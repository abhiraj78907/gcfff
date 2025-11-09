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
  private restartAttempts: number = 0;
  private maxRestartAttempts: number = 50; // Increased for longer sessions
  private lastRestartTime: number = 0;
  private consecutiveErrors: number = 0;
  private sessionStartTime: number = 0;
  private keepAliveInterval?: number;
  private lastSpeechTime: number = 0;
  private keepAliveDelay: number = 50; // Very fast restart (50ms) to capture speech immediately
  private networkErrorCount: number = 0;
  private maxNetworkRetries: number = 5; // Maximum consecutive network error retries
  private lastNetworkErrorTime: number = 0;
  private currentLanguageFallbackIndex: number = 0; // Track which fallback language code to try
  private originalLanguage: string = ""; // Store original language selection

  constructor(config: SpeechRecognitionConfig = {}) {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser");
      return;
    }

    this.recognition = new SpeechRecognition();
    // CRITICAL: Always use continuous mode for clinical consultations
    this.recognition.continuous = true; // Force continuous - never stop after short phrases
    this.recognition.interimResults = true; // Always show interim results for real-time feedback
    this.recognition.maxAlternatives = config.maxAlternatives ?? 1;
    
    // Priority: Kannada, then Hindi, Telugu, English
    // For Urdu, use ur-IN (Urdu in India) which has better browser support than ur-PK
    this.recognition.lang = config.language || "kn-IN"; // Kannada (India)
    
    console.log("========================================");
    console.log("[SpeechRecognition] 🎙️ SERVICE INITIALIZED");
    console.log("========================================");
    console.log("[SpeechRecognition] Configuration:", {
      continuous: this.recognition.continuous,
      interimResults: this.recognition.interimResults,
      language: this.recognition.lang,
      maxAlternatives: this.recognition.maxAlternatives,
    });
    console.log("[SpeechRecognition] ✅ Continuous listening mode ENABLED");
    console.log("[SpeechRecognition] ✅ Auto-restart on silence/pauses ENABLED");
    console.log("========================================");
    
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
      let interimTranscript = '';
      let allFinalTranscript = '';
      let hasNewFinal = false;
      let confidenceSum = 0;
      let resultCount = 0;

      // CRITICAL: Process ALL results from index 0 to get complete accumulated transcript
      // The Web Speech API's event.results contains ALL results from session start
      // We need to rebuild the complete transcript each time
      for (let i = 0; i < event.results.length; ++i) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence || 0.5;
        
        // Track confidence for debugging (especially important for Urdu)
        confidenceSum += confidence;
        resultCount++;
        
        if (result.isFinal) {
          // Accumulate ALL final results to rebuild complete transcript
          allFinalTranscript += transcript + ' ';
          hasNewFinal = true;
        } else {
          // Interim result - for real-time preview
          interimTranscript += transcript;
        }
      }
      
      // Log confidence metrics for Urdu (helps diagnose recognition issues)
      if (this.recognition?.lang?.startsWith("ur-") && resultCount > 0) {
        const avgConfidence = confidenceSum / resultCount;
        if (avgConfidence < 0.3) {
          console.warn("[SpeechRecognition] ⚠️ Low confidence for Urdu recognition:", {
            averageConfidence: avgConfidence.toFixed(2),
            language: this.recognition.lang,
            suggestion: "Consider speaking more clearly or checking microphone quality",
          });
        } else {
          console.log("[SpeechRecognition] ✅ Urdu recognition confidence:", avgConfidence.toFixed(2));
        }
      }

      // Update persistent buffer with complete accumulated transcript
      // This ensures we capture the FULL conversation, not just latest 2 words
      if (allFinalTranscript.trim()) {
        const completeFinal = allFinalTranscript.trim();
        
        // Check if this is a longer/more complete version than our buffer
        // The API might send the complete accumulated transcript
        if (completeFinal.length > this.transcriptBuffer.length) {
          // New complete transcript is longer - use it (contains all previous + new)
          const wasEmpty = this.transcriptBuffer.length === 0;
          this.transcriptBuffer = completeFinal;
          hasNewFinal = true;
          this.lastSpeechTime = Date.now();
          
          console.log('[SpeechRecognition] ✅ Updated buffer with complete transcript:', {
            wasEmpty,
            oldLength: wasEmpty ? 0 : this.transcriptBuffer.length - (completeFinal.length - this.transcriptBuffer.length),
            newLength: this.transcriptBuffer.length,
            wordCount: this.transcriptBuffer.split(/\s+/).filter(w => w.length > 0).length,
            preview: this.transcriptBuffer.substring(0, 100) + (this.transcriptBuffer.length > 100 ? '...' : ''),
          });
        } else if (completeFinal.length > 0 && !this.transcriptBuffer.toLowerCase().includes(completeFinal.toLowerCase())) {
          // New chunk that doesn't exist - append it
          this.transcriptBuffer += (this.transcriptBuffer ? ' ' : '') + completeFinal;
          hasNewFinal = true;
          this.lastSpeechTime = Date.now();
          
          console.log('[SpeechRecognition] ➕ Appended new chunk:', {
            chunk: completeFinal.substring(0, 50) + (completeFinal.length > 50 ? '...' : ''),
            bufferLength: this.transcriptBuffer.length,
            wordCount: this.transcriptBuffer.split(/\s+/).filter(w => w.length > 0).length,
          });
        }
      }

      // Always output the full accumulated transcript buffer
      // Combine buffer (all finalized text) + interim (current speaking)
      const fullTranscript = (this.transcriptBuffer + (interimTranscript ? ' ' + interimTranscript : '')).trim();
      
      // Log complete transcript continuously
      console.log('========================================');
      console.log('[SpeechRecognition] 📝 FULL TRANSCRIPT BUFFER');
      console.log('========================================');
      console.log('Full transcript:', fullTranscript);
      console.log('Buffer length:', this.transcriptBuffer.length, 'characters');
      console.log('Word count:', this.transcriptBuffer.split(/\s+/).filter(w => w.length > 0).length);
      console.log('All final from API:', allFinalTranscript.trim().substring(0, 100) + (allFinalTranscript.length > 100 ? '...' : ''));
      console.log('Interim:', interimTranscript ? interimTranscript.substring(0, 50) + '...' : 'none');
      console.log('Results count:', event.results.length);
      console.log('========================================');

      // Update UI with complete transcript (buffer + interim)
      if (fullTranscript || this.transcriptBuffer) {
        this.onTranscriptCallback?.({
          transcript: fullTranscript,
          confidence: interimTranscript ? 0.5 : 0.9,
          isFinal: hasNewFinal,
          speaker: this.currentSpeaker,
        });
      }
    };

    this.recognition.onerror = (event: any) => {
      const errorCode = event.error;
      const isNoSpeech = errorCode === "no-speech";
      const isRecoverable = ["no-speech", "aborted", "network", "audio-capture"].includes(errorCode);
      
      // "no-speech" is NORMAL during pauses - don't treat as error
      if (isNoSpeech) {
        console.log("========================================");
        console.log("[SpeechRecognition] ⏸️ NO SPEECH DETECTED (Normal pause)");
        console.log("========================================");
        console.log("[SpeechRecognition] This is expected during natural pauses in conversation");
        console.log("[SpeechRecognition] Recognition will continue listening - no action needed");
        console.log("[SpeechRecognition] Transcript so far:", this.transcriptBuffer.length, "characters");
        console.log("========================================");
        // Don't call error callback for normal pauses
        return;
      }
      
      // Log other errors with full diagnostics
      console.error("========================================");
      console.error("[SpeechRecognition] ❌ ERROR OCCURRED");
      console.error("========================================");
      console.error("[SpeechRecognition] Error details:", {
        error: errorCode,
        message: event.message,
        speaker: this.currentSpeaker,
        currentLanguage: this.recognition?.lang,
        isRecoverable,
        isListening: this.isListening,
        sessionDuration: this.sessionStartTime > 0 ? `${Math.floor((Date.now() - this.sessionStartTime) / 1000)}s` : "N/A",
        transcriptLength: this.transcriptBuffer.length,
      });
      
      // Special handling for language-specific errors (especially Urdu)
      if (this.recognition?.lang?.startsWith("ur-")) {
        console.warn("[SpeechRecognition] ⚠️ Urdu language error detected. If recognition fails, consider:");
        console.warn("  1. Checking browser support for Urdu (ur-IN or ur-PK)");
        console.warn("  2. Trying Hindi (hi-IN) as fallback for Urdu speakers");
        console.warn("  3. Ensuring stable internet connection for cloud-based recognition");
        console.warn("  4. Speaking more clearly and at moderate pace");
      }
      
      console.error("========================================");
      
      const error = new Error(`Speech recognition error: ${errorCode}`);
      (error as any).code = errorCode;
      (error as any).recoverable = isRecoverable;
      this.onErrorCallback?.(error);

      // Handle specific errors
      if (errorCode === "not-allowed") {
        console.error("[SpeechRecognition] ❌ Microphone permission denied - cannot continue");
        this.isListening = false;
        this.networkErrorCount = 0; // Reset network error count
      } else if (errorCode === "aborted") {
        console.warn("[SpeechRecognition] ⚠️ Recognition aborted - will attempt restart");
        this.networkErrorCount = 0; // Reset network error count on aborted
      } else if (errorCode === "network") {
        this.networkErrorCount++;
        this.lastNetworkErrorTime = Date.now();
        console.error("[SpeechRecognition] ❌ Network error (#" + this.networkErrorCount + ") - will attempt restart");
        
        // Special handling for Urdu: Try fallback language codes immediately on first network error
        // This ensures smooth recognition like other languages
        if (this.recognition?.lang?.startsWith("ur-") && this.networkErrorCount >= 1) {
          console.warn("[SpeechRecognition] 🔄 Urdu network error detected. Attempting language code fallback for smooth recognition...");
          this.tryUrduFallback();
        }
        
        // If too many consecutive network errors, wait longer before retry
        if (this.networkErrorCount >= this.maxNetworkRetries) {
          console.error("[SpeechRecognition] ⚠️ Too many network errors (" + this.networkErrorCount + "). Waiting longer before retry...");
          // Don't auto-restart immediately - let onend handle it with longer delay
          return; // Exit early, let onend handle restart with delay
        }
      } else if (errorCode === "audio-capture") {
        console.error("[SpeechRecognition] ❌ Audio capture error - will attempt restart");
        this.networkErrorCount = 0; // Reset network error count
      } else {
        // For other recoverable errors, reset network error count
        this.networkErrorCount = 0;
      }

      // Auto-restart on recoverable errors (except no-speech and not-allowed)
      // For network errors, use exponential backoff
      if (isRecoverable && this.isListening && errorCode !== 'not-allowed') {
        // Calculate retry delay with exponential backoff for network errors
        let retryDelay = 100; // Default delay
        if (errorCode === "network") {
          // Exponential backoff: 200ms, 400ms, 800ms, 1600ms, 3200ms
          retryDelay = Math.min(200 * Math.pow(2, this.networkErrorCount - 1), 5000);
          console.log(`[SpeechRecognition] 🔄 Network error retry #${this.networkErrorCount}, waiting ${retryDelay}ms before restart`);
        } else {
        console.log('[SpeechRecognition] 🔄 Restarting after recoverable error:', errorCode);
        }
        
        if (this.restartTimeout) {
          clearTimeout(this.restartTimeout);
        }
        this.restartTimeout = window.setTimeout(() => {
          if (this.isListening) {
            try {
              this.recognition.start();
              // Reset network error count on successful restart
              if (errorCode === "network") {
                this.networkErrorCount = 0;
                console.log('[SpeechRecognition] ✅ Restarted after network error - connection restored');
              } else {
              console.log('[SpeechRecognition] ✅ Restarted after error');
              }
            } catch (restartError: any) {
              console.error('[SpeechRecognition] ❌ Restart after error failed', restartError);
              // If restart fails, increment error count for network errors
              if (errorCode === "network") {
                this.networkErrorCount++;
              }
            }
          }
        }, retryDelay);
      }
    };

    this.recognition.onend = () => {
      console.log('========================================');
      console.log('[SpeechRecognition] 🔄 Recognition ended, restarting...');
      console.log('========================================');
      console.log('Current buffer length:', this.transcriptBuffer.length);
      console.log('Buffer preserved:', this.transcriptBuffer.substring(0, 100) + (this.transcriptBuffer.length > 100 ? '...' : ''));
      console.log('Network error count:', this.networkErrorCount);
      console.log('========================================');
      
      // Immediately restart if still listening (preserves buffer across pauses)
      if (this.isListening) {
        // Clear any pending restart timeout
        if (this.restartTimeout) {
          clearTimeout(this.restartTimeout);
        }
        
        // Calculate restart delay based on network error history
        let restartDelay = 50; // Default minimal delay for normal restarts
        
        // If we had recent network errors, wait longer before restarting
        const timeSinceLastNetworkError = Date.now() - this.lastNetworkErrorTime;
        if (this.networkErrorCount > 0 && timeSinceLastNetworkError < 10000) {
          // Recent network error - use exponential backoff
          restartDelay = Math.min(500 * Math.pow(2, Math.min(this.networkErrorCount - 1, 3)), 3000);
          console.log(`[SpeechRecognition] ⚠️ Recent network errors detected. Waiting ${restartDelay}ms before restart`);
        }
        
        this.restartTimeout = window.setTimeout(() => {
          if (!this.isListening) {
            return;
          }
          
          try {
            this.recognition.start();
            // Reset network error count on successful restart
            if (this.networkErrorCount > 0) {
              console.log('[SpeechRecognition] ✅ Restarted successfully after network issues - buffer preserved');
              this.networkErrorCount = 0; // Reset on successful restart
            } else {
            console.log('[SpeechRecognition] ✅ Restarted successfully - buffer preserved');
            }
          } catch (e: any) {
            console.error('[SpeechRecognition] ❌ Restart failed:', e.name, e.message);
            // Increment network error count if it's a network-related issue
            if (e.message?.includes('network') || e.code === 'network') {
              this.networkErrorCount++;
              this.lastNetworkErrorTime = Date.now();
            }
            
            // Retry after short delay if state error
            if (e.name === 'InvalidStateError' || e.code === 'invalid-state') {
              this.restartTimeout = window.setTimeout(() => {
                if (this.isListening) {
                  try {
                    this.recognition.start();
                    this.networkErrorCount = 0; // Reset on successful retry
                  } catch (retryError) {
                    console.error('[SpeechRecognition] Retry failed', retryError);
                  }
                }
              }, 200); // Slightly longer delay for state error retry
            }
          }
        }, restartDelay);
      } else {
        console.log('[SpeechRecognition] ⏹️ Not restarting - session stopped');
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
    
    // Reset session tracking
    if (this.sessionStartTime === 0) {
      this.sessionStartTime = Date.now();
      this.restartAttempts = 0;
      this.consecutiveErrors = 0;
      this.networkErrorCount = 0; // Reset network error count for new session
      this.lastNetworkErrorTime = 0;
      this.currentLanguageFallbackIndex = 0; // Reset fallback index for new session
      this.transcriptBuffer = "";
      this.lastSpeechTime = Date.now();
      this.lastRestartTime = Date.now();
      console.log("[SpeechRecognition] 📊 New session started");
      
      // Start keep-alive mechanism to ensure continuous listening
      this.startKeepAlive();
    } else {
      // Update last speech time and restart time on restart
      this.lastSpeechTime = Date.now();
      this.lastRestartTime = Date.now();
    }
    
    // CRITICAL: Verify language is set correctly before starting (especially for Urdu)
    const currentLang = this.recognition?.lang;
    if (currentLang?.startsWith("ur-")) {
      console.log("[SpeechRecognition] 🔍 Verifying Urdu language configuration before start:", {
        currentLanguage: currentLang,
        fallbackIndex: this.currentLanguageFallbackIndex,
        note: "Ensuring optimal Urdu recognition settings",
      });
      
      // Double-check Urdu language code is valid
      const urduCodes = ["ur-IN", "ur-PK"];
      if (!urduCodes.includes(currentLang)) {
        console.warn("[SpeechRecognition] ⚠️ Invalid Urdu code detected, resetting to ur-IN");
        try {
          this.recognition.lang = "ur-IN";
          this.currentLanguageFallbackIndex = 0;
        } catch (e) {
          console.error("[SpeechRecognition] ❌ Failed to reset Urdu language code");
        }
      }
    }
    
    console.log("[SpeechRecognition] Configuration:", {
      speaker,
      language: this.recognition.lang,
      continuous: this.recognition.continuous,
      interimResults: this.recognition.interimResults,
      sessionDuration: this.sessionStartTime > 0 ? `${Math.floor((Date.now() - this.sessionStartTime) / 1000)}s` : "new",
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
   * Start keep-alive mechanism to ensure recognition stays active
   */
  private startKeepAlive() {
    // Clear any existing interval
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
    }
    
    // Check every 2 seconds if recognition is still active
    this.keepAliveInterval = window.setInterval(() => {
      if (!this.isListening) {
        if (this.keepAliveInterval) {
          clearInterval(this.keepAliveInterval);
          this.keepAliveInterval = undefined;
        }
        return;
      }
      
      // Check if recognition might have stopped (no speech for a while and no recent restart)
      const timeSinceLastSpeech = Date.now() - this.lastSpeechTime;
      const timeSinceLastRestart = Date.now() - this.lastRestartTime;
      
      // If it's been more than 5 seconds since last speech and more than 3 seconds since last restart,
      // proactively restart to ensure we're still listening
      if (timeSinceLastSpeech > 5000 && timeSinceLastRestart > 3000) {
        try {
          // Check if recognition is actually running by trying to restart
          const state = (this.recognition as any).state;
          if (state === 'inactive' || state === 'ended') {
            console.log("[SpeechRecognition] 🔄 Keep-alive: Proactively restarting recognition");
            this.recognition.start();
            this.lastRestartTime = Date.now();
          }
        } catch (e) {
          // Recognition might be in a state where we can't check, that's okay
        }
      }
    }, 2000); // Check every 2 seconds
  }
  
  /**
   * Stop keep-alive mechanism
   */
  private stopKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = undefined;
    }
  }

  /**
   * Stop listening
   */
  stop() {
    const sessionDuration = this.sessionStartTime > 0 ? Date.now() - this.sessionStartTime : 0;
    
    console.log("========================================");
    console.log("[SpeechRecognition] ⏹️ STOPPING RECOGNITION");
    console.log("========================================");
    console.log("[SpeechRecognition] Session summary:", {
      duration: `${Math.floor(sessionDuration / 1000)}s`,
      restartAttempts: this.restartAttempts,
      finalTranscriptLength: this.transcriptBuffer.length,
      transcriptPreview: this.transcriptBuffer.substring(0, 150) + (this.transcriptBuffer.length > 150 ? "..." : ""),
    });
    console.log("========================================");
    
    this.isListening = false;
    
    // Stop keep-alive mechanism
    this.stopKeepAlive();
    
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = undefined;
    }
    
    if (this.recognition) {
      try {
        this.recognition.stop();
        console.log("[SpeechRecognition] ✅ Recognition stopped successfully");
      } catch (e) {
        console.warn("[SpeechRecognition] ⚠️ Stop failed", e);
      }
    }
    
    // Reset session tracking
    this.sessionStartTime = 0;
    this.restartAttempts = 0;
    this.consecutiveErrors = 0;
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
   * Try Urdu fallback language codes when network errors occur
   */
  private tryUrduFallback() {
    if (!this.recognition) return;
    
    const urduFallbacks = ["ur-IN", "ur-PK", "hi-IN"];
    const currentLang = this.recognition.lang;
    const currentIndex = urduFallbacks.findIndex(code => code === currentLang);
    
    // Try next fallback
    if (currentIndex >= 0 && currentIndex < urduFallbacks.length - 1) {
      const nextFallback = urduFallbacks[currentIndex + 1];
      try {
        this.recognition.lang = nextFallback;
        this.currentLanguageFallbackIndex = currentIndex + 1;
        console.log("[SpeechRecognition] 🔄 Switched to Urdu fallback:", nextFallback);
        
        // Reset network error count when switching language codes
        this.networkErrorCount = 0;
      } catch (error) {
        console.error("[SpeechRecognition] ❌ Failed to set fallback language:", nextFallback);
      }
    } else if (currentIndex === -1) {
      // Current language not in fallback list, try first fallback
      try {
        this.recognition.lang = urduFallbacks[0];
        this.currentLanguageFallbackIndex = 0;
        console.log("[SpeechRecognition] 🔄 Reset to first Urdu fallback:", urduFallbacks[0]);
        this.networkErrorCount = 0;
      } catch (error) {
        console.error("[SpeechRecognition] ❌ Failed to set first fallback");
      }
    }
  }

  /**
   * Set language
   */
  setLanguage(language: "kannada" | "hindi" | "telugu" | "urdu" | "tamil" | "english") {
    // Language code mapping with fallbacks for better browser support
    const langMap: Record<string, string[]> = {
      kannada: ["kn-IN"],
      hindi: ["hi-IN"],
      telugu: ["te-IN"],
      urdu: ["ur-IN", "ur-PK", "hi-IN"], // Try ur-IN first (Urdu in India), then ur-PK, fallback to Hindi
      tamil: ["ta-IN"],
      english: ["en-IN", "en-US", "en-GB"],
    };
    
    const langCodes = langMap[language] || ["en-IN"];
    const primaryLangCode = langCodes[0];
    
    // Reset fallback index when language is manually changed
    this.currentLanguageFallbackIndex = 0;
    this.originalLanguage = language;
    
    console.log("[SpeechRecognition] Setting language", {
      language,
      primaryLangCode,
      fallbacks: langCodes.slice(1),
      currentLang: this.recognition?.lang,
    });
    
    if (this.recognition) {
      // Stop recognition if it's running before changing language (critical for Urdu)
      const wasListening = this.isListening;
      if (wasListening) {
        try {
          this.recognition.stop();
          console.log("[SpeechRecognition] ⏸️ Stopped recognition to change language");
        } catch (e) {
          // Ignore errors if already stopped
        }
      }
      
      try {
        // Try primary language code first
        this.recognition.lang = primaryLangCode;
        console.log("[SpeechRecognition] ✅ Language updated to", this.recognition.lang);
        
        // Reset network error count when language is changed
        this.networkErrorCount = 0;
        
        // For Urdu, ensure optimal settings
        if (language === "urdu") {
          console.log("[SpeechRecognition] 🔍 Urdu recognition configured:", {
            primaryCode: primaryLangCode,
            fallbacks: langCodes.slice(1),
            note: "If network errors occur, system will automatically try fallback codes",
            continuous: this.recognition.continuous,
            interimResults: this.recognition.interimResults,
          });
          
          // Ensure continuous mode is enabled for Urdu (critical for smooth recognition)
          if (!this.recognition.continuous) {
            this.recognition.continuous = true;
            console.log("[SpeechRecognition] ✅ Enabled continuous mode for Urdu");
          }
          
          // Ensure interim results are enabled
          if (!this.recognition.interimResults) {
            this.recognition.interimResults = true;
            console.log("[SpeechRecognition] ✅ Enabled interim results for Urdu");
          }
        }
        
        // Restart recognition if it was running
        if (wasListening) {
          setTimeout(() => {
            if (this.isListening) {
              try {
                this.recognition.start();
                console.log("[SpeechRecognition] ✅ Restarted recognition with new language");
              } catch (restartError) {
                console.error("[SpeechRecognition] ❌ Failed to restart after language change:", restartError);
              }
            }
          }, 100);
        }
      } catch (error: any) {
        console.warn("[SpeechRecognition] ⚠️ Failed to set primary language code, trying fallback...", error);
        // Try fallback if primary fails
        if (langCodes.length > 1) {
          try {
            this.recognition.lang = langCodes[1];
            this.currentLanguageFallbackIndex = 1;
            console.log("[SpeechRecognition] ✅ Fallback language code set:", langCodes[1]);
            this.networkErrorCount = 0;
            
            // Restart if was listening
            if (wasListening) {
              setTimeout(() => {
                if (this.isListening) {
                  try {
                    this.recognition.start();
                  } catch (restartError) {
                    console.error("[SpeechRecognition] ❌ Failed to restart with fallback");
                  }
                }
              }, 100);
            }
          } catch (fallbackError) {
            console.error("[SpeechRecognition] ❌ All language codes failed for", language);
          }
        }
      }
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

