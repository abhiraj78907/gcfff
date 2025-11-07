/**
 * Speech Recognition Service
 * Real-time bi-directional speech recognition with multi-language support
 */

export interface SpeechRecognitionConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
  speaker?: "patient" | "doctor";
}

export class SpeechRecognitionService {
  private recognition: any;
  private isListening: boolean = false;
  private currentSpeaker: "patient" | "doctor" = "patient";
  private transcriptBuffer: string = "";
  private onTranscriptCallback?: (result: SpeechRecognitionResult) => void;
  private onErrorCallback?: (error: Error) => void;
  private restartTimeout?: number;

  constructor(config: SpeechRecognitionConfig = {}) {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = config.continuous ?? true;
    this.recognition.interimResults = config.interimResults ?? true;
    this.recognition.maxAlternatives = config.maxAlternatives ?? 1;
    
    // Priority: Kannada, then Hindi, Telugu, English
    this.recognition.lang = config.language || "kn-IN"; // Kannada (India)
    
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.recognition.onstart = () => {
      console.log("========================================");
      console.log("[SpeechRecognition] ✅✅✅ ONSTART EVENT FIRED! ✅✅✅");
      console.log("========================================");
      console.log("[SpeechRecognition] Microphone is NOW ACTIVE!");
      console.log("[SpeechRecognition] Listening configuration:", {
        language: this.recognition.lang,
        speaker: this.currentSpeaker,
        continuous: this.recognition.continuous,
        interimResults: this.recognition.interimResults,
      });
      console.log("[SpeechRecognition] Ready to capture speech!");
      console.log("========================================");
    };

    this.recognition.onresult = (event: any) => {
      console.log("========================================");
      console.log("[SpeechRecognition] 📝 ONRESULT EVENT FIRED!");
      console.log("========================================");
      console.log("[SpeechRecognition] Result details:", {
        resultIndex: event.resultIndex,
        resultsLength: event.results.length,
        speaker: this.currentSpeaker,
      });
      console.log("[SpeechRecognition] This means microphone IS WORKING and capturing speech!");
      console.log("========================================");

      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence || 0.8;
        
        console.log("[SpeechRecognition] Processing result", {
          index: i,
          transcript,
          isFinal: result.isFinal,
          confidence,
        });

        if (result.isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      // Always update transcript (both interim and final)
      if (finalTranscript) {
        this.transcriptBuffer += finalTranscript;
        console.log("[SpeechRecognition] Final transcript updated", {
          finalTranscript: finalTranscript.trim(),
          buffer: this.transcriptBuffer.trim(),
          speaker: this.currentSpeaker,
        });
        this.onTranscriptCallback?.({
          transcript: this.transcriptBuffer.trim(),
          confidence: 0.9,
          isFinal: true,
          speaker: this.currentSpeaker,
        });
      }
      
      // Also show interim results for real-time feedback
      if (interimTranscript) {
        console.log("[SpeechRecognition] Interim transcript", {
          interimTranscript,
          fullTranscript: this.transcriptBuffer + interimTranscript,
          speaker: this.currentSpeaker,
        });
        this.onTranscriptCallback?.({
          transcript: this.transcriptBuffer + interimTranscript,
          confidence: 0.5,
          isFinal: false,
          speaker: this.currentSpeaker,
        });
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error("[SpeechRecognition] Error occurred", {
        error: event.error,
        message: event.message,
        speaker: this.currentSpeaker,
      });
      
      const error = new Error(`Speech recognition error: ${event.error}`);
      (error as any).code = event.error;
      (error as any).recoverable = ["no-speech", "aborted", "network", "audio-capture"].includes(event.error);
      this.onErrorCallback?.(error);

      const isRecoverable = (error as any).recoverable && this.isListening;
      
      // Handle specific errors
      if (event.error === "not-allowed") {
        console.error("[SpeechRecognition] Microphone permission denied");
      } else if (event.error === "no-speech") {
        console.warn("[SpeechRecognition] No speech detected");
      } else if (event.error === "aborted") {
        console.warn("[SpeechRecognition] Recognition aborted");
      } else if (event.error === "network") {
        console.error("[SpeechRecognition] Network error");
      }

      if (isRecoverable) {
        if (this.restartTimeout) {
          clearTimeout(this.restartTimeout);
        }
        this.restartTimeout = window.setTimeout(() => {
          try {
            console.log("[SpeechRecognition] Recoverable error - restarting recognition");
            this.recognition.start();
          } catch (restartError) {
            console.warn("[SpeechRecognition] Restart after recoverable error failed", restartError);
          }
        }, 500);
      }
    };

    this.recognition.onend = () => {
      console.log("[SpeechRecognition] Recognition ended", {
        isListening: this.isListening,
        speaker: this.currentSpeaker,
      });
      
      if (this.isListening) {
        if (this.restartTimeout) {
          clearTimeout(this.restartTimeout);
        }
        this.restartTimeout = window.setTimeout(() => {
          try {
            console.log("[SpeechRecognition] Auto-restarting...");
            this.recognition.start();
          } catch (e) {
            console.warn("[SpeechRecognition] Auto-restart failed", e);
          }
        }, 250);
      }
    };

    this.recognition.onaudiostart = () => {
      console.log("[SpeechRecognition] Audio capture started");
    };

    this.recognition.onaudioend = () => {
      console.log("[SpeechRecognition] Audio capture ended");
    };

    this.recognition.onsoundstart = () => {
      console.log("[SpeechRecognition] Sound detected");
    };

    this.recognition.onsoundend = () => {
      console.log("[SpeechRecognition] Sound ended");
    };

    this.recognition.onspeechstart = () => {
      console.log("[SpeechRecognition] Speech detected");
    };

    this.recognition.onspeechend = () => {
      console.log("[SpeechRecognition] Speech ended");
    };

    this.recognition.onnomatch = () => {
      console.warn("[SpeechRecognition] No match found");
    };
  }

  /**
   * Start listening for speech
   */
  start(speaker: "patient" | "doctor" = "patient") {
    console.log("========================================");
    console.log("[SpeechRecognition] 🎙️ START() CALLED");
    console.log("========================================");
    console.log("[SpeechRecognition] Recognition object exists:", !!this.recognition);
    console.log("[SpeechRecognition] Speaker:", speaker);
    
    if (!this.recognition) {
      console.error("========================================");
      console.error("[SpeechRecognition] ❌ CANNOT START: NOT SUPPORTED");
      console.error("========================================");
      throw new Error("Speech Recognition not supported");
    }

    this.currentSpeaker = speaker;
    this.isListening = true;
    
    console.log("[SpeechRecognition] Configuration:", {
      speaker,
      language: this.recognition.lang,
      continuous: this.recognition.continuous,
      interimResults: this.recognition.interimResults,
    });
    
    try {
      console.log("[SpeechRecognition] Calling recognition.start()...");
      console.log("[SpeechRecognition] This should activate the microphone!");
      this.recognition.start();
      
      console.log("========================================");
      console.log("[SpeechRecognition] ✅✅✅ RECOGNITION.START() SUCCESS! ✅✅✅");
      console.log("========================================");
      console.log("[SpeechRecognition] Microphone should now be active");
      console.log("[SpeechRecognition] Waiting for speech input...");
      console.log("========================================");
    } catch (e: any) {
      console.error("========================================");
      console.error("[SpeechRecognition] ❌ START FAILED");
      console.error("========================================");
      console.error("[SpeechRecognition] Error name:", e.name);
      console.error("[SpeechRecognition] Error message:", e.message);
      console.error("[SpeechRecognition] Error code:", e.code);
      console.error("[SpeechRecognition] Full error:", e);
      console.error("========================================");
      
      if (e.message?.includes("already started") || e.code === "invalid-state") {
        console.warn("[SpeechRecognition] Already started, stopping and restarting...");
        try {
          this.recognition.stop();
          setTimeout(() => {
            console.log("[SpeechRecognition] Retrying start() after stop...");
            this.recognition.start();
          }, 100);
        } catch (restartError) {
          console.error("[SpeechRecognition] Restart failed", restartError);
          throw e;
        }
      } else {
        throw e;
      }
    }
  }

  /**
   * Stop listening
   */
  stop() {
    console.log("[SpeechRecognition] Stopping recognition");
    this.isListening = false;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = undefined;
    }
    if (this.recognition) {
      try {
        this.recognition.stop();
        console.log("[SpeechRecognition] Recognition stopped successfully");
      } catch (e) {
        console.warn("[SpeechRecognition] Stop failed", e);
      }
    }
  }

  /**
   * Switch speaker (patient/doctor)
   */
  switchSpeaker(speaker: "patient" | "doctor") {
    this.currentSpeaker = speaker;
  }

  /**
   * Clear transcript buffer
   */
  clearTranscript() {
    this.transcriptBuffer = "";
  }

  /**
   * Get current transcript
   */
  getTranscript(): string {
    return this.transcriptBuffer;
  }

  /**
   * Set language
   */
  setLanguage(language: "kannada" | "hindi" | "telugu" | "english") {
    const langMap = {
      kannada: "kn-IN",
      hindi: "hi-IN",
      telugu: "te-IN",
      english: "en-IN",
    };
    
    const langCode = langMap[language];
    console.log("[SpeechRecognition] Setting language", {
      language,
      langCode,
      currentLang: this.recognition?.lang,
    });
    
    if (this.recognition) {
      this.recognition.lang = langCode;
      console.log("[SpeechRecognition] Language updated to", this.recognition.lang);
    }
  }

  /**
   * Set transcript callback
   */
  onTranscript(callback: (result: SpeechRecognitionResult) => void) {
    this.onTranscriptCallback = callback;
  }

  /**
   * Set error callback
   */
  onError(callback: (error: Error) => void) {
    this.onErrorCallback = callback;
  }

  /**
   * Check if speech recognition is supported
   */
  static isSupported(): boolean {
    return !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition;
  }
}

