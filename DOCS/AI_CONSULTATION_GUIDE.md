# AI-Powered Consultation Workflow Guide

## Overview

The AI-Powered Active Consultation page (`ActiveConsultationAI.tsx`) integrates cutting-edge AI features to enhance doctor-patient interactions with intelligent symptom tracking, diagnosis assistance, and professional prescription automation.

## Features

### 1. Real-Time Speech Recognition

**Multi-Language Support:**
- **Priority:** Kannada (kn-IN)
- **Secondary:** Hindi (hi-IN), Telugu (te-IN), English (en-IN)
- Automatic language detection from conversation

**Bi-Directional Recording:**
- Switch between Patient and Doctor modes
- Real-time transcription with speaker identification
- Continuous recording with auto-restart

**Usage:**
1. Click the microphone button to start recording
2. Select speaker mode (Patient/Doctor)
3. Conversation is transcribed in real-time
4. Language is automatically detected

### 2. AI Symptom Extraction

**Automatic Extraction:**
- AI analyzes patient dialogue in real-time
- Extracts key symptom phrases automatically
- Auto-populates "Symptoms" field as conversation progresses
- Doctor can edit/remove symptoms manually

**How It Works:**
- When patient speaks (final transcript), AI processes the text
- Uses Gemini API to extract medical symptoms
- Updates symptoms field automatically
- Respects doctor edits (won't overwrite if doctor already entered symptoms)

### 3. AI-Aided Diagnosis

**Intelligent Suggestions:**
- Based on extracted symptoms and conversation context
- Provides multiple diagnosis suggestions with confidence scores
- Includes ICD-10 codes when available
- Shows reasoning for each suggestion

**Usage:**
1. Enter symptoms (manually or via AI extraction)
2. Click "AI Suggest" button
3. Review suggested diagnoses
4. Click on a suggestion to auto-fill
5. Edit as needed

### 4. Medicine Search & Autocomplete

**Smart Search:**
- Integrates with Indian medicine database
- Handles partial matches and common misspellings
- Fuzzy matching for typo tolerance
- Real-time search results as you type

**Features:**
- Search by medicine name or generic name
- Autocomplete dropdown with suggestions
- Shows generic name and dosage information
- Multi-select support for adding multiple medicines

**Usage:**
1. Type medicine name in search box
2. Select from dropdown suggestions
3. Configure timing, food, duration, quantity
4. Click "Add to Prescription"

### 5. Prescription Generation & Formatting

**Template Support:**
- Upload custom prescription template during registration
- AI formats prescription according to template structure
- Professional medical formatting
- Preview before saving

**Features:**
- Neatly formatted prescription document
- Includes all consultation details
- Medicine list with dosages
- Doctor signature and advice
- Export as text file

**Usage:**
1. Add medicines to prescription
2. Click "Preview Prescription"
3. Review formatted prescription
4. Download if needed
5. Save consultation

### 6. Sharing and Notifications

**Automatic Sharing:**
- Prescriptions automatically shared to Pharmacy dashboard
- Lab orders automatically shared to Lab dashboard
- Real-time Firestore updates
- Notifications triggered on completion

**Notification Triggers:**
- Consultation saved → Doctor notification
- Prescription created → Pharmacy notification
- Lab order created → Lab notification

## Technical Implementation

### API Integration

**Gemini API:**
- API Key: Stored in `.env` as `VITE_GEMINI_API_KEY`
- Fallback: Uses provided key if env variable not set
- Endpoints: `gemini-pro:generateContent`

**Services:**
- `geminiService.ts` - AI processing (symptoms, diagnosis, formatting)
- `speechRecognition.ts` - Speech-to-text with multi-language support
- `medicineSearch.ts` - Medicine database search with fuzzy matching

### Speech Recognition

**Browser Support:**
- Chrome/Edge: Full support
- Safari: Limited support
- Firefox: Not supported

**Implementation:**
- Uses Web Speech API
- Continuous recording mode
- Interim and final results
- Speaker switching support

### Medicine Database

**Current Implementation:**
- In-memory database with common Indian medicines
- Production: Should load from Kaggle dataset or Firestore

**Search Algorithm:**
- Exact match (highest priority)
- Partial match
- Fuzzy match (Levenshtein distance)
- Relevance scoring and ranking

## Setup Instructions

### 1. Environment Variables

Add to `.env` file:
```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Browser Permissions

**Microphone Access:**
- Browser will prompt for microphone permission
- Grant permission for speech recognition to work
- HTTPS required (or localhost)

### 3. Medicine Database

**For Production:**
1. Download Kaggle Indian Medicine Dataset
2. Convert to JSON format
3. Load into Firestore or import into `medicineSearch.ts`
4. Update `loadMedicineDatabase()` function

### 4. Prescription Templates

**Template Format:**
- Upload during doctor registration
- Store in Firestore `users/{doctorId}/prescriptionTemplate`
- Plain text format with placeholders
- AI will format according to template structure

## Usage Workflow

### Complete Consultation Flow

1. **Start Consultation**
   - Navigate to Active Consultation page
   - Patient information loads automatically

2. **Begin Recording**
   - Click microphone button
   - Select speaker mode (Patient/Doctor)
   - Start conversation

3. **AI Processing**
   - Symptoms auto-extracted as patient speaks
   - Transcript appears in real-time
   - Language automatically detected

4. **Get Diagnosis Suggestions**
   - Click "AI Suggest" button
   - Review suggestions with confidence scores
   - Select or edit diagnosis

5. **Add Medicines**
   - Search for medicines
   - Select from autocomplete
   - Configure dosage, timing, duration
   - Add to prescription

6. **Preview Prescription**
   - Click "Preview Prescription"
   - Review formatted document
   - Download if needed

7. **Save Consultation**
   - Click "Save & Sign"
   - Consultation saved to Firestore
   - Prescription shared to Pharmacy
   - Notifications sent

## Performance Optimization

### Latency Reduction
- Debounced medicine search (300ms)
- Async AI processing with loading states
- Fallback UI for slow AI responses
- Cached medicine database

### Error Handling
- Graceful degradation if AI fails
- Manual entry fallback
- Error notifications
- Retry mechanisms

## Security & Privacy

### API Key Security
- Stored in environment variables
- Never exposed in client code
- Use Firebase Functions for production (recommended)

### Data Privacy
- Transcripts stored in Firestore
- Patient data encrypted in transit
- HIPAA compliance considerations
- Audit logging for sensitive operations

## Troubleshooting

### Speech Recognition Not Working
- **Check:** Browser support (Chrome/Edge recommended)
- **Check:** Microphone permissions granted
- **Check:** HTTPS connection (or localhost)
- **Fallback:** Manual text entry

### AI Features Not Responding
- **Check:** Gemini API key valid
- **Check:** Network connection
- **Check:** API quota limits
- **Fallback:** Manual entry available

### Medicine Search Not Finding Results
- **Check:** Search query length (minimum 2 characters)
- **Check:** Medicine database loaded
- **Try:** Different spelling or generic name
- **Fallback:** Manual medicine entry

## Future Enhancements

1. **Offline Support**
   - Cache AI responses
   - Queue API calls when offline
   - Sync when online

2. **Advanced AI Features**
   - Drug interaction checking
   - Dosage recommendations
   - Allergy warnings

3. **Enhanced Templates**
   - Multiple template formats
   - Custom fields
   - Digital signatures

4. **Analytics**
   - Consultation time tracking
   - AI accuracy metrics
   - Usage statistics

## Support

For issues or questions:
- Check browser console for errors
- Review Firestore security rules
- Verify API key permissions
- Check network connectivity

---

**Last Updated:** _______________  
**Version:** 1.0.0

