import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import HologramLogo from '../components/HologramLogo';
import { User, Mail, Globe, Calendar, TrendingUp, MessageSquare, Sparkles } from 'lucide-react';

const ProfilePage = ({ language }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('nova_user');
    if (!user) {
      navigate('/auth');
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      setProfile({
        name: userData.name || 'AI Explorer',
        email: userData.email,
        avatar: null,
        language: language || 'en',
        joinedDate: userData.created_at 
          ? new Date(userData.created_at).toLocaleDateString('tr-TR') 
          : new Date().toLocaleDateString('tr-TR'),
        stats: {
          conversations: 127,
          modulesUsed: 18,
          hoursActive: 45
        }
      });
    } catch (e) {
      console.error('Error loading user data:', e);
    } finally {
      setLoading(false);
    }
  }, [navigate, language]);

  const handleLogout = () => {
    localStorage.removeItem('nova_user');
    navigate('/auth');
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <HologramLogo size="normal" animate />
      </div>
    );
  };

  const stats = [
    { icon: MessageSquare, label: 'Conversations', value: profile.stats.conversations, color: 'text-cyan-400' },
    { icon: Sparkles, label: 'Modules Used', value: profile.stats.modulesUsed, color: 'text-purple-400' },
    { icon: TrendingUp, label: 'Hours Active', value: profile.stats.hoursActive, color: 'text-pink-400' },
  ];

  return (
    <div className="min-h-screen p-6 pb-24" data-testid="profile-page">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-up">
          <HologramLogo size="small" animate />
          <div>
            <h1 className="text-4xl font-bold nova-hero-title tracking-tight">Your AI Control Center</h1>
            <p className="text-gray-400 nova-subtitle text-sm">Your Nova Q7 Journey</p>
          </div>
        </div>

        {/* Profile Card */}
        <GlassCard neon className="mb-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 flex items-center justify-center mb-4">
              <User className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2 nova-profile-name tracking-tight" data-testid="profile-name">{profile.name}</h2>
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Mail className="w-4 h-4" />
              <span data-testid="profile-email" className="nova-profile-email">{profile.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <Calendar className="w-4 h-4" />
              <span className="nova-profile-joined">Joined {profile.joinedDate}</span>
            </div>
            <NeonButton
              variant="glass"
              onClick={() => setEditing(!editing)}
              data-testid="edit-profile-button"
            >
              {editing ? 'Save Profile' : 'Edit Profile'}
            </NeonButton>
          </div>
        </GlassCard>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <GlassCard key={index} className="text-center" data-testid={`stat-${index}`}>
                <Icon className={`w-12 h-12 mx-auto mb-3 ${stat.color}`} />
                <p className="text-3xl font-bold mb-1 nova-stat-value tracking-tight">{stat.value}</p>
                <p className="text-sm text-gray-400 nova-stat-label">{stat.label}</p>
              </GlassCard>
            );
          })}
        </div>

        {/* Language Preference */}
        <GlassCard>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1 nova-setting-title">Language Preference</h3>
              <p className="text-sm text-gray-400 nova-setting-desc">Currently set to: {profile.language.toUpperCase()}</p>
            </div>
            <NeonButton variant="glass" size="sm" data-testid="change-language-button">
              Change
            </NeonButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ProfilePage;