import type { Handler } from "@netlify/functions";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_API_ENDPOINTS = [
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent",
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent",
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent",
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent",
];

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  if (!GEMINI_API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: "Missing GEMINI_API_KEY" }) };
  }

  try {
    const { prompt } = JSON.parse(event.body || "{}");
    if (!prompt || typeof prompt !== "string") {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing prompt" }) };
    }

    let lastError: any = null;
    for (let i = 0; i < GEMINI_API_ENDPOINTS.length; i++) {
      const endpoint = GEMINI_API_ENDPOINTS[i];
      const url = `${endpoint}?key=${GEMINI_API_KEY}`;
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        });

        if (res.status === 404) { lastError = new Error("Model not found"); continue; }
        if (res.status === 429) {
          const retryAfter = res.headers.get("Retry-After") || "20";
          await new Promise(r => setTimeout(r, parseInt(retryAfter, 10) * 1000));
          i--; // retry same
          continue;
        }
        if (!res.ok) {
          const text = await res.text();
          lastError = new Error(text);
          continue;
        }
        const data = await res.json();
        return { statusCode: 200, body: JSON.stringify(data) };
      } catch (e: any) {
        lastError = e;
      }
    }
    return { statusCode: 502, body: JSON.stringify({ error: String(lastError || "Upstream failed") }) };
  } catch (e: any) {
    return { statusCode: 400, body: JSON.stringify({ error: e.message || "Bad Request" }) };
  }
};


