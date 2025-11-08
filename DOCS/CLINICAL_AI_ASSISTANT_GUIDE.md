# Clinical AI Assistant - Complete Implementation Guide

## Overview

The Clinical AI Assistant is an expert system integrated with Gemini Pro API that handles long, real-time patient conversations in regional languages (Kannada, Telugu, English, Hindi, Urdu). It provides comprehensive clinical transcription, symptom detection, diagnosis, and prescription structure autofill (without medicine names).

## Key Features

1. ✅ **Continuous Transcription**: Processes entire patient conversations without cut-off
2. ✅ **Multi-Language Support**: Kannada, Telugu, English, Hindi, Urdu
3. ✅ **Symptom Recognition & Normalization**: Maps regional terms to standardized English medical terminology
4. ✅ **Professional Diagnosis**: Provides diagnosis with confidence scores and ICD-10 codes
5. ✅ **Prescription Structure Autofill**: Dosage, timing, frequency, food timing, duration, instructions (NO medicine names)
6. ✅ **Doctor Control**: All fields are editable; doctor manually selects medicines
7. ✅ **Privacy & Security**: Best practices for clinical data handling

## Architecture

### Core Service: `src/lib/ai/clinicalAssistant.ts`

Main service that handles:
- `analyzeClinicalConversation()`: Comprehensive analysis of patient conversation
- `getMedicinePrescriptionStructure()`: Get prescription structure for manually selected medicine
- Language detection and support

### React Hook: `src/hooks/useClinicalAssistant.ts`

Convenient React hook for integrating the clinical assistant:
- `analyzeTranscript()`: Debounced transcript analysis
- `getMedicineStructure()`: Get structure for selected medicine
- `reset()`: Reset state
- `updatePrescriptionStructure()`: Manual updates

## Usage Example

### Basic Integration

```typescript
import { useClinicalAssistant } from "@shared/hooks/useClinicalAssistant";
import { SpeechRecognitionService } from "@shared/lib/ai/speechRecognition";

function ActiveConsultation() {
  const { state, analyzeTranscript, getMedicineStructure, reset } = useClinicalAssistant();
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const speechRecognitionRef = useRef<SpeechRecognitionService | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (!SpeechRecognitionService.isSupported()) {
      console.warn("Speech recognition not supported");
      return;
    }

    speechRecognitionRef.current = new SpeechRecognitionService({
      continuous: true,
      interimResults: true,
      language: "kn-IN" // Kannada (India)
    });

    speechRecognitionRef.current.onTranscript((result) => {
      setTranscript(result.transcript);
      
      // Analyze transcript when it updates (debounced automatically)
      if (result.isFinal && result.transcript.length > 10) {
        analyzeTranscript(result.transcript);
      }
    });

    return () => {
      speechRecognitionRef.current?.stop();
    };
  }, [analyzeTranscript]);

  // Start/stop recording
  const handleStartRecording = () => {
    speechRecognitionRef.current?.start("patient");
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    speechRecognitionRef.current?.stop();
    setIsRecording(false);
  };

  // Use AI-generated data
  const symptoms = state.symptoms.normalized.join(", ");
  const diagnosis = state.diagnosis.primary;
  const advice = state.advice;

  // When doctor selects a medicine, get structure
  const handleMedicineSelect = async (medicineName: string) => {
    const structure = await getMedicineStructure(
      medicineName,
      state.diagnosis.primary,
      patientAge
    );
    
    if (structure) {
      // Apply structure to medicine form
      setMedicineForm({
        dosage: structure.dosage,
        frequency: structure.frequency,
        timing: structure.timing,
        food: structure.foodTiming,
        duration: structure.duration,
        quantity: structure.quantity,
        instructions: structure.instructions
      });
    }
  };

  return (
    <div>
      {/* Recording Controls */}
      <button onClick={isRecording ? handleStopRecording : handleStartRecording}>
        {isRecording ? "Stop" : "Start"} Recording
      </button>

      {/* Live Transcript */}
      <div>
        <h3>Live Transcript</h3>
        <p>{transcript}</p>
        {state.isProcessing && <p>Analyzing...</p>}
      </div>

      {/* AI-Generated Symptoms */}
      <div>
        <h3>Symptoms</h3>
        <textarea
          value={symptoms}
          onChange={(e) => {/* Doctor can edit */}}
        />
        <p className="text-sm text-muted">
          Original: {state.symptoms.original.join(", ")}
        </p>
      </div>

      {/* AI-Generated Diagnosis */}
      <div>
        <h3>Diagnosis</h3>
        <input
          value={diagnosis}
          onChange={(e) => {/* Doctor can edit */}}
        />
        <p className="text-sm text-muted">
          Confidence: {Math.round(state.diagnosis.confidence * 100)}%
        </p>
        <p className="text-sm text-muted">
          Reasoning: {state.diagnosis.reasoning}
        </p>
        {state.diagnosis.icd10Code && (
          <p className="text-sm text-muted">
            ICD-10: {state.diagnosis.icd10Code}
          </p>
        )}
      </div>

      {/* Prescription Structure (Auto-filled, editable) */}
      <div>
        <h3>Prescription Structure</h3>
        <p>Dosage: {state.prescriptionStructure.dosage}</p>
        <p>Frequency: {state.prescriptionStructure.frequency}</p>
        <p>Timing: {state.prescriptionStructure.timing.join(", ")}</p>
        <p>Food: {state.prescriptionStructure.foodTiming}</p>
        <p>Duration: {state.prescriptionStructure.duration} days</p>
        <p>Instructions: {state.prescriptionStructure.instructions}</p>
      </div>

      {/* Doctor's Advice */}
      <div>
        <h3>Advice</h3>
        <textarea
          value={advice}
          onChange={(e) => {/* Doctor can edit */}}
        />
      </div>

      {/* Medicine Selection (Doctor manually selects) */}
      <div>
        <h3>Add Medicine</h3>
        <MedicineSearch
          onSelect={handleMedicineSelect}
          // Structure is auto-filled from prescriptionStructure
        />
      </div>
    </div>
  );
}
```

