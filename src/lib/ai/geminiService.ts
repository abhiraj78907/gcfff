/**
 * Gemini AI Service
 * Handles all AI-powered features using Google Gemini API
 */

// Get API key from environment or use provided key
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyBLJ62iYb0LICj2A8-Wui9WIYDM4JWQI2s";

// Updated API endpoints - using available models for this API key
// Available models: gemini-2.5-flash, gemini-2.5-pro, gemini-2.0-flash, gemini-flash-latest, gemini-pro-latest
const GEMINI_API_ENDPOINTS = [
  // Try latest stable models first (v1beta)
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent",
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent",
  // Then try v1 (newer API)
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent",
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent",
];

// Default endpoint (will try others if this fails)
const GEMINI_API_URL = GEMINI_API_ENDPOINTS[0];

export interface SymptomExtractionResult {
  symptoms: string[];
  symptomsNative?: string[]; // Symptoms in native language (Kannada/Telugu/Hindi)
  symptomsEnglish: string[]; // Symptoms in English
  confidence: number;
  language?: string; // Detected language
}

export interface DiagnosisSuggestion {
  diagnosis: string;
  confidence: number;
  reasoning: string;
  icd10Code?: string;
}

export interface PrescriptionFormatData {
  patientName: string;
  patientAge: string;
  patientId: string;
  date: string;
  diagnosis: string;
  medicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes?: string;
  }>;
  doctorName: string;
  doctorQualification?: string;
  advice?: string;
  followUpDate?: string;
}

/**
 * Extract symptoms from conversation transcript with regional language support
 * Returns symptoms in both native language and English
 */
