import React, { createContext, useContext, useState, useEffect } from 'react';

// Ad Manager Context
const AdContext = createContext(null);

export const useAds = () => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAds must be used within AdProvider');
  }
  return context;
};

// Ad frequency tracking
const AD_STORAGE_KEY = 'nova_q7_ad_tracking';

const getAdTracking = () => {
  try {
    const data = localStorage.getItem(AD_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const setAdTracking = (adId, timestamp) => {
  try {
    const tracking = getAdTracking();
    tracking[adId] = timestamp;
    localStorage.setItem(AD_STORAGE_KEY, JSON.stringify(tracking));
  } catch (e) {
    console.error('Failed to save ad tracking:', e);
  }
};

const canShowAd = (adId, frequency) => {
  if (frequency === 'once_per_action') return true;
  
  const tracking = getAdTracking();
  const lastShown = tracking[adId];
  
  if (!lastShown) return true;
  
  if (frequency === 'once_per_day') {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return lastShown < oneDayAgo;
  }
  
  return true;
};

// Session tracking for revenue optimization
const getSessionCount = () => {
  try {
    const count = sessionStorage.getItem('nova_q7_session_count');
    return count ? parseInt(count, 10) : 1;
  } catch {
    return 1;
  }
};

const incrementSessionCount = () => {
  try {
    const count = getSessionCount();
    sessionStorage.setItem('nova_q7_session_count', (count + 1).toString());
  } catch (e) {
    console.error('Failed to increment session:', e);
  }
};

export const AdProvider = ({ children }) => {
  const [adState, setAdState] = useState({
    bannerLoaded: false,
    interstitialActive: null,
    rewardedActive: false,
    sessionCount: getSessionCount(),
  });

  useEffect(() => {
    incrementSessionCount();
  }, []);

  const showInterstitial = (adId, frequency, onClose) => {
    if (!canShowAd(adId, frequency)) {
      if (onClose) onClose();
      return;
    }

    setAdState(prev => ({ ...prev, interstitialActive: adId }));
    setAdTracking(adId, Date.now());

    // Auto-close after 5 seconds or on user action
    const timer = setTimeout(() => {
      setAdState(prev => ({ ...prev, interstitialActive: null }));
      if (onClose) onClose();
    }, 5000);

    return () => clearTimeout(timer);
  };

  const closeInterstitial = (callback) => {
    setAdState(prev => ({ ...prev, interstitialActive: null }));
    if (callback) callback();
  };

  const showRewarded = (adId, onSuccess, onFail) => {
    setAdState(prev => ({ ...prev, rewardedActive: adId }));

    // Simulate ad loading and reward
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      setAdState(prev => ({ ...prev, rewardedActive: false }));
      
      if (success && onSuccess) {
        onSuccess();
      } else if (!success && onFail) {
        onFail();
      }
    }, 3000);
  };

  const setBannerLoaded = (loaded) => {
    setAdState(prev => ({ ...prev, bannerLoaded: loaded }));
  };

  const getActiveAds = () => {
    const { sessionCount } = adState;
    
    // Revenue optimization rules
    if (sessionCount >= 1 && sessionCount <= 3) {
      return ['banner_home', 'full_chat_open'];
    } else if (sessionCount >= 4) {
      return ['banner_home', 'reward_voice'];
    }
    
    return ['banner_home'];
  };

  const value = {
    ...adState,
    showInterstitial,
    closeInterstitial,
    showRewarded,
    setBannerLoaded,
    getActiveAds,
    canShowAd: (adId, frequency) => canShowAd(adId, frequency),
  };

  return <AdContext.Provider value={value}>{children}</AdContext.Provider>;
};
