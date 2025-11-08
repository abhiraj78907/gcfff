# Local Whisper Setup Guide

## 🚀 Quick Start (Real Whisper API Locally)

### Step 1: Set Your OpenAI API Key

Create a `.env` file in the project root:

```bash
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Get your API key from:** https://platform.openai.com/api-keys

### Step 2: Start Local Development

**Option A: Run both servers together (Recommended)**
```powershell
npm run dev:full
```

This starts:
- Local Whisper proxy server (port 3001)
- Vite dev server (port 8080)

**Option B: Run separately (Two terminals)**

Terminal 1:
```powershell
npm run dev:whisper
```

Terminal 2:
```powershell
npm run dev
```

### Step 3: Test

1. Open http://localhost:8080
2. Navigate to consultation page
3. Click "Start Recording"
4. Speak in any language (Kannada, Hindi, Telugu, English, etc.)
5. See real-time transcription from OpenAI Whisper API!

## 📝 How It Works

1. **Local Proxy Server** (`scripts/local-whisper-server.js`)
   - Runs on port 3001
   - Proxies requests to OpenAI Whisper API
   - Keeps your API key secure (server-side only)

2. **Vite Proxy** (`vite.config.ts`)
   - Automatically forwards `/.netlify/functions/whisper-transcribe` to `http://localhost:3001/whisper-transcribe`
   - Works seamlessly in development

3. **Production**
   - Uses Netlify Functions (no changes needed)
   - Same code works in both environments

## ✅ Verification

When the local server starts, you should see:
```
🚀 Local Whisper API Proxy Server running on http://localhost:3001
📝 Endpoint: http://localhost:3001/whisper-transcribe
✅ Ready to proxy Whisper API calls
```

## 🔧 Troubleshooting

### "OPENAI_API_KEY environment variable is required"
- Make sure you created `.env` file in project root
- Check the key is correct (starts with `sk-`)
- Restart the server after adding the key

### "Port 3001 already in use"
- Another process is using port 3001
- Kill it or change PORT in `scripts/local-whisper-server.js`

### Transcription not working
- Check browser console for errors
- Verify local server is running (check terminal)
- Test API key is valid at https://platform.openai.com

## 🎯 Next Steps

Once local testing works:
1. Test thoroughly with real voice input
2. Commit your changes
3. Deploy to production (functions will work automatically)

