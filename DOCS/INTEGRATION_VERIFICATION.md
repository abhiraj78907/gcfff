# Integration Verification & Testing Guide

## Current Integration Status

### ✅ **Routing & Navigation**
- **Route**: `/consultation` → `ActiveConsultationAI` component
- **Navigation**: Dashboard → "Start Consultation" button → `/consultation` with patient state
- **Status**: ✅ CONNECTED

### ✅ **Speech Recognition**
- **Service**: `SpeechRecognitionService` from `@/lib/ai/speechRecognition`
- **Initialization**: On component mount
- **Trigger**: Microphone button click
- **Status**: ✅ INTEGRATED (with mock fallback)

### ✅ **AI Services**
- **Symptom Extraction**: `extractSymptoms()` from `@/lib/ai/geminiService`
- **Diagnosis Suggestions**: `suggestDiagnosis()` from `@/lib/ai/geminiService`
- **Prescription Formatting**: `formatPrescription()` from `@/lib/ai/geminiService`
- **Language Detection**: `detectLanguage()` from `@/lib/ai/geminiService`
- **Status**: ✅ INTEGRATED

### ✅ **Real-time Flow**
1. **Speech → Transcript**: Real-time transcription updates `fullTranscript` state
2. **Transcript → Symptoms**: Auto-extracts symptoms every 3 seconds (interim) or immediately (final)
3. **Symptoms → Diagnosis**: Auto-triggers diagnosis suggestions 1 second after symptoms extracted
4. **Status**: ✅ CONNECTED

### ✅ **Firestore Integration**
- **Consultation Save**: `createConsultation()` from `@/lib/doctorActions`
- **Prescription Save**: `createPrescription()` from `@/lib/doctorActions`
- **Lab Order**: `createLabOrder()` from `@/lib/doctorActions`
- **Status**: ✅ INTEGRATED

### ✅ **Medicine Search**
- **Service**: `searchMedicines()` from `@/lib/medicineSearch`
- **UI**: Command component with autocomplete
- **Status**: ✅ INTEGRATED

## Testing Checklist

### 1. **Access Consultation Page**
- [ ] Navigate to Dashboard
- [ ] Click "Start Consultation" on any patient
- [ ] Verify `/consultation` page loads
- [ ] Verify patient data is displayed in left panel

### 2. **Speech Recognition**
- [ ] Click microphone button
- [ ] Allow microphone permission if prompted
- [ ] Speak clearly: "I have headache, fever, and body pain"
- [ ] Verify transcript appears in real-time
- [ ] Check browser console for `[Speech Recognition]` logs

### 3. **AI Symptom Extraction**
- [ ] After speaking, wait 2-3 seconds
- [ ] Verify symptoms auto-populate in Symptoms field
- [ ] Check browser console for `[AI] Extracting symptoms` logs
- [ ] Verify toast notification: "Symptoms extracted"

### 4. **AI Diagnosis Suggestions**
- [ ] After symptoms appear, wait 1-2 seconds
- [ ] Verify diagnosis auto-fills or suggestions appear
- [ ] Check browser console for `[AI] Getting diagnosis suggestions` logs
- [ ] Click "AI Suggest" button manually if needed
- [ ] Verify diagnosis suggestions dropdown appears

### 5. **Medicine Search**
- [ ] Type medicine name in search box (e.g., "Paracetamol")
- [ ] Verify autocomplete dropdown appears
- [ ] Select a medicine
- [ ] Verify medicine form appears
- [ ] Configure timing, food, duration, quantity
- [ ] Click "Add to Prescription"
- [ ] Verify medicine appears in "Added Medicines" list

### 6. **Save Consultation**
- [ ] Fill in all required fields (symptoms, diagnosis, advice)
- [ ] Add at least one medicine
- [ ] Click "Save & Sign"
- [ ] Verify toast notification: "Consultation saved"
- [ ] Verify navigation to `/completed` page
- [ ] Check Firestore for saved consultation record

### 7. **Prescription Preview**
- [ ] Add medicines to prescription
- [ ] Click "Preview Prescription"
- [ ] Verify prescription preview dialog opens
- [ ] Verify formatted prescription is displayed
- [ ] Click "Download" to save prescription

### 8. **Lab Test Order**
- [ ] Click "Order Lab Test" button
- [ ] Enter test type in prompt (e.g., "Complete Blood Count")
- [ ] Verify toast notification: "Lab test ordered"
- [ ] Check Firestore for lab request record

## Debugging Steps

### If Speech Recognition Not Working:
1. Check browser console for errors
2. Verify microphone permission is granted
3. Try in Chrome or Edge browser
4. Check if mock mode activates (should see "Mock mode" notification)

### If AI Not Responding:
1. Check browser console for `[Gemini]` logs
2. Verify `.env` file has `VITE_GEMINI_API_KEY`
3. Check network tab for API calls to `generativelanguage.googleapis.com`
4. Verify API key is valid (check for 401/403 errors)

### If Symptoms Not Auto-Populating:
1. Check console for `[AI] Extracting symptoms` logs
2. Verify transcript is being generated
3. Check if `extractSymptomsAsync` is being called
4. Verify Gemini API is responding (check network tab)

### If Diagnosis Not Suggesting:
1. Check console for `[AI] Getting diagnosis suggestions` logs
2. Verify symptoms field has content
3. Click "AI Suggest" button manually
4. Check network tab for API calls

## Quick Test Commands

### Test in Browser Console:
```javascript
// Test Gemini API directly
fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: "Extract symptoms from: I have headache and fever" }] }]
  })
}).then(r => r.json()).then(console.log);

// Check if speech recognition is supported
console.log('Speech Recognition:', !!(window.SpeechRecognition || window.webkitSpeechRecognition));
```

## Expected Console Logs

When working correctly, you should see:
```
[Consultation] Initializing speech recognition...
[Consultation] Speech recognition supported
[Consultation] Speech recognition service initialized
[Speech Recognition] Transcript received: { transcript: "...", isFinal: false }
[AI] Extracting symptoms from: ...
[Gemini] Response: { ... }
[AI] Symptom extraction result: { symptoms: [...], confidence: 0.9 }
[AI] Getting diagnosis suggestions...
[Gemini] Diagnosis response: { ... }
[AI] Diagnosis suggestions received: [...]
```

## Common Issues & Solutions

### Issue: "Speech recognition not supported"
**Solution**: Use Chrome or Edge browser. Mock mode will activate automatically.

### Issue: "Microphone permission denied"
**Solution**: 
1. Check browser settings → Site permissions → Microphone
2. Allow microphone access
3. Refresh page

### Issue: "Gemini API error: 401"
**Solution**: 
1. Check `.env` file has correct `VITE_GEMINI_API_KEY`
2. Restart dev server after updating `.env`
3. Verify API key is valid

### Issue: "No symptoms extracted"
**Solution**:
1. Check if transcript is being generated
2. Verify Gemini API is responding
3. Check network tab for API errors
4. Try manual symptom entry

### Issue: "Diagnosis suggestions not appearing"
**Solution**:
1. Ensure symptoms field has content
2. Click "AI Suggest" button manually
3. Check console for errors
4. Verify Gemini API is responding

## Integration Points Summary

```
Dashboard
  └─> [Start Consultation] → /consultation (with patient state)
       └─> ActiveConsultationAI
            ├─> Speech Recognition Service
            │    └─> onTranscript → fullTranscript state
            │         └─> extractSymptomsAsync()
            │              └─> Gemini API → symptoms state
            │                   └─> getDiagnosisSuggestions()
            │                        └─> Gemini API → diagnosis state
            ├─> Medicine Search
            │    └─> searchMedicines() → medicineSearchResults
            │         └─> handleAddMedicine() → medicines state
            └─> Save Flow
                 ├─> createConsultation() → Firestore
                 ├─> createPrescription() → Firestore
                 └─> navigate("/completed")
```

## Next Steps for Full Integration

1. ✅ Speech Recognition - DONE
2. ✅ AI Symptom Extraction - DONE
3. ✅ AI Diagnosis Suggestions - DONE
4. ✅ Medicine Search - DONE
5. ✅ Firestore Save - DONE
6. ⚠️ **TEST ALL FLOWS** - IN PROGRESS
7. ⚠️ **VERIFY API KEYS** - NEEDS VERIFICATION
8. ⚠️ **TEST REAL SPEECH** - NEEDS TESTING

