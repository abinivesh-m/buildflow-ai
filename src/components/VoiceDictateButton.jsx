import React from "react";
import { Mic, MicOff, AlertCircle } from "lucide-react";
import { useVoiceDictation } from "../hooks/useVoiceDictation.js";

/**
 * VoiceDictateButton
 * Accessible, compact microphone control for any input field or textarea.
 * Shows true audio volume level in real-time when listening.
 */
export default function VoiceDictateButton({
  onAppend,
  onReplace,
  currentValue = "",
  label = "Dictate",
  title = "Click to speak with microphone (Wispr Flow native / Web Speech)",
  size = "sm",
  sampleFallbackText = "",
  onNotify,
}) {
  const handleTranscript = (fullText, finalText) => {
    const textToInsert = finalText || fullText;
    if (!textToInsert) return;

    if (onReplace) {
      onReplace(textToInsert);
    } else if (onAppend) {
      const space = currentValue && !currentValue.endsWith(" ") ? " " : "";
      onAppend(currentValue + space + textToInsert);
    }
  };

  const handleError = (errMsg) => {
    if (onNotify) {
      onNotify(`🎙️ ${errMsg}`);
    }
  };

  const {
    isListening,
    audioLevel,
    isSupported,
    startListening,
    stopListening,
  } = useVoiceDictation({
    onTranscript: handleTranscript,
    onError: handleError,
  });

  const toggleRecording = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSupported) {
      if (sampleFallbackText && (onAppend || onReplace)) {
        if (onReplace) onReplace(sampleFallbackText);
        else onAppend(currentValue ? `${currentValue} ${sampleFallbackText}` : sampleFallbackText);
        if (onNotify) onNotify("Sample dictated text inserted (browser speech API not supported).");
      } else if (onNotify) {
        onNotify("Browser speech API unavailable. Use Wispr Flow desktop shortcut (Ctrl+Opt) to dictate directly.");
      }
      return;
    }

    if (isListening) {
      stopListening();
      if (onNotify) onNotify("Voice dictation stopped.");
    } else {
      startListening();
      if (onNotify) onNotify("🎙️ Listening... Speak naturally.");
    }
  };

  // Compute bar height based on real microphone audioLevel (0-100)
  const barHeight1 = Math.max(3, Math.min(14, 3 + (audioLevel * 0.11)));
  const barHeight2 = Math.max(4, Math.min(16, 4 + (audioLevel * 0.14)));
  const barHeight3 = Math.max(5, Math.min(18, 5 + (audioLevel * 0.16)));
  const barHeight4 = Math.max(3, Math.min(14, 3 + (audioLevel * 0.1)));

  return (
    <button
      type="button"
      className={`voice-dictate-btn ${isListening ? "listening" : ""} ${size === "xs" ? "btn-xs" : "btn-sm"}`}
      onClick={toggleRecording}
      title={isListening ? "Listening... Click to stop" : title}
      aria-label={isListening ? "Stop voice dictation" : "Start voice dictation"}
      aria-pressed={isListening}
    >
      {isListening ? (
        <span className="voice-active-wrapper">
          <span className="voice-mic-icon active">
            <Mic size={13} />
          </span>
          {/* Real Audio-reactive Waveform Equalizer */}
          <span className="voice-equalizer-bars" aria-hidden="true">
            <span className="eq-bar" style={{ height: `${barHeight1}px` }} />
            <span className="eq-bar" style={{ height: `${barHeight2}px` }} />
            <span className="eq-bar" style={{ height: `${barHeight3}px` }} />
            <span className="eq-bar" style={{ height: `${barHeight4}px` }} />
          </span>
          <span className="voice-listening-text">Listening...</span>
        </span>
      ) : (
        <span className="voice-idle-wrapper">
          <Mic size={13} className="voice-mic-icon" />
          {label && <span className="voice-btn-label">{label}</span>}
        </span>
      )}
    </button>
  );
}
