/**
 * List available Gemini models for this API key
 * Run with: node list-available-models.js
 */

const API_KEY = "AIzaSyBLJ62iYb0LICj2A8-Wui9WIYDM4JWQI2s";

async function listAvailableModels() {
  console.log("========================================");
  console.log("🔍 LISTING AVAILABLE GEMINI MODELS");
  console.log("========================================");
  console.log(`API Key: ${API_KEY.substring(0, 10)}...\n`);

  const versions = ["v1beta", "v1"];
  
  for (const version of versions) {
    console.log(`\n📋 Checking ${version} models...`);
    console.log("----------------------------------------");
    
    try {
      const url = `https://generativelanguage.googleapis.com/${version}/models?key=${API_KEY}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        if (data.models && data.models.length > 0) {
          console.log(`✅ Found ${data.models.length} models:`);
          data.models.forEach((model, index) => {
            console.log(`  ${index + 1}. ${model.name}`);
            if (model.supportedGenerationMethods) {
              console.log(`     Methods: ${model.supportedGenerationMethods.join(", ")}`);
            }
          });
        } else {
          console.log("❌ No models found");
        }
      } else {
        const errorText = await response.text();
        console.log(`❌ Failed: ${response.status} ${response.statusText}`);
        try {
          const errorJson = JSON.parse(errorText);
          console.log(`Error: ${JSON.stringify(errorJson, null, 2)}`);
        } catch (e) {
          console.log(`Error: ${errorText}`);
        }
      }
    } catch (error) {
      console.log(`❌ Network error: ${error.message}`);
    }
  }
  
  console.log("\n========================================");
}

listAvailableModels().catch(console.error);

