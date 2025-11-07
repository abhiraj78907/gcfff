# Debugging Guide - ActiveConsultationAI

## Issues Fixed

### 1. **Import Path Errors**
**Problem**: Imports were using `@/` instead of `@shared/` for shared code.

**Fixed**: Changed all imports from:
- `@/contexts/AuthContext` → `@shared/contexts/AuthContext`
- `@/lib/doctorActions` → `@shared/lib/doctorActions`
- `@/lib/notifications` → `@shared/lib/notifications`
- `@/lib/ai/speechRecognition` → `@shared/lib/ai/speechRecognition`
- `@/lib/ai/geminiService` → `@shared/lib/ai/geminiService`
- `@/lib/medicineSearch` → `@shared/lib/medicineSearch`

### 2. **No Console Logs**
**Problem**: Component wasn't logging initialization.

**Fixed**: Added comprehensive console logs:
- Component initialization
- User and entity info
- Speech recognition setup
- Test AI button clicks
- All AI function calls

### 3. **Test AI Button Not Working**
**Problem**: Button might not be connected or functions not imported.

**Fixed**: 
- Added explicit onClick handler with logging
- Added function type checks
- Added error handling

## How to Debug

### Step 1: Check Console on Page Load
You should see:
```
[ActiveConsultationAI] Component initializing...
[ActiveConsultationAI] User: <user-id> Entity: <entity-id>
[ActiveConsultationAI] useEffect: Initializing speech recognition...
[ActiveConsultationAI] Rendering component...
```

### Step 2: Click "🧪 Test AI" Button
You should see:
```
[UI] Test AI button clicked!
[TEST] ===== AI TEST BUTTON CLICKED =====
[TEST] Current state: {...}
[TEST] Testing symptom extraction...
[TEST] Transcript: ...
[TEST] Language: ...
[TEST] extractSymptoms function: function
```

### Step 3: Check for Errors
If you see errors:
- **"Cannot find module"** → Import path issue
- **"is not a function"** → Function not imported correctly
- **"undefined"** → Service not initialized

### Step 4: Verify Imports
Check browser DevTools → Sources → Check if files are loading:
- `@shared/contexts/AuthContext`
- `@shared/lib/ai/geminiService`
- `@shared/lib/ai/speechRecognition`

## Common Issues

### Issue: "No console logs at all"
**Solution**: 
1. Check if component is rendering (look for page title)
2. Check browser console filter (make sure "All levels" is selected)
3. Check if there are JavaScript errors preventing execution

### Issue: "Test AI button does nothing"
**Solution**:
1. Check console for `[UI] Test AI button clicked!` log
2. If no log, button might not be connected
3. Check if button is disabled (should show `disabled={false}`)

### Issue: "extractSymptoms is not a function"
**Solution**:
1. Check import: `import { extractSymptoms } from "@shared/lib/ai/geminiService"`
2. Verify file exists: `src/lib/ai/geminiService.ts`
3. Check if function is exported: `export async function extractSymptoms(...)`

### Issue: "SpeechRecognitionService is undefined"
**Solution**:
1. Check import: `import { SpeechRecognitionService } from "@shared/lib/ai/speechRecognition"`
2. Verify file exists: `src/lib/ai/speechRecognition.ts`
3. Check if class is exported: `export class SpeechRecognitionService`

## Testing Checklist

- [ ] Page loads without errors
- [ ] Console shows initialization logs
- [ ] "🧪 Test AI" button is visible
- [ ] Clicking button shows console logs
- [ ] Symptoms populate after test
- [ ] Diagnosis suggests after symptoms
- [ ] No "uncontrolled to controlled" warnings
- [ ] No import errors in console

## Next Steps if Still Not Working

1. **Clear browser cache** and hard refresh (Ctrl+Shift+R)
2. **Restart dev server** to pick up import changes
3. **Check Network tab** for failed module loads
4. **Check Console** for specific error messages
5. **Verify .env file** has `VITE_GEMINI_API_KEY`

