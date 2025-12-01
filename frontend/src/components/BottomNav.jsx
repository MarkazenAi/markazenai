import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Grid3x3, MessageSquare, Sparkles, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', icon: Home, label: 'Home', path: '/' },
    { id: 'modules', icon: Grid3x3, label: 'Modules', path: '/modules' },
    { id: 'chat', icon: MessageSquare, label: 'Chat', path: '/chat' },
    { id: 'creative', icon: Sparkles, label: 'Creative', path: '/creative' },
    { id: 'profile', icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50" data-testid="bottom-nav">
      <div className="backdrop-blur-xl bg-black/30 border-t border-white/10">
        <div className="flex justify-around items-center py-2 px-4 max-w-2xl mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                data-testid={`nav-${item.id}`}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-300",
                  isActive 
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400" 
                    : "text-gray-400 hover:text-white"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "animate-pulse")} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 w-12 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;