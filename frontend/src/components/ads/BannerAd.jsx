import React, { useEffect, useState } from 'react';
import { useAds } from './AdManager';
import GlassCard from '../GlassCard';

const BannerAd = ({ position = 'below_ai_dashboard_button' }) => {
  const { setBannerLoaded, getActiveAds } = useAds();
  const [loading, setLoading] = useState(true);
  const [adContent, setAdContent] = useState(null);

  useEffect(() => {
    const activeAds = getActiveAds();
    if (!activeAds.includes('banner_home')) {
      return;
    }

    // Simulate ad loading
    const timer = setTimeout(() => {
      setAdContent({
        title: 'Nova Q7 Premium',
        description: 'Upgrade to unlock unlimited AI conversations',
        cta: 'Learn More'
      });
      setLoading(false);
      setBannerLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [setBannerLoaded, getActiveAds]);

  if (loading) {
    return (
      <div className="w-full h-[110px] rounded-[18px] bg-[#0D1117] flex items-center justify-center">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  if (!adContent) return null;

  return (
    <GlassCard 
      className="w-full h-[110px] rounded-[18px] bg-[#0D1117] p-6 flex items-center justify-between shadow-lg"
      data-testid="banner-ad"
    >
      <div className="flex-1">
        <h3 className="text-lg font-bold mb-1 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          {adContent.title}
        </h3>
        <p className="text-sm text-gray-400">{adContent.description}</p>
      </div>
      <button 
        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium rounded-xl hover:scale-105 transition-transform"
        onClick={() => console.log('Ad clicked')}
      >
        {adContent.cta}
      </button>
    </GlassCard>
  );
};

export default BannerAd;