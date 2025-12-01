import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HologramLogo from '../components/HologramLogo';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MessageSquare, Grid3x3, TrendingUp, Zap, Globe } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = ({ language }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ agents: 24, modules: 32, languages: 67 });
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
          languages: response.data.languages || 67
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { id: 'chat', icon: MessageSquare, label: 'Start Chat', path: '/chat', color: 'from-cyan-500 to-blue-500' },
    { id: 'modules', icon: Grid3x3, label: 'AI Modules', path: '/modules', color: 'from-purple-500 to-pink-500' },
    { id: 'creative', icon: Sparkles, label: 'Creative Tools', path: '/creative', color: 'from-pink-500 to-rose-500' },
  ];

  const features = [
    { icon: Zap, title: '120 FPS', subtitle: 'Ultra-smooth animations', value: stats.agents },
    { icon: TrendingUp, title: `${stats.agents} AI Agents`, subtitle: 'Specialized experts', value: stats.modules },
    { icon: Globe, title: `${stats.languages} Languages`, subtitle: 'Global support', value: stats.languages },
  ];

  return (
    <div className="min-h-screen p-6 pb-24" data-testid="home-page">
      {/* Header with Logo */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 mt-8">
          <div className="flex justify-center mb-6">
            <HologramLogo size="large" animate={true} />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            HoloUI Platform
          </h1>
          <p className="text-xl text-gray-300">
            Next-Generation AI Multi-Agent System
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
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
                  <h3 className="text-xl font-semibold">{action.label}</h3>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <GlassCard key={index} className="text-center" data-testid={`feature-${index}`}>
                <Icon className="w-12 h-12 mx-auto mb-3 text-cyan-400" />
                <h3 className="text-2xl font-bold mb-1">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.subtitle}</p>
              </GlassCard>
            );
          })}
        </div>

        {/* CTA Section */}
        <GlassCard neon className="text-center p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Experience the power of 24 specialized AI agents, 30+ intelligent modules, and support for 65+ languages.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NeonButton
              variant="primary"
              size="lg"
              onClick={() => navigate('/chat')}
              data-testid="cta-chat-button"
            >
              Start Chatting
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
      </div>
    </div>
  );
};

export default HomePage;