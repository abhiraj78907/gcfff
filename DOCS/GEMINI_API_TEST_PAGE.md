# Gemini API Test Page - Diagnostic Tool

## 📋 Overview

A standalone HTML test page to diagnose Gemini API connectivity and response issues.

## 🚀 How to Use

### 1. Open the Test Page
- Navigate to `test-gemini-api.html` in your project root
- Open it directly in your browser (double-click or `file://` URL)
- **Note**: For API calls to work, you may need to serve it via HTTP/HTTPS (not `file://`)

### 2. Using a Local Server (Recommended)

#### Option A: Python
```bash
# Python 3
python -m http.server 8000

# Then open: http://localhost:8000/test-gemini-api.html
```

#### Option B: Node.js (http-server)
```bash
npx http-server -p 8000

# Then open: http://localhost:8000/test-gemini-api.html
```

#### Option C: VS Code Live Server
- Install "Live Server" extension
- Right-click `test-gemini-api.html` → "Open with Live Server"

### 3. Test Steps

1. **Enter API Key**
   - The default API key is pre-filled: `AIzaSyCaFFXsDBQlbpqzsOjHYyNUCNApB_bZf4M`
   - Click "Check API Key" to verify it's valid

2. **Test Connection**
   - Use the default test prompt or enter your own
   - Click "Test Connection" to send a request
   - Watch the logs for request/response details

3. **Quick Tests**
   - **Test Symptom Extraction**: Pre-fills a symptom extraction prompt
   - **Test Diagnosis**: Pre-fills a diagnosis suggestion prompt

4. **Review Results**
   - Check the test results cards (Connection, Response Time, API Status)
   - Review the detailed logs in the log container
   - Look for any error messages

## 🔍 What to Check

### ✅ Success Indicators:
- API Key Status: "Valid ✓" (green)
- Connection: "Success" (green)
- Response Time: Shows milliseconds (green if < 1000ms)
- API Status: "Success" (green)
- Logs show: `✅ Response parsed successfully`

### ❌ Error Indicators:
- API Key Status: "Invalid" or "Error" (red)
- Connection: "Failed" (red)
- API Status: "Failed" (red)
- Logs show error messages

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error
**Error**: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solution**: 
- Gemini API should not have CORS issues
- If you see this, try serving the page via HTTPS
- Or use a browser extension to disable CORS (development only)

### Issue 2: Network Error
**Error**: `NetworkError when attempting to fetch resource`

**Solution**:
- Check internet connection
- Verify API URL is correct
- Check if firewall/proxy is blocking requests
- Try from a different network

### Issue 3: 401 Unauthorized
**Error**: `401 Unauthorized` or `API key not valid`

**Solution**:
- Verify API key is correct
- Check if API key has proper permissions
- Ensure API key is not expired
- Try generating a new API key from Google AI Studio

### Issue 4: 429 Too Many Requests
**Error**: `429 Too Many Requests`

**Solution**:
- You've exceeded rate limits
- Wait a few minutes and try again
- Check your API quota in Google Cloud Console

### Issue 5: 400 Bad Request
**Error**: `400 Bad Request`

**Solution**:
- Check the request body format
- Verify the prompt is not too long
- Check if the model name is correct (`gemini-pro`)

## 📊 What the Logs Show

### Request Logs (Blue):
- API URL
- API Key (masked)
- Prompt preview
- Request timestamp

### Response Logs (Green):
- Response time
- HTTP status
- Response data preview
- Parsed JSON (if applicable)

### Error Logs (Red):
- Error type
- Error message
- Stack trace (if available)

## 🎯 Expected Output

### Successful Test:
```
[Time] 🚀 STARTING API CONNECTION TEST
[Time] 📡 Making request to: https://generativelanguage.googleapis.com/...?key=***KEY***
[Time] 📡 Response received in 1234ms
[Time] Status: 200 OK
[Time] ✅ Response parsed successfully
[Time] Candidates: 1
[Time] Response text length: 245 characters
[Time] ✅ Valid JSON found: {"symptoms": ["Headache", "Fever", "Body pain"], "confidence": 0.9}
```

### Failed Test:
```
[Time] 🚀 STARTING API CONNECTION TEST
[Time] 📡 Making request to: ...
[Time] ❌ Network Error: Failed to fetch
[Time] Error message: NetworkError when attempting to fetch resource
```

## 🔧 Integration with React App

If the test page works but your React app doesn't:

1. **Check Environment Variables**
   - Verify `.env` file has `VITE_GEMINI_API_KEY`
   - Restart dev server after changing `.env`

2. **Check Console Logs**
   - Look for `[GeminiService]` logs in React app
   - Compare with test page logs

3. **Check Network Tab**
   - Open browser DevTools → Network tab
   - Filter by "gemini" or "generativelanguage"
   - Check if requests are being made
   - Compare request/response with test page

4. **Check API Key Usage**
   - Verify the same API key works in test page
   - Check if API key is being read correctly in React app

## 📝 Notes

- The test page uses the same API endpoint as your React app
- All network requests are logged for debugging
- The page works offline (HTML file) but needs internet for API calls
- API key is pre-filled for convenience (replace with your own if needed)

## 🚨 Security Note

- **Never commit API keys to version control**
- The test page has a default API key for testing only
- Replace with your own key for production use
- Consider using environment variables in production

---

**File Location**: `test-gemini-api.html` (project root)

**Usage**: Open in browser or serve via HTTP server for best results.

