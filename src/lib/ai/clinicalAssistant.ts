/**
 * Clinical AI Assistant Service
 * Expert clinical AI assistant integrated with Gemini Pro API
 * Handles long, real-time patient conversations in regional languages
 * (Kannada, Telugu, English, Hindi, Urdu)
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Gemini Pro API endpoints - prioritize Pro models
const GEMINI_API_ENDPOINTS = [
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent",
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent",
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent",
  "https://generativelanguage.googleapis.com/v1/models/gemini-pro-latest:generateContent",
];

export type SupportedLanguage = "kannada" | "telugu" | "hindi" | "urdu" | "tamil" | "english";

export interface ClinicalTranscriptResult {
  transcript: string;
  symptoms: {
    original: string[]; // Original expressions in patient's language
    normalized: string[]; // Standardized English medical terminology
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
    dosage: string; // e.g., "500mg", "1 tablet"
    frequency: string; // e.g., "2 times daily", "3 times daily"
    timing: ("morning" | "afternoon" | "night")[];
    foodTiming: "before" | "after";
    duration: number; // days
    instructions: string; // General instructions for medicines
  };
  advice: string;
  followUpDays?: number;
  detectedLanguage: SupportedLanguage;
}

/**
 * Comprehensive clinical analysis of patient conversation
 * Processes entire transcript without cut-off, extracts symptoms, provides diagnosis,
 * and suggests prescription structure (without medicine names)
 */
