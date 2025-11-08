import type { Handler } from "@netlify/functions";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const handler: Handler = async (event) => {
  console.log("[Whisper] Function called", {
    method: event.httpMethod,
    path: event.path,
    hasBody: !!event.body,
    bodyLength: event.body?.length || 0,
  });

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  if (!OPENAI_API_KEY) {
    console.error("[Whisper] Missing OPENAI_API_KEY environment variable");
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Missing OPENAI_API_KEY" }),
    };
  }

  try {
    // Parse the request body
    const body = event.body;
    if (!body) {
      console.error("[Whisper] Missing request body");
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Missing request body" }),
      };
    }

    // Parse JSON body with base64 audio
    let audioBuffer: Buffer;
    let contentType = "audio/webm";

    try {
      const jsonBody = JSON.parse(body);
      if (!jsonBody.audio) {
        console.error("[Whisper] Missing audio field in request body");
        return {
          statusCode: 400,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ error: "Missing audio data in request" }),
        };
      }
      audioBuffer = Buffer.from(jsonBody.audio, "base64");
      contentType = jsonBody.contentType || "audio/webm";
      console.log("[Whisper] Parsed audio data", {
        audioSize: audioBuffer.length,
        contentType,
      });
    } catch (parseError: any) {
      console.error("[Whisper] Failed to parse request body:", parseError.message);
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          error: "Invalid request body",
          details: parseError.message,
        }),
      };
    }

    if (!audioBuffer || audioBuffer.length === 0) {
      console.error("[Whisper] Empty audio buffer");
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Empty audio buffer" }),
      };
    }

    // Create multipart/form-data for OpenAI API
    const boundary = `----WhisperBoundary${Date.now()}`;
    const CRLF = "\r\n";
    
    // Build multipart body parts
    const parts: Buffer[] = [];
    
    // File part header
    const fileHeader = `--${boundary}${CRLF}Content-Disposition: form-data; name="file"; filename="audio.webm"${CRLF}Content-Type: ${contentType}${CRLF}${CRLF}`;
    parts.push(Buffer.from(fileHeader, "utf-8"));
    
    // Audio file data
    parts.push(audioBuffer);
    
    // Model field
    const modelField = `${CRLF}--${boundary}${CRLF}Content-Disposition: form-data; name="model"${CRLF}${CRLF}whisper-1`;
    parts.push(Buffer.from(modelField, "utf-8"));
    
    // Language field
    const languageField = `${CRLF}--${boundary}${CRLF}Content-Disposition: form-data; name="language"${CRLF}${CRLF}auto`;
    parts.push(Buffer.from(languageField, "utf-8"));
    
    // Response format field
    const formatField = `${CRLF}--${boundary}${CRLF}Content-Disposition: form-data; name="response_format"${CRLF}${CRLF}json`;
    parts.push(Buffer.from(formatField, "utf-8"));
    
    // Closing boundary
    const closing = `${CRLF}--${boundary}--${CRLF}`;
    parts.push(Buffer.from(closing, "utf-8"));
    
    // Combine all parts
    const multipartBody = Buffer.concat(parts);
    
    console.log("[Whisper] Calling OpenAI API", {
      audioSize: audioBuffer.length,
      multipartSize: multipartBody.length,
      boundary,
    });

    // Call OpenAI Whisper API
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
      body: multipartBody,
    });

    console.log("[Whisper] OpenAI API response", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Whisper] OpenAI API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      return {
        statusCode: response.status,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          error: "Whisper API error",
          details: errorText,
          status: response.status,
        }),
      };
    }

    const data = await response.json();
    console.log("[Whisper] Transcription successful", {
      textLength: data.text?.length || 0,
      language: data.language || "unknown",
    });
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: data.text || "",
        language: data.language || "unknown",
      }),
    };
  } catch (error: any) {
    console.error("[Whisper] Unexpected error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        error: "Internal server error",
        message: error.message || String(error),
      }),
    };
  }
};