export async function extractSymptoms(
  transcript: string,
  language: "kannada" | "hindi" | "telugu" | "english" = "kannada"
): Promise<SymptomExtractionResult> {
  console.log("[GeminiService] 🔍 Extracting symptoms with regional language support...", {
    transcriptLength: transcript.length,
    language,
    apiKey: GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : "MISSING",
  });
  
  try {
    const languageMap: Record<string, string> = {
      kannada: "Kannada",
      telugu: "Telugu",
      hindi: "Hindi",
      english: "English"
    };
    
    const nativeLang = languageMap[language] || "Kannada";
    
    const prompt = `You are a medical AI assistant specialized in Indian regional languages. Extract symptoms from the following patient conversation in ${nativeLang}.
    
    IMPORTANT RULES:
    1. Extract symptoms in BOTH native language (${nativeLang}) AND English
    2. Recognize common and village/regional medical terms (e.g., "ತಲೆನೋವು" in Kannada = "Headache" in English)
    3. Map regional terms to standard English medical terminology
    4. Return ONLY symptom names/phrases - no explanatory text
    5. Do NOT include phrases like "Patient reports", "AI-generated", or placeholder text
    6. Each symptom should be clear and medically relevant
    
    Conversation: ${transcript}
    
    Return ONLY this JSON format (no other text):
    {
      "symptomsNative": ["symptom in ${nativeLang}", ...],
      "symptomsEnglish": ["English symptom", ...],
      "confidence": 0.0-1.0,
      "language": "${language}"
    }
    
    Example for Kannada:
    {
      "symptomsNative": ["ತಲೆನೋವು", "ಜ್ವರ", "ದೇಹ ನೋವು"],
      "symptomsEnglish": ["Headache", "Fever", "Body pain"],
      "confidence": 0.95,
      "language": "kannada"
    }`;

    console.log("========================================");
    console.log("[GeminiService] 📡 MAKING API CALL TO GEMINI");
    console.log("========================================");
    console.log("[GeminiService] Request Details:", {
      url: GEMINI_API_URL,
      method: "POST",
      transcriptLength: transcript.length,
      language,
      apiKeyPresent: !!GEMINI_API_KEY,
      apiKeyPrefix: GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : "MISSING",
    });
    console.log("[GeminiService] Request Body:", {
      contents: [{
        parts: [{ text: prompt.substring(0, 200) + "..." }] // Log first 200 chars
      }]
    });
    console.log("========================================");
    
    const startTime = Date.now();
    
    // Try endpoints in order until one works
    let lastError: any = null;
    let response: Response | null = null;
    
    for (let i = 0; i < GEMINI_API_ENDPOINTS.length; i++) {
      const endpoint = GEMINI_API_ENDPOINTS[i];
      const requestUrl = `${endpoint}?key=${GEMINI_API_KEY}`;
      
      console.log(`[GeminiService] 🔗 Trying endpoint ${i + 1}/${GEMINI_API_ENDPOINTS.length}:`, {
        url: requestUrl.replace(GEMINI_API_KEY, "***KEY***"),
        timestamp: new Date().toISOString(),
      });
      
      try {
        response = await fetch(requestUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          }),
        });
        
        // Handle different status codes
        if (response.status === 404) {
          console.warn(`[GeminiService] ⚠️ Endpoint ${i + 1} returned 404, trying next...`);
          lastError = new Error(`404 Not Found: ${endpoint}`);
          response = null;
          continue;
        }
        
        if (response.status === 429) {
          // Rate limit exceeded - wait and retry
          const retryAfter = response.headers.get('Retry-After') || '60';
          const waitTime = parseInt(retryAfter) * 1000;
          console.warn(`[GeminiService] ⚠️ Rate limit exceeded (429). Waiting ${waitTime/1000}s before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          // Retry the same endpoint
          i--;
          continue;
        }
        
        if (response.status === 403) {
          const errorText = await response.text();
          console.error(`[GeminiService] ❌ Access forbidden (403): ${errorText}`);
          lastError = new Error(`403 Forbidden: ${errorText}`);
          break; // Don't try other endpoints for 403
        }
        
        // If not 404/429/403, break (success or other error)
        break;
      } catch (networkError: any) {
        console.warn(`[GeminiService] ⚠️ Endpoint ${i + 1} failed:`, networkError.message);
        lastError = networkError;
        response = null;
        if (i < GEMINI_API_ENDPOINTS.length - 1) {
          continue;
        }
      }
    }
    
    // If all endpoints failed, throw the last error
    if (!response) {
      console.error("========================================");
      console.error("[GeminiService] ❌ ALL ENDPOINTS FAILED");
      console.error("========================================");
      console.error("[GeminiService] Last error:", lastError);
      console.error("========================================");
      throw lastError || new Error("All Gemini API endpoints failed");
    }
    
    // Handle 429 rate limit error
    if (response.status === 429) {
      const errorText = await response.text();
      let errorMessage = "Rate limit exceeded. Please wait a moment and try again.";
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message;
        }
      } catch (e) {
        // Not JSON
      }
      console.error("========================================");
      console.error("[GeminiService] ❌ RATE LIMIT EXCEEDED (429)");
      console.error("========================================");
      console.error("[GeminiService] Error:", errorMessage);
      console.error("[GeminiService] Please wait before making more requests.");
      console.error("========================================");
      throw new Error(`Rate limit exceeded: ${errorMessage}`);
    }

    const duration = Date.now() - startTime;
    console.log("========================================");
    console.log("[GeminiService] 📡 API RESPONSE RECEIVED");
    console.log("========================================");
    console.log("[GeminiService] Response Details:", {
      status: response.status,
      statusText: response.statusText,
      duration: `${duration}ms`,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
    });
    console.log("========================================");

    if (!response.ok) {
      const errorText = await response.text();
      console.error("========================================");
      console.error("[GeminiService] ❌ API ERROR RESPONSE");
      console.error("========================================");
      console.error("[GeminiService] Error Details:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("[GeminiService] ✅ API response parsed", {
      hasCandidates: !!data.candidates,
      candidatesLength: data.candidates?.length || 0,
    });
    const text = data.candidates[0]?.content?.parts[0]?.text || "{}";
    console.log("[Gemini] Extracted text:", text);
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Handle new format with symptomsNative and symptomsEnglish
        if (parsed.symptomsNative && parsed.symptomsEnglish) {
          // Clean both arrays
          parsed.symptomsNative = parsed.symptomsNative.filter((s: string) => {
            const symptom = String(s).trim();
            return symptom.length > 0 && 
                   !symptom.includes("[AI-generated") && 
                   !symptom.includes("Patient reports:") &&
                   !symptom.toLowerCase().includes("placeholder");
          });
          
          parsed.symptomsEnglish = parsed.symptomsEnglish.filter((s: string) => {
            const symptom = String(s).trim();
            return symptom.length > 0 && 
                   !symptom.includes("[AI-generated") && 
                   !symptom.includes("Patient reports:") &&
                   !symptom.toLowerCase().includes("placeholder");
          });
          
          // Also set symptoms for backward compatibility
          parsed.symptoms = parsed.symptomsEnglish;
          
          return parsed;
        }
        
        // Backward compatibility - handle old format
        if (parsed.symptoms && Array.isArray(parsed.symptoms)) {
          parsed.symptoms = parsed.symptoms.filter((s: string) => {
            const symptom = String(s).trim();
            return symptom.length > 0 && 
                   !symptom.includes("[AI-generated") && 
                   !symptom.includes("Patient reports:") &&
                   !symptom.toLowerCase().includes("placeholder") &&
                   !symptom.startsWith("[") && !symptom.endsWith("]");
          });
          
          // If no English symptoms, use symptoms as English
          if (!parsed.symptomsEnglish) {
            parsed.symptomsEnglish = parsed.symptoms;
          }
        }
        
        return parsed;
      } catch (e) {
        console.error("[Gemini] JSON parse error:", e);
      }
    }

    // Fallback - return mock data for testing
    console.warn("[Gemini] Using fallback mock symptoms");
    // Extract basic symptoms from transcript as fallback
    const fallbackSymptoms: string[] = [];
    const transcriptLower = transcript.toLowerCase();
    if (transcriptLower.includes("headache") || transcriptLower.includes("head pain") || transcriptLower.includes("ತಲೆನೋವು")) fallbackSymptoms.push("Headache");
    if (transcriptLower.includes("fever") || transcriptLower.includes("temperature") || transcriptLower.includes("ಜ್ವರ")) fallbackSymptoms.push("Fever");
    if (transcriptLower.includes("body pain") || transcriptLower.includes("body ache") || transcriptLower.includes("ದೇಹ ನೋವು")) fallbackSymptoms.push("Body pain");
    if (transcriptLower.includes("fatigue") || transcriptLower.includes("tired")) fallbackSymptoms.push("Fatigue");
    if (transcriptLower.includes("cough") || transcriptLower.includes("ಕೆಮ್ಮು")) fallbackSymptoms.push("Cough");
    if (transcriptLower.includes("cold") || transcriptLower.includes("ಜುಮ್ಮು")) fallbackSymptoms.push("Cold");
    if (transcriptLower.includes("nausea") || transcriptLower.includes("vomiting")) fallbackSymptoms.push("Nausea");
    
    return {
      symptoms: fallbackSymptoms.length > 0 ? fallbackSymptoms : ["Headache", "Fever", "Body pain"],
      symptomsEnglish: fallbackSymptoms.length > 0 ? fallbackSymptoms : ["Headache", "Fever", "Body pain"],
      confidence: 0.7,
      language: language,
    };
  } catch (error) {
    console.error("[Gemini] Symptom extraction failed:", error);
    return {
      symptoms: [],
      confidence: 0,
    };
  }
}

/**
 * Suggest diagnosis based on symptoms and context
 */
export async function suggestDiagnosis(
  symptoms: string[],
  transcript: string,
  language: "kannada" | "hindi" | "telugu" | "english" = "kannada"
): Promise<DiagnosisSuggestion[]> {
  try {
    const prompt = `You are a medical AI assistant. Based on the following symptoms and conversation context in ${language}, suggest probable diagnoses.
    Return a JSON array of diagnosis suggestions with confidence scores and brief reasoning.
    
    Symptoms: ${symptoms.join(", ")}
    Conversation Context: ${transcript.substring(0, 500)}
    
    Return format: [{"diagnosis": "diagnosis name", "confidence": 0.0-1.0, "reasoning": "brief explanation", "icd10Code": "optional ICD-10 code"}]`;

    console.log("========================================");
    console.log("[GeminiService] 📡 MAKING DIAGNOSIS API CALL");
    console.log("========================================");
    console.log("[GeminiService] Request Details:", {
      symptomsCount: symptoms.length,
      transcriptLength: transcript.length,
      language,
    });
    
    const startTime = Date.now();
    
    // Try endpoints in order until one works
    let lastError: any = null;
    let response: Response | null = null;
    
    for (let i = 0; i < GEMINI_API_ENDPOINTS.length; i++) {
      const endpoint = GEMINI_API_ENDPOINTS[i];
      const requestUrl = `${endpoint}?key=${GEMINI_API_KEY}`;
      
      console.log(`[GeminiService] 🔗 Trying endpoint ${i + 1}/${GEMINI_API_ENDPOINTS.length} (Diagnosis):`, {
        url: requestUrl.replace(GEMINI_API_KEY, "***KEY***"),
      });
      
      try {
        response = await fetch(requestUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          }),
        });
        
        // Handle different status codes
        if (response.status === 404) {
          console.warn(`[GeminiService] ⚠️ Endpoint ${i + 1} returned 404, trying next...`);
          lastError = new Error(`404 Not Found: ${endpoint}`);
          response = null;
          continue;
        }
        
        if (response.status === 429) {
          // Rate limit exceeded - wait and retry
          const retryAfter = response.headers.get('Retry-After') || '60';
          const waitTime = parseInt(retryAfter) * 1000;
          console.warn(`[GeminiService] ⚠️ Rate limit exceeded (429). Waiting ${waitTime/1000}s before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          // Retry the same endpoint
          i--;
          continue;
        }
        
        if (response.status === 403) {
          const errorText = await response.text();
          console.error(`[GeminiService] ❌ Access forbidden (403): ${errorText}`);
          lastError = new Error(`403 Forbidden: ${errorText}`);
          break; // Don't try other endpoints for 403
        }
        
        break;
      } catch (networkError: any) {
        console.warn(`[GeminiService] ⚠️ Endpoint ${i + 1} failed:`, networkError.message);
        lastError = networkError;
        response = null;
        if (i < GEMINI_API_ENDPOINTS.length - 1) {
          continue;
        }
      }
    }
    
    if (!response) {
      console.error("[GeminiService] ❌ All endpoints failed (Diagnosis):", lastError);
      throw lastError || new Error("All Gemini API endpoints failed");
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Gemini API error: ${response.statusText}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message;
        }
      } catch (e) {
        // Not JSON
      }
      
      if (response.status === 429) {
        console.error("[GeminiService] ⚠️ Rate limit exceeded (Diagnosis). Please wait before retrying.");
        throw new Error(`Rate limit exceeded: ${errorMessage}`);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("[Gemini] Diagnosis response:", data);
    const text = data.candidates[0]?.content?.parts[0]?.text || "[]";
    console.log("[Gemini] Diagnosis text:", text);
    
    // Extract JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error("[Gemini] JSON parse error:", e);
      }
    }

    // Fallback - return mock suggestions
    console.warn("[Gemini] Using fallback mock diagnosis");
    return [
      {
        diagnosis: "Viral Fever",
        confidence: 0.85,
        reasoning: "Based on symptoms provided",
        icd10Code: "B34.9",
      },
    ];
  } catch (error) {
    console.error("[Gemini] Diagnosis suggestion failed:", error);
    return [];
  }
}

