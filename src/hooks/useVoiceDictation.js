import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useVoiceDictation
 * Production Web Speech API hook with real AudioContext microphone volume tracking.
 * Provides live speech recognition, real waveform level (0-100), and graceful fallbacks.
 */
export function useVoiceDictation({ onTranscript, onError } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [audioLevel, setAudioLevel] = useState(0); // 0 - 100 real microphone level
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const animFrameRef = useRef(null);

  // Check Web Speech API support
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  // Cleanup audio tracks on unmount
  const stopAudioTracking = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try {
        audioContextRef.current.close();
      } catch (_e) {
        // ignore
      }
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  // Start real AudioContext microphone volume analyzer
  const startAudioTracking = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.5;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Compute average volume level
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        // Normalize 0 to 100 with sensitivity scaling
        const scaled = Math.min(100, Math.round((avg / 128) * 100));
        setAudioLevel(scaled);

        animFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (_err) {
      // Audio level tracking is optional progressive enhancement
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    stopAudioTracking();
    setIsListening(false);
  }, [stopAudioTracking]);

  const startListening = useCallback(
    (customCallback) => {
      setError(null);
      setTranscript("");
      setInterimTranscript("");

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        const err =
          "Web Speech API is not supported in this browser. Please use Chrome, Edge, Safari, or Wispr Flow system-wide dictation.";
        setError(err);
        if (onError) onError(err);
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setIsListening(true);
          startAudioTracking();
        };

        recognition.onresult = (event) => {
          let currentFinal = "";
          let currentInterim = "";

          for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              currentFinal += result[0].transcript;
            } else {
              currentInterim += result[0].transcript;
            }
          }

          const fullText = (currentFinal + " " + currentInterim).trim();
          setTranscript(fullText);
          setInterimTranscript(currentInterim);

          if (customCallback) {
            customCallback(fullText, currentFinal);
          } else if (onTranscript) {
            onTranscript(fullText, currentFinal);
          }
        };

        recognition.onerror = (event) => {
          let msg = "Microphone error: " + event.error;
          if (event.error === "not-allowed") {
            msg =
              "Microphone permission was denied. Please allow microphone access in your browser address bar.";
          } else if (event.error === "no-speech") {
            msg = "No speech detected. Listening timed out.";
          }
          setError(msg);
          if (onError) onError(msg);
          stopListening();
        };

        recognition.onend = () => {
          setIsListening(false);
          stopAudioTracking();
        };

        recognition.start();
      } catch (err) {
        const msg = "Unable to start speech recognition: " + err.message;
        setError(msg);
        if (onError) onError(msg);
        stopListening();
      }
    },
    [onTranscript, onError, startAudioTracking, stopListening]
  );

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    isListening,
    transcript,
    interimTranscript,
    audioLevel,
    error,
    isSupported,
    startListening,
    stopListening,
  };
}
