# Quick Test: Active Consultation Page

## 🚀 Quick Test Steps

### Step 1: Open the Page
1. Start your dev server: `npm run dev`
2. Navigate to: `http://localhost:5173/consultation` (or your dev URL)
3. Open browser console (F12)

### Step 2: Run Test Script
1. Copy the contents of `TEST_ACTIVE_CONSULTATION.js`
2. Paste into browser console
3. Press Enter
4. Wait 2 seconds for tests to run

### Step 3: Manual Tests

#### Test Voice Recognition:
1. Click the **"Start Recording"** button (green button with microphone icon)
2. Grant microphone permission if prompted
3. Speak into microphone (or wait for mock mode)
4. Verify transcript appears in real-time
5. Click **"Stop Recording"** button

**Expected:**
- Button changes to red "Stop Recording"
- Transcript appears below
- Symptoms auto-fill after a few seconds

#### Test AI Features:
1. Wait for symptoms to auto-fill (or type manually)
2. Click **"AI Suggest"** button next to Diagnosis
3. Verify diagnosis suggestions appear in a dialog

**Expected:**
- Diagnosis suggestions dialog opens
- Shows 3-5 diagnosis options with confidence scores
- Can select a diagnosis

#### Test Form Inputs:
1. Type in **Symptoms** textarea: "Headache, fever, body pain"
2. Type in **Diagnosis** textarea: "Viral Fever"
3. Type in **Advice** textarea: "Rest and drink fluids"
4. Search for a medicine: Type "Paracetamol" in medicine search
5. Add medicine to prescription

**Expected:**
- All textareas accept input
- Medicine search shows results
- Medicine can be added to prescription list

#### Test Save:
1. Fill in all required fields
2. Click **"Save & Sign"** button
3. Verify success notification appears

**Expected:**
- Success toast notification
- Redirects to completed consultations page
- Data saved to Firestore

---

## ✅ Expected Console Logs

### On Page Load:
```
[ActiveConsultationAI] Component initializing...
[ActiveConsultationAI] User: doctor-1 Entity: entity-1
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
[GeminiService] ✅ API response parsed
```

### On Save:
```
[ActiveConsultationAI] Saving consultation...
[ActiveConsultationAI] ✅ Consultation saved successfully
```

---

## ❌ Common Issues

### Issue: Page doesn't load
**Check:**
- Browser console for errors
- Network tab for failed requests
- Verify user is logged in

**Solution:**
- Check all imports are correct
- Verify Firebase is initialized
- Check user authentication

### Issue: Voice recognition not working
**Check:**
- Browser support (Chrome/Edge required)
- Microphone permission granted
- Console for errors

**Solution:**
- Mock mode should activate automatically
- Check console for "[ActiveConsultationAI] ⚠️ Speech recognition service not initialized"

### Issue: AI features not working
**Check:**
- Gemini API key in `.env` file
- Network tab for API calls
- Console for API errors

**Solution:**
- Verify `VITE_GEMINI_API_KEY` is set
- Check API key is valid
- Check network connectivity

### Issue: Save button not working
**Check:**
- User is logged in
- Entity ID is set
- Patient ID exists
- Console for errors

**Solution:**
- Verify user has `entityId` and `id`
- Check Firestore connection
- Verify patient data is loaded

---

## 📋 Test Checklist

- [ ] Page loads without errors
- [ ] Patient information displays
- [ ] Form fields are visible and editable
- [ ] Voice recognition button works
- [ ] Microphone permission request works
- [ ] Transcript appears (or mock mode activates)
- [ ] Symptoms auto-fill from transcript
- [ ] AI Suggest button works
- [ ] Diagnosis suggestions appear
- [ ] Medicine search works
- [ ] Medicine can be added
- [ ] Save button works
- [ ] Success notification appears
- [ ] Data saves to Firestore

---

## 🎯 Success Criteria

✅ **Page is working if:**
1. Page loads without console errors
2. All form fields are visible and editable
3. Voice recognition starts (or mock mode activates)
4. AI features work (symptoms extraction, diagnosis suggestions)
5. Save button saves data successfully
6. No React warnings in console

❌ **Page is NOT working if:**
1. Page doesn't load
2. Console shows errors
3. Form fields don't accept input
4. Buttons don't respond
5. Save fails with errors

---

## 🐛 Debugging Tips

1. **Check Console First**: Always check browser console for errors
2. **Check Network Tab**: Verify API calls are being made
3. **Check React DevTools**: Verify component state
4. **Check Firestore**: Verify data is being saved
5. **Check Environment Variables**: Verify API keys are set

---

## 📞 Need Help?

If tests fail:
1. Check console for specific error messages
2. Verify all dependencies are installed
3. Check Firebase configuration
4. Verify API keys are correct
5. Check network connectivity