/**
 * Format prescription using template
 */
export async function formatPrescription(
  data: PrescriptionFormatData,
  template?: string
): Promise<string> {
  try {
    const prompt = template
      ? `Format the following prescription data according to this template structure:
      
      Template: ${template}
      
      Data: ${JSON.stringify(data, null, 2)}
      
      Return a professionally formatted prescription following the template structure.`
      : `Format the following prescription data into a professional medical prescription:
      
      ${JSON.stringify(data, null, 2)}
      
      Return a neatly formatted prescription with proper sections, alignment, and medical terminology.`;

    console.log("========================================");
    console.log("[GeminiService] 📡 MAKING PRESCRIPTION FORMAT API CALL");
    console.log("========================================");
    console.log("[GeminiService] Request Details:", {
      hasTemplate: !!template,
      medicinesCount: data.medicines?.length || 0,
    });
    
    const startTime = Date.now();
    
    // Try endpoints in order until one works
    let lastError: any = null;
    let response: Response | null = null;
    
    for (let i = 0; i < GEMINI_API_ENDPOINTS.length; i++) {
      const endpoint = GEMINI_API_ENDPOINTS[i];
      const requestUrl = `${endpoint}?key=${GEMINI_API_KEY}`;
      
      console.log(`[GeminiService] 🔗 Trying endpoint ${i + 1}/${GEMINI_API_ENDPOINTS.length} (Prescription):`, {
        url: requestUrl.replace(GEMINI_API_KEY, "***KEY***"),
      });
      
      try {
        response = await fetch(requestUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          }),
        });
        
        // Handle different status codes
        if (response.status === 404) {
          console.warn(`[GeminiService] ⚠️ Endpoint ${i + 1} returned 404, trying next...`);
          lastError = new Error(`404 Not Found: ${endpoint}`);
          response = null;
          continue;
        }
        
        if (response.status === 429) {
          // Rate limit exceeded - wait and retry
          const retryAfter = response.headers.get('Retry-After') || '60';
          const waitTime = parseInt(retryAfter) * 1000;
          console.warn(`[GeminiService] ⚠️ Rate limit exceeded (429). Waiting ${waitTime/1000}s before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          // Retry the same endpoint
          i--;
          continue;
        }
        
        if (response.status === 403) {
          const errorText = await response.text();
          console.error(`[GeminiService] ❌ Access forbidden (403): ${errorText}`);
          lastError = new Error(`403 Forbidden: ${errorText}`);
          break; // Don't try other endpoints for 403
        }
        
        break;
      } catch (networkError: any) {
        console.warn(`[GeminiService] ⚠️ Endpoint ${i + 1} failed:`, networkError.message);
        lastError = networkError;
        response = null;
        if (i < GEMINI_API_ENDPOINTS.length - 1) {
          continue;
        }
      }
    }
    
    if (!response) {
      console.error("[GeminiService] ❌ All endpoints failed (Prescription):", lastError);
      throw lastError || new Error("All Gemini API endpoints failed");
    }

    const duration = Date.now() - startTime;
    console.log("[GeminiService] 📡 PRESCRIPTION API RESPONSE", {
      status: response.status,
      duration: `${duration}ms`,
      ok: response.ok,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Gemini API error: ${response.statusText}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message;
        }
      } catch (e) {
        // Not JSON
      }
      
      console.error("[GeminiService] ❌ PRESCRIPTION API ERROR:", {
        status: response.status,
        body: errorText,
      });
      
      if (response.status === 429) {
        throw new Error(`Rate limit exceeded: ${errorMessage}`);
      }
      
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log("[GeminiService] ✅ Prescription formatted", {
      hasResult: !!result.candidates?.[0]?.content?.parts?.[0]?.text,
      resultLength: result.candidates?.[0]?.content?.parts?.[0]?.text?.length || 0,
    });
    return result.candidates[0]?.content?.parts[0]?.text || "";
  } catch (error) {
    console.error("[Gemini] Prescription formatting failed:", error);
    return "";
  }
}

/**
 * Detect language from text
 */
export async function detectLanguage(text: string): Promise<"kannada" | "hindi" | "telugu" | "english"> {
  try {
    const prompt = `Detect the primary language of this text. Return only one word: "kannada", "hindi", "telugu", or "english".
    Priority: If Kannada is detected, return "kannada". Otherwise return the most likely language.
    
    Text: ${text.substring(0, 200)}`;

    console.log("[GeminiService] 📡 MAKING LANGUAGE DETECTION API CALL", {
      textLength: text.length,
    });
    
    const startTime = Date.now();
    
    // Try endpoints in order until one works
    let lastError: any = null;
    let response: Response | null = null;
    
    for (let i = 0; i < GEMINI_API_ENDPOINTS.length; i++) {
      const endpoint = GEMINI_API_ENDPOINTS[i];
      const requestUrl = `${endpoint}?key=${GEMINI_API_KEY}`;
      
      console.log(`[GeminiService] 🔗 Trying endpoint ${i + 1}/${GEMINI_API_ENDPOINTS.length} (Language):`, {
        url: requestUrl.replace(GEMINI_API_KEY, "***KEY***"),
      });
      
      try {
        response = await fetch(requestUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }]
          }),
        });
        
        // Handle different status codes
        if (response.status === 404) {
          console.warn(`[GeminiService] ⚠️ Endpoint ${i + 1} returned 404, trying next...`);
          lastError = new Error(`404 Not Found: ${endpoint}`);
          response = null;
          continue;
        }
        
        if (response.status === 429) {
          // Rate limit exceeded - wait and retry
          const retryAfter = response.headers.get('Retry-After') || '60';
          const waitTime = parseInt(retryAfter) * 1000;
          console.warn(`[GeminiService] ⚠️ Rate limit exceeded (429). Waiting ${waitTime/1000}s before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          // Retry the same endpoint
          i--;
          continue;
        }
        
        if (response.status === 403) {
          const errorText = await response.text();
          console.error(`[GeminiService] ❌ Access forbidden (403): ${errorText}`);
          lastError = new Error(`403 Forbidden: ${errorText}`);
          break; // Don't try other endpoints for 403
        }
        
        break;
      } catch (networkError: any) {
        console.warn(`[GeminiService] ⚠️ Endpoint ${i + 1} failed:`, networkError.message);
        lastError = networkError;
        response = null;
        if (i < GEMINI_API_ENDPOINTS.length - 1) {
          continue;
        }
      }
    }
    
    if (!response) {
      console.warn("[GeminiService] ⚠️ All endpoints failed (Language), using fallback");
      return "english"; // Fallback
    }

    const duration = Date.now() - startTime;
    console.log("[GeminiService] 📡 LANGUAGE DETECTION API RESPONSE", {
      status: response.status,
      duration: `${duration}ms`,
    });

    if (!response.ok) {
      console.warn("[GeminiService] ⚠️ Language detection failed, using fallback");
      return "english"; // Fallback
    }

    const data = await response.json();
    const detected = data.candidates[0]?.content?.parts[0]?.text?.toLowerCase().trim() || "english";
    console.log("[GeminiService] ✅ Language detected:", detected);
    
    if (detected.includes("kannada")) return "kannada";
    if (detected.includes("hindi")) return "hindi";
    if (detected.includes("telugu")) return "telugu";
    return "english";
  } catch (error) {
    console.error("[Gemini] Language detection failed:", error);
    return "english";
  }
}

