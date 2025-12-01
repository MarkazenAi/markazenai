import React from 'react';
import './HologramLogo.css';

const HologramLogo = ({ size = 'normal', animate = true }) => {
  const sizes = {
    mini: 'w-8 h-8',
    small: 'w-16 h-16',
    normal: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  return (
    <div className={`hologram-logo ${sizes[size]} ${animate ? 'animate' : ''}`} data-testid="hologram-logo">
      <div className="hologram-core">
        <div className="hologram-ring ring-1"></div>
        <div className="hologram-ring ring-2"></div>
        <div className="hologram-ring ring-3"></div>
        <div className="hologram-center">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f2ff" />
                <stop offset="50%" stopColor="#7b2fff" />
                <stop offset="100%" stopColor="#ff006e" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <circle cx="50" cy="50" r="35" fill="none" stroke="url(#logoGradient)" strokeWidth="3" filter="url(#glow)" />
            <path d="M 35 35 L 50 50 L 65 35 M 50 50 L 50 70 M 40 60 L 50 70 L 60 60" 
                  stroke="url(#logoGradient)" strokeWidth="3" fill="none" strokeLinecap="round" filter="url(#glow)" />
          </svg>
        </div>
      </div>
      <div className="hologram-glow"></div>
    </div>
  );
};

export default HologramLogo;
