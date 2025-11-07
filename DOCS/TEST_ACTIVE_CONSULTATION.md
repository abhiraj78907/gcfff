# Active Consultation Testing Guide

## Quick Test Checklist

### 1. Page Load Test
- [ ] Page loads without errors
- [ ] No console errors on initial load
- [ ] Patient information displays correctly
- [ ] All UI components render properly

### 2. Voice Recognition Test
- [ ] Microphone permission request works
- [ ] Start recording button works
- [ ] Speech recognition starts (or mock mode activates)
- [ ] Transcript appears in real-time
- [ ] Stop recording button works

### 3. AI Features Test
- [ ] Symptoms auto-fill from transcript
- [ ] Diagnosis suggestions appear
- [ ] Language detection works
- [ ] AI Suggest button works

### 4. Form Inputs Test
- [ ] Symptoms textarea accepts input
- [ ] Diagnosis textarea accepts input
- [ ] Advice textarea accepts input
- [ ] Medicine search works
- [ ] Medicine can be added to prescription

### 5. Save Functionality Test
- [ ] Save & Sign button works
- [ ] Consultation saves to Firestore
- [ ] Prescription saves to Firestore
- [ ] Success notification appears

### 6. Error Handling Test
- [ ] Error messages display correctly
- [ ] Fallback to mock mode works
- [ ] Network errors handled gracefully

---

## Step-by-Step Test Instructions

### Step 1: Open the Page
1. Navigate to `/consultation` route
2. Check browser console for errors
3. Verify page loads completely

### Step 2: Test Voice Recognition
1. Click "Start Recording" button
2. Grant microphone permission if prompted
3. Speak into microphone (or wait for mock mode)
4. Verify transcript appears
5. Click "Stop Recording"

### Step 3: Test AI Features
1. Wait for symptoms to auto-fill
2. Click "AI Suggest" for diagnosis
3. Verify diagnosis suggestions appear
4. Select a diagnosis suggestion

### Step 4: Test Form Inputs
1. Type in Symptoms textarea
2. Type in Diagnosis textarea
3. Type in Advice textarea
4. Search for a medicine
5. Add medicine to prescription

### Step 5: Test Save
1. Fill in all required fields
2. Click "Save & Sign"
3. Verify success notification
4. Check Firestore for saved data

---

## Expected Console Logs

### On Page Load:
```
[ActiveConsultationAI] useEffect: Initializing speech recognition...
[ActiveConsultationAI] Speech recognition supported
[ActiveConsultationAI] Speech recognition service initialized
```

### On Start Recording:
```
[ActiveConsultationAI] ===== STARTING RECORDING =====
[ActiveConsultationAI] Current state: {...}
[ActiveConsultationAI] ✅ Microphone permission granted
[SpeechRecognition] Started listening
```

### On Transcript Received:
```
[ActiveConsultationAI] 📝 Transcript received: {...}
[ActiveConsultationAI] 🤖 Extracting symptoms from final transcript...
[GeminiService] 🔍 Extracting symptoms...
[GeminiService] 📡 Making API call to Gemini...
```

### On Save:
```
[ActiveConsultationAI] Saving consultation...
[ActiveConsultationAI] ✅ Consultation saved successfully
```

---

## Common Issues & Solutions

### Issue: Page doesn't load
- **Check**: Browser console for errors
- **Solution**: Verify all imports are correct

### Issue: Voice recognition not working
- **Check**: Browser support (Chrome/Edge)
- **Solution**: Mock mode should activate automatically

### Issue: AI features not working
- **Check**: Gemini API key in .env
- **Solution**: Check network tab for API calls

### Issue: Save button not working
- **Check**: Firebase connection
- **Solution**: Verify user is logged in and has entityId

---

## Test Results Template

```
Date: __________
Browser: __________
Test Results:

1. Page Load: [ ] PASS [ ] FAIL
   Notes: __________

2. Voice Recognition: [ ] PASS [ ] FAIL
   Notes: __________

3. AI Features: [ ] PASS [ ] FAIL
   Notes: __________

4. Form Inputs: [ ] PASS [ ] FAIL
   Notes: __________

5. Save Functionality: [ ] PASS [ ] FAIL
   Notes: __________

6. Error Handling: [ ] PASS [ ] FAIL
   Notes: __________

Overall: [ ] PASS [ ] FAIL
```

