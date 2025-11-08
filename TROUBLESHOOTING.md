# Troubleshooting Guide

## Error: ECONNREFUSED on /whisper-transcribe

**Problem:** Vite is trying to proxy to the Whisper server (port 3001) but it's not running.

**Solutions:**

### Option 1: Use Mock Mode (Easiest - No API Key Needed)
Just run:
```powershell
npm run dev
```
The app will automatically use mock transcription when the server isn't available.

### Option 2: Start Whisper Server (Requires API Key)

1. **Add your OpenAI API key to `.env`:**
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

2. **Start both servers:**
   ```powershell
   npm run dev:full
   ```

### Option 3: Start Servers Separately

**Terminal 1:**
```powershell
npm run dev:whisper
```

**Terminal 2:**
```powershell
npm run dev
```

## Error: OPENAI_API_KEY environment variable is required

**Problem:** The `.env` file has a placeholder value or is missing the key.

**Solution:**
1. Open `.env` file
2. Find: `OPENAI_API_KEY=your-openai-api-key-here`
3. Replace with your actual key: `OPENAI_API_KEY=sk-...`
4. Save and restart

**Get your API key:** https://platform.openai.com/api-keys

## Current Status

✅ **Fixed Issues:**
- Vite proxy now handles connection errors gracefully
- App automatically falls back to mock when server unavailable
- Better error messages and logging
- Concurrently won't kill both servers if one fails

✅ **How It Works Now:**
- If Whisper server is running → Uses real API
- If Whisper server is not running → Uses mock (no errors!)
- Production → Uses Netlify Functions automatically

## Quick Test

Run this to test without API key:
```powershell
npm run dev
```

The app will work with mock transcription. No errors!

