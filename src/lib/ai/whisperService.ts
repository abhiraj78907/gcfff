/**
 * Whisper Speech Recognition Service
 * Uses OpenAI Whisper API via secure backend proxy for accurate multilingual transcription
 */

export interface WhisperConfig {
  language?: string;
  chunkDuration?: number; // Duration in ms to send audio chunks (default: 3000ms = 3 seconds)
  sampleRate?: number; // Audio sample rate (default: 16000)
}

export interface WhisperResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  speaker?: "patient" | "doctor";
  language?: string;
}

export class WhisperService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioContext: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private isRecording: boolean = false;
  private currentSpeaker: "patient" | "doctor" = "patient";
  private transcriptBuffer: string = "";
  private onTranscriptCallback?: (result: WhisperResult) => void;
  private onErrorCallback?: (error: Error) => void;
  private chunkInterval?: number;
  private config: WhisperConfig;
  private audioChunks: Blob[] = [];
  private pendingTranscriptions: Set<Promise<void>> = new Set();
  private retryCount: number = 0;
  private maxRetries: number = 3;

  constructor(config: WhisperConfig = {}) {
    this.config = {
      chunkDuration: config.chunkDuration || 3000, // 3 seconds per chunk
      sampleRate: config.sampleRate || 16000,
      language: config.language || "auto",
    };
  }

  /**
   * Initialize audio capture
   */
  async initialize(): Promise<void> {
    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: this.config.sampleRate,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Create AudioContext for processing
      this.audioContext = new AudioContext({
        sampleRate: this.config.sampleRate,
      });

      // Determine best MIME type for MediaRecorder
      const mimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/mp4",
        "audio/ogg;codecs=opus",
      ];
      let selectedMimeType = "";

      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }

      if (!selectedMimeType) {
        throw new Error("No supported audio MIME type found");
      }

      // Create MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: selectedMimeType,
        audioBitsPerSecond: 128000, // Good quality for speech
      });

      console.log("[WhisperService] ✅ Initialized with MIME type:", selectedMimeType);
    } catch (error: any) {
      console.error("[WhisperService] ❌ Initialization error:", error);
      throw new Error(`Failed to initialize audio: ${error.message}`);
    }
  }

  /**
   * Start recording and transcribing
   */
  async start(): Promise<void> {
    if (this.isRecording) {
      console.warn("[WhisperService] Already recording");
      return;
    }

    if (!this.mediaRecorder) {
      await this.initialize();
    }

    if (!this.mediaRecorder) {
      throw new Error("MediaRecorder not initialized");
    }

    this.isRecording = true;
    this.transcriptBuffer = ""; // Clear buffer on new session
    this.audioChunks = [];
    this.retryCount = 0;

    // Handle data available events
    this.mediaRecorder.ondataavailable = async (event) => {
      if (event.data && event.data.size > 0) {
        this.audioChunks.push(event.data);
        // Send chunk for transcription
        await this.transcribeChunk(event.data);
      }
    };

    // Handle recording stop
    this.mediaRecorder.onstop = () => {
      console.log("[WhisperService] 🛑 Recording stopped");
      // Process any remaining audio
      if (this.audioChunks.length > 0) {
        const finalBlob = new Blob(this.audioChunks, { type: this.mediaRecorder?.mimeType || "audio/webm" });
        this.transcribeChunk(finalBlob, true);
      }
    };

    // Start recording with timeslice for chunking
    this.mediaRecorder.start(this.config.chunkDuration);
    console.log("[WhisperService] 🎤 Started recording with chunk duration:", this.config.chunkDuration, "ms");

    // Also set up periodic transcription of accumulated chunks
    this.chunkInterval = window.setInterval(() => {
      if (this.audioChunks.length > 0 && this.isRecording) {
        const chunkBlob = new Blob(this.audioChunks, { type: this.mediaRecorder?.mimeType || "audio/webm" });
        this.transcribeChunk(chunkBlob);
        this.audioChunks = []; // Clear after sending
      }
    }, this.config.chunkDuration!);
  }

  /**
   * Stop recording
   */
  stop(): void {
    if (!this.isRecording) {
      return;
    }

    this.isRecording = false;

    if (this.chunkInterval) {
      clearInterval(this.chunkInterval);
      this.chunkInterval = undefined;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }

    // Wait for pending transcriptions
    Promise.all(Array.from(this.pendingTranscriptions)).then(() => {
      console.log("[WhisperService] ✅ All transcriptions completed");
    });
  }

  /**
   * Transcribe an audio chunk using Whisper API
   */
  private async transcribeChunk(audioBlob: Blob, isFinal: boolean = false): Promise<void> {
    if (audioBlob.size === 0) {
      return;
    }

    const transcriptionPromise = this.performTranscription(audioBlob, isFinal);
    this.pendingTranscriptions.add(transcriptionPromise);

    transcriptionPromise
      .then(() => {
        this.pendingTranscriptions.delete(transcriptionPromise);
        this.retryCount = 0; // Reset retry on success
      })
      .catch((error) => {
        this.pendingTranscriptions.delete(transcriptionPromise);
        console.error("[WhisperService] Transcription error:", error);
        this.onErrorCallback?.(error);
      });
  }

  /**
   * Mock transcription for local development (when Netlify function isn't available)
   */
  private async mockTranscription(audioBlob: Blob): Promise<{ text: string; language: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    // Generate mock transcription based on audio duration
    // In real scenario, this would be actual speech-to-text
    const mockTranscripts = [
      "ನಮಸ್ಕಾರ ಸರ್ ನನಗೆ ತಲೆ ನೋವು ಇದೆ ಮತ್ತು ಜ್ವರ ಬಂದಿದೆ",
      "सर मुझे सिर दर्द है और बुखार आ रहा है",
      "Hello doctor, I have headache and fever",
      "రోగికి తలనొప్పి మరియు జ్వరం ఉంది",
      "Patient reports severe headache, high fever of 102°F, body pain, and fatigue for the last 3 days",
    ];
    
    const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
    const detectedLang = randomTranscript.includes("ನ") ? "kn" : 
                        randomTranscript.includes("म") ? "hi" : 
                        randomTranscript.includes("ర") ? "te" : "en";
    
    console.log("[WhisperService] 🎭 Using mock transcription (local dev mode)", {
      transcript: randomTranscript,
      language: detectedLang,
      note: "This is simulated data. Deploy to production for real Whisper transcription.",
    });
    
    return {
      text: randomTranscript,
      language: detectedLang,
    };
  }

  /**
   * Perform actual transcription API call
   */
  private async performTranscription(audioBlob: Blob, isFinal: boolean): Promise<void> {
    try {
      // Convert blob to base64
      const base64Audio = await this.blobToBase64(audioBlob);
      const mimeType = audioBlob.type || "audio/webm";

      // Use relative path - works in both dev (with netlify dev) and production
      // When using `netlify dev`, it proxies /.netlify/functions/* to the function server
      // In production, Netlify serves functions at the same path
      const functionUrl = "/.netlify/functions/whisper-transcribe";
      const isLocalDev = import.meta.env.DEV && window.location.hostname === "localhost";

      console.log("[WhisperService] Calling transcription function", {
        url: functionUrl,
        audioSize: audioBlob.size,
        mimeType,
        isDev: import.meta.env.DEV,
        isLocalDev,
        note: isLocalDev 
          ? "⚠️ Local dev - will use mock if function unavailable"
          : "Using relative path - works in production automatically",
      });

      // Call Netlify Function proxy
      let response: Response;
      let useMock = false;
      
      try {
        response = await fetch(functionUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            audio: base64Audio,
            contentType: mimeType,
          }),
        });

        console.log("[WhisperService] Response received", {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
        });

        // If 404 or 500 in local dev, use mock instead of failing
        if ((response.status === 404 || response.status === 500) && isLocalDev) {
          console.warn("[WhisperService] Server error in local dev, using mock transcription", {
            status: response.status,
            statusText: response.statusText,
          });
          useMock = true;
        } else if (!response.ok) {
          let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          let errorDetails: any = {};
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
            errorDetails = errorData;
            console.error("[WhisperService] API error details:", errorData);
          } catch {
            const errorText = await response.text().catch(() => "");
            if (errorText) {
              errorMessage = errorText;
              errorDetails = { raw: errorText };
            }
          }
          
          if (response.status === 404 && !isLocalDev) {
            throw new Error(
              `Whisper function not found (404). ` +
              `Ensure the function is deployed. Check Netlify Dashboard → Functions tab.`
            );
          }
          
          // For 500 errors, provide more helpful message
          if (response.status === 500) {
            console.error("[WhisperService] Server error (500) - possible causes:", {
              errorDetails,
              note: "Check local server logs for details. Common causes: invalid API key, network issues, or OpenAI API errors.",
            });
            if (isLocalDev) {
              // In local dev, fall back to mock for 500 errors
              console.warn("[WhisperService] Falling back to mock due to server error");
              useMock = true;
            } else {
              throw new Error(`Whisper server error (500): ${errorMessage}. Check server logs.`);
            }
          } else {
            throw new Error(`Whisper API error: ${errorMessage}`);
          }
        }
      } catch (fetchError: any) {
        // Network error or function unavailable - use mock in local dev
        const isConnectionError = fetchError.message.includes("Failed to fetch") || 
                                  fetchError.message.includes("ECONNREFUSED") ||
                                  fetchError.message.includes("404") ||
                                  fetchError.message.includes("NetworkError");
        
        if (isLocalDev && isConnectionError) {
          console.warn("[WhisperService] Connection error in local dev, using mock transcription", {
            error: fetchError.message,
            note: "Whisper server not running. Start with 'npm run dev:whisper' or use mock mode.",
          });
          useMock = true;
        } else {
          throw fetchError;
        }
      }

      let data: { text: string; language: string };
      
      if (useMock) {
        // Use mock transcription for local development
        data = await this.mockTranscription(audioBlob);
      } else {
        // Use real API response
        data = await response!.json();
      }
      
      const transcribedText = data.text || "";
      const detectedLanguage = data.language || "unknown";

      if (transcribedText.trim()) {
        // Append to buffer
        this.transcriptBuffer += (this.transcriptBuffer ? " " : "") + transcribedText.trim();
        
        console.log("[WhisperService] 📝 Transcription:", {
          chunk: transcribedText.substring(0, 50) + (transcribedText.length > 50 ? "..." : ""),
          language: detectedLanguage,
          bufferLength: this.transcriptBuffer.length,
          wordCount: this.transcriptBuffer.split(/\s+/).filter(w => w.length > 0).length,
          isFinal,
        });

        // Notify callback with full accumulated transcript
        this.onTranscriptCallback?.({
          transcript: this.transcriptBuffer,
          confidence: 0.95, // Whisper is highly accurate
          isFinal: isFinal || false,
          speaker: this.currentSpeaker,
          language: detectedLanguage,
        });
      }
    } catch (error: any) {
      // Retry logic
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.warn(`[WhisperService] Retry ${this.retryCount}/${this.maxRetries} after error:`, error.message);
        await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount)); // Exponential backoff
        return this.performTranscription(audioBlob, isFinal);
      }
      throw error;
    }
  }

  /**
   * Convert Blob to base64 string
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(",")[1]; // Remove data:audio/...;base64, prefix
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Set callback for transcript updates
   */
  onTranscript(callback: (result: WhisperResult) => void): void {
    this.onTranscriptCallback = callback;
  }

  /**
   * Set callback for errors
   */
  onError(callback: (error: Error) => void): void {
    this.onErrorCallback = callback;
  }

  /**
   * Set current speaker
   */
  setSpeaker(speaker: "patient" | "doctor"): void {
    this.currentSpeaker = speaker;
  }

  /**
   * Get current accumulated transcript
   */
  getTranscript(): string {
    return this.transcriptBuffer;
  }

  /**
   * Clear transcript buffer
   */
  clearTranscript(): void {
    this.transcriptBuffer = "";
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.stop();

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.audioContext) {
      this.audioContext.close().catch(console.error);
      this.audioContext = null;
    }

    this.mediaRecorder = null;
    this.pendingTranscriptions.clear();
    console.log("[WhisperService] 🧹 Cleaned up resources");
  }
}