export async function analyzeClinicalConversation(
  transcript: string,
  language?: SupportedLanguage
): Promise<ClinicalTranscriptResult> {
  console.log("[ClinicalAssistant] ===== STARTING CLINICAL ANALYSIS =====");
  console.log("[ClinicalAssistant] Transcript length:", transcript.length);
  console.log("[ClinicalAssistant] Language:", language || "auto-detect");

  // Auto-detect language if not provided
  const detectedLanguage = language || await detectLanguage(transcript);

  const languageMap: Record<SupportedLanguage, string> = {
    kannada: "Kannada",
    telugu: "Telugu",
    hindi: "Hindi",
    urdu: "Urdu",
    tamil: "Tamil",
    english: "English"
  };

  const nativeLang = languageMap[detectedLanguage] || "English";

  const comprehensivePrompt = `You are an advanced multilingual clinical assistant integrated with Gemini Pro. Your role is to provide comprehensive, dynamic, and unique clinical analysis for each patient conversation.

CRITICAL REQUIREMENTS:

1. CONTINUOUS LISTENING ACROSS MULTIPLE LANGUAGES:
   - Listen continuously to the ENTIRE patient conversation across Kannada, Telugu, Hindi, Urdu, Tamil, and English
   - Handle ONLY ONE language at a time per consultation session
   - Current conversation is in: ${nativeLang}
   - Optimize AI analysis specifically for ${nativeLang} language patterns, medical terminology, and cultural context
   - Understand regional medical expressions, slang, and colloquialisms unique to ${nativeLang} speakers
   - Accurately capture and transcribe ALL spoken words including multiple symptoms, complaints, and contextual expressions
   - NO truncation or repetition - capture complete statements

2. DYNAMIC, UNIQUE CONVERSATION ANALYSIS:
   - For each unique conversation, dynamically update the transcript and extract DISTINCT symptoms and possible diagnosis
   - Add new information freshly - AVOID repeating the same summary for every session
   - Confirm uniqueness of each conversation summary - NO repeating canned text across different patients or sessions
   - Each analysis must be patient-specific and conversation-specific

3. LIVE PLACEHOLDER UPDATES:
   - Populate the application's symptom/diagnosis placeholders LIVE with new insights as the conversation progresses
   - Update dynamically as new information is spoken
   - Wait for completion of patient statements before concluding transcription for each segment
   - AVOID premature partial summaries - ensure complete thoughts are captured

4. SYMPTOM RECOGNITION & NORMALIZATION:
   - Accurately recognize ALL spoken symptoms, complaints, and relevant medical phrases
   - Support natural slang and colloquial terms, normalizing them to standard medical phrases
   - RETAIN original language quotes as annotations alongside normalized terms
   - Handle local slang and colloquial expressions (e.g., "ತಲೆನೋವು" = "Headache", "ज्वर" = "Fever", "بخار" = "Fever", "తలనొప్పి" = "Headache")
   - Map regional terms to standard English medical terminology
   - Preserve original expressions for reference

5. DIAGNOSIS ANALYSIS:
   - Analyze the FULL conversation context dynamically
   - Provide a professional and precise medical diagnosis based on symptoms recognized
   - Include confidence score (0.0-1.0)
   - Provide reasoning for the diagnosis
   - Include ICD-10 code if applicable
   - Suggest alternative diagnoses if applicable
   - Update diagnosis as conversation progresses with new information

6. PRESCRIPTION STRUCTURE (CRITICAL: NO MEDICINE NAMES):
   - Autofill an editable prescription structure for:
     * Dosage format (e.g., "500mg", "1 tablet", "10ml")
     * Timing (morning, afternoon, night) - suggest optimal timing based on diagnosis
     * Frequency (e.g., "2 times daily", "3 times daily")
     * Food timing (before/after food)
     * Duration (number of days)
     * General instructions for medicines
   - EXCLUDE medication selection/autofill - only analyze and autofill symptoms, diagnosis, and related prescription fields EXCEPT medicines
   - DO NOT add or autofill any medicine names - the doctor will manually search, select, and add medicines
   - Your job is to handle all symptom and prescription details EXCEPT medicine selection

7. OUTPUT FORMAT:
   - Format output in the clinic's official prescription structure
   - Ensure accurate, patient-specific notes
   - Include clear sections for patient info, diagnosis, symptoms, doctor's advice
   - Provide editable medicine table structure (without medicine names)

8. LOW LATENCY & REAL-TIME UPDATES:
   - Keep latency low for a smooth real-time user interface
   - Allow doctor edits on all AI-generated content
   - Provide incremental updates as conversation progresses

9. PRIVACY & SECURITY:
   - Maintain privacy and security best practices during transcription and AI processing

PATIENT CONVERSATION TRANSCRIPT (${nativeLang}):
${transcript}

IMPORTANT: This is a UNIQUE conversation. Provide a UNIQUE analysis specific to this patient and this conversation. Do NOT use generic or repeated summaries.

Return ONLY a valid JSON object in this exact format (no other text, no markdown, no code blocks):
{
  "symptoms": {
    "original": ["original symptom expression 1", "original symptom expression 2", ...],
    "normalized": ["Standardized English Symptom 1", "Standardized English Symptom 2", ...]
  },
  "diagnosis": {
    "primary": "Primary Diagnosis Name",
    "confidence": 0.85,
    "reasoning": "Brief explanation of why this diagnosis based on symptoms",
    "icd10Code": "ICD-10 code if applicable",
    "alternatives": [
      {
        "diagnosis": "Alternative Diagnosis 1",
        "confidence": 0.70,
        "reasoning": "Brief reasoning"
      }
    ]
  },
  "prescriptionStructure": {
    "dosage": "e.g., 500mg or 1 tablet",
    "frequency": "e.g., 2 times daily or 3 times daily",
    "timing": ["morning", "afternoon", "night"],
    "foodTiming": "before" or "after",
    "duration": 5,
    "instructions": "General instructions for medicines (e.g., 'Take with plenty of water', 'Avoid alcohol', 'Complete full course')"
  },
  "advice": "Patient advice and recommendations",
  "followUpDays": 3,
  "detectedLanguage": "${detectedLanguage}"
}

IMPORTANT:
- Extract ONLY real symptoms (no placeholders, no meta-commentary, no "[AI-generated]" text)
- Do NOT include medicine names in prescriptionStructure
- Preserve original symptom expressions alongside normalized English terms
- Provide professional medical diagnosis with confidence scores
- Suggest optimal timing based on diagnosis and standard medical practice`;

  try {
    console.log("[ClinicalAssistant] 📡 Making API call to Gemini Pro...");
    const startTime = Date.now();
    
    let lastError: any = null;
    let response: Response | null = null;
    
    // Try serverless proxy first
    try {
      response = await fetch("/.netlify/functions/gemini-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: comprehensivePrompt })
      });
    } catch (e) {
      response = null;
    }

    // If proxy fails, try direct endpoints
    if (!response || !response.ok) {
      for (let i = 0; i < GEMINI_API_ENDPOINTS.length; i++) {
        const endpoint = GEMINI_API_ENDPOINTS[i];
        const requestUrl = `${endpoint}?key=${GEMINI_API_KEY}`;
        
        try {
          response = await fetch(requestUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: comprehensivePrompt }] }]
            }),
          });
          
          if (response.status === 404) {
            lastError = new Error(`404 Not Found: ${endpoint}`);
            response = null;
            continue;
          }
          
          if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After') || '60';
            const waitTime = parseInt(retryAfter) * 1000;
            console.warn(`[ClinicalAssistant] ⚠️ Rate limit (429). Waiting ${waitTime/1000}s...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            i--;
            continue;
          }
          
          if (response.status === 403) {
            const errorText = await response.text();
            console.error(`[ClinicalAssistant] ❌ Access forbidden (403): ${errorText}`);
            lastError = new Error(`403 Forbidden: ${errorText}`);
            break;
          }
          
          if (response.ok) break;
        } catch (networkError: any) {
          lastError = networkError;
          response = null;
          if (i < GEMINI_API_ENDPOINTS.length - 1) continue;
        }
      }
    }
    
    if (!response || !response.ok) {
      console.error("[ClinicalAssistant] ❌ All endpoints failed:", lastError);
      throw lastError || new Error("All Gemini API endpoints failed");
    }

    const duration = Date.now() - startTime;
    console.log("[ClinicalAssistant] 📡 API response received", {
      status: response.status,
      duration: `${duration}ms`,
    });

    const data = await response.json();
    const text = data.candidates[0]?.content?.parts[0]?.text || "{}";
    console.log("[ClinicalAssistant] 📝 Raw AI response:", text.substring(0, 500));

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log("[ClinicalAssistant] ✅ Parsed successfully");
        
        // Validate and clean response
        if (!parsed.symptoms || !parsed.symptoms.normalized) {
          parsed.symptoms = { original: [], normalized: [] };
        }
        if (!parsed.diagnosis) {
          parsed.diagnosis = {
            primary: "General Consultation",
            confidence: 0.5,
            reasoning: "Based on symptoms provided"
          };
        }
        if (!parsed.prescriptionStructure) {
          parsed.prescriptionStructure = {
            dosage: "As directed",
            frequency: "3 times daily",
            timing: ["morning", "afternoon", "night"],
            foodTiming: "after",
            duration: 5,
            instructions: "Take as prescribed"
          };
        }
        
        parsed.detectedLanguage = detectedLanguage;
        
        return parsed as ClinicalTranscriptResult;
      } catch (e) {
        console.error("[ClinicalAssistant] ❌ JSON parse error:", e);
      }
    }

    // Fallback response
    console.warn("[ClinicalAssistant] ⚠️ Using fallback analysis");
    return getFallbackAnalysis(transcript, detectedLanguage);
  } catch (error) {
    console.error("[ClinicalAssistant] ❌ Analysis failed:", error);
    return getFallbackAnalysis(transcript, detectedLanguage);
  }
}

/**
 * Detect language from transcript
 */
async function detectLanguage(text: string): Promise<SupportedLanguage> {
  try {
    const prompt = `Detect the primary language of this text. Return only one word: "kannada", "telugu", "hindi", "urdu", or "english".
Priority: If Kannada is detected, return "kannada". Otherwise return the most likely language.

Text: ${text.substring(0, 200)}`;

    // Try serverless proxy first
    try {
      const response = await fetch("/.netlify/functions/gemini-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      
      if (response.ok) {
        const data = await response.json();
        const detected = data.candidates[0]?.content?.parts[0]?.text?.toLowerCase().trim() || "english";
        if (detected.includes("kannada")) return "kannada";
        if (detected.includes("telugu")) return "telugu";
        if (detected.includes("hindi")) return "hindi";
        if (detected.includes("urdu")) return "urdu";
        return "english";
      }
    } catch (e) {
      // Fall through to direct API
    }

    // Direct API call
    for (const endpoint of GEMINI_API_ENDPOINTS) {
      try {
        const requestUrl = `${endpoint}?key=${GEMINI_API_KEY}`;
        const response = await fetch(requestUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          const detected = data.candidates[0]?.content?.parts[0]?.text?.toLowerCase().trim() || "english";
          if (detected.includes("kannada")) return "kannada";
          if (detected.includes("telugu")) return "telugu";
          if (detected.includes("hindi")) return "hindi";
          if (detected.includes("urdu")) return "urdu";
          return "english";
        }
      } catch (e) {
        continue;
      }
    }
    
    return "english";
  } catch (error) {
    console.error("[ClinicalAssistant] Language detection failed:", error);
    return "english";
  }
}

/**
 * Fallback analysis when API fails
 */
function getFallbackAnalysis(
  transcript: string,
  language: SupportedLanguage
): ClinicalTranscriptResult {
  const transcriptLower = transcript.toLowerCase();
  const symptoms: string[] = [];
  const originalSymptoms: string[] = [];
  
  // Extract basic symptoms
  if (transcriptLower.includes("headache") || transcriptLower.includes("head pain") || 
      transcriptLower.includes("ತಲೆನೋವು") || transcriptLower.includes("सिरदर्द") ||
      transcriptLower.includes("سر درد")) {
    symptoms.push("Headache");
    originalSymptoms.push(transcript.match(/headache|head pain|ತಲೆನೋವು|सिरदर्द|سر درد/i)?.[0] || "Headache");
  }
  if (transcriptLower.includes("fever") || transcriptLower.includes("temperature") ||
      transcriptLower.includes("ಜ್ವರ") || transcriptLower.includes("ज्वर") ||
      transcriptLower.includes("بخار")) {
    symptoms.push("Fever");
    originalSymptoms.push(transcript.match(/fever|temperature|ಜ್ವರ|ज्वर|بخار/i)?.[0] || "Fever");
  }
  if (transcriptLower.includes("body pain") || transcriptLower.includes("body ache") ||
      transcriptLower.includes("ದೇಹ ನೋವು") || transcriptLower.includes("शरीर दर्द")) {
    symptoms.push("Body pain");
    originalSymptoms.push(transcript.match(/body pain|body ache|ದೇಹ ನೋವು|शरीर दर्द/i)?.[0] || "Body pain");
  }
  if (transcriptLower.includes("cough") || transcriptLower.includes("ಕೆಮ್ಮು") ||
      transcriptLower.includes("खांसी")) {
    symptoms.push("Cough");
    originalSymptoms.push(transcript.match(/cough|ಕೆಮ್ಮು|खांसी/i)?.[0] || "Cough");
  }
  
  return {
    transcript,
    symptoms: {
      original: originalSymptoms.length > 0 ? originalSymptoms : ["General complaint"],
      normalized: symptoms.length > 0 ? symptoms : ["General symptoms"]
    },
    diagnosis: {
      primary: "Viral Fever",
      confidence: 0.75,
      reasoning: "Based on common symptoms presented",
      icd10Code: "B34.9"
    },
    prescriptionStructure: {
      dosage: "500mg",
      frequency: "3 times daily",
      timing: ["morning", "afternoon", "night"],
      foodTiming: "after",
      duration: 5,
      instructions: "Take with plenty of water. Complete full course."
    },
    advice: "Take rest, drink plenty of fluids, avoid oily food",
    followUpDays: 3,
    detectedLanguage: language
  };
}

/**
 * Get prescription structure recommendations for a specific medicine
 * (Called after doctor manually selects a medicine)
 */
export interface MedicinePrescriptionStructure {
  dosage: string;
  frequency: string;
  timing: ("morning" | "afternoon" | "night")[];
  foodTiming: "before" | "after";
  duration: number;
  quantity: number;
  instructions: string;
}

export async function getMedicinePrescriptionStructure(
  medicineName: string,
  diagnosis: string,
  patientAge?: string
): Promise<MedicinePrescriptionStructure> {
  console.log("[ClinicalAssistant] Getting prescription structure for medicine:", medicineName);
  
  const prompt = `You are a medical AI assistant. A doctor has manually selected the medicine "${medicineName}" for a patient with diagnosis "${diagnosis}".
${patientAge ? `Patient age: ${patientAge}` : ""}

Provide optimal prescription structure (dosage, timing, frequency, food timing, duration, quantity, instructions) for this medicine.
DO NOT suggest alternative medicines - only provide structure for the selected medicine.

Return ONLY this JSON format:
{
  "dosage": "e.g., 500mg or 1 tablet",
  "frequency": "e.g., 2 times daily or 3 times daily",
  "timing": ["morning", "afternoon", "night"],
  "foodTiming": "before" or "after",
  "duration": 5,
  "quantity": 15,
  "instructions": "Specific instructions for this medicine"
}`;

  try {
    // Try serverless proxy first
    try {
      const response = await fetch("/.netlify/functions/gemini-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      
      if (response.ok) {
        const data = await response.json();
        const text = data.candidates[0]?.content?.parts[0]?.text || "{}";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    } catch (e) {
      // Fall through
    }

    // Direct API call
    for (const endpoint of GEMINI_API_ENDPOINTS) {
      try {
        const requestUrl = `${endpoint}?key=${GEMINI_API_KEY}`;
        const response = await fetch(requestUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          const text = data.candidates[0]?.content?.parts[0]?.text || "{}";
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
          }
        }
      } catch (e) {
        continue;
      }
    }
    
    // Fallback
    return {
      dosage: "500mg",
      frequency: "3 times daily",
      timing: ["morning", "afternoon", "night"],
      foodTiming: "after",
      duration: 5,
      quantity: 15,
      instructions: "Take as prescribed"
    };
  } catch (error) {
    console.error("[ClinicalAssistant] Failed to get medicine structure:", error);
    return {
      dosage: "As directed",
      frequency: "3 times daily",
      timing: ["morning", "afternoon", "night"],
      foodTiming: "after",
      duration: 5,
      quantity: 15,
      instructions: "Take as prescribed"
    };
  }
}

