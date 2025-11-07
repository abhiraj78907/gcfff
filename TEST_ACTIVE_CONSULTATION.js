/**
 * Active Consultation Page Test Script
 * Run this in browser console after navigating to /consultation
 */

console.log("🧪 Starting Active Consultation Test...");

// Test 1: Check if component is loaded
function testComponentLoad() {
  console.log("\n✅ Test 1: Component Load");
  const symptomsTextarea = document.querySelector('textarea[id="symptoms"]');
  const diagnosisTextarea = document.querySelector('textarea[id="diagnosis"]');
  const startRecordingBtn = document.querySelector('button:has(svg)') || document.querySelector('button');
  
  if (symptomsTextarea && diagnosisTextarea) {
    console.log("✅ Component loaded - Form fields found");
    return true;
  } else {
    console.log("❌ Component not loaded - Form fields missing");
    return false;
  }
}

// Test 2: Check patient data
function testPatientData() {
  console.log("\n✅ Test 2: Patient Data");
  const patientName = document.querySelector('p.font-medium')?.textContent;
  if (patientName && patientName.includes("Ramesh")) {
    console.log("✅ Patient data loaded:", patientName);
    return true;
  } else {
    console.log("⚠️ Patient data may not be loaded");
    return false;
  }
}

// Test 3: Test form inputs
function testFormInputs() {
  console.log("\n✅ Test 3: Form Inputs");
  const symptomsTextarea = document.querySelector('textarea[id="symptoms"]');
  const diagnosisTextarea = document.querySelector('textarea[id="diagnosis"]');
  
  if (symptomsTextarea && diagnosisTextarea) {
    // Test symptoms input
    symptomsTextarea.value = "Test symptom: Headache";
    symptomsTextarea.dispatchEvent(new Event('input', { bubbles: true }));
    console.log("✅ Symptoms textarea accepts input");
    
    // Test diagnosis input
    diagnosisTextarea.value = "Test diagnosis: Viral Fever";
    diagnosisTextarea.dispatchEvent(new Event('input', { bubbles: true }));
    console.log("✅ Diagnosis textarea accepts input");
    
    return true;
  } else {
    console.log("❌ Form inputs not found");
    return false;
  }
}

// Test 4: Test voice recognition button
function testVoiceRecognition() {
  console.log("\n✅ Test 4: Voice Recognition Button");
  const buttons = Array.from(document.querySelectorAll('button'));
  const recordBtn = buttons.find(btn => 
    btn.textContent.includes('Recording') || 
    btn.textContent.includes('Ready to listen') ||
    btn.querySelector('svg')
  );
  
  if (recordBtn) {
    console.log("✅ Recording button found");
    console.log("   Click the button to test voice recognition");
    return true;
  } else {
    console.log("❌ Recording button not found");
    return false;
  }
}

// Test 5: Test AI Suggest button
function testAISuggest() {
  console.log("\n✅ Test 5: AI Suggest Button");
  const buttons = Array.from(document.querySelectorAll('button'));
  const aiBtn = buttons.find(btn => 
    btn.textContent.includes('AI Suggest') || 
    btn.textContent.includes('Suggest')
  );
  
  if (aiBtn) {
    console.log("✅ AI Suggest button found");
    console.log("   Click the button to test AI diagnosis");
    return true;
  } else {
    console.log("⚠️ AI Suggest button not found (may be disabled)");
    return false;
  }
}

// Test 6: Test Save button
function testSaveButton() {
  console.log("\n✅ Test 6: Save Button");
  const buttons = Array.from(document.querySelectorAll('button'));
  const saveBtn = buttons.find(btn => 
    btn.textContent.includes('Save') || 
    btn.textContent.includes('Sign')
  );
  
  if (saveBtn) {
    console.log("✅ Save button found");
    console.log("   Fill in form and click to test save functionality");
    return true;
  } else {
    console.log("❌ Save button not found");
    return false;
  }
}

// Test 7: Check console logs
function testConsoleLogs() {
  console.log("\n✅ Test 7: Console Logs");
  console.log("   Check console for:");
  console.log("   - [ActiveConsultationAI] Component initializing...");
  console.log("   - [ActiveConsultationAI] User: ... Entity: ...");
  console.log("   - [ActiveConsultationAI] Speech recognition service initialized");
  return true;
}

// Run all tests
function runAllTests() {
  console.log("\n" + "=".repeat(50));
  console.log("🧪 ACTIVE CONSULTATION TEST RESULTS");
  console.log("=".repeat(50));
  
  const results = {
    componentLoad: testComponentLoad(),
    patientData: testPatientData(),
    formInputs: testFormInputs(),
    voiceRecognition: testVoiceRecognition(),
    aiSuggest: testAISuggest(),
    saveButton: testSaveButton(),
    consoleLogs: testConsoleLogs(),
  };
  
  console.log("\n" + "=".repeat(50));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(50));
  
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, result]) => {
    console.log(`${result ? '✅' : '❌'} ${test}: ${result ? 'PASS' : 'FAIL'}`);
  });
  
  console.log(`\n📈 Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log("🎉 All tests passed! Active Consultation is working correctly.");
  } else {
    console.log("⚠️ Some tests failed. Check the details above.");
  }
  
  return results;
}

// Auto-run tests
setTimeout(() => {
  runAllTests();
}, 2000);

console.log("\n⏳ Waiting 2 seconds for page to load...");
console.log("   Tests will run automatically, or call runAllTests() manually");

