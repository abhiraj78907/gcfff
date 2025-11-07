/**
 * Medicine Search Service
 * Integrates with Kaggle Indian Medicine Dataset for autocomplete
 */

export interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  dosage?: string;
  manufacturer?: string;
  category?: string;
}

// In-memory medicine database (would be loaded from Kaggle dataset in production)
// TODO: Replace with actual Kaggle dataset loading
const MEDICINE_DATABASE: Medicine[] = [
  { id: "1", name: "Paracetamol 500mg", genericName: "Acetaminophen", dosage: "500mg", category: "Analgesic" },
  { id: "2", name: "Dolo 650", genericName: "Paracetamol", dosage: "650mg", category: "Analgesic" },
  { id: "3", name: "Azithromycin 500mg", genericName: "Azithromycin", dosage: "500mg", category: "Antibiotic" },
  { id: "4", name: "Cetirizine 10mg", genericName: "Cetirizine", dosage: "10mg", category: "Antihistamine" },
  { id: "5", name: "Metformin 500mg", genericName: "Metformin", dosage: "500mg", category: "Antidiabetic" },
  { id: "6", name: "Pantoprazole 40mg", genericName: "Pantoprazole", dosage: "40mg", category: "Proton Pump Inhibitor" },
  { id: "7", name: "Amoxicillin 500mg", genericName: "Amoxicillin", dosage: "500mg", category: "Antibiotic" },
  { id: "8", name: "Omeprazole 20mg", genericName: "Omeprazole", dosage: "20mg", category: "Proton Pump Inhibitor" },
  { id: "9", name: "Atorvastatin 10mg", genericName: "Atorvastatin", dosage: "10mg", category: "Statin" },
  { id: "10", name: "Amlodipine 5mg", genericName: "Amlodipine", dosage: "5mg", category: "Calcium Channel Blocker" },
  // Add more Indian medicines
  { id: "11", name: "Crocin 650", genericName: "Paracetamol", dosage: "650mg", manufacturer: "GSK", category: "Analgesic" },
  { id: "12", name: "Calpol 500", genericName: "Paracetamol", dosage: "500mg", manufacturer: "GlaxoSmithKline", category: "Analgesic" },
  { id: "13", name: "Combiflam", genericName: "Ibuprofen + Paracetamol", dosage: "400mg + 325mg", manufacturer: "Sanofi", category: "Analgesic" },
  { id: "14", name: "Azee 500", genericName: "Azithromycin", dosage: "500mg", manufacturer: "Cipla", category: "Antibiotic" },
  { id: "15", name: "Zithromax 500", genericName: "Azithromycin", dosage: "500mg", manufacturer: "Pfizer", category: "Antibiotic" },
  { id: "16", name: "Allegra 120", genericName: "Fexofenadine", dosage: "120mg", manufacturer: "Sanofi", category: "Antihistamine" },
  { id: "17", name: "Montair 10", genericName: "Montelukast", dosage: "10mg", manufacturer: "Cipla", category: "Antihistamine" },
  { id: "18", name: "Glycomet 500", genericName: "Metformin", dosage: "500mg", manufacturer: "USV", category: "Antidiabetic" },
  { id: "19", name: "Pantocid 40", genericName: "Pantoprazole", dosage: "40mg", manufacturer: "Sun Pharma", category: "Proton Pump Inhibitor" },
  { id: "20", name: "Omez 20", genericName: "Omeprazole", dosage: "20mg", manufacturer: "Dr. Reddy's", category: "Proton Pump Inhibitor" },
];

/**
 * Search medicines with fuzzy matching
 * Supports debounced autocomplete with relevance ranking
 */
export function searchMedicines(query: string, limit: number = 10): Medicine[] {
  if (!query || query.length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase().trim();
  
  // Exact match first
  const exactMatches = MEDICINE_DATABASE.filter(med =>
    med.name.toLowerCase() === lowerQuery ||
    med.genericName?.toLowerCase() === lowerQuery
  );

  // Partial match
  const partialMatches = MEDICINE_DATABASE.filter(med => {
    const nameMatch = med.name.toLowerCase().includes(lowerQuery);
    const genericMatch = med.genericName?.toLowerCase().includes(lowerQuery);
    const manufacturerMatch = med.manufacturer?.toLowerCase().includes(lowerQuery);
    return nameMatch || genericMatch || manufacturerMatch;
  });

  // Fuzzy match (handles common misspellings)
  const fuzzyMatches = MEDICINE_DATABASE.filter(med => {
    const name = med.name.toLowerCase();
    const generic = med.genericName?.toLowerCase() || "";
    
    // Simple fuzzy matching (Levenshtein distance approximation)
    return (
      calculateSimilarity(name, lowerQuery) > 0.7 ||
      calculateSimilarity(generic, lowerQuery) > 0.7
    );
  });

  // Combine and deduplicate
  const allMatches = [...exactMatches, ...partialMatches, ...fuzzyMatches];
  const uniqueMatches = Array.from(
    new Map(allMatches.map(med => [med.id, med])).values()
  );

  // Sort by relevance
  return uniqueMatches
    .sort((a, b) => {
      const aScore = calculateRelevanceScore(a, lowerQuery);
      const bScore = calculateRelevanceScore(b, lowerQuery);
      return bScore - aScore;
    })
    .slice(0, limit);
}

/**
 * Calculate string similarity (simple Levenshtein approximation)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

/**
 * Simple Levenshtein distance
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * Calculate relevance score for ranking
 */
function calculateRelevanceScore(medicine: Medicine, query: string): number {
  const name = medicine.name.toLowerCase();
  const generic = medicine.genericName?.toLowerCase() || "";
  const manufacturer = medicine.manufacturer?.toLowerCase() || "";
  const lowerQuery = query.toLowerCase();
  
  let score = 0;
  
  // Exact match gets highest score
  if (name === lowerQuery || generic === lowerQuery) {
    score += 100;
  }
  
  // Starts with query
  if (name.startsWith(lowerQuery) || generic.startsWith(lowerQuery)) {
    score += 50;
  }
  
  // Contains query
  if (name.includes(lowerQuery) || generic.includes(lowerQuery)) {
    score += 25;
  }
  
  // Manufacturer match
  if (manufacturer.includes(lowerQuery)) {
    score += 15;
  }
  
  // Fuzzy match
  score += calculateSimilarity(name, lowerQuery) * 10;
  score += calculateSimilarity(generic, lowerQuery) * 10;
  
  return score;
}

/**
 * Load medicines from Kaggle dataset (for production)
 * This would fetch from a CSV/JSON file or API
 * 
 * To integrate Kaggle dataset:
 * 1. Download Indian medicines dataset from Kaggle
 * 2. Convert to JSON/CSV format
 * 3. Store in public folder or Firestore
 * 4. Load on app initialization
 * 5. Replace MEDICINE_DATABASE with loaded data
 */
export async function loadMedicineDatabase(): Promise<Medicine[]> {
  // In production, this would load from:
  // 1. Kaggle dataset CSV/JSON (e.g., /public/data/indian-medicines.json)
  // 2. Firestore collection (e.g., entities/{entityId}/medicines)
  // 3. External API
  
  try {
    // Example: Load from public folder
    // const response = await fetch('/data/indian-medicines.json');
    // const data = await response.json();
    // return data;
    
    // For now, return in-memory database
    console.log("[MedicineSearch] Using in-memory database. To use Kaggle dataset, implement loadMedicineDatabase()");
    return MEDICINE_DATABASE;
  } catch (error) {
    console.error("[MedicineSearch] Failed to load medicine database:", error);
    // Fallback to in-memory database
    return MEDICINE_DATABASE;
  }
}

/**
 * Get medicine by ID
 */
export function getMedicineById(id: string): Medicine | undefined {
  return MEDICINE_DATABASE.find(med => med.id === id);
}

/**
 * Initialize medicine database on app start
 * Call this in your app initialization
 */
export async function initializeMedicineDatabase(): Promise<void> {
  try {
    const medicines = await loadMedicineDatabase();
    console.log(`[MedicineSearch] ✅ Loaded ${medicines.length} medicines`);
    // In production, you might want to cache this in a global state or context
  } catch (error) {
    console.error("[MedicineSearch] Failed to initialize database:", error);
  }
}