## API Reference

### `analyzeClinicalConversation()`

Comprehensive analysis of patient conversation.

**Parameters:**
- `transcript: string` - Full patient conversation transcript
- `language?: SupportedLanguage` - Optional language hint (auto-detected if not provided)

**Returns:**
```typescript
{
  transcript: string;
  symptoms: {
    original: string[];      // Original expressions
    normalized: string[];     // Standardized English
  };
  diagnosis: {
    primary: string;
    confidence: number;
    reasoning: string;
    icd10Code?: string;
    alternatives?: Array<{
      diagnosis: string;
      confidence: number;
      reasoning: string;
    }>;
  };
  prescriptionStructure: {
    dosage: string;
    frequency: string;
    timing: ("morning" | "afternoon" | "night")[];
    foodTiming: "before" | "after";
    duration: number;
    instructions: string;
  };
  advice: string;
  followUpDays?: number;
  detectedLanguage: SupportedLanguage;
}
```

### `getMedicinePrescriptionStructure()`

Get prescription structure for a manually selected medicine.

**Parameters:**
- `medicineName: string` - Medicine name selected by doctor
- `diagnosis: string` - Current diagnosis
- `patientAge?: string` - Optional patient age

**Returns:**
```typescript
{
  dosage: string;
  frequency: string;
  timing: ("morning" | "afternoon" | "night")[];
  foodTiming: "before" | "after";
  duration: number;
  quantity: number;
  instructions: string;
}
```

## Gemini Pro Prompt Engineering

The clinical assistant uses a comprehensive prompt that instructs Gemini Pro to:

1. **Listen Continuously**: Process entire conversations without cut-off
2. **Recognize Symptoms**: Extract all symptoms in both original and normalized forms
3. **Provide Diagnosis**: Professional diagnosis with confidence and reasoning
4. **Autofill Structure**: Prescription structure (dosage, timing, etc.) WITHOUT medicine names
5. **Support Languages**: Handle Kannada, Telugu, Hindi, Urdu, English
6. **Maintain Privacy**: Follow security best practices

### Key Prompt Features

- **No Medicine Names**: Explicitly instructs NOT to suggest medicine names
- **Preserve Originals**: Keeps original symptom expressions alongside normalized English
- **Professional Diagnosis**: Requires confidence scores, reasoning, and ICD-10 codes
- **Editable Structure**: All fields are suggestions that doctors can edit

## Language Support

### Supported Languages

1. **Kannada** (`kn-IN`) - Priority language
2. **Telugu** (`te-IN`)
3. **Hindi** (`hi-IN`)
4. **Urdu** (`ur-PK`)
5. **English** (`en-IN`)

### Language Detection

Language is auto-detected from transcript if not provided. Kannada is prioritized if detected.

## Integration Checklist

- [ ] Import `useClinicalAssistant` hook
- [ ] Initialize speech recognition service
- [ ] Set up transcript callback to call `analyzeTranscript()`
- [ ] Display AI-generated symptoms (editable)
- [ ] Display AI-generated diagnosis (editable)
- [ ] Display prescription structure (editable)
- [ ] Implement medicine search (doctor manually selects)
- [ ] Call `getMedicineStructure()` when medicine is selected
- [ ] Apply structure to medicine form
- [ ] Allow doctor to edit all AI-generated fields
- [ ] Save consultation with all data

## Best Practices

1. **Debouncing**: Transcript analysis is automatically debounced (2s default)
2. **Error Handling**: Always handle API failures gracefully
3. **Doctor Control**: All AI suggestions are editable
4. **Privacy**: Never log full transcripts in production
5. **Performance**: Use debouncing to avoid excessive API calls
6. **Fallbacks**: System provides fallback values if API fails

## Troubleshooting

### API Rate Limits
- System automatically retries with exponential backoff
- Uses multiple endpoint fallbacks
- Implements serverless proxy for better rate limit handling

### Language Detection Issues
- Falls back to English if detection fails
- Can manually specify language in `analyzeTranscript()`

### Missing Symptoms/Diagnosis
- Check transcript length (minimum 10 characters)
- Verify API key is set (`VITE_GEMINI_API_KEY`)
- Check browser console for errors
- Fallback values are provided if API fails

## Example Prompt Output

The Gemini Pro API receives a comprehensive prompt that includes:
- Role definition (expert clinical AI assistant)
- All requirements (continuous listening, symptom normalization, etc.)
- Full conversation transcript
- Output format specification
- Critical rules (no medicine names, preserve originals, etc.)

The response is parsed and validated before being returned to the application.

## Security & Privacy

- API keys are stored in environment variables
- Serverless proxy can be used to avoid exposing keys
- Transcripts are processed securely
- No patient data is logged in production
- All fields are editable by doctors before saving

## Next Steps

1. Integrate into `ActiveConsultation` component
2. Test with real patient conversations
3. Fine-tune prompts based on feedback
4. Add custom prescription templates
5. Implement offline fallbacks

