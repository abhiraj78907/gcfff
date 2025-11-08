/**
 * Symptom Normalization for Indian regional languages → Standard English
 * Fast, deterministic mappings layered on top of AI outputs.
 */

export type SupportedLanguage = "kannada" | "telugu" | "hindi" | "urdu" | "tamil" | "english";

type MappingEntry = {
  patterns: RegExp[];
  english: string;
};

// Core dictionary: add common colloquialisms and bracket codes
// Keep regexes case-insensitive; include common Unicode script tokens.
const CORE_MAP: MappingEntry[] = [
  // Fever
  { patterns: [/\b\[translate:jwara\]\b/i, /\bjwara\b/i, /ज्वर/u, /జ్వరం/u, /ஜுரம்/u, /بخار/u, /ಜ್ವರ/u, /\bfever\b/i], english: "Fever" },
  // Cold / nasal congestion
  { patterns: [/\b\[translate:negadi\]\b/i, /ನೆಗಡಿ/u, /నెగడి/u, /जुकाम/u, /نزلة/u, /மூக்கடைப்பு/u, /\bcold\b/i, /nasal\s*congestion/i, /nose\s*block/i], english: "Nasal congestion" },
  // Cough
  { patterns: [/ಕೆಮ್ಮು/u, /खांसी/u, /దగ్గు/u, /खाँसी/u, /سعال/u, /இருமல்/u, /\bcough\b/i], english: "Cough" },
  // Headache
  { patterns: [/ತಲೆನೋವು/u, /सिरदर्द/u, /தலைவலி/u, / తలనొప్పి/u, /سر درد/u, /\bhead\s*ache\b/i, /\bheadache\b/i], english: "Headache" },
  // Body pain
  { patterns: [/ದೇಹ\s*ನೋವು/u, /శరీర\s*నొప్పి/u, /بدن\s*درد/u, /بدن درد/u, /शरीर\s*दर्द/u, / உடல்\s*வலி/u, /\bbody\s*(pain|ache)\b/i, /myalgia/i], english: "Body pain" },
  // Sore throat
  { patterns: [/గొంతు\s*నొప్పి/u, /कंठ\s*दर्द/u, /தொண்டை\s*வலி/u, /ಗಂಟಲು\s*ನೋವು/u, /\bsore\s*throat\b/i, /pharyngitis/i], english: "Sore throat" },
  // Vomiting / Nausea
  { patterns: [/వాంతులు/u, /उल्टी/u, /قيء/u, /வாந்தி/u, /ಓಕರಿ/u, /\bnausea\b/i, /\bvomit(ing)?\b/i], english: "Nausea / Vomiting" },
  // Diarrhea / Loose stools
  { patterns: [/ಜಡ ದೋಡು/u, /डायरिया/u, /வயிற்றுப்போக்கு/u, /డయ్యేరియా/u, /اسہال/u, /\bdiarrh(o)?ea\b/i, /loose\s*stools?/i], english: "Diarrhea" },
  // Shortness of breath
  { patterns: [/ಉಸಿರಾಟ\s*ಕಡಿಮೆ/u, /सांस\s*फूलना/u, /تنگی\s*نفس/u, /மூச்சுத்திணறல்/u, /శ్వాస\s*తక్కువ/u, /short(ness)?\s*of\s*breath/i, /dyspnoea|dyspnea/i], english: "Shortness of breath" },
  // Chest pain
  { patterns: [/ಮೇಲುಮುಟ್ಟಿನ\s*ನೋವು/u, /छाती\s*में\s*दर्द/u, /صدر\s*میں\s*درد/u, /மார்பு\s*வலி/u, /ఛాతి\s*నొప్పి/u, /\bchest\s*pain\b/i, /angina/i], english: "Chest pain" },
];

/** Normalize a single phrase to English using CORE_MAP; return null if no confident match */
export function normalizePhraseToEnglish(input: string): string | null {
  const text = String(input || "").trim();
  if (!text) return null;
  for (const entry of CORE_MAP) {
    if (entry.patterns.some((re) => re.test(text))) return entry.english;
  }
  return null;
}

/**
 * Normalize arrays of phrases to English-only, deduplicated and cleaned.
 */
export function normalizeSymptomsToEnglish(
  regionalPhrases: string[] = [],
  englishPhrases: string[] = []
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();

  const push = (s?: string | null) => {
    const v = (s || "").trim();
    if (!v) return;
    const key = v.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(v);
  };

  // First, map any known regional or bracket codes to English
  [...regionalPhrases, ...englishPhrases].forEach((raw) => {
    const normalized = normalizePhraseToEnglish(raw);
    if (normalized) push(normalized);
  });

  // Then include clean English tokens not yet covered
  englishPhrases.forEach((raw) => {
    const v = String(raw || "").trim();
    if (!v) return;
    const key = v.toLowerCase();
    if (!seen.has(key)) push(v);
  });

  return out;
}


