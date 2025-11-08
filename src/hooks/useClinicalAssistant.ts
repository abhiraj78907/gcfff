/**
 * Hook for Clinical AI Assistant
 * Integrates the comprehensive clinical assistant into consultation workflow
 */

import { useState, useCallback, useRef } from "react";
import { analyzeClinicalConversation, getMedicinePrescriptionStructure, type ClinicalTranscriptResult, type MedicinePrescriptionStructure, type SupportedLanguage } from "@shared/lib/ai/clinicalAssistant";
import { toast } from "sonner";

export interface ClinicalAssistantState {
  isProcessing: boolean;
  transcript: string;
  symptoms: {
    original: string[];
    normalized: string[];
  };
  diagnosis: {
    primary: string;
    confidence: number;
    reasoning: string;
    icd10Code?: string;
    alternatives?: Array<{
      diagnosis: string;
      confidence: number;
      reasoning: string;
    }>;
  };
  prescriptionStructure: {
    dosage: string;
    frequency: string;
    timing: ("morning" | "afternoon" | "night")[];
    foodTiming: "before" | "after";
    duration: number;
    instructions: string;
  };
  advice: string;
  followUpDays?: number;
  detectedLanguage: SupportedLanguage;
}

export function useClinicalAssistant() {
  const [state, setState] = useState<ClinicalAssistantState>({
    isProcessing: false,
    transcript: "",
    symptoms: {
      original: [],
      normalized: []
    },
    diagnosis: {
      primary: "",
      confidence: 0,
      reasoning: ""
    },
    prescriptionStructure: {
      dosage: "As directed",
      frequency: "3 times daily",
      timing: ["morning", "afternoon", "night"],
      foodTiming: "after",
      duration: 5,
      instructions: "Take as prescribed"
    },
    advice: "",
    detectedLanguage: "english"
  });

  const processingRef = useRef(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Analyze clinical conversation transcript
   * Debounced to avoid excessive API calls
   */
  const analyzeTranscript = useCallback(async (
    transcript: string,
    language?: SupportedLanguage,
    debounceMs: number = 2000
  ) => {
    if (!transcript || transcript.trim().length < 10) {
      return;
    }

    // Clear existing debounce
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce the analysis
    debounceTimeoutRef.current = setTimeout(async () => {
      if (processingRef.current) {
        console.log("[useClinicalAssistant] Already processing, skipping...");
        return;
      }

      processingRef.current = true;
      setState(prev => ({ ...prev, isProcessing: true }));

      try {
        console.log("[useClinicalAssistant] Analyzing transcript...", {
          length: transcript.length,
          language
        });

        const result = await analyzeClinicalConversation(transcript, language);

        setState({
          isProcessing: false,
          transcript: result.transcript,
          symptoms: result.symptoms,
          diagnosis: result.diagnosis,
          prescriptionStructure: result.prescriptionStructure,
          advice: result.advice,
          followUpDays: result.followUpDays,
          detectedLanguage: result.detectedLanguage
        });

        console.log("[useClinicalAssistant] ✅ Analysis complete", {
          symptomsCount: result.symptoms.normalized.length,
          diagnosis: result.diagnosis.primary,
          confidence: result.diagnosis.confidence
        });

        toast.success("Clinical analysis complete", {
          description: `Diagnosis: ${result.diagnosis.primary} (${Math.round(result.diagnosis.confidence * 100)}% confidence)`
        });
      } catch (error: any) {
        console.error("[useClinicalAssistant] Analysis failed:", error);
        setState(prev => ({ ...prev, isProcessing: false }));
        toast.error("Clinical analysis failed", {
          description: error.message || "Please try again"
        });
      } finally {
        processingRef.current = false;
      }
    }, debounceMs);
  }, []);

  /**
   * Get prescription structure for a manually selected medicine
   */
  const getMedicineStructure = useCallback(async (
    medicineName: string,
    diagnosis: string,
    patientAge?: string
  ): Promise<MedicinePrescriptionStructure | null> => {
    try {
      console.log("[useClinicalAssistant] Getting medicine structure for:", medicineName);
      const structure = await getMedicinePrescriptionStructure(medicineName, diagnosis, patientAge);
      return structure;
    } catch (error) {
      console.error("[useClinicalAssistant] Failed to get medicine structure:", error);
      toast.error("Failed to get medicine structure", {
        description: "Using default values"
      });
      return null;
    }
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({
      isProcessing: false,
      transcript: "",
      symptoms: {
        original: [],
        normalized: []
      },
      diagnosis: {
        primary: "",
        confidence: 0,
        reasoning: ""
      },
      prescriptionStructure: {
        dosage: "As directed",
        frequency: "3 times daily",
        timing: ["morning", "afternoon", "night"],
        foodTiming: "after",
        duration: 5,
        instructions: "Take as prescribed"
      },
      advice: "",
      detectedLanguage: "english"
    });
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
    processingRef.current = false;
  }, []);

  /**
   * Update prescription structure manually
   */
  const updatePrescriptionStructure = useCallback((updates: Partial<ClinicalAssistantState["prescriptionStructure"]>) => {
    setState(prev => ({
      ...prev,
      prescriptionStructure: {
        ...prev.prescriptionStructure,
        ...updates
      }
    }));
  }, []);

  return {
    state,
    analyzeTranscript,
    getMedicineStructure,
    reset,
    updatePrescriptionStructure
  };
}

