import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import '@/App.css';
import HomePage from './pages/HomePage';
import ModulesPage from './pages/ModulesPage';
import ChatPage from './pages/ChatPage';
import CreativeToolsPage from './pages/CreativeToolsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import BottomNav from './components/BottomNav';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language.split('-')[0];
    setLanguage(browserLang);
    
    // Simulate initial loading
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <div className="App min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <BrowserRouter>
          <div className="pb-20">
            <Routes>
              <Route path="/" element={<HomePage language={language} />} />
              <Route path="/modules" element={<ModulesPage language={language} />} />
              <Route path="/chat" element={<ChatPage language={language} />} />
              <Route path="/creative" element={<CreativeToolsPage language={language} />} />
              <Route path="/profile" element={<ProfilePage language={language} />} />
              <Route path="/settings" element={<SettingsPage language={language} setLanguage={setLanguage} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <BottomNav />
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  );
}

export default App;