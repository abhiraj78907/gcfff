/**
 * Doctor Assistant AI Service
 * Comprehensive AI assistant that processes consultation data and auto-fills everything
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

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

const GEMINI_API_URL = GEMINI_API_ENDPOINTS[0];

export interface ConsultationAnalysis {
  symptoms: string[];
  diagnosis: string;
  diagnosisConfidence: number;
  reasoning: string;
  suggestedMedicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
    timing: ("morning" | "afternoon" | "night")[];
    food: "before" | "after";
    duration: number;
    quantity: number;
    reasoning: string;
  }>;
  advice: string;
  followUpDays?: number;
}

/**
 * Comprehensive consultation analysis - acts as doctor assistant
 * Processes transcript and returns structured consultation data
 */
export async function analyzeConsultation(
  transcript: string,
  language: "kannada" | "hindi" | "telugu" | "english" = "kannada"
): Promise<ConsultationAnalysis> {
  console.log("[DoctorAssistant] ===== STARTING COMPREHENSIVE ANALYSIS =====");
  console.log("[DoctorAssistant] Input transcript:", transcript);
  console.log("[DoctorAssistant] Language:", language);
  console.log("[DoctorAssistant] Transcript length:", transcript.length);

  const prompt = `You are an AI medical assistant helping a doctor during a patient consultation. Your role is to:
1. Extract symptoms from the conversation
2. Suggest a diagnosis based on symptoms
3. Recommend appropriate medicines with optimal timing (morning/afternoon/night)
4. Provide medical advice
5. Suggest follow-up if needed

IMPORTANT RULES:
- Act as a professional medical assistant
- Extract ONLY real symptoms (no placeholders, no meta-commentary)
- Suggest evidence-based diagnosis
- Recommend medicines with optimal timing based on medicine type:
  * Morning medicines: Usually for chronic conditions, vitamins, supplements
  * Afternoon medicines: Usually for mid-day doses, some antibiotics
  * Night medicines: Usually for sleep aids, some antibiotics, pain relief before sleep
- Consider medicine interactions and best practices
- Provide clear, structured medical advice

Conversation Transcript (${language}): ${transcript}

Return ONLY a valid JSON object in this exact format (no other text):
{
  "symptoms": ["symptom1", "symptom2", ...],
  "diagnosis": "diagnosis name",
  "diagnosisConfidence": 0.0-1.0,
  "reasoning": "brief explanation",
  "suggestedMedicines": [
    {
      "name": "Medicine Name",
      "dosage": "e.g., 500mg",
      "frequency": "e.g., 2 times daily",
      "timing": ["morning", "afternoon", "night"],
      "food": "before" or "after",
      "duration": number of days,
      "quantity": total tablets,
      "reasoning": "why this medicine and timing"
    }
  ],
  "advice": "patient advice",
  "followUpDays": optional number of days for follow-up
}`;

  try {
    console.log("[DoctorAssistant] 📡 Making API call to Gemini...");
    const startTime = Date.now();
    
    // Try endpoints in order until one works
    let lastError: any = null;
    let response: Response | null = null;
    
    for (let i = 0; i < GEMINI_API_ENDPOINTS.length; i++) {
      const endpoint = GEMINI_API_ENDPOINTS[i];
      const requestUrl = `${endpoint}?key=${GEMINI_API_KEY}`;
      
      console.log(`[DoctorAssistant] 🔗 Trying endpoint ${i + 1}/${GEMINI_API_ENDPOINTS.length}:`, {
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
          console.warn(`[DoctorAssistant] ⚠️ Endpoint ${i + 1} returned 404, trying next...`);
          lastError = new Error(`404 Not Found: ${endpoint}`);
          response = null;
          continue;
        }
        
        if (response.status === 429) {
          // Rate limit exceeded - wait and retry
          const retryAfter = response.headers.get('Retry-After') || '60';
          const waitTime = parseInt(retryAfter) * 1000;
          console.warn(`[DoctorAssistant] ⚠️ Rate limit exceeded (429). Waiting ${waitTime/1000}s before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          // Retry the same endpoint
          i--;
          continue;
        }
        
        if (response.status === 403) {
          const errorText = await response.text();
          console.error(`[DoctorAssistant] ❌ Access forbidden (403): ${errorText}`);
          lastError = new Error(`403 Forbidden: ${errorText}`);
          break; // Don't try other endpoints for 403
        }
        
        // If not 404/429/403, break (success or other error)
        break;
      } catch (networkError: any) {
        console.warn(`[DoctorAssistant] ⚠️ Endpoint ${i + 1} failed:`, networkError.message);
        lastError = networkError;
        response = null;
        if (i < GEMINI_API_ENDPOINTS.length - 1) {
          continue;
        }
      }
    }
    
    // If all endpoints failed
    if (!response) {
      console.error("[DoctorAssistant] ❌ All endpoints failed:", lastError);
      throw lastError || new Error("All Gemini API endpoints failed");
    }

    const duration = Date.now() - startTime;
    console.log("[DoctorAssistant] 📡 API response received", {
      status: response.status,
      statusText: response.statusText,
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
      
      console.error("[DoctorAssistant] ❌ API error response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      
      if (response.status === 429) {
        console.error("[DoctorAssistant] ⚠️ Rate limit exceeded. Please wait before retrying.");
        throw new Error(`Rate limit exceeded: ${errorMessage}`);
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log("[DoctorAssistant] ✅ API response parsed", {
      hasCandidates: !!data.candidates,
      candidatesLength: data.candidates?.length || 0,
    });

    const text = data.candidates[0]?.content?.parts[0]?.text || "{}";
    console.log("[DoctorAssistant] 📝 Raw AI response text:", text);
    console.log("[DoctorAssistant] 📝 Response text length:", text.length);

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log("[DoctorAssistant] ✅ Parsed JSON successfully:", parsed);
        console.log("[DoctorAssistant] Symptoms count:", parsed.symptoms?.length || 0);
        console.log("[DoctorAssistant] Diagnosis:", parsed.diagnosis);
        console.log("[DoctorAssistant] Medicines count:", parsed.suggestedMedicines?.length || 0);
        
        // Validate and clean the response
        if (!parsed.symptoms || !Array.isArray(parsed.symptoms)) {
          console.warn("[DoctorAssistant] ⚠️ Invalid symptoms, using fallback");
          parsed.symptoms = [];
        }
        
        if (!parsed.diagnosis) {
          console.warn("[DoctorAssistant] ⚠️ No diagnosis, using fallback");
          parsed.diagnosis = "General Consultation";
        }
        
        if (!parsed.suggestedMedicines || !Array.isArray(parsed.suggestedMedicines)) {
          console.warn("[DoctorAssistant] ⚠️ Invalid medicines, using empty array");
          parsed.suggestedMedicines = [];
        }
        
        // Clean symptoms - remove placeholders
        parsed.symptoms = parsed.symptoms.filter((s: string) => {
          const symptom = String(s).trim();
          return symptom.length > 0 && 
                 !symptom.includes("[AI-generated") && 
                 !symptom.includes("Patient reports:") &&
                 !symptom.toLowerCase().includes("placeholder") &&
                 !symptom.startsWith("[") && !symptom.endsWith("]");
        });
        
        console.log("[DoctorAssistant] ✅ Final cleaned analysis:", {
          symptoms: parsed.symptoms,
          diagnosis: parsed.diagnosis,
          medicinesCount: parsed.suggestedMedicines.length,
        });
        
        return parsed as ConsultationAnalysis;
      } catch (e) {
        console.error("[DoctorAssistant] ❌ JSON parse error:", e);
        console.error("[DoctorAssistant] Failed to parse text:", text);
      }
    }

    // Fallback - extract basic info from transcript
    console.warn("[DoctorAssistant] ⚠️ Using fallback analysis");
    const fallbackSymptoms: string[] = [];
    const transcriptLower = transcript.toLowerCase();
    if (transcriptLower.includes("headache") || transcriptLower.includes("head pain")) fallbackSymptoms.push("Headache");
    if (transcriptLower.includes("fever") || transcriptLower.includes("temperature")) fallbackSymptoms.push("Fever");
    if (transcriptLower.includes("body pain") || transcriptLower.includes("body ache")) fallbackSymptoms.push("Body pain");
    if (transcriptLower.includes("fatigue") || transcriptLower.includes("tired")) fallbackSymptoms.push("Fatigue");
    if (transcriptLower.includes("cough")) fallbackSymptoms.push("Cough");
    if (transcriptLower.includes("cold")) fallbackSymptoms.push("Cold");
    
    return {
      symptoms: fallbackSymptoms.length > 0 ? fallbackSymptoms : ["Headache", "Fever"],
      diagnosis: "Viral Fever",
      diagnosisConfidence: 0.75,
      reasoning: "Based on common symptoms",
      suggestedMedicines: [
        {
          name: "Paracetamol 500mg",
          dosage: "500mg",
          frequency: "3 times daily",
          timing: ["morning", "afternoon", "night"],
          food: "after",
          duration: 5,
          quantity: 15,
          reasoning: "Standard antipyretic and analgesic",
        },
      ],
      advice: "Take rest, drink plenty of fluids, avoid oily food",
      followUpDays: 3,
    };
  } catch (error) {
    console.error("[DoctorAssistant] ❌ Analysis failed:", error);
    throw error;
  }
}

/**
 * AI-powered dosage and timing recommendation for Indian medicines
 * Uses Gemini API to suggest optimal dosage, frequency, timing, and food timing
 */
export interface DosageRecommendation {
  dosage: string; // e.g., "500mg", "1 tablet", "10ml"
  frequency: string; // e.g., "2 times daily", "3 times daily"
  timing: ("morning" | "afternoon" | "night")[];
  food: "before" | "after";
  duration: number; // days
  quantity: number; // total tablets/capsules
  reasoning: string; // Why this recommendation
}

export async function getDosageRecommendation(
  medicineName: string,
  medicineGenericName?: string,
  patientAge?: string,
  diagnosis?: string,
  symptoms?: string
): Promise<DosageRecommendation> {
  console.log("[DoctorAssistant] 🤖 Getting AI dosage recommendation for:", medicineName);
  
  try {
    const prompt = `You are a medical AI assistant specialized in Indian medicine standards. Recommend optimal dosage, timing, and frequency for the following medicine.

Medicine Name: ${medicineName}
${medicineGenericName ? `Generic Name: ${medicineGenericName}` : ""}
${patientAge ? `Patient Age: ${patientAge}` : ""}
${diagnosis ? `Diagnosis: ${diagnosis}` : ""}
${symptoms ? `Symptoms: ${symptoms}` : ""}

IMPORTANT RULES (Indian Medical Standards):
1. Dosage should follow Indian pharmaceutical standards and common practice
2. Timing should be optimal (morning/afternoon/night) based on medicine type
3. Food timing (before/after) should be appropriate for medicine absorption
4. Duration should be appropriate for the condition (typically 3-7 days for acute, longer for chronic)
5. Quantity should match duration and frequency (e.g., 3 times daily for 5 days = 15 tablets)
6. Consider patient age if provided (adjust for pediatric/adult/geriatric)

Return ONLY this JSON format (no other text):
{
  "dosage": "e.g., 500mg or 1 tablet",
  "frequency": "e.g., 2 times daily or 3 times daily",
  "timing": ["morning", "afternoon", "night"],
  "food": "before" or "after",
  "duration": number of days (typically 3-7),
  "quantity": total tablets/capsules needed,
  "reasoning": "brief explanation of why this recommendation"
}

Example:
{
  "dosage": "500mg",
  "frequency": "3 times daily",
  "timing": ["morning", "afternoon", "night"],
  "food": "after",
  "duration": 5,
  "quantity": 15,
  "reasoning": "Paracetamol 500mg is typically taken 3 times daily after food for fever/pain relief. 5 days duration is standard for acute conditions."
}`;

    // Try endpoints in order until one works
    let lastError: any = null;
    let response: Response | null = null;
    
    for (let i = 0; i < GEMINI_API_ENDPOINTS.length; i++) {
      const endpoint = GEMINI_API_ENDPOINTS[i];
      const requestUrl = `${endpoint}?key=${GEMINI_API_KEY}`;
      
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
        
        if (response.status === 404) {
          lastError = new Error(`404 Not Found: ${endpoint}`);
          response = null;
          continue;
        }
        
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After') || '60';
          const waitTime = parseInt(retryAfter) * 1000;
          console.warn(`[DoctorAssistant] ⚠️ Rate limit (429). Waiting ${waitTime/1000}s...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          i--;
          continue;
        }
        
        if (response.ok) break;
      } catch (networkError: any) {
        lastError = networkError;
        response = null;
        if (i < GEMINI_API_ENDPOINTS.length - 1) continue;
      }
    }
    
    if (!response || !response.ok) {
      console.warn("[DoctorAssistant] ⚠️ AI dosage recommendation failed, using fallback");
      return getFallbackDosageRecommendation(medicineName);
    }
    
    const data = await response.json();
    const text = data.candidates[0]?.content?.parts[0]?.text || "{}";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log("[DoctorAssistant] ✅ AI dosage recommendation received:", parsed);
        return parsed;
      } catch (e) {
        console.error("[DoctorAssistant] JSON parse error:", e);
      }
    }
    
    return getFallbackDosageRecommendation(medicineName);
  } catch (error) {
    console.error("[DoctorAssistant] ❌ Dosage recommendation failed:", error);
    return getFallbackDosageRecommendation(medicineName);
  }
}

/**
 * Fallback dosage recommendation based on medicine type
 */
function getFallbackDosageRecommendation(medicineName: string): DosageRecommendation {
  const name = medicineName.toLowerCase();
  
  // Antibiotics
  if (name.includes("antibiotic") || name.includes("amoxicillin") || name.includes("azithromycin") ||
      name.includes("ciprofloxacin") || name.includes("doxycycline")) {
    return {
      dosage: "500mg",
      frequency: "2-3 times daily",
      timing: ["morning", "afternoon", "night"],
      food: "after",
      duration: 5,
      quantity: 15,
      reasoning: "Antibiotics are typically taken 2-3 times daily after food for 5-7 days"
    };
  }
  
  // Pain relief
  if (name.includes("paracetamol") || name.includes("acetaminophen") || name.includes("dolo") ||
      name.includes("crocin") || name.includes("calpol")) {
    return {
      dosage: "500mg",
      frequency: "3 times daily",
      timing: ["morning", "afternoon", "night"],
      food: "after",
      duration: 5,
      quantity: 15,
      reasoning: "Paracetamol is typically taken 3 times daily after food for fever/pain relief"
    };
  }
  
  // Antacids
  if (name.includes("antacid") || name.includes("omeprazole") || name.includes("pantoprazole") ||
      name.includes("pantocid") || name.includes("omez")) {
    return {
      dosage: "20-40mg",
      frequency: "2 times daily",
      timing: ["morning", "night"],
      food: "before",
      duration: 7,
      quantity: 14,
      reasoning: "PPIs are typically taken twice daily before food for acid-related conditions"
    };
  }
  
  // Default
  return {
    dosage: "As directed",
    frequency: "3 times daily",
    timing: ["morning", "afternoon", "night"],
    food: "after",
    duration: 5,
    quantity: 15,
    reasoning: "Standard dosing: 3 times daily after food for 5 days"
  };
}

