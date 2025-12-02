import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import GlassCard from '../GlassCard';

const InterstitialAd = ({ adId, onClose }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onClose();
    }
  }, [countdown, onClose]);

  const adContent = {
    full_chat_open: {
      title: 'Nova Q7 AI Chat',
      description: 'Experience unlimited conversations with 24 specialized AI agents',
      cta: 'Continue to Chat'
    },
    full_generate: {
      title: 'Boost Your Productivity',
      description: 'Unlock advanced AI modules for faster content generation',
      cta: 'Continue'
    }
  };

  const content = adContent[adId] || adContent.full_chat_open;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      data-testid="interstitial-ad"
    >
      <GlassCard className="relative max-w-lg w-full mx-4 p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          data-testid="close-interstitial"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
              <span className="text-4xl">🚀</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {content.title}
          </h2>
          <p className="text-gray-300 mb-6">
            {content.description}
          </p>

          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform mb-3"
            data-testid="interstitial-cta"
          >
            {content.cta}
          </button>

          <p className="text-xs text-gray-500">
            Auto-closing in {countdown}s
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default InterstitialAd;