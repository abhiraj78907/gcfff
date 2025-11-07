/**
 * Simple Node.js script to validate Gemini API key
 * Run with: node validate-api-key.js
 */

const API_KEY = "AIzaSyBLJ62iYb0LICj2A8-Wui9WIYDM4JWQI2s";

const ENDPOINTS = [
  // Updated to use available models
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent",
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent",
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent",
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent",
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent",
];

async function validateApiKey() {
  console.log("========================================");
  console.log("🔍 VALIDATING GEMINI API KEY");
  console.log("========================================");
  console.log(`API Key: ${API_KEY.substring(0, 10)}...`);
  console.log(`Testing ${ENDPOINTS.length} endpoints...`);
  console.log("========================================\n");

  for (let i = 0; i < ENDPOINTS.length; i++) {
    const endpoint = ENDPOINTS[i];
    const url = `${endpoint}?key=${API_KEY}`;
    
    console.log(`[${i + 1}/${ENDPOINTS.length}] Testing: ${endpoint}`);
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: "test" }]
          }]
        }),
      });

      if (response.ok) {
        console.log(`✅✅✅ SUCCESS! ✅✅✅`);
        console.log(`Status: ${response.status} ${response.statusText}`);
        console.log(`Working endpoint: ${endpoint}`);
        console.log("\n========================================");
        console.log("✅ API KEY IS VALID AND WORKING!");
        console.log("========================================");
        return true;
      } else {
        const errorText = await response.text();
        console.log(`❌ Failed: ${response.status} ${response.statusText}`);
        try {
          const errorJson = JSON.parse(errorText);
          console.log(`Error: ${JSON.stringify(errorJson, null, 2)}`);
        } catch (e) {
          console.log(`Error: ${errorText.substring(0, 200)}`);
        }
        if (i < ENDPOINTS.length - 1) {
          console.log("Trying next endpoint...\n");
        }
      }
    } catch (error) {
      console.log(`❌ Network error: ${error.message}`);
      if (i < ENDPOINTS.length - 1) {
        console.log("Trying next endpoint...\n");
      }
    }
  }

  console.log("\n========================================");
  console.log("❌ ALL ENDPOINTS FAILED");
  console.log("========================================");
  console.log("The API key may be invalid or not have access to these models.");
  return false;
}

validateApiKey().catch(console.error);

