import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HologramLogo from '../components/HologramLogo';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import BannerAd from '../components/ads/BannerAd';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MessageSquare, Grid3x3, TrendingUp, Zap, Globe } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = ({ language }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ agents: 24, modules: 32, languages: 75 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/`);
      if (response.data) {
        setStats({
          agents: response.data.agents || 24,
          modules: response.data.modules || 32,
          languages: 75
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { id: 'chat', icon: MessageSquare, label: 'AI Chat & Voice', path: '/chat', color: 'from-cyan-500 to-blue-500' },
    { id: 'modules', icon: Grid3x3, label: 'Smart AI Modules', path: '/modules', color: 'from-purple-500 to-pink-500' },
    { id: 'creative', icon: Sparkles, label: 'Creative Intelligence', path: '/creative', color: 'from-pink-500 to-rose-500' },
  ];

  const features = [
    { icon: Zap, title: '120 FPS', subtitle: 'Ultra-Smooth UI', value: stats.agents },
    { icon: TrendingUp, title: `${stats.agents} Autonomous AI Agents`, subtitle: 'Multi-agent architecture', value: stats.modules },
    { icon: Globe, title: `${stats.languages} Languages`, subtitle: 'Global Mode', value: stats.languages },
  ];

  return (
    <div className="min-h-screen p-6 pb-24" data-testid="home-page">
      {/* Header with Logo */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 mt-8 animate-fade-up">
          <div className="flex justify-center mb-6">
            <HologramLogo size="large" animate={true} />
          </div>
          <h1 className="text-7xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent nova-hero-title tracking-tight">
            Nova Q7
          </h1>
          <p className="text-2xl font-medium text-gray-200 mb-4 nova-hero-subtitle tracking-tight">
            Faster. Smarter. Global.
          </p>
          <p className="text-sm text-gray-400 nova-hero-details">
            24 AI Agents • 30+ Modules • 75 Languages · HoloUI v7 · Quantum-Grade Design
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-3 text-center nova-section-title tracking-tight">
            Begin Your Intelligent Journey
          </h2>
          <p className="text-center text-gray-300 mb-8 max-w-3xl mx-auto nova-section-sub text-base">
            Experience holographic UI, multi-agent architecture, and next-generation AI tools.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <GlassCard
                  key={action.id}
                  neon
                  hover
                  onClick={() => navigate(action.path)}
                  data-testid={`quick-action-${action.id}`}
                  className="cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center py-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${action.color} mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold nova-card-title">{action.label}</h3>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <GlassCard key={index} className="text-center" data-testid={`feature-${index}`}>
                <Icon className="w-12 h-12 mx-auto mb-3 text-cyan-400" />
                <h3 className="text-2xl font-semibold mb-1 nova-stat-title">{feature.title}</h3>
                <p className="text-gray-400 text-sm nova-stat-subtitle">{feature.subtitle}</p>
              </GlassCard>
            );
          })}
        </div>

        {/* CTA Section */}
        <GlassCard neon className="text-center p-12">
          <h2 className="text-4xl font-bold mb-4 nova-cta-title tracking-tight">Ready to Explore?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto nova-cta-sub text-base">
            Powered by Nova Q7 Core — faster, smarter, global.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NeonButton
              variant="primary"
              size="lg"
              onClick={() => navigate('/chat')}
              data-testid="cta-chat-button"
            >
              Start with AI
            </NeonButton>
            <NeonButton
              variant="glass"
              size="lg"
              onClick={() => navigate('/modules')}
              data-testid="cta-modules-button"
            >
              Explore Modules
            </NeonButton>
          </div>
        </GlassCard>

        {/* Banner Ad - Below AI Dashboard Button */}
        <div className="mt-8">
          <BannerAd position="below_ai_dashboard_button" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;