import React, { useState, useEffect } from 'react';
import { Gift, X } from 'lucide-react';
import GlassCard from '../GlassCard';

const RewardedAd = ({ adId, onSuccess, onFail, onClose }) => {
  const [stage, setStage] = useState('intro'); // intro, loading, success, fail
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (stage === 'loading') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // 90% success rate
            const success = Math.random() > 0.1;
            setStage(success ? 'success' : 'fail');
            setTimeout(() => {
              if (success && onSuccess) onSuccess();
              if (!success && onFail) onFail();
              onClose();
            }, 2000);
            return 100;
          }
          return prev + 2;
        });
      }, 60);

      return () => clearInterval(interval);
    }
  }, [stage, onSuccess, onFail, onClose]);

  const handleWatch = () => {
    setStage('loading');
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      data-testid="rewarded-ad"
    >
      <GlassCard className="relative max-w-lg w-full mx-4 p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          data-testid="close-rewarded"
        >
          <X className="w-6 h-6" />
        </button>

        {stage === 'intro' && (
          <div className="text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                <Gift className="w-10 h-10 text-white" />
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Unlock Voice Chat
            </h2>
            <p className="text-gray-300 mb-6">
              Watch a short ad to unlock voice chat features for free!
            </p>

            <button
              onClick={handleWatch}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform"
              data-testid="watch-ad-btn"
            >
              Watch Ad & Unlock
            </button>
          </div>
        )}

        {stage === 'loading' && (
          <div className="text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center animate-pulse">
                <span className="text-4xl">📺</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Loading Ad...</h2>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400">{progress}%</p>
          </div>
        )}

        {stage === 'success' && (
          <div className="text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                <span className="text-4xl">✅</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-green-400">Unlocked!</h2>
            <p className="text-gray-300">Voice chat is now available</p>
          </div>
        )}

        {stage === 'fail' && (
          <div className="text-center">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 flex items-center justify-center">
                <span className="text-4xl">❌</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-red-400">Ad Failed to Load</h2>
            <p className="text-gray-300 mb-4">Please try again later</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default RewardedAd;