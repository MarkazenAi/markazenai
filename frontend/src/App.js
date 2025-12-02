import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import '@/App.css';
import HomePage from './pages/HomePage';
import ModulesPage from './pages/ModulesPage';
import ModuleDetailPage from './pages/ModuleDetailPage';
import ChatPage from './pages/ChatPage';
import CreativeToolsPage from './pages/CreativeToolsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import BottomNav from './components/BottomNav';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import { AdProvider } from './components/ads/AdManager';
import InterstitialAd from './components/ads/InterstitialAd';
import RewardedAd from './components/ads/RewardedAd';
import { useAds } from './components/ads/AdManager';

function AppContent() {
  const [language, setLanguage] = useState(() => {
    return navigator.language.split('-')[0];
  });

  return (
    <ErrorBoundary>
      <div className="App min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <BrowserRouter>
          <AdAwareRoutes language={language} setLanguage={setLanguage} />
          <BottomNav />
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  );
}

function AdAwareRoutes({ language, setLanguage }) {
  const { interstitialActive, rewardedActive, closeInterstitial } = useAds();

  const handleCloseInterstitial = () => {
    closeInterstitial(() => {
      console.log('Interstitial closed');
    });
  };

  return (
    <>
      <div className="pb-20">
        <Routes>
          <Route path="/" element={<HomePage language={language} />} />
          <Route path="/modules" element={<ModulesPage language={language} />} />
          <Route path="/modules/:moduleId" element={<ModuleDetailPage language={language} />} />
          <Route path="/chat" element={<ChatPage language={language} />} />
          <Route path="/creative" element={<CreativeToolsPage language={language} />} />
          <Route path="/profile" element={<ProfilePage language={language} />} />
          <Route path="/settings" element={<SettingsPage language={language} setLanguage={setLanguage} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {interstitialActive && (
        <InterstitialAd 
          adId={interstitialActive} 
          onClose={handleCloseInterstitial} 
        />
      )}

      {rewardedActive && (
        <RewardedAd 
          adId={rewardedActive}
          onSuccess={() => console.log('Reward granted')}
          onFail={() => console.log('Ad failed')}
          onClose={() => closeInterstitial()}
        />
      )}
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AdProvider>
      <AppContent />
    </AdProvider>
  );
}

export default App;