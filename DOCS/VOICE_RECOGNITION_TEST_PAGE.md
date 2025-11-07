# Voice Recognition Test Page

## 🎯 Purpose

A standalone HTML test page to isolate and test voice recognition functionality before debugging the main ActiveConsultationAI component.

## 📋 Features

### 1. Microphone Permission Testing
- ✅ Check current permission status
- ✅ Request microphone permission
- ✅ Real-time permission status display
- ✅ Permission change detection

### 2. Voice Recording
- ✅ Start/Stop recording buttons
- ✅ Microphone button (visual feedback)
- ✅ Recording timer display
- ✅ Visual recording state (red/green button)

### 3. Speech Recognition
- ✅ Web Speech API integration
- ✅ Real-time transcript display
- ✅ Interim and final results
- ✅ Language detection (mock)
- ✅ Error handling

### 4. Debug Logging
- ✅ Comprehensive console logs
- ✅ Visual log display
- ✅ Color-coded log types
- ✅ Timestamp for each log entry

## 🚀 How to Use

### 1. Open the Test Page
```bash
# Option 1: Direct file open
# Double-click test-voice-recognition.html

# Option 2: Local server (recommended)
python -m http.server 8000
# Then open: http://localhost:8000/test-voice-recognition.html
```

### 2. Test Steps

1. **Check Permission**
   - Click "Check Permission" button
   - See current microphone permission status

2. **Request Permission** (if needed)
   - Click "Request Permission" button
   - Browser will show permission dialog
   - Grant permission

3. **Start Recording**
   - Click the microphone button (green) OR
   - Click "Start Recording" button
   - Button should turn red and pulse
   - Timer should start counting

4. **Speak**
   - Speak into microphone
   - Watch transcript appear in real-time
   - Check logs for recognition events

5. **Stop Recording**
   - Click microphone button (red) OR
   - Click "Stop Recording" button
   - Recording stops, transcript finalizes

## 🔍 What to Check

### ✅ Success Indicators:
- Permission status: "granted" (green)
- Microphone button: Turns red when recording
- Transcript: Shows speech in real-time
- Logs: Show "ONSTART", "ONRESULT" events
- Timer: Counts up during recording

### ❌ Error Indicators:
- Permission status: "denied" (red)
- No transcript appearing
- Logs show error messages
- Button doesn't change state

## 📊 Expected Console Output

### Successful Recording:
```
[Time] 🔥🔥🔥 MICROPHONE BUTTON CLICKED! 🔥🔥🔥
[Time] 🎤🎤🎤 START RECORDING CALLED! 🎤🎤🎤
[Time] 🔐 Requesting microphone access...
[Time] ✅✅✅ MICROPHONE PERMISSION GRANTED! ✅✅✅
[Time] 🚀 Starting Speech Recognition...
[Time] ✅✅✅ ONSTART EVENT FIRED! ✅✅✅
[Time] 🎤 Microphone is NOW ACTIVE!
[Time] 📝 ONRESULT EVENT FIRED!
[Time] ✅ Final transcript added: "your speech here"
```

### Failed Recording:
```
[Time] ❌ Permission denied: NotAllowedError
[Time] User denied microphone access
```

## 🐛 Troubleshooting

### Issue 1: Button Not Working
**Symptoms**: Clicking button does nothing

**Check**:
- Open browser console (F12)
- Look for JavaScript errors
- Check if button click handler is attached
- Verify button ID matches: `microphone-button-test`

### Issue 2: No Permission Dialog
**Symptoms**: No permission prompt appears

**Solutions**:
- Check browser settings (Chrome: Settings → Privacy → Microphone)
- Try different browser (Chrome/Edge recommended)
- Check if HTTPS is required (some browsers require HTTPS)
- Use localhost (works without HTTPS)

### Issue 3: No Transcript
**Symptoms**: Recording starts but no transcript appears

**Check**:
- Speak clearly and loudly
- Check microphone is working (test in other apps)
- Look for "ONRESULT" events in logs
- Check for error messages in logs

### Issue 4: Recognition Stops Immediately
**Symptoms**: Starts then stops right away

**Solutions**:
- Check for "no-speech" errors
- Speak immediately after starting
- Check microphone is not muted
- Verify microphone is not being used by another app

## 🔧 Comparison with ActiveConsultationAI

This test page mimics the functionality of `ActiveConsultationAI.tsx`:

| Feature | Test Page | ActiveConsultationAI |
|---------|-----------|---------------------|
| Permission Check | ✅ | ✅ |
| Button Click Handler | ✅ Native onclick | ✅ Direct DOM listener |
| Speech Recognition | ✅ Web Speech API | ✅ SpeechRecognitionService |
| Transcript Display | ✅ Real-time | ✅ Real-time |
| Debug Logging | ✅ Comprehensive | ✅ Comprehensive |

## 📝 Next Steps

After testing in this HTML file:

1. **If it works here**: The issue is likely in React component lifecycle or event handling
2. **If it doesn't work here**: The issue is browser/permission/microphone related
3. **Compare logs**: Use logs from test page to debug ActiveConsultationAI

---

**File**: `test-voice-recognition.html`

**Usage**: Open in browser and test voice functionality independently.


