/**
 * Local Whisper API Proxy Server
 * Runs locally to proxy Whisper API calls during development
 * 
 * Usage: node scripts/local-whisper-server.js
 * Requires: OPENAI_API_KEY environment variable (in .env file or environment)
 */

import http from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env file from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');
dotenv.config({ path: join(projectRoot, '.env') });

const PORT = 3001;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-openai-api-key-here') {
  console.error('❌ Error: OPENAI_API_KEY environment variable is required');
  console.log('\n💡 Your .env file has a placeholder. Please update it:');
  console.log('   1. Open .env file in your editor');
  console.log('   2. Find: OPENAI_API_KEY=your-openai-api-key-here');
  console.log('   3. Replace with your actual key: OPENAI_API_KEY=sk-...');
  console.log('   4. Save and restart the server');
  console.log('\n📝 Get your API key from: https://platform.openai.com/api-keys');
  console.log('\n💡 Alternative (temporary):');
  console.log('   PowerShell: $env:OPENAI_API_KEY="sk-your-key"; npm run dev:whisper');
  process.exit(1);
}

const server = http.createServer(async (req, res) => {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method !== 'POST' || req.url !== '/whisper-transcribe') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
    return;
  }

    try {
      // Read request body
      let body = '';
      for await (const chunk of req) {
        body += chunk.toString();
      }

      if (!body) {
        res.writeHead(400, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(JSON.stringify({ error: 'Missing request body' }));
        return;
      }

      let parsedBody;
      try {
        parsedBody = JSON.parse(body);
      } catch (parseError) {
        console.error('[Local Whisper] JSON parse error:', parseError.message);
        res.writeHead(400, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(JSON.stringify({ 
          error: 'Invalid JSON in request body',
          details: parseError.message,
        }));
        return;
      }

      const { audio, contentType } = parsedBody;
      if (!audio) {
        res.writeHead(400, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(JSON.stringify({ error: 'Missing audio data in request' }));
        return;
      }

    // Convert base64 to buffer
    let audioBuffer;
    try {
      audioBuffer = Buffer.from(audio, 'base64');
      if (audioBuffer.length === 0) {
        throw new Error('Empty audio buffer after base64 decode');
      }
    } catch (bufferError) {
      console.error('[Local Whisper] Base64 decode error:', bufferError.message);
      res.writeHead(400, { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify({ 
        error: 'Invalid base64 audio data',
        details: bufferError.message,
      }));
      return;
    }

    // Create multipart/form-data for OpenAI
    const boundary = `----WhisperBoundary${Date.now()}`;
    const CRLF = '\r\n';
    
    const parts = [];
    
    // File part header
    const fileHeader = `--${boundary}${CRLF}Content-Disposition: form-data; name="file"; filename="audio.webm"${CRLF}Content-Type: ${contentType || 'audio/webm'}${CRLF}${CRLF}`;
    parts.push(Buffer.from(fileHeader, 'utf-8'));
    parts.push(audioBuffer);
    
    // Model field
    const modelField = `${CRLF}--${boundary}${CRLF}Content-Disposition: form-data; name="model"${CRLF}${CRLF}whisper-1`;
    parts.push(Buffer.from(modelField, 'utf-8'));
    
    // Language field
    const languageField = `${CRLF}--${boundary}${CRLF}Content-Disposition: form-data; name="language"${CRLF}${CRLF}auto`;
    parts.push(Buffer.from(languageField, 'utf-8'));
    
    // Response format field
    const formatField = `${CRLF}--${boundary}${CRLF}Content-Disposition: form-data; name="response_format"${CRLF}${CRLF}json`;
    parts.push(Buffer.from(formatField, 'utf-8'));
    
    // Closing boundary
    const closing = `${CRLF}--${boundary}--${CRLF}`;
    parts.push(Buffer.from(closing, 'utf-8'));
    
    const multipartBody = Buffer.concat(parts);

    console.log(`[Local Whisper] Calling OpenAI API (audio size: ${audioBuffer.length} bytes)`);

    // Call OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: multipartBody,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Local Whisper] OpenAI API Error:', response.status, errorText);
      res.writeHead(response.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Whisper API error',
        details: errorText,
        status: response.status,
      }));
      return;
    }

    const data = await response.json();
    console.log('[Local Whisper] ✅ Transcription successful:', {
      textLength: data.text?.length || 0,
      language: data.language || 'unknown',
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      text: data.text || '',
      language: data.language || 'unknown',
    }));

  } catch (error) {
    console.error('[Local Whisper] ❌ Error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    
    // Provide detailed error information
    let errorMessage = error.message || String(error);
    let errorType = 'Unknown error';
    
    if (error instanceof SyntaxError) {
      errorType = 'JSON parse error - invalid request body';
    } else if (error.message?.includes('fetch')) {
      errorType = 'Network error - failed to reach OpenAI API';
    } else if (error.message?.includes('ENOTFOUND') || error.message?.includes('ECONNREFUSED')) {
      errorType = 'Connection error - cannot reach OpenAI API';
    }
    
    res.writeHead(500, { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(JSON.stringify({
      error: 'Internal server error',
      type: errorType,
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }));
  }
});

server.listen(PORT, () => {
  console.log('🚀 Local Whisper API Proxy Server running on http://localhost:' + PORT);
  console.log('📝 Endpoint: http://localhost:' + PORT + '/whisper-transcribe');
  console.log('✅ Ready to proxy Whisper API calls');
});