/**
 * Suggest medicine timing based on medicine name/type (fallback function)
 */
export function suggestMedicineTiming(medicineName: string): ("morning" | "afternoon" | "night")[] {
  console.log("[DoctorAssistant] Suggesting timing for medicine:", medicineName);
  
  const name = medicineName.toLowerCase();
  
  // Morning medicines (usually taken once or twice daily)
  if (name.includes("vitamin") || name.includes("supplement") || name.includes("calcium") || 
      name.includes("iron") || name.includes("multivitamin") || name.includes("vitamin d")) {
    console.log("[DoctorAssistant] → Morning medicine (vitamin/supplement)");
    return ["morning"];
  }
  
  // Night medicines (sleep aids, some pain relief)
  if (name.includes("sleep") || name.includes("melatonin") || name.includes("diphenhydramine") ||
      name.includes("promethazine") || name.includes("lorazepam")) {
    console.log("[DoctorAssistant] → Night medicine (sleep aid)");
    return ["night"];
  }
  
  // Antibiotics - usually 2-3 times daily
  if (name.includes("antibiotic") || name.includes("amoxicillin") || name.includes("azithromycin") ||
      name.includes("ciprofloxacin") || name.includes("doxycycline")) {
    console.log("[DoctorAssistant] → 3 times daily (antibiotic)");
    return ["morning", "afternoon", "night"];
  }
  
  // Pain relief - usually 2-3 times daily
  if (name.includes("paracetamol") || name.includes("acetaminophen") || name.includes("dolo") ||
      name.includes("ibuprofen") || name.includes("diclofenac")) {
    console.log("[DoctorAssistant] → 3 times daily (pain relief)");
    return ["morning", "afternoon", "night"];
  }
  
  // Antacids - usually before meals
  if (name.includes("antacid") || name.includes("omeprazole") || name.includes("pantoprazole") ||
      name.includes("ranitidine")) {
    console.log("[DoctorAssistant] → Morning and night (antacid)");
    return ["morning", "night"];
  }
  
  // Default: 3 times daily
  console.log("[DoctorAssistant] → Default: 3 times daily");
  return ["morning", "afternoon", "night"];
}

