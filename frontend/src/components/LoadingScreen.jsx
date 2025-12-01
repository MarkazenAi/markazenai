import React from 'react';
import HologramLogo from './HologramLogo';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center z-50" data-testid="loading-screen">
      <HologramLogo size="large" animate={true} />
      <div className="mt-8 text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent nova-hero-title tracking-tight">
        Nova Q7
      </div>
      <div className="mt-3 text-lg font-medium text-gray-300 nova-hero-subtitle tracking-tight">
        Faster. Smarter. Global.
      </div>
      <div className="mt-4 flex space-x-2">
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default LoadingScreen;