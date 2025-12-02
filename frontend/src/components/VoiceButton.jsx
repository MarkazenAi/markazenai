import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

const VoiceButton = ({ onVoiceInput, disabled = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const startVoiceRecognition = () => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Tarayıcınız ses tanıma özelliğini desteklemiyor. Chrome veya Edge kullanmanızı öneririz.');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = 'tr-TR';
    recognitionInstance.interimResults = false;
    recognitionInstance.maxAlternatives = 1;

    recognitionInstance.onstart = () => {
      setIsListening(true);
    };

    recognitionInstance.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onVoiceInput) {
        onVoiceInput(transcript);
      }
      setIsListening(false);
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        alert('Mikrofon izinleri kapalı. Lütfen tarayıcı ayarlarından mikrofon erişimini aktif edin.');
      } else if (event.error === 'no-speech') {
        alert('Ses algılanamadı. Lütfen tekrar deneyin.');
      } else {
        alert('Ses tanıma hatası. Lütfen tekrar deneyin.');
      }
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);
    recognitionInstance.start();
  };

  const stopVoiceRecognition = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <button
      onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
      disabled={disabled}
      className={`voice-button ${isListening ? 'listening' : ''}`}
      data-testid="voice-button"
      title={isListening ? 'Dinleniyor...' : 'Sesli komut'}
      style={{
        width: '46px',
        height: '46px',
        borderRadius: '14px',
        border: 'none',
        background: isListening 
          ? 'linear-gradient(135deg, #ff006e, #ff5722)' 
          : 'linear-gradient(135deg, #6f00ff, #00d4ff)',
        color: 'white',
        fontSize: '20px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        opacity: disabled ? 0.5 : 1,
        animation: isListening ? 'pulse 1.5s infinite' : 'none'
      }}
    >
      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
    </button>
  );
};

export default VoiceButton;
