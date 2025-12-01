import React from 'react';
import { cn } from '@/lib/utils';

const NeonButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className,
  disabled = false,
  ...props 
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 shadow-[0_0_20px_rgba(123,47,255,0.5)]",
    secondary: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-[0_0_20px_rgba(255,0,110,0.5)]",
    glass: "bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-xl",
    outline: "bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button
      className={cn(
        "relative font-semibold rounded-xl transition-all duration-300",
        "hover:scale-105 active:scale-95",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default NeonButton;
