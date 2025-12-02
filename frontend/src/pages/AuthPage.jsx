import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import HologramLogo from '../components/HologramLogo';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AuthPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/user/login' : '/user/register';
      const payload = mode === 'login' 
        ? { email, password }
        : { email, password, name };

      const response = await axios.post(`${API}${endpoint}`, payload);

      if (response.data.success) {
        // Store user info in localStorage
        localStorage.setItem('nova_user', JSON.stringify(response.data.user));
        navigate('/profile');
      } else {
        setError(response.data.error || 'Bir hata oluştu');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 pb-24 flex items-center justify-center" data-testid="auth-page">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-6 animate-fade-up">
          <HologramLogo size="large" animate />
        </div>

        {/* Title */}
        <div className="text-center mb-8 animate-fade-up">
          <h1 className="text-4xl font-bold mb-2 nova-hero-title tracking-tight">
            {mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
          </h1>
          <p className="text-gray-400 nova-subtitle">
            Nova Q7 AI platformuna hoş geldin
          </p>
        </div>

        {/* Form */}
        <GlassCard neon className="animate-fade-up">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  İsim
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adınız Soyadınız"
                  required
                  className="w-full bg-white/5 border-white/10 text-white h-12 rounded-xl"
                  data-testid="name-input"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                E-posta
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                required
                className="w-full bg-white/5 border-white/10 text-white h-12 rounded-xl"
                data-testid="email-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Şifre
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-white/5 border-white/10 text-white h-12 rounded-xl"
                data-testid="password-input"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
                {error}
              </div>
            )}

            <NeonButton
              type="submit"
              disabled={loading}
              className="w-full"
              data-testid="submit-button"
            >
              {loading ? 'İşleniyor...' : (mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol')}
            </NeonButton>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
              className="text-purple-400 hover:text-purple-300 transition-colors"
              data-testid="toggle-mode"
            >
              {mode === 'login' 
                ? 'Hesabın yok mu? Kayıt ol' 
                : 'Zaten hesabın var mı? Giriş yap'}
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default AuthPage;
