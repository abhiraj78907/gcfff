/**
 * AI-Powered Active Consultation Page
 * Features:
 * - Real-time speech recognition with multi-language support (Kannada, Hindi, Telugu)
 * - AI symptom extraction and auto-fill
 * - AI-aided diagnosis suggestions
 * - Medicine search with autocomplete
 * - Prescription template formatting
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Loader2, Plus, Trash2, Edit, Search, X, Sparkles, FileText, Download } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@shared/contexts/AuthContext";
import { useSubEntry } from "@shared/contexts/SubEntryContext";
import { createConsultation, createPrescription, createLabOrder } from "@shared/lib/doctorActions";
import { notifyByRole, notifyError } from "@shared/lib/notifications";
import { SpeechRecognitionService } from "@shared/lib/ai/speechRecognition";
import { extractSymptoms, suggestDiagnosis, formatPrescription, detectLanguage } from "@shared/lib/ai/geminiService";
import { analyzeClinicalConversation, getMedicinePrescriptionStructure, type ClinicalTranscriptResult } from "@shared/lib/ai/clinicalAssistant";
import { suggestMedicineTiming, getDosageRecommendation, type DosageRecommendation } from "@shared/lib/ai/doctorAssistant";
import { normalizeSymptomsToEnglish } from "@shared/lib/ai/symptomNormalization";
import { searchMedicines, type Medicine } from "@shared/lib/medicineSearch";
import { fetchUserProfile } from "@shared/lib/userProfile";
import { upsertById } from "@shared/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const mergeSymptomStrings = (current: string, incoming: string[]): string[] => {
  const base = (current || "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  const seen = new Set(base.map((item) => item.toLowerCase()));
  const result = [...base];
  incoming.forEach((item) => {
    const value = String(item || "").trim();
    if (!value) return;
    const key = value.toLowerCase();
    if (!seen.has(key)) {
      result.push(value);
      seen.add(key);
    }
  });
  return result;
};

const RECOVERABLE_SPEECH_ERRORS = new Set(["no-speech", "aborted", "network", "audio-capture"]);

interface MedicineItem {
  id: string;
  name: string;
  timing: string[];
  food: "before" | "after";
  duration: number;
  quantity: number;
  drugId: string;
  dosage: string;
  frequency: string;
}

interface DiagnosisSuggestion {
  diagnosis: string;
  confidence: number;
  reasoning: string;
  icd10Code?: string;
}


export default function ActiveConsultationAI() {
  console.log("========================================");
  console.log("========================================");
  console.log("[ActiveConsultationAI] 🚀 COMPONENT INITIALIZING");
  console.log("========================================");
  console.log("========================================");
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { currentEntity } = useSubEntry();
  
  console.log("[ActiveConsultationAI] User:", user?.id, "Entity:", currentEntity?.id);
  console.log("[ActiveConsultationAI] Component mounted successfully");
  console.log("========================================");
  
  // Component mount tracking - prevents state updates after unmount
  const isMountedRef = useRef(true);
  
  // Speech Recognition (Web Speech API)
  const speechRecognitionRef = useRef<SpeechRecognitionService | null>(null);
  const fullTranscriptRef = useRef<string>("");
  const lastAnalysisTranscriptRef = useRef<string>("");
  const conversationSessionIdRef = useRef<string>(`session-${Date.now()}`);
  const analysisDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentSpeaker, setCurrentSpeaker] = useState<"patient" | "doctor">("patient");
  const [detectedLanguage, setDetectedLanguage] = useState<"kannada" | "hindi" | "telugu" | "urdu" | "tamil" | "english">("kannada");
  const [fullTranscript, setFullTranscript] = useState("");
  const [micPermissionStatus, setMicPermissionStatus] = useState<"unknown" | "granted" | "denied" | "prompt">("unknown");
  
  // AI Processing
  const [isProcessingSymptoms, setIsProcessingSymptoms] = useState(false);
  const [isProcessingDiagnosis, setIsProcessingDiagnosis] = useState(false);
  const [diagnosisSuggestions, setDiagnosisSuggestions] = useState<DiagnosisSuggestion[]>([]);
  const [showDiagnosisSuggestions, setShowDiagnosisSuggestions] = useState(false);
  const [clinicalAnalysis, setClinicalAnalysis] = useState<ClinicalTranscriptResult | null>(null);
  // Form State
  const [saving, setSaving] = useState(false);
  const [symptoms, setSymptoms] = useState("");
  const [symptomsNative, setSymptomsNative] = useState(""); // Symptoms in native language
  const [symptomsEnglish, setSymptomsEnglish] = useState(""); // Symptoms in English
  const [diagnosis, setDiagnosis] = useState("");
  const [advice, setAdvice] = useState("Rest, drink fluids, avoid oily food");
  const [followUpDate, setFollowUpDate] = useState("2025-11-06");
  const [baseProblem, setBaseProblem] = useState("");
  
  // Medicine Search
  const [medicineSearchQuery, setMedicineSearchQuery] = useState("");
  const [medicineSearchResults, setMedicineSearchResults] = useState<Medicine[]>([]);
  const [showMedicineSearch, setShowMedicineSearch] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  
  // Medicine Form
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [medicineForm, setMedicineForm] = useState({
    timing: ["morning", "afternoon", "night"] as string[],
    food: "after" as "before" | "after",
    duration: 5,
    quantity: 15,
    dosage: "As directed" as string,
  });
  const [aiDosageRecommendation, setAiDosageRecommendation] = useState<DosageRecommendation | null>(null);
  const [isLoadingDosage, setIsLoadingDosage] = useState(false);
  
  // Prescription Preview
  const [showPrescriptionPreview, setShowPrescriptionPreview] = useState(false);
  const [formattedPrescription, setFormattedPrescription] = useState("");
  const [prescriptionTemplate, setPrescriptionTemplate] = useState<string>(() => {
    // Initialize with default - never undefined
    if (typeof window !== "undefined") {
      return localStorage.getItem("prescriptionTemplate") || "standard";
    }
    return "standard";
  });
  const [customTemplateContent, setCustomTemplateContent] = useState<string>("");
  // Load prescription template from Firestore user profile
  useEffect(() => {
    const loadTemplate = async () => {
      if (!user?.id) return;
      
      try {
        console.log("[ActiveConsultationAI] Loading prescription template from Firestore...");
        const profile = await fetchUserProfile(user.id);
        
        if (profile?.settings?.prescriptionTemplate) {
          const template = profile.settings.prescriptionTemplate;
          console.log("[ActiveConsultationAI] ✅ Template loaded from Firestore:", template);
          setPrescriptionTemplate(template);
          
          // Also update localStorage for offline access
          if (typeof window !== "undefined") {
            localStorage.setItem("prescriptionTemplate", template);
          }
        }
        
        // Load custom template content if available
        if (profile?.settings?.customTemplateContent) {
          setCustomTemplateContent(profile.settings.customTemplateContent);
          console.log("[ActiveConsultationAI] ✅ Custom template content loaded");
        }
      } catch (error) {
        console.error("[ActiveConsultationAI] Failed to load template from Firestore:", error);
        // Fallback to localStorage
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("prescriptionTemplate");
          if (stored) {
            setPrescriptionTemplate(stored);
          }
        }
      }
    };
    
    loadTemplate();
  }, [user?.id]);
  
  // Test Mode - Quick test AI functionality
  const handleTestAI = async () => {
    console.log("[TEST] ===== AI TEST BUTTON CLICKED =====");
    console.log("[TEST] Current state:", { symptoms, diagnosis, detectedLanguage });
    
    toast.info("Testing AI integration...");
    
    // Test 1: Symptom Extraction
    try {
      const testTranscript = "Patient reports severe headache, high fever of 102°F, body pain, and fatigue for the last 3 days";
      console.log("[TEST] Testing symptom extraction...");
      console.log("[TEST] Transcript:", testTranscript);
      console.log("[TEST] Language:", detectedLanguage);
      console.log("[TEST] extractSymptoms function:", typeof extractSymptoms);
      
      setIsProcessingSymptoms(true);
      const symptomResult = await extractSymptoms(testTranscript, detectedLanguage);
      console.log("[TEST] Symptom extraction result:", symptomResult);
      
      if (symptomResult.symptoms.length > 0) {
        setSymptoms(symptomResult.symptoms.join(", "));
        setFullTranscript(testTranscript);
        toast.success("✅ Symptom extraction working!", {
          description: `Extracted: ${symptomResult.symptoms.join(", ")}`,
        });
        
        // Test 2: Diagnosis Suggestions
        setTimeout(async () => {
          console.log("[TEST] Testing diagnosis suggestions...");
          setIsProcessingDiagnosis(true);
          const diagnosisResult = await suggestDiagnosis(
            symptomResult.symptoms,
            testTranscript,
            detectedLanguage
          );
          console.log("[TEST] Diagnosis suggestions result:", diagnosisResult);
          
          if (diagnosisResult.length > 0) {
            setDiagnosisSuggestions(diagnosisResult);
            setDiagnosis(diagnosisResult[0].diagnosis);
            toast.success("✅ Diagnosis suggestions working!", {
              description: `Top suggestion: ${diagnosisResult[0].diagnosis}`,
            });
          } else {
            toast.warning("⚠️ Diagnosis API returned no suggestions");
          }
          setIsProcessingDiagnosis(false);
        }, 1000);
      } else {
        toast.error("❌ Symptom extraction returned no results");
      }
      setIsProcessingSymptoms(false);
    } catch (error) {
      console.error("[TEST] AI test failed:", error);
      toast.error("❌ AI test failed", {
        description: error instanceof Error ? error.message : "Check console for details",
      });
      setIsProcessingSymptoms(false);
      setIsProcessingDiagnosis(false);
    }
  };

  const routePatient = (location.state as any)?.patient;
  const patient = routePatient ?? {
    name: "Ramesh Kumar",
    age: "45M",
    id: "VIMS-2025-12345",
    contact: "+91 9876543210",
    registered: "9:45 AM",
    pastVisits: [
      { date: "15 Oct 2025", diagnosis: "Viral Fever", medicines: "Paracetamol" },
      { date: "2 Sept 2025", diagnosis: "Stomach pain", medicines: "Antacid" },
    ],
  };

  // Advanced Clinical Analysis - Dynamic, Unique per Conversation
  const performClinicalAnalysis = useCallback(async (transcript: string, force: boolean = false) => {
    // Skip if transcript hasn't changed significantly
    const transcriptDiff = transcript.length - lastAnalysisTranscriptRef.current.length;
    if (!force && transcriptDiff < 20 && transcript.length > 0) {
      return; // Not enough new content
    }

    // Skip if already processing
    if (isProcessingSymptoms || isProcessingDiagnosis) {
      return;
    }

    // Clear existing debounce
    if (analysisDebounceTimeoutRef.current) {
      clearTimeout(analysisDebounceTimeoutRef.current);
    }

    // Debounce analysis (2 seconds) to wait for complete statements
    analysisDebounceTimeoutRef.current = setTimeout(async () => {
      if (!isMountedRef.current) return;

      setIsProcessingSymptoms(true);
      setIsProcessingDiagnosis(true);
      lastAnalysisTranscriptRef.current = transcript;

      try {
        console.log("[ClinicalAssistant] 🔍 Analyzing conversation...", {
          sessionId: conversationSessionIdRef.current,
          transcriptLength: transcript.length,
          language: detectedLanguage
        });

        const analysis = await analyzeClinicalConversation(transcript, detectedLanguage);
        if (!isMountedRef.current) return;

        console.log("[ClinicalAssistant] ✅ Analysis complete", analysis);

        // Update symptoms dynamically (merge with existing, avoid duplicates)
        if (analysis.symptoms.normalized.length > 0) {
          const existingSymptoms = symptoms.split(/[,\n]/).map(s => s.trim()).filter(s => s.length > 0);
          const newSymptoms = analysis.symptoms.normalized.filter(s => !existingSymptoms.includes(s));
          
          if (newSymptoms.length > 0) {
            const merged = [...existingSymptoms, ...newSymptoms].join(", ");
            setSymptoms(merged);
            toast.success("Symptoms updated", {
              description: `Added ${newSymptoms.length} new symptom(s)`,
            });
          }
        }

        // Update diagnosis if more confident or if empty
        if (analysis.diagnosis.primary) {
          if (!diagnosis || analysis.diagnosis.confidence > 0.7) {
            setDiagnosis(analysis.diagnosis.primary);
            toast.success("Diagnosis updated", {
              description: `${analysis.diagnosis.primary} (${Math.round(analysis.diagnosis.confidence * 100)}% confidence)`,
            });
          }
        }

        // Update advice
        if (analysis.advice && !advice) {
          setAdvice(analysis.advice);
        }

        // Update follow-up date
        if (analysis.followUpDays && !followUpDate) {
          const followUp = new Date();
          followUp.setDate(followUp.getDate() + analysis.followUpDays);
          setFollowUpDate(followUp.toISOString().split("T")[0]);
        }

        // Update prescription structure (for when doctor adds medicines)
        if (analysis.prescriptionStructure) {
          setMedicineForm(prev => ({
            ...prev,
            timing: analysis.prescriptionStructure.timing,
            food: analysis.prescriptionStructure.foodTiming,
            duration: analysis.prescriptionStructure.duration,
            dosage: analysis.prescriptionStructure.dosage,
          }));
        }

      } catch (error) {
        console.error("[ClinicalAssistant] ❌ Analysis failed:", error);
        if (isMountedRef.current) {
          toast.error("Clinical analysis failed", {
            description: "Please try again or fill manually",
          });
        }
      } finally {
        if (isMountedRef.current) {
          setIsProcessingSymptoms(false);
          setIsProcessingDiagnosis(false);
        }
      }
    }, 2000); // Wait 2 seconds for complete statements
  }, [detectedLanguage, symptoms, diagnosis, advice, followUpDate, isProcessingSymptoms, isProcessingDiagnosis]);

  // Get diagnosis suggestions - defined first to avoid circular dependency
  const getDiagnosisSuggestions = useCallback(async () => {
    const symptomText = symptoms || fullTranscript;
    if (!symptomText || symptomText.trim().length < 5) {
      toast.warning("Please enter symptoms or start recording first");
      return;
    }

    console.log("[AI] Getting diagnosis suggestions...", { symptoms, fullTranscript });
    setIsProcessingDiagnosis(true);
    setShowDiagnosisSuggestions(true);
    
    try {
      const symptomList = symptoms ? symptoms.split(/[,\n]/).filter(s => s.trim()) : [];
      const inputText = symptomList.length > 0 ? symptomList : [fullTranscript || symptoms];
      
      const suggestions = await suggestDiagnosis(
        inputText,
        fullTranscript || symptoms,
        detectedLanguage
      );
      
      console.log("[AI] Diagnosis suggestions received:", suggestions);
      
      if (suggestions.length > 0) {
        setDiagnosisSuggestions(suggestions);
        // Auto-fill top suggestion if diagnosis is empty
        setDiagnosis((prev) => {
          if (!prev || prev.trim().length === 0) {
            return suggestions[0].diagnosis;
          }
          return prev;
        });
        toast.success("Diagnosis suggested", {
          description: `${suggestions[0].diagnosis} (${(suggestions[0].confidence * 100).toFixed(0)}% confidence)`,
        });
      } else {
        console.log("[AI] No suggestions received from API");
        toast.warning("No diagnosis suggestions available", {
          description: "Please enter diagnosis manually",
        });
      }
    } catch (error) {
      console.error("[AI] Diagnosis suggestion failed:", error);
      toast.error("Failed to get diagnosis suggestions", {
        description: error instanceof Error ? error.message : "Please try again or enter manually",
      });
    } finally {
      setIsProcessingDiagnosis(false);
    }
  }, [symptoms, fullTranscript, detectedLanguage]);

  // Initialize Speech Recognition Service (Web Speech API)
  useEffect(() => {
    if (!SpeechRecognitionService.isSupported()) {
      console.warn("[ActiveConsultationAI] Speech Recognition not supported in this browser");
      return;
    }

    const service = new SpeechRecognitionService({
      continuous: true,
      interimResults: true,
      language: "kn-IN", // Default to Kannada
    });

    let lastLangSwitchAt = 0;
    const LANG_DWELL_MS = 20000;

    service.onTranscript((result) => {
      if (!isMountedRef.current) return;

      const transcript = result.transcript.trim();
      if (!transcript) return;

      // Update transcript continuously
      fullTranscriptRef.current = transcript;
      setFullTranscript(transcript);

      // Update language detection
      if (result.speaker === "patient" && transcript.length > 50) {
        detectLanguage(transcript).then((lang) => {
          const now = Date.now();
          if (now - lastLangSwitchAt > LANG_DWELL_MS) {
            setDetectedLanguage(lang);
            service.setLanguage(lang);
            lastLangSwitchAt = now;
          }
        }).catch(() => {});
      }

      // Perform clinical analysis when final results come in (debounced)
      if (result.isFinal && result.speaker === "patient") {
        performClinicalAnalysis(transcript);
      }
    });

    service.onError((error: Error) => {
      console.error("[ActiveConsultationAI] Speech recognition error:", error);
      if (isMountedRef.current) {
        const errorCode = (error as any).code;
        const isRecoverable = (error as any).recoverable;
        
        // Don't stop recording for recoverable errors (network, aborted, etc.)
        // Only stop for critical errors (not-allowed, etc.)
        if (errorCode === "not-allowed") {
          setIsRecording(false);
          toast.error("Microphone permission denied", {
            description: "Please allow microphone access in your browser settings",
          });
        } else if (errorCode === "network") {
          // Network errors are recoverable - show warning but don't stop
          toast.warning("Network connection issue", {
            description: "Attempting to reconnect... Speech recognition will continue automatically.",
            duration: 3000,
          });
        } else if (!isRecoverable) {
          // Only stop for non-recoverable errors
          setIsRecording(false);
          toast.error("Speech recognition error", {
            description: error.message || "Please try again",
          });
        } else {
          // Recoverable errors - just log, don't stop recording
          console.log("[ActiveConsultationAI] Recoverable error, continuing...");
        }
      }
    });

    speechRecognitionRef.current = service;

    return () => {
      service.stop();
      speechRecognitionRef.current = null;
    };
  }, [performClinicalAnalysis]);

  // Component cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      speechRecognitionRef.current?.stop();
      if (analysisDebounceTimeoutRef.current) {
        clearTimeout(analysisDebounceTimeoutRef.current);
      }
    };
  }, []);

  // Removed: isRecordingRef sync - no longer needed with React onClick

  // Timer for recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Medicine search debounce - enhanced with better debouncing
  useEffect(() => {
    if (!medicineSearchQuery || medicineSearchQuery.trim().length < 2) {
      setMedicineSearchResults([]);
      return;
    }

    // Debounce search to avoid too many API calls
    // Longer delay for shorter queries, shorter delay for longer queries
    const delay = medicineSearchQuery.length < 4 ? 500 : 300;
    
    const timeoutId = setTimeout(() => {
      const query = medicineSearchQuery.trim();
      console.log("[ActiveConsultationAI] 🔍 Searching medicines:", query);
      try {
        const results = searchMedicines(query, 10);
        console.log("[ActiveConsultationAI] ✅ Found", results.length, "medicines:", results.map(r => r.name));
        setMedicineSearchResults(results);
        
        // Show results in popover if we have results
        if (results.length > 0) {
          setShowMedicineSearch(true);
        }
      } catch (error) {
        console.error("[ActiveConsultationAI] ❌ Medicine search error:", error);
        setMedicineSearchResults([]);
        toast.error("Medicine search failed", {
          description: "Please try again or search manually",
        });
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [medicineSearchQuery]);



  // Check microphone permission status
  useEffect(() => {
    const checkPermission = async () => {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          console.log("[ActiveConsultationAI] Microphone permission status:", result.state);
          setMicPermissionStatus(result.state);
          
          result.onchange = () => {
            console.log("[ActiveConsultationAI] Microphone permission changed:", result.state);
            setMicPermissionStatus(result.state);
          };
        }
      } catch (e) {
        console.warn("[ActiveConsultationAI] Permission API not supported, will request on click");
      }
    };
    checkPermission();
  }, []);

  // Start Recording
  const handleStartRecording = useCallback(async () => {
    if (isRecording) return;

    // Reset session for new conversation (unique session ID)
    conversationSessionIdRef.current = `session-${Date.now()}`;
    fullTranscriptRef.current = "";
    lastAnalysisTranscriptRef.current = "";
    setFullTranscript("");
    setSymptoms("");
    setDiagnosis("");
    setAdvice("");
    setClinicalAnalysis(null);

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      setMicPermissionStatus("granted");
      
      // Start speech recognition
      if (speechRecognitionRef.current) {
        // CRITICAL: Set language BEFORE starting (especially important for Urdu)
        speechRecognitionRef.current.setLanguage(detectedLanguage);
        
        // Small delay to ensure language is properly set before starting (helps with Urdu)
        await new Promise(resolve => setTimeout(resolve, 50));
        
        speechRecognitionRef.current.start(currentSpeaker);
        setIsRecording(true);
        
        // Special message for Urdu
        if (detectedLanguage === "urdu") {
          toast.success("🎤 Recording started - Urdu (اردو)", {
            description: "Listening in Urdu. Speak clearly for best recognition.",
            duration: 3000,
          });
        } else {
          toast.success("🎤 Recording started", {
            description: `Listening in ${detectedLanguage.charAt(0).toUpperCase() + detectedLanguage.slice(1)}. AI optimized for this language.`,
          });
        }
      } else {
        throw new Error("Speech recognition not initialized");
      }

      // Stop the stream (we just needed permission)
      stream.getTracks().forEach(track => track.stop());
    } catch (error: any) {
      console.error("[ActiveConsultationAI] Start recording failed:", error);
      setMicPermissionStatus("denied");
      setIsRecording(false);
      toast.error("Microphone permission required", {
        description: "Please allow microphone access to record",
      });
    }
  }, [isRecording, currentSpeaker, detectedLanguage]);

  // Stop Recording
  const handleStopRecording = useCallback(() => {
    speechRecognitionRef.current?.stop();
    setIsRecording(false);
    
    // Final analysis on stop
    if (fullTranscriptRef.current.length > 10) {
      performClinicalAnalysis(fullTranscriptRef.current, true);
    }

    toast.info("Recording stopped", {
      description: `Recorded ${Math.floor(recordingTime / 60)}:${String(recordingTime % 60).padStart(2, '0')}`,
    });
  }, [recordingTime, performClinicalAnalysis]);

  // Switch Speaker
  const handleSwitchSpeaker = () => {
    const newSpeaker = currentSpeaker === "patient" ? "doctor" : "patient";
    setCurrentSpeaker(newSpeaker);
    speechRecognitionRef.current?.switchSpeaker(newSpeaker);
    toast.info(`Switched to ${newSpeaker} mode`);
  };

  // Medicine Handlers
  const handleSelectMedicine = async (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setShowMedicineSearch(false);
    setMedicineSearchQuery(medicine.name);
    
    setIsLoadingDosage(true);
    try {
      const structure = await getMedicinePrescriptionStructure(
        medicine.name,
        diagnosis || clinicalAnalysis?.diagnosis.primary || "",
        patient.age
      );
      
      setMedicineForm(prev => ({
        ...prev,
        timing: structure.timing,
        food: structure.foodTiming,
        duration: structure.duration,
        quantity: structure.quantity,
        dosage: structure.dosage,
      }));

      setAiDosageRecommendation({
        dosage: structure.dosage,
        frequency: structure.frequency,
        timing: structure.timing,
        food: structure.foodTiming,
        duration: structure.duration,
        quantity: structure.quantity,
        reasoning: structure.instructions,
      });
    } catch (error) {
      console.error("[ActiveConsultationAI] ❌ Dosage recommendation failed:", error);
      toast.dismiss("dosage-recommendation");
      
      // Fallback to simple timing suggestion
      const suggestedTiming = suggestMedicineTiming(medicine.name);
      setMedicineForm(prev => ({
        ...prev,
        timing: suggestedTiming,
        food: medicine.name.toLowerCase().includes("antacid") || medicine.name.toLowerCase().includes("omeprazole") ? "before" : "after",
        dosage: medicine.dosage || "As directed",
      }));
      
      setAiDosageRecommendation(null);
      
      toast.info("Using standard timing", {
        description: `Timing: ${suggestedTiming.join(", ")}`,
      });
    } finally {
      setIsLoadingDosage(false);
    }
  };

  const handleAddMedicine = () => {
    if (!selectedMedicine) {
      toast.warning("Please select a medicine");
      return;
    }

    const newMedicine: MedicineItem = {
      id: `med-${Date.now()}`,
      name: selectedMedicine.name,
      timing: medicineForm.timing,
      food: medicineForm.food,
      duration: medicineForm.duration,
      quantity: medicineForm.quantity,
      drugId: selectedMedicine.id,
      dosage: medicineForm.dosage || selectedMedicine.dosage || "As directed",
      frequency: aiDosageRecommendation?.frequency || `${medicineForm.timing.length} times daily`,
    };

    setMedicines([...medicines, newMedicine]);
    setSelectedMedicine(null);
    setMedicineSearchQuery("");
    setAiDosageRecommendation(null);
    setMedicineForm({
      timing: ["morning", "afternoon", "night"],
      food: "after",
      duration: 5,
      quantity: 15,
      dosage: "As directed",
    });
    
    toast.success("Medicine added to prescription", {
      description: "You can edit dosage and timing before finalizing",
    });
  };

  const handleRemoveMedicine = (id: string) => {
    setMedicines(medicines.filter((med) => med.id !== id));
    toast.success("Medicine removed");
  };

  // Prescription Preview
  const handlePreviewPrescription = async () => {
    if (medicines.length === 0) {
      toast.warning("Please add medicines to prescription");
      return;
    }

    setShowPrescriptionPreview(true);
    
    try {
      // Use custom template content if available, otherwise use template name
      const templateToUse = customTemplateContent || prescriptionTemplate;
      
      console.log("[ActiveConsultationAI] Formatting prescription with template:", {
        hasCustomTemplate: !!customTemplateContent,
        templateName: prescriptionTemplate,
      });
      
      const formatted = await formatPrescription(
        {
          patientName: patient.name,
          patientAge: patient.age,
          patientId: patient.id,
          date: new Date().toISOString().split("T")[0],
          diagnosis: diagnosis || baseProblem,
          medicines: medicines.map(m => ({
            name: m.name,
            dosage: m.dosage,
            frequency: m.frequency,
            duration: `${m.duration} days`,
            notes: `${m.food === "after" ? "After" : "Before"} food`,
          })),
          doctorName: user?.name || "Dr. User",
          advice: advice,
          followUpDate: followUpDate,
        },
        templateToUse
      );

      setFormattedPrescription(formatted);
    } catch (error) {
      console.error("[AI] Prescription formatting failed:", error);
      toast.error("Failed to format prescription");
    }
  };

  // Save Consultation
  const handleSaveAndSign = async () => {
    const entityId = currentEntity?.id ?? user?.entityId;
    const doctorId = user?.id;
    
    if (!entityId || !doctorId) {
      notifyError("Save Consultation", new Error("Entity or doctor ID missing"));
      return;
    }

    if (!patient?.id) {
      notifyError("Save Consultation", new Error("Patient ID missing"));
      return;
    }

    setSaving(true);
    try {
      const visitId = patient.id;

      // Create consultation record
      await createConsultation(entityId, doctorId, {
        visitId,
        patientId: patient.id,
        notes: `${symptoms}\n\nAdvice: ${advice}`,
        diagnosis: diagnosis || baseProblem,
        diagnosisCodes: diagnosisSuggestions[0]?.icd10Code ? [diagnosisSuggestions[0].icd10Code] : undefined,
        aiTranscript: fullTranscript,
      });

      // Create prescription if medicines exist
      if (medicines.length > 0) {
        const prescriptionItems = medicines.map(med => ({
          drugId: med.drugId,
          drugName: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: `${med.duration} days`,
          notes: `${med.food === "after" ? "After" : "Before"} food`,
        }));

        await createPrescription(
          entityId,
          patient.id,
          visitId,
          prescriptionItems,
          doctorId,
          user?.name || "Dr. User"
        );
      }

      // Send notifications to relevant roles
      notifyByRole.doctor.consultationSaved(patient.name);
      
      // Notify pharmacist if prescription was created
      if (medicines.length > 0) {
        notifyByRole.doctor.prescriptionCreated(patient.name);
        console.log("[ActiveConsultationAI] ✅ Prescription notification sent to pharmacist");
      }
      
      // Real-time notification via Firestore (for cross-role sync)
      try {
        const entityId = currentEntity?.id ?? user?.entityId;
        if (entityId && medicines.length > 0) {
          // Create notification document for pharmacist
          const { addDoc, collection } = await import("firebase/firestore");
          const { getFirebase } = await import("@shared/lib/firebase");
          const { db } = await getFirebase();
          await addDoc(collection(db, `entities/${entityId}/notifications`), {
            type: "prescription_created",
            patientId: patient.id,
            patientName: patient.name,
            doctorId: user?.id,
            doctorName: user?.name,
            prescriptionId: visitId,
            timestamp: Date.now(),
            read: false,
            role: "pharmacist",
          });
          console.log("[ActiveConsultationAI] ✅ Real-time notification created in Firestore");
        }
      } catch (notifError) {
        console.error("[ActiveConsultationAI] Failed to create notification:", notifError);
        // Don't block save if notification fails
      }
      
      setTimeout(() => {
        navigate("/completed");
      }, 1500);
    } catch (error) {
      console.error("[doctor] Save failed:", error);
      notifyError("Save Consultation", error);
    } finally {
      setSaving(false);
    }
  };

  console.log("========================================");
  console.log("[ActiveConsultationAI] 🔄 COMPONENT RENDERING");
  console.log("========================================");
  console.log("[ActiveConsultationAI] Patient:", patient?.name);
  console.log("[ActiveConsultationAI] isRecording:", isRecording);
  console.log("[ActiveConsultationAI] handleStartRecording type:", typeof handleStartRecording);
  console.log("[ActiveConsultationAI] handleStopRecording type:", typeof handleStopRecording);
  console.log("[ActiveConsultationAI] SpeechRecognitionService:", typeof SpeechRecognitionService);
  console.log("========================================");

  return (
    <div className="min-h-[100svh] flex flex-col">
      <div className="mb-4 px-1 md:px-0">
        <h2 className="text-2xl font-bold text-foreground">
          Consultation: {patient.name} ({patient.age})
        </h2>
        <p className="text-sm text-muted-foreground">Patient ID: {patient.id}</p>
      </div>

      <div className="lg:grid grid-cols-5 gap-4 md:gap-6 flex-1 min-h-0 px-1 md:px-0">
        {/* Left Panel - Patient Context (40%) */}
        <div className="lg:col-span-2 space-y-4 lg:overflow-y-auto min-h-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Patient Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="font-medium">{patient.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Age</p>
                  <p className="font-medium">{patient.age}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">ID</p>
                  <p className="font-medium">{patient.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Contact</p>
                  <p className="font-medium">{patient.contact}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Base Problem</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter the patient's base problem in one line"
                value={baseProblem}
                onChange={(e) => setBaseProblem(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Past Visits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {patient.pastVisits.map((visit, i) => (
                <div key={i} className="border-l-2 border-primary pl-3 text-sm">
                  <p className="font-medium">{visit.date}</p>
                  <p className="text-muted-foreground">Diagnosis: {visit.diagnosis}</p>
                  <p className="text-muted-foreground">Medicines: {visit.medicines}</p>
                </div>
              ))}
              <Button variant="link" size="sm" className="px-0">
                View Complete History →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - AI Interface (60%) */}
        <div className="lg:col-span-3 space-y-4 lg:overflow-y-auto min-h-0">
          {/* AI Speech Recognition Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Assistant
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    console.log("[UI] Test AI button clicked!", e);
                    handleTestAI();
                  }}
                  disabled={isProcessingSymptoms || isProcessingDiagnosis}
                  className="text-xs"
                >
                  🧪 Test AI
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                {/* Language Selector - Prominent and Easy to Use */}
                <div className="w-full max-w-md mx-auto">
                  <Label className="text-sm font-medium mb-2 block text-center">
                    Select Patient Language
                  </Label>
                  <Select
                    value={detectedLanguage}
                    onValueChange={(value: "kannada" | "hindi" | "telugu" | "urdu" | "tamil" | "english") => {
                      setDetectedLanguage(value);
                      speechRecognitionRef.current?.setLanguage(value);
                      
                      // Special message for Urdu with tips
                      if (value === "urdu") {
                        toast.info(`Language set to Urdu (اردو)`, {
                          description: "For best results, speak clearly and ensure stable internet connection",
                          duration: 4000,
                        });
                      } else {
                        toast.info(`Language set to ${value.charAt(0).toUpperCase() + value.slice(1)}`, {
                          description: "AI will now optimize for this language",
                        });
                      }
                    }}
                    disabled={isRecording}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kannada">
                        <div className="flex items-center gap-2">
                          <span>🇮🇳</span>
                          <span>ಕನ್ನಡ (Kannada)</span>
                          <Badge variant="outline" className="ml-auto text-xs">Primary</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="telugu">
                        <div className="flex items-center gap-2">
                          <span>🇮🇳</span>
                          <span>తెలుగు (Telugu)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="hindi">
                        <div className="flex items-center gap-2">
                          <span>🇮🇳</span>
                          <span>हिंदी (Hindi)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="urdu">
                        <div className="flex items-center gap-2">
                          <span>🇮🇳</span>
                          <span>اردو (Urdu)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="tamil">
                        <div className="flex items-center gap-2">
                          <span>🇮🇳</span>
                          <span>தமிழ் (Tamil)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="english">
                        <div className="flex items-center gap-2">
                          <span>🇬🇧</span>
                          <span>English</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    Select the language your patient will speak before starting recording
                  </p>
                </div>

                {/* Status Display */}
                <div className="text-center">
                  <p className="text-lg font-semibold mb-1">
                    {isRecording 
                      ? `🔴 Recording: ${Math.floor(recordingTime / 60)}:${String(recordingTime % 60).padStart(2, '0')}` 
                      : "🎤 Ready to Record"}
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSwitchSpeaker}
                      disabled={isRecording}
                    >
                      {currentSpeaker === "patient" ? "👤 Patient" : "👨‍⚕️ Doctor"}
                    </Button>
                    <Badge variant="secondary" className="text-xs">
                      {detectedLanguage.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {/* Voice Recording Buttons - Separate Start and Stop */}
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  {/* Start Recording Button */}
                  <Button
                    id="start-recording-button"
                    type="button"
                    size="lg"
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("========================================");
                      console.log("🎤 START RECORDING BUTTON CLICKED");
                      console.log("========================================");
                      console.log("isRecording:", isRecording);
                      console.log("handleStartRecording:", typeof handleStartRecording);
                      console.log("========================================");
                      
                      if (!isRecording) {
                        await handleStartRecording();
                      }
                    }}
                    disabled={isRecording}
                    className={`h-16 px-8 rounded-full text-base font-semibold transition-all duration-300 flex items-center gap-2 ${
                      isRecording
                        ? "opacity-50 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                    }`}
                    style={{
                      minWidth: '180px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Mic className="h-5 w-5" />
                    <span>Start Recording</span>
                  </Button>

                  {/* Stop Recording Button */}
                  <Button
                    id="stop-recording-button"
                    type="button"
                    size="lg"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("========================================");
                      console.log("⏹️ STOP RECORDING BUTTON CLICKED");
                      console.log("========================================");
                      console.log("isRecording:", isRecording);
                      console.log("handleStopRecording:", typeof handleStopRecording);
                      console.log("========================================");
                      
                      if (isRecording) {
                        handleStopRecording();
                      }
                    }}
                    disabled={!isRecording}
                    className={`h-16 px-8 rounded-full text-base font-semibold transition-all duration-300 flex items-center gap-2 ${
                      !isRecording
                        ? "opacity-50 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 animate-pulse"
                    }`}
                    style={{
                      minWidth: '180px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <MicOff className="h-5 w-5" />
                    <span>Stop Recording</span>
                  </Button>
                </div>

                {/* Microphone Permission Status */}
                {micPermissionStatus === "denied" && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      ⚠️ Microphone permission denied
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                      Click the lock icon (🔒) in your browser's address bar and allow microphone access
                    </p>
                  </div>
                )}

                {micPermissionStatus === "prompt" && !isRecording && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      💡 Click "Start Recording" to enable microphone
                    </p>
                  </div>
                )}
              </div>
              
              {/* Large Live Transcript Display - Maximized Space */}
              <div className="border-2 rounded-lg p-3 bg-muted/30 min-h-[350px] max-h-[600px] overflow-y-auto">
                <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                  <Mic className="h-3 w-3" />
                  Live Transcript {isRecording && <span className="animate-pulse text-green-600 text-xs">●</span>}
                </p>
                {fullTranscript ? (
                  <div className="space-y-1">
                    <p className="text-xs leading-relaxed whitespace-pre-wrap break-words font-mono">
                      {fullTranscript}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 pt-1 border-t">
                      {fullTranscript.split(/\s+/).length} words • {fullTranscript.length} characters
                    </p>
                  </div>
                ) : isRecording ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">
                      Listening... Speak clearly into your microphone
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      The transcript will appear here as you speak
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                    <p className="text-xs text-muted-foreground">
                      Click "Start Recording" to begin transcription
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      This area will display the complete patient conversation
                    </p>
                  </div>
                )}
              </div>
              
              {!SpeechRecognitionService.isSupported() && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Speech recognition not supported in this browser
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                        Please use Chrome or Edge browser for voice recognition.
                      </p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                        You can still use manual input for symptoms and diagnosis.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* No audio detected warning */}
              {isRecording && !fullTranscript && recordingTime > 5 && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    ⚠️ No audio detected yet
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    Please check your microphone and speak clearly
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Consultation Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Consultation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label htmlFor="symptoms">
                    Symptoms
                    {isProcessingSymptoms && <Loader2 className="h-3 w-3 ml-2 animate-spin inline" />}
                  </Label>
                  <Badge variant="secondary" className="text-xs">AI generated</Badge>
                </div>
                 <Textarea
                   id="symptoms"
                   placeholder={isProcessingSymptoms 
                     ? "🤖 AI is extracting symptoms from conversation..." 
                     : isRecording 
                     ? "🎤 Listening... Symptoms will appear here as you speak" 
                     : fullTranscript 
                     ? "💬 Click 'Start Recording' or speak to extract symptoms automatically" 
                     : "💬 Start recording or type symptoms manually. AI will auto-fill from conversation."}
                   className="mt-1.5"
                   value={symptoms}
                   onChange={(e) => setSymptoms(e.target.value)}
                 />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label htmlFor="diagnosis">
                    Diagnosis
                    {isProcessingDiagnosis && <Loader2 className="h-3 w-3 ml-2 animate-spin inline" />}
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={getDiagnosisSuggestions}
                      disabled={isProcessingDiagnosis}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Suggest
                    </Button>
                    <Badge variant="secondary" className="text-xs">AI generated</Badge>
                  </div>
                </div>
                <Textarea 
                  id="diagnosis" 
                  placeholder={isProcessingDiagnosis 
                    ? "🤖 AI is analyzing symptoms and suggesting diagnosis..." 
                    : symptoms 
                    ? "💡 Click 'AI Suggest' for AI-powered diagnosis suggestions, or type manually" 
                    : "💡 Enter symptoms first, then click 'AI Suggest' for AI-powered diagnosis recommendations"}
                  className="mt-1.5"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                />
                
                {showDiagnosisSuggestions && diagnosisSuggestions.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {diagnosisSuggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        className="border rounded p-2 cursor-pointer hover:bg-accent"
                        onClick={() => {
                          setDiagnosis(suggestion.diagnosis);
                          setShowDiagnosisSuggestions(false);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{suggestion.diagnosis}</p>
                          <Badge variant="outline" className="text-xs">
                            {(suggestion.confidence * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{suggestion.reasoning}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="advice">Advice</Label>
                <Textarea
                  id="advice"
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="followup">Follow-up Date</Label>
                <Input 
                  type="date" 
                  id="followup" 
                  className="mt-1.5" 
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Medicine Entry */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Add Medicines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="medicine-search">Search Medicine</Label>
                <Popover open={showMedicineSearch} onOpenChange={setShowMedicineSearch}>
                  <PopoverTrigger asChild>
                    <div className="relative mt-1.5">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="medicine-search"
                        placeholder="Type to search medicines (handles misspellings)"
                        className="pl-10"
                        value={medicineSearchQuery}
                        onChange={(e) => {
                          setMedicineSearchQuery(e.target.value);
                          setShowMedicineSearch(true);
                        }}
                        onFocus={() => setShowMedicineSearch(true)}
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput 
                        placeholder="Search medicines..." 
                        value={medicineSearchQuery}
                        onValueChange={(value) => {
                          setMedicineSearchQuery(value);
                          setShowMedicineSearch(true);
                        }}
                      />
                      <CommandList>
                        <CommandEmpty>
                          {medicineSearchQuery.length < 2 
                            ? "Type at least 2 characters to search" 
                            : "No medicines found. Try a different search term."}
                        </CommandEmpty>
                        <CommandGroup>
                          {medicineSearchResults.length > 0 ? (
                            medicineSearchResults.map((medicine) => (
                              <CommandItem
                                key={medicine.id}
                                onSelect={() => handleSelectMedicine(medicine)}
                                className="cursor-pointer"
                              >
                                <div className="flex flex-col w-full">
                                  <span className="font-medium">{medicine.name}</span>
                                  {medicine.genericName && (
                                    <span className="text-xs text-muted-foreground">
                                      {medicine.genericName}
                                    </span>
                                  )}
                                  {medicine.manufacturer && (
                                    <span className="text-xs text-muted-foreground">
                                      {medicine.manufacturer}
                                    </span>
                                  )}
                                </div>
                              </CommandItem>
                            ))
                          ) : medicineSearchQuery.length >= 2 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                              Searching...
                            </div>
                          ) : null}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {selectedMedicine && (
                <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{selectedMedicine.name}</p>
                      {selectedMedicine.genericName && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Generic: {selectedMedicine.genericName}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedMedicine(null);
                        setMedicineSearchQuery("");
                        setAiDosageRecommendation(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* AI Dosage Recommendation Display */}
                  {aiDosageRecommendation && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-start gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-1">
                            AI Recommended Dosage
                          </p>
                          <p className="text-xs text-blue-700 dark:text-blue-300">
                            {aiDosageRecommendation.reasoning}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Dosage:</span>{" "}
                          <span className="font-medium">{aiDosageRecommendation.dosage}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Frequency:</span>{" "}
                          <span className="font-medium">{aiDosageRecommendation.frequency}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Timing:</span>{" "}
                          <span className="font-medium">{aiDosageRecommendation.timing.join(", ")}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Food:</span>{" "}
                          <span className="font-medium capitalize">{aiDosageRecommendation.food}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        💡 You can edit these recommendations below
                      </p>
                    </div>
                  )}
                  
                  {isLoadingDosage && (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-sm text-muted-foreground">Getting AI dosage recommendations...</p>
                    </div>
                  )}
                  
                  {/* Dosage Input (Editable) */}
                  <div>
                    <Label htmlFor="dosage" className="text-sm">
                      Dosage {aiDosageRecommendation && <span className="text-xs text-muted-foreground">(AI suggested: {aiDosageRecommendation.dosage})</span>}
                    </Label>
                    <Input
                      id="dosage"
                      placeholder="e.g., 500mg, 1 tablet"
                      className="mt-1.5"
                      value={medicineForm.dosage}
                      onChange={(e) => setMedicineForm(prev => ({ ...prev, dosage: e.target.value }))}
                    />
                  </div>
                  
                  {/* Timing (Editable) */}
                  <div>
                    <Label className="text-sm">
                      Timing {aiDosageRecommendation && <span className="text-xs text-muted-foreground">(AI suggested: {aiDosageRecommendation.timing.join(", ")})</span>}
                    </Label>
                    <div className="flex gap-4 mt-1.5">
                      {["morning", "afternoon", "night"].map((time) => (
                        <div key={time} className="flex items-center space-x-2">
                          <Checkbox
                            checked={medicineForm.timing.includes(time)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setMedicineForm(prev => ({
                                  ...prev,
                                  timing: [...prev.timing, time],
                                }));
                              } else {
                                setMedicineForm(prev => ({
                                  ...prev,
                                  timing: prev.timing.filter(t => t !== time),
                                }));
                              }
                            }}
                          />
                          <label className="text-sm capitalize cursor-pointer">{time}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Food Timing (Editable) */}
                  <div>
                    <Label className="text-sm">
                      Food Timing {aiDosageRecommendation && <span className="text-xs text-muted-foreground">(AI suggested: {aiDosageRecommendation.food})</span>}
                    </Label>
                    <RadioGroup
                      value={medicineForm.food}
                      onValueChange={(value) => setMedicineForm(prev => ({ ...prev, food: value as "before" | "after" }))}
                      className="flex gap-4 mt-1.5"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="before" id="before" />
                        <label htmlFor="before" className="text-sm cursor-pointer">Before</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="after" id="after" />
                        <label htmlFor="after" className="text-sm cursor-pointer">After</label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* Duration and Quantity (Editable) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration" className="text-sm">
                        Duration (days) {aiDosageRecommendation && <span className="text-xs text-muted-foreground">(AI: {aiDosageRecommendation.duration})</span>}
                      </Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        className="mt-1.5"
                        value={medicineForm.duration}
                        onChange={(e) => setMedicineForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 5 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity" className="text-sm">
                        Quantity {aiDosageRecommendation && <span className="text-xs text-muted-foreground">(AI: {aiDosageRecommendation.quantity})</span>}
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        className="mt-1.5"
                        value={medicineForm.quantity}
                        onChange={(e) => setMedicineForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 15 }))}
                      />
                    </div>
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full" 
                    onClick={handleAddMedicine}
                    disabled={isLoadingDosage}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Prescription
                  </Button>
                </div>
              )}

              {/* Added Medicines */}
              {medicines.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted p-3 border-b">
                    <p className="font-medium text-sm">Added Medicines ({medicines.length})</p>
                  </div>
                  <div className="divide-y">
                    {medicines.map((medicine) => (
                      <div key={medicine.id} className="p-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex-1">
                            <p className="font-medium">{medicine.name}</p>
                            <p className="text-muted-foreground text-xs mt-1">
                              <span className="font-medium">{medicine.dosage}</span> • 
                              {medicine.frequency} • 
                              {medicine.timing.map(t => t.charAt(0).toUpperCase()).join('-')} • 
                              {medicine.food === "after" ? " After" : " Before"} food • 
                              {medicine.duration} days • {medicine.quantity} tablets
                            </p>
                          </div>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-critical"
                            onClick={() => handleRemoveMedicine(medicine.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={handlePreviewPrescription}>
                  <FileText className="h-4 w-4 mr-2" />
                  Preview Prescription
                </Button>
                <Button className="flex-1" onClick={handleSaveAndSign} disabled={saving}>
                  {saving ? "Saving..." : "Save & Sign"}
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1" 
                  onClick={async () => {
                    const entityId = currentEntity?.id ?? user?.entityId;
                    const doctorId = user?.id;
                    if (!entityId || !doctorId || !patient?.id) {
                      notifyError("Order Lab Test", new Error("Missing required IDs"));
                      return;
                    }
                    try {
                      const testType = prompt("Enter test type (e.g., Complete Blood Count):");
                      if (testType) {
                        await createLabOrder(entityId, patient.id, doctorId, testType);
                        notifyByRole.doctor.labOrdered(testType);
                        navigate("/doctor/lab-requests");
                      }
                    } catch (error) {
                      notifyError("Order Lab Test", error);
                    }
                  }}
                >
                  Order Lab Test
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Prescription Preview Dialog */}
      {showPrescriptionPreview && (
        <Dialog open={showPrescriptionPreview} onOpenChange={setShowPrescriptionPreview}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Prescription Preview</DialogTitle>
              <DialogDescription>
                Review the formatted prescription before saving
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {formattedPrescription ? (
                <div className="border rounded-lg p-6 bg-white">
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {formattedPrescription}
                  </pre>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}
              <div className="flex gap-2 mt-4 flex-wrap">
              <Button
                variant="outline"
                onClick={() => {
                  if (formattedPrescription) {
                    const blob = new Blob([formattedPrescription], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `prescription-${patient.name}-${Date.now()}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                    toast.success("Prescription downloaded as TXT");
                  }
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download TXT
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (formattedPrescription) {
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                          <head>
                            <title>Prescription - ${patient.name}</title>
                            <style>
                              body { font-family: Arial, sans-serif; padding: 20px; }
                              pre { white-space: pre-wrap; font-size: 12px; }
                            </style>
                          </head>
                          <body>
                            <pre>${formattedPrescription}</pre>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.print();
                      toast.success("Prescription ready for PDF print");
                    }
                  }
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Print/PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (formattedPrescription) {
                    // Convert to CSV/Excel format
                    const csvRows = [
                      ["Prescription Data"],
                      ["Patient Name", patient.name],
                      ["Patient Age", patient.age],
                      ["Date", new Date().toLocaleDateString()],
                      ["Diagnosis", diagnosis || baseProblem],
                      ["", ""],
                      ["Medicines"],
                      ["Name", "Dosage", "Frequency", "Timing", "Food", "Duration", "Quantity"],
                      ...medicines.map(m => [
                        m.name,
                        m.dosage,
                        m.frequency,
                        m.timing.join(", "),
                        m.food,
                        `${m.duration} days`,
                        m.quantity.toString()
                      ]),
                      ["", ""],
                      ["Advice", advice],
                      ["Follow-up Date", followUpDate],
                    ];
                    
                    const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
                    const blob = new Blob([csvContent], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `prescription-${patient.name}-${Date.now()}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                    toast.success("Prescription downloaded as CSV/Excel");
                  }
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download CSV/Excel
              </Button>
              <Button
                variant="default"
                onClick={async () => {
                  await handleSaveAndSign();
                  setShowPrescriptionPreview(false);
                }}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save & Finalize"}
              </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

