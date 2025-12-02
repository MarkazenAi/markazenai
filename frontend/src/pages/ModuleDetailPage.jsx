import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import HologramLogo from '../components/HologramLogo';
import { ArrowLeft, Sparkles, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ModuleDetailPage = ({ language }) => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchModule();
  }, [moduleId]);

  const fetchModule = async () => {
    try {
      const response = await axios.get(`${API}/modules`);
      const foundModule = response.data.modules.find(m => m.id === moduleId);
      setModule(foundModule);
    } catch (error) {
      console.error('Failed to fetch module:', error);
    }
  };

  const handleExecute = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setResult('');

    try {
      const response = await axios.post(`${API}/modules/execute`, {
        module_id: moduleId,
        input_text: inputText,
        language: language
      });

      setResult(response.data.result);
    } catch (error) {
      console.error('Module execution error:', error);
      setResult('Sorry, an error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <HologramLogo size="normal" animate />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pb-24" data-testid="module-detail-page">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-up">
          <button
            onClick={() => navigate('/modules')}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4 flex-1">
            <div className="text-4xl">{module.icon}</div>
            <div>
              <h1 className="text-4xl font-bold nova-hero-title tracking-tight">{module.name}</h1>
              <p className="text-gray-400 nova-subtitle text-sm capitalize">{module.category}</p>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <GlassCard neon className="mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Input
          </h2>
          <Textarea
            placeholder={`Enter your ${module.name.toLowerCase()} input...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full min-h-[150px] bg-white/5 border-white/10 text-white placeholder:text-gray-400 rounded-xl p-4 resize-none"
            data-testid="module-input"
          />
          <div className="mt-4 flex gap-2">
            <NeonButton
              onClick={handleExecute}
              disabled={loading || !inputText.trim()}
              className="flex items-center gap-2"
              data-testid="execute-button"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Processing...' : 'Execute'}
            </NeonButton>
            <NeonButton
              variant="glass"
              onClick={() => setInputText('')}
              disabled={loading}
            >
              Clear
            </NeonButton>
          </div>
        </GlassCard>

        {/* Result Section */}
        {(result || loading) && (
          <GlassCard className="animate-fade-up">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Result
            </h2>
            {loading ? (
              <div className="flex items-center gap-3 py-8">
                <HologramLogo size="mini" animate />
                <div>
                  <div className="flex gap-2 mb-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <p className="text-gray-400 text-sm">AI is processing...</p>
                </div>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-200 whitespace-pre-wrap">{result}</p>
              </div>
            )}
          </GlassCard>
        )}

        {/* Module Info */}
        <GlassCard className="mt-6">
          <h3 className="text-lg font-semibold mb-3">About This Module</h3>
          <p className="text-gray-300 mb-4">
            The <span className="text-purple-400 font-semibold">{module.name}</span> module uses advanced AI to help you with {module.category}-related tasks.
          </p>
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400">
              {module.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-xs text-purple-300">
              AI-Powered
            </span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ModuleDetailPage;
