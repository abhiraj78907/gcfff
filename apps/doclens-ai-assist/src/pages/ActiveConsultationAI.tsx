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
import { analyzeConsultation, suggestMedicineTiming, getDosageRecommendation, type ConsultationAnalysis, type DosageRecommendation } from "@shared/lib/ai/doctorAssistant";
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
  
  // Speech Recognition
  const speechRecognitionRef = useRef<SpeechRecognitionService | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null); // Keep stream active during recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentSpeaker, setCurrentSpeaker] = useState<"patient" | "doctor">("patient");
  const [detectedLanguage, setDetectedLanguage] = useState<"kannada" | "hindi" | "telugu" | "english">("kannada");
  const [fullTranscript, setFullTranscript] = useState("");
  const [micPermissionStatus, setMicPermissionStatus] = useState<"unknown" | "granted" | "denied" | "prompt">("unknown");
  
  // AI Processing
  const [isProcessingSymptoms, setIsProcessingSymptoms] = useState(false);
  const [isProcessingDiagnosis, setIsProcessingDiagnosis] = useState(false);
  const [diagnosisSuggestions, setDiagnosisSuggestions] = useState<DiagnosisSuggestion[]>([]);
  const [showDiagnosisSuggestions, setShowDiagnosisSuggestions] = useState(false);
  
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

  // Comprehensive AI Analysis - Doctor Assistant
  const analyzeConsultationComprehensive = useCallback(async (transcript: string) => {
    // Check if component is still mounted before proceeding
    if (!isMountedRef.current) {
      console.warn("[AI DOCTOR ASSISTANT] ⚠️ Component unmounted, skipping analysis");
      return;
    }
    
    console.log("========================================");
    console.log("[AI DOCTOR ASSISTANT] 🏥 STARTING COMPREHENSIVE ANALYSIS");
    console.log("========================================");
    console.log("[AI DOCTOR ASSISTANT] Input transcript:", transcript);
    console.log("[AI DOCTOR ASSISTANT] Language:", detectedLanguage);
    
    setIsProcessingSymptoms(true);
    setIsProcessingDiagnosis(true);
    
    try {
      const analysis = await analyzeConsultation(transcript, detectedLanguage);
      
      // Check again after async operation
      if (!isMountedRef.current) {
        console.warn("[AI DOCTOR ASSISTANT] ⚠️ Component unmounted during analysis, skipping state updates");
        return;
      }
      
      console.log("========================================");
      console.log("[AI DOCTOR ASSISTANT] ✅ ANALYSIS COMPLETE");
      console.log("========================================");
      console.log("[AI DOCTOR ASSISTANT] Full analysis response:", JSON.stringify(analysis, null, 2));
      console.log("[AI DOCTOR ASSISTANT] Symptoms:", analysis.symptoms);
      console.log("[AI DOCTOR ASSISTANT] Diagnosis:", analysis.diagnosis);
      console.log("[AI DOCTOR ASSISTANT] Medicines:", analysis.suggestedMedicines);
      console.log("========================================");
      
      // Auto-fill symptoms
      if (analysis.symptoms && analysis.symptoms.length > 0) {
        const symptomText = analysis.symptoms.join(", ");
        console.log("[AI DOCTOR ASSISTANT] → Auto-filling symptoms:", symptomText);
        if (isMountedRef.current) {
          setSymptoms(symptomText);
          toast.success("✅ Symptoms auto-filled", {
            description: `${analysis.symptoms.length} symptoms identified`,
          });
        }
      }
      
      // Auto-fill diagnosis
      if (analysis.diagnosis) {
        console.log("[AI DOCTOR ASSISTANT] → Auto-filling diagnosis:", analysis.diagnosis);
        if (isMountedRef.current) {
          setDiagnosis(analysis.diagnosis);
          toast.success("✅ Diagnosis auto-filled", {
            description: `${analysis.diagnosis} (${(analysis.diagnosisConfidence * 100).toFixed(0)}% confidence)`,
          });
        }
      }
      
      // Auto-fill advice
      if (analysis.advice) {
        console.log("[AI DOCTOR ASSISTANT] → Auto-filling advice:", analysis.advice);
        if (isMountedRef.current) {
          setAdvice(analysis.advice);
        }
      }
      
      // Auto-fill follow-up date
      if (analysis.followUpDays) {
        const followUpDate = new Date();
        followUpDate.setDate(followUpDate.getDate() + analysis.followUpDays);
        const dateStr = followUpDate.toISOString().split("T")[0];
        console.log("[AI DOCTOR ASSISTANT] → Auto-filling follow-up date:", dateStr);
        if (isMountedRef.current) {
          setFollowUpDate(dateStr);
        }
      }
      
      // Auto-add suggested medicines with optimal timing
      if (analysis.suggestedMedicines && analysis.suggestedMedicines.length > 0) {
        console.log("[AI DOCTOR ASSISTANT] → Auto-adding medicines:", analysis.suggestedMedicines.length);
        
        const newMedicines: MedicineItem[] = analysis.suggestedMedicines.map((med, idx) => ({
          id: `ai-med-${Date.now()}-${idx}`,
          name: med.name,
          timing: med.timing,
          food: med.food,
          duration: med.duration,
          quantity: med.quantity,
          drugId: `drug-${idx}`,
          dosage: med.dosage,
          frequency: med.frequency,
        }));
        
        console.log("[AI DOCTOR ASSISTANT] → Medicine items created:", newMedicines);
        if (isMountedRef.current) {
          setMedicines(newMedicines);
          toast.success("✅ Medicines auto-added", {
            description: `${newMedicines.length} medicines with optimal timing`,
          });
        }
      }
      
      if (isMountedRef.current) {
        setIsProcessingSymptoms(false);
        setIsProcessingDiagnosis(false);
        console.log("[AI DOCTOR ASSISTANT] ✅ All auto-fills complete!");
      }
      
    } catch (error) {
      console.error("[AI DOCTOR ASSISTANT] ❌ Analysis failed:", error);
      if (isMountedRef.current) {
        toast.error("AI analysis failed", {
          description: "Please fill manually or try again",
        });
        setIsProcessingSymptoms(false);
        setIsProcessingDiagnosis(false);
      }
    }
  }, [detectedLanguage]);

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

  // Extract symptoms asynchronously - defined after getDiagnosisSuggestions
  const extractSymptomsAsync = useCallback(async (transcript: string, force: boolean = false) => {
    // Only skip if already processing
    if (isProcessingSymptoms) {
      console.log("[AI] Already processing symptoms, skipping...");
      return;
    }
    
    // If symptoms exist and doctor might have edited, only update if force=true
    if (symptoms.length > 20 && !force) {
      console.log("[AI] Symptoms already exist, skipping auto-extraction");
      return;
    }
    
    console.log("[AI] Extracting symptoms from:", transcript);
    setIsProcessingSymptoms(true);
    
    try {
      const result = await extractSymptoms(transcript, detectedLanguage);
      console.log("[AI] Symptom extraction result:", result);
      
      // Handle new format with native and English symptoms
      const englishSymptoms = result.symptomsEnglish || result.symptoms || [];
      const nativeSymptoms = result.symptomsNative || [];
      
      if (englishSymptoms.length > 0) {
        // Filter out any placeholder or invalid symptoms
        const validEnglishSymptoms = englishSymptoms.filter((s: string) => {
          const symptom = String(s).trim();
          return symptom.length > 0 && 
                 !symptom.includes("[AI-generated") && 
                 !symptom.includes("Patient reports:") &&
                 !symptom.toLowerCase().includes("placeholder");
        });
        
        const validNativeSymptoms = nativeSymptoms.filter((s: string) => {
          const symptom = String(s).trim();
          return symptom.length > 0 && 
                 !symptom.includes("[AI-generated") && 
                 !symptom.includes("Patient reports:") &&
                 !symptom.toLowerCase().includes("placeholder");
        });
        
        if (validEnglishSymptoms.length > 0) {
          const englishText = validEnglishSymptoms.join(", ");
          const nativeText = validNativeSymptoms.length > 0 ? validNativeSymptoms.join(", ") : "";
          
          // Update English symptoms
          setSymptomsEnglish((prev) => {
            if (prev && prev.length > 0 && !prev.includes("[AI-generated") && !prev.includes("Patient reports:")) {
              const existingSymptoms = prev.split(/[,\n]/).map(s => s.trim().toLowerCase());
              const newSymptoms = validEnglishSymptoms.filter((s: string) => 
                !existingSymptoms.includes(String(s).trim().toLowerCase())
              );
              if (newSymptoms.length > 0) {
                return `${prev}, ${newSymptoms.join(", ")}`;
              }
              return prev;
            }
            return englishText;
          });
          
          // Update native symptoms
          if (nativeText) {
            setSymptomsNative((prev) => {
              if (prev && prev.length > 0 && !prev.includes("[AI-generated") && !prev.includes("Patient reports:")) {
                const existingSymptoms = prev.split(/[,\n]/).map(s => s.trim().toLowerCase());
                const newSymptoms = validNativeSymptoms.filter((s: string) => 
                  !existingSymptoms.includes(String(s).trim().toLowerCase())
                );
                if (newSymptoms.length > 0) {
                  return `${prev}, ${newSymptoms.join(", ")}`;
                }
                return prev;
              }
              return nativeText;
            });
          }
          
          // Also update main symptoms field (for backward compatibility)
          setSymptoms(englishText);
          
          toast.success("Symptoms extracted", {
            description: `${validEnglishSymptoms.length} symptoms found (${nativeText ? "with native language" : "English only"})`,
          });
          
          // Auto-trigger diagnosis suggestions after symptoms are extracted
          setTimeout(() => {
            getDiagnosisSuggestions();
          }, 1000);
        } else {
          console.log("[AI] No valid symptoms extracted from transcript");
          toast.warning("No symptoms found", {
            description: "Please enter symptoms manually or try speaking again",
          });
        }
      } else {
        console.log("[AI] No symptoms extracted from transcript");
      }
    } catch (error) {
      console.error("[AI] Symptom extraction failed:", error);
      toast.error("Symptom extraction failed", {
        description: "Please enter symptoms manually",
      });
    } finally {
      setIsProcessingSymptoms(false);
    }
  }, [detectedLanguage, symptoms, isProcessingSymptoms, getDiagnosisSuggestions, analyzeConsultationComprehensive]);

  // Initialize Speech Recognition
  useEffect(() => {
    console.log("[ActiveConsultationAI] useEffect: Initializing speech recognition...");
    console.log("[ActiveConsultationAI] SpeechRecognitionService:", SpeechRecognitionService);
    console.log("[ActiveConsultationAI] isSupported check:", SpeechRecognitionService?.isSupported);
    
    if (!SpeechRecognitionService) {
      console.error("[ActiveConsultationAI] SpeechRecognitionService is not imported!");
      return;
    }
    
    if (SpeechRecognitionService.isSupported()) {
      console.log("[ActiveConsultationAI] Speech recognition supported");
      
      try {
        const service = new SpeechRecognitionService({
          language: "kn-IN", // Kannada (India) - priority
          continuous: true,
          interimResults: true,
        });

        service.onTranscript((result) => {
          console.log("[ActiveConsultationAI] 📝 Transcript received:", {
            transcript: result.transcript.substring(0, 100) + "...",
            length: result.transcript.length,
            isFinal: result.isFinal,
            speaker: result.speaker,
            confidence: result.confidence,
          });
          
          // Always update transcript for real-time display
          setFullTranscript(result.transcript);
          
          // Auto-detect language periodically (every 50+ characters)
          if (result.isFinal && result.transcript.length > 50) {
            console.log("[ActiveConsultationAI] 🌐 Detecting language from transcript...");
            detectLanguage(result.transcript).then((lang) => {
              console.log("[ActiveConsultationAI] ✅ Language detected:", lang);
              setDetectedLanguage(lang);
              // Update speech recognition language
              speechRecognitionRef.current?.setLanguage(lang);
            }).catch(err => {
              console.error("[ActiveConsultationAI] ❌ Language detection failed:", err);
            });
          }
          
          // Auto-extract symptoms in real-time (both interim and final results)
          // Extract from patient speech or any speech if speaker detection isn't working
          if (result.speaker === "patient" || !result.speaker) {
            // For final results, use comprehensive analysis
            if (result.isFinal && result.transcript.length > 10) {
              console.log("[ActiveConsultationAI] 🤖 Final transcript - triggering comprehensive AI analysis...");
              analyzeConsultationComprehensive(result.transcript).catch(err => {
                console.error("[ActiveConsultationAI] ❌ Comprehensive analysis error:", err);
                // Fallback to simple extraction
                extractSymptomsAsync(result.transcript, true).catch(e => {
                  console.error("[ActiveConsultationAI] ❌ Symptom extraction error:", e);
                });
              });
            }
            // For interim results, extract periodically (every 30+ characters)
            else if (!result.isFinal && result.transcript.length > 30) {
              // Debounce interim extraction to avoid too many API calls
              const lastExtraction = (window as any).lastSymptomExtraction || 0;
              const now = Date.now();
              if (now - lastExtraction > 3000) { // Extract every 3 seconds max
                console.log("[ActiveConsultationAI] 🤖 Extracting symptoms from interim transcript...");
                (window as any).lastSymptomExtraction = now;
                extractSymptomsAsync(result.transcript, false).catch(err => {
                  console.error("[ActiveConsultationAI] ❌ Symptom extraction error:", err);
                });
              }
            }
          }
        });

        service.onError((error) => {
          console.error("[ActiveConsultationAI] ❌ Speech recognition error:", error);
          setIsRecording(false);
          toast.error("Speech recognition error", {
            description: error.message || "Please try again or use manual input",
          });
        });

        speechRecognitionRef.current = service;
        console.log("[Consultation] Speech recognition service initialized");
      } catch (error) {
        console.error("[Consultation] Failed to initialize speech recognition:", error);
        toast.error("Failed to initialize speech recognition", {
          description: error instanceof Error ? error.message : "Unknown error",
        });
      }
    } else {
      console.warn("[Consultation] Speech recognition not supported");
      toast.warning("Speech recognition not supported", {
        description: "Please use Chrome or Edge browser. Using mock mode for testing.",
      });
    }

    return () => {
      console.log("[Consultation] Cleaning up speech recognition");
      speechRecognitionRef.current?.stop();
      
      // Clean up microphone stream
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getTracks().forEach(track => track.stop());
        microphoneStreamRef.current = null;
      }
    };
  }, [extractSymptomsAsync]);

  // Component cleanup on unmount - prevents state updates after unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      console.log("[ActiveConsultationAI] 🧹 COMPONENT UNMOUNTING - Cleaning up all resources");
      isMountedRef.current = false;
      
      // Stop speech recognition
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
        speechRecognitionRef.current = null;
      }
      
      // Stop microphone stream
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getTracks().forEach(track => track.stop());
        microphoneStreamRef.current = null;
      }
      
      // No need to clean up button listener - using React onClick
      
      console.log("[ActiveConsultationAI] ✅ Cleanup complete");
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

  // Speech Recognition Handlers
  const handleStartRecording = useCallback(async () => {
    // CRITICAL: This log MUST appear when button is clicked
    console.log("========================================");
    console.log("========================================");
    console.log("========================================");
    console.log("🎤🎤🎤 BUTTON CLICKED - handleStartRecording CALLED! 🎤🎤🎤");
    console.log("========================================");
    console.log("========================================");
    console.log("========================================");
    console.log("[ACTIVE CONSULTATION] ===== STARTING RECORDING =====");
    console.log("========================================");
    console.log("[ACTIVE CONSULTATION] Current state:", {
      currentSpeaker,
      detectedLanguage,
      isRecording,
      hasService: !!speechRecognitionRef.current,
      isSupported: SpeechRecognitionService.isSupported(),
      micPermissionStatus,
      hasMediaDevices: !!navigator.mediaDevices,
      hasGetUserMedia: !!navigator.mediaDevices?.getUserMedia,
    });
    console.log("========================================");
    
    // Prevent double-start
    if (isRecording) {
      console.warn("[ACTIVE CONSULTATION] ⚠️ Already recording, ignoring start request");
      return;
    }
    
    // Check browser support first
    console.log("[ACTIVE CONSULTATION] Checking browser support...");
    console.log("[ACTIVE CONSULTATION] SpeechRecognitionService.isSupported():", SpeechRecognitionService.isSupported());
    
    if (!SpeechRecognitionService.isSupported()) {
      console.warn("========================================");
      console.warn("[ACTIVE CONSULTATION] ⚠️ SPEECH RECOGNITION NOT SUPPORTED");
      console.warn("========================================");
      console.warn("[ACTIVE CONSULTATION] Browser does not support Web Speech API");
      console.warn("[ACTIVE CONSULTATION] Please use Chrome or Edge browser");
      console.warn("========================================");
      toast.warning("Speech recognition not supported", {
        description: "Please use Chrome or Edge browser. Using mock mode.",
      });
      // Still try to request permission - maybe user wants to use manual input
    } else {
      console.log("[ACTIVE CONSULTATION] ✅ Browser supports speech recognition");
    }
    
    // ===== STEP 1: REQUEST MICROPHONE PERMISSION =====
    console.log("========================================");
    console.log("[MICROPHONE] 🎤 STEP 1: REQUESTING MICROPHONE PERMISSION");
    console.log("========================================");
    console.log("[MICROPHONE] navigator.mediaDevices:", navigator.mediaDevices);
    console.log("[MICROPHONE] getUserMedia available:", !!navigator.mediaDevices?.getUserMedia);
    console.log("[MICROPHONE] About to call getUserMedia...");
    console.log("[MICROPHONE] This SHOULD trigger browser permission dialog!");
    console.log("========================================");
    
    let stream: MediaStream | null = null;
    
    try {
      // Request microphone access - this MUST be called from user interaction
      // This is the ONLY way to trigger browser permission dialog
      console.log("[MICROPHONE] ========================================");
      console.log("[MICROPHONE] 🎤 REQUESTING MICROPHONE PERMISSION");
      console.log("[MICROPHONE] ========================================");
      console.log("[MICROPHONE] Calling navigator.mediaDevices.getUserMedia({ audio: true })...");
      console.log("[MICROPHONE] This should trigger browser permission dialog!");
      console.log("[MICROPHONE] Waiting for user to grant/deny permission...");
      console.log("[MICROPHONE] ========================================");
      
      // Show loading state
      toast.loading("Requesting microphone permission...", {
        id: "mic-permission",
        duration: 5000,
      });
      
      stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      
      console.log("========================================");
      console.log("[MICROPHONE] ✅✅✅ PERMISSION GRANTED! ✅✅✅");
      console.log("========================================");
      console.log("[MICROPHONE] Stream received:", stream);
      console.log("[MICROPHONE] Stream active:", stream.active);
      console.log("[MICROPHONE] Stream id:", stream.id);
      console.log("[MICROPHONE] Audio tracks count:", stream.getAudioTracks().length);
      console.log("========================================");
      
      // Dismiss loading toast
      toast.dismiss("mic-permission");
      
      // Store stream reference to keep it active during recording
      microphoneStreamRef.current = stream;
      setMicPermissionStatus("granted");
      
      // Log detailed track info
      stream.getAudioTracks().forEach((track, idx) => {
        console.log(`[MICROPHONE] Audio track ${idx}:`, {
          enabled: track.enabled,
          readyState: track.readyState,
          label: track.label,
          kind: track.kind,
          id: track.id,
          muted: track.muted,
          settings: track.getSettings(),
        });
      });
      
      console.log("[MICROPHONE] ✅ Microphone stream is ACTIVE and READY for speech recognition");
      console.log("========================================");
      
      toast.success("🎤 Microphone enabled", {
        description: "Permission granted. Starting speech recognition...",
        duration: 2000,
      });
      
      // DO NOT stop tracks here - keep them active for speech recognition
      // The speech recognition API needs the microphone to be active
      
    } catch (error: any) {
      console.log("========================================");
      console.error("[MICROPHONE] ❌❌❌ PERMISSION DENIED OR ERROR ❌❌❌");
      console.log("========================================");
      console.error("[MICROPHONE] Error name:", error.name);
      console.error("[MICROPHONE] Error message:", error.message);
      console.error("[MICROPHONE] Error code:", error.code);
      console.error("[MICROPHONE] Full error:", error);
      console.log("========================================");
      
      // Dismiss loading toast
      toast.dismiss("mic-permission");
      
      setMicPermissionStatus("denied");
      
      let errorMessage = "Microphone permission is required for voice recording.";
      let errorDescription = "Please allow microphone access and try again.";
      
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        errorMessage = "Microphone permission denied";
        errorDescription = "Please click the lock icon (🔒) in your browser's address bar and allow microphone access, then click 'Start Recording' again.";
        console.error("[MICROPHONE] User denied permission or permission was previously denied");
      } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        errorMessage = "No microphone found";
        errorDescription = "Please connect a microphone and try again.";
        console.error("[MICROPHONE] No microphone device found on system");
      } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        errorMessage = "Microphone is busy";
        errorDescription = "Another application is using your microphone. Please close it and try again.";
        console.error("[MICROPHONE] Microphone is being used by another application");
      } else {
        console.error("[MICROPHONE] Unknown error:", error);
      }
      
      toast.error(errorMessage, {
        description: errorDescription,
        duration: 8000,
      });
      
      setIsRecording(false);
      return;
    }
    
    // ===== STEP 2: INITIALIZE SPEECH RECOGNITION (only if permission granted) =====
    if (!stream) {
      console.error("[ACTIVE CONSULTATION] ❌ No stream available, cannot proceed");
      return;
    }

    // ===== STEP 2: INITIALIZE SPEECH RECOGNITION (only if permission granted) =====
    console.log("========================================");
    console.log("[SPEECH RECOGNITION] 🎙️ STEP 2: INITIALIZING SPEECH RECOGNITION");
    console.log("========================================");
    console.log("[SPEECH RECOGNITION] Service already exists:", !!speechRecognitionRef.current);
    
    // If service not initialized, try to initialize it now
    if (!speechRecognitionRef.current) {
      console.log("[SPEECH RECOGNITION] ⚠️ Service not initialized, creating new service...");
      try {
        console.log("[SPEECH RECOGNITION] Creating SpeechRecognitionService with config:", {
          language: "kn-IN",
          continuous: true,
          interimResults: true,
        });
        
        const service = new SpeechRecognitionService({
          language: "kn-IN",
          continuous: true,
          interimResults: true,
        });
        
        console.log("[SPEECH RECOGNITION] ✅ Service created:", service);

        service.onTranscript((result) => {
          // ===== ACCURATE VOICE-TO-TEXT LOGGING =====
          console.log("========================================");
          console.log("[VOICE-TO-TEXT] 📝 RAW TRANSCRIPT RECEIVED");
          console.log("========================================");
          console.log("[VOICE-TO-TEXT] Full transcript:", result.transcript);
          console.log("[VOICE-TO-TEXT] Transcript length:", result.transcript.length, "characters");
          console.log("[VOICE-TO-TEXT] Is final:", result.isFinal);
          console.log("[VOICE-TO-TEXT] Speaker:", result.speaker || "unknown");
          console.log("[VOICE-TO-TEXT] Confidence:", result.confidence);
          console.log("[VOICE-TO-TEXT] Timestamp:", new Date().toISOString());
          console.log("========================================");
          
          // Always update transcript for real-time display
          setFullTranscript(result.transcript);
          
          // Auto-extract symptoms in real-time
          if (result.speaker === "patient" || !result.speaker) {
            if (result.isFinal && result.transcript.length > 10) {
              console.log("[ActiveConsultationAI] 🤖 Final transcript - triggering comprehensive AI analysis...");
              // Use comprehensive doctor assistant analysis
              analyzeConsultationComprehensive(result.transcript);
            } else if (!result.isFinal && result.transcript.length > 30) {
              const lastExtraction = (window as any).lastSymptomExtraction || 0;
              const now = Date.now();
              if (now - lastExtraction > 3000) {
                console.log("[ActiveConsultationAI] 🤖 Interim transcript - extracting symptoms...");
                (window as any).lastSymptomExtraction = now;
                extractSymptomsAsync(result.transcript, false);
              }
            }
          }
        });

        service.onError((error) => {
          console.error("[ActiveConsultationAI] ❌ Speech recognition error:", error);
          setIsRecording(false);
          toast.error("Speech recognition error", {
            description: error.message || "Please try again or use manual input",
          });
        });

        speechRecognitionRef.current = service;
        console.log("[SPEECH RECOGNITION] ✅ Service initialized and stored in ref");
      } catch (initError) {
        console.error("========================================");
        console.error("[SPEECH RECOGNITION] ❌ FAILED TO INITIALIZE SERVICE");
        console.error("========================================");
        console.error("[SPEECH RECOGNITION] Error:", initError);
        console.error("========================================");
        // Fall through to mock mode
      }
    } else {
      console.log("[SPEECH RECOGNITION] ✅ Service already exists, using existing service");
    }
    
    console.log("[SPEECH RECOGNITION] Final service check:", !!speechRecognitionRef.current);
    console.log("========================================");

    // If still no service, use mock mode (ONLY if permission was granted but service failed)
    if (!speechRecognitionRef.current) {
      console.warn("========================================");
      console.warn("[ACTIVE CONSULTATION] ⚠️ SPEECH RECOGNITION SERVICE NOT AVAILABLE");
      console.warn("========================================");
      console.warn("[ACTIVE CONSULTATION] Permission was granted but service initialization failed");
      console.warn("[ACTIVE CONSULTATION] Falling back to mock mode for testing");
      console.warn("========================================");
      
      // Only use mock mode if we have permission (otherwise user should see error)
      if (micPermissionStatus === "granted" || stream) {
        setIsRecording(true);
        toast.info("Mock mode: Speech recognition not available", {
          description: "Using simulated transcription for testing",
        });
        
        // Simulate transcript after 2 seconds and auto-extract symptoms
        setTimeout(() => {
          const mockTranscript = "Patient reports headache, fever, and body pain for the last 3 days. Also experiencing fatigue and loss of appetite.";
          console.log("[ActiveConsultationAI] 🎭 Mock transcript generated:", mockTranscript);
          setFullTranscript(mockTranscript);
          toast.success("Mock transcript generated", {
            description: "This is simulated data for testing",
          });
          // Use comprehensive AI analysis for mock transcript
          console.log("[ActiveConsultationAI] 🎭 Using comprehensive AI analysis for mock transcript");
          analyzeConsultationComprehensive(mockTranscript).catch(err => {
            console.error("[ActiveConsultationAI] ❌ Mock analysis failed, using fallback:", err);
            extractSymptomsAsync(mockTranscript, true);
          });
        }, 2000);
        return;
      } else {
        // No permission, don't use mock mode - show error instead
        console.error("[ACTIVE CONSULTATION] ❌ Cannot proceed: No permission and no service");
        return;
      }
    }

    // ===== STEP 3: START SPEECH RECOGNITION =====
    console.log("========================================");
    console.log("[SPEECH RECOGNITION] 🎙️ STEP 3: STARTING SPEECH RECOGNITION");
    console.log("========================================");
    console.log("[SPEECH RECOGNITION] Service available:", !!speechRecognitionRef.current);
    console.log("[SPEECH RECOGNITION] Microphone stream active:", !!microphoneStreamRef.current);
    console.log("[SPEECH RECOGNITION] Current speaker:", currentSpeaker);
    console.log("[SPEECH RECOGNITION] Language:", detectedLanguage);
    
    // Start the actual recording
    try {
      if (!speechRecognitionRef.current) {
        throw new Error("Speech recognition service not initialized");
      }
      
      console.log("[SPEECH RECOGNITION] Calling service.start()...");
      speechRecognitionRef.current.start(currentSpeaker);
      
      setIsRecording(true);
      
      console.log("========================================");
      console.log("[SPEECH RECOGNITION] ✅✅✅ RECORDING STARTED! ✅✅✅");
      console.log("========================================");
      console.log("[SPEECH RECOGNITION] isRecording:", true);
      console.log("[SPEECH RECOGNITION] Microphone stream:", microphoneStreamRef.current?.active);
      console.log("[SPEECH RECOGNITION] Ready to capture voice!");
      console.log("========================================");
      
      toast.success("🎤 AI listening started", {
        description: `Recording as ${currentSpeaker} in ${detectedLanguage}. Speak clearly into your microphone.`,
        duration: 3000,
      });
    } catch (error: any) {
      console.error("[ActiveConsultationAI] ❌ Start failed:", {
        error: error.message,
        name: error.name,
        code: error.code,
        stack: error.stack,
      });
      
      // Fallback to mock mode
      console.log("[ActiveConsultationAI] Falling back to mock mode...");
      setIsRecording(true);
      toast.warning("Using mock mode", {
        description: "Speech recognition unavailable. Using simulated data.",
      });
      
      setTimeout(() => {
        const mockTranscript = "Patient reports headache, fever, and body pain for the last 3 days. Also experiencing fatigue and loss of appetite.";
        console.log("[ActiveConsultationAI] 🎭 Mock transcript (fallback):", mockTranscript);
        setFullTranscript(mockTranscript);
        // Use comprehensive AI analysis for mock transcript
        console.log("[ActiveConsultationAI] 🎭 Using comprehensive AI analysis for mock transcript (fallback)");
        analyzeConsultationComprehensive(mockTranscript).catch(err => {
          console.error("[ActiveConsultationAI] ❌ Mock analysis failed, using fallback:", err);
          extractSymptomsAsync(mockTranscript, true);
        });
      }, 2000);
    }
  }, [currentSpeaker, detectedLanguage, micPermissionStatus, analyzeConsultationComprehensive, extractSymptomsAsync]);

  const handleStopRecording = useCallback(() => {
    console.log("[ActiveConsultationAI] ===== STOPPING RECORDING =====");
    console.log("[ActiveConsultationAI] Recording duration:", recordingTime, "seconds");
    console.log("[ActiveConsultationAI] Final transcript length:", fullTranscript.length);
    
    try {
      // Stop speech recognition
      speechRecognitionRef.current?.stop();
      
      // Stop and release microphone stream
      if (microphoneStreamRef.current) {
        console.log("[ActiveConsultationAI] Stopping microphone stream...");
        microphoneStreamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log("[ActiveConsultationAI] Microphone track stopped:", track.label);
        });
        microphoneStreamRef.current = null;
      }
      
      setIsRecording(false);
      console.log("[ActiveConsultationAI] ✅ Recording stopped successfully");
      toast.info("AI listening stopped", {
        description: `Recorded ${Math.floor(recordingTime / 60)}:${String(recordingTime % 60).padStart(2, '0')}`,
      });
    } catch (error) {
      console.error("[ActiveConsultationAI] ❌ Stop failed:", error);
      setIsRecording(false);
      
      // Clean up stream even on error
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getTracks().forEach(track => track.stop());
        microphoneStreamRef.current = null;
      }
      
      toast.warning("Recording stopped with errors");
    }
  }, [recordingTime, fullTranscript]);

  const handleSwitchSpeaker = () => {
    const newSpeaker = currentSpeaker === "patient" ? "doctor" : "patient";
    console.log("[ActiveConsultationAI] Switching speaker", {
      from: currentSpeaker,
      to: newSpeaker,
    });
    setCurrentSpeaker(newSpeaker);
    speechRecognitionRef.current?.switchSpeaker(newSpeaker);
    toast.info(`Switched to ${newSpeaker} mode`);
  };

  // Medicine Handlers - Enhanced with AI dosage recommendations
  const handleSelectMedicine = async (medicine: Medicine) => {
    console.log("[ActiveConsultationAI] Medicine selected:", medicine);
    setSelectedMedicine(medicine);
    setShowMedicineSearch(false);
    setMedicineSearchQuery(medicine.name);
    
    // Show loading state
    setIsLoadingDosage(true);
    toast.loading("Getting AI dosage recommendations...", {
      id: "dosage-recommendation",
      duration: 5000,
    });
    
    try {
      // Get AI-powered dosage recommendation
      const recommendation = await getDosageRecommendation(
        medicine.name,
        medicine.genericName,
        patient.age,
        diagnosis,
        symptomsEnglish || symptoms
      );
      
      console.log("[ActiveConsultationAI] ✅ AI dosage recommendation received:", recommendation);
      
      // Store recommendation for display
      setAiDosageRecommendation(recommendation);
      
      // Update medicine form with AI recommendations (doctor can edit these)
      setMedicineForm(prev => ({
        ...prev,
        timing: recommendation.timing,
        food: recommendation.food,
        duration: recommendation.duration,
        quantity: recommendation.quantity,
        dosage: recommendation.dosage,
      }));
      
      // Dismiss loading toast
      toast.dismiss("dosage-recommendation");
      
      toast.success("AI dosage recommended", {
        description: `${recommendation.dosage} - ${recommendation.frequency} (${recommendation.timing.join(", ")})`,
        duration: 3000,
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
          const { db } = await import("@shared/lib/firebase");
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
  console.log("[ActiveConsultationAI] handleTestAI function:", typeof handleTestAI);
  console.log("[ActiveConsultationAI] extractSymptoms function:", typeof extractSymptoms);
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
              
              {fullTranscript && (
                <div className="border rounded-lg p-3 bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Live Transcript:</p>
                  <p className="text-sm">{fullTranscript}</p>
                </div>
              )}
              
              {!fullTranscript && isRecording && (
                <div className="border rounded-lg p-3 bg-muted/30">
                  <p className="text-xs text-muted-foreground mb-1">Status:</p>
                  <p className="text-sm flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Listening... Speak clearly into your microphone
                  </p>
                </div>
              )}
              
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
                        Please use Chrome or Edge browser for voice recognition. Mock mode will be used for testing.
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

