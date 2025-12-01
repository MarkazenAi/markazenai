import React from 'react';
import { cn } from '@/lib/utils';

const GlassCard = ({ 
  children, 
  className, 
  neon = false, 
  hover = true,
  onClick,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "relative backdrop-blur-xl bg-white/5 border border-white/10",
        "rounded-2xl p-6 transition-all duration-300",
        hover && "hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] hover:shadow-2xl",
        neon && "shadow-[0_0_30px_rgba(123,47,255,0.3)]",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {neon && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-xl -z-10" />
      )}
      {children}
    </div>
  );
};

export default GlassCard;
