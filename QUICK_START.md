# 🚀 Quick Start - Local Whisper Testing

## Setup (One Time)

1. **Add your OpenAI API key to `.env` file:**
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```
   Get your key from: https://platform.openai.com/api-keys

## Run Locally (Every Time)

**Start both servers:**
```powershell
npm run dev:full
```

This starts:
- ✅ Local Whisper proxy (port 3001) - calls real OpenAI API
- ✅ Vite dev server (port 8080) - your app

## Test

1. Open http://localhost:8080
2. Go to consultation page
3. Click "Start Recording"
4. Speak in Kannada, Hindi, Telugu, or English
5. See **real Whisper transcription**! 🎉

## What Happens

- Your voice → Local proxy server → OpenAI Whisper API → Real transcription
- Works exactly like production, but locally
- API key stays secure (server-side only)

## When Ready to Deploy

Just commit and push - production will use Netlify Functions automatically!

