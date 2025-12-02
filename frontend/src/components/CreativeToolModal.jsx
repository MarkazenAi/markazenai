import React, { useState } from 'react';
import axios from 'axios';
import { X, Send, Sparkles, Download } from 'lucide-react';
import GlassCard from './GlassCard';
import NeonButton from './NeonButton';
import HologramLogo from './HologramLogo';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CreativeToolModal = ({ tool, onClose, language }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExecute = async () => {
    if (!input.trim()) {
      setError('Lütfen bir girdi sağlayın');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await axios.post(`${API}/creative/${tool.id}`, {
        input: input,
        language: language || 'tr',
        provider: 'openai',
        model: 'gpt-5-mini'
      });

      if (response.data.success !== false) {
        // Handle different response types
        if (response.data.image_base64) {
          setResult({ type: 'image', data: response.data.image_base64 });
        } else if (response.data.audio_base64) {
          setResult({ type: 'audio', data: response.data.audio_base64 });
        } else if (response.data.result) {
          setResult({ type: 'text', data: response.data.result });
        } else if (response.data.success) {
          setResult({ type: 'text', data: response.data.result || 'İşlem tamamlandı' });
        } else {
          setResult({ type: 'text', data: JSON.stringify(response.data, null, 2) });
        }
      } else {
        setError(response.data.error || 'Bir hata oluştu');
      }
    } catch (err) {
      console.error('Creative tool error:', err);
      setError(err.response?.data?.detail || err.response?.data?.error || 'İşlem başarısız oldu');
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholder = () => {
    switch (tool.id) {
      case 'text-gen':
        return 'Örnek: "Yapay zeka hakkında bir blog yazısı yaz"';
      case 'voice-gen':
        return 'Seslendirmek istediğiniz metni yazın...';
      case 'code-gen':
        return 'Örnek: "Python ile fibonacci dizisi hesaplayan fonksiyon"';
      case 'story-gen':
        return 'Hikaye konusu veya tema yazın...';
      case 'image-gen':
        return 'Görsel açıklaması: "Gün batımında sahil manzarası"';
      default:
        return `${tool.name} için açıklama yazın...`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" data-testid="creative-tool-modal">
      <GlassCard className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${tool.color} flex items-center justify-center`}>
              <tool.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold nova-hero-title tracking-tight">{tool.name}</h2>
              <p className="text-sm text-gray-400">{tool.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            data-testid="close-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Girdi
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={getPlaceholder()}
            className="w-full min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-gray-400 rounded-xl p-4 resize-none"
            data-testid="tool-input"
          />
        </div>

        {/* Execute Button */}
        <div className="mb-6 flex gap-2">
          <NeonButton
            onClick={handleExecute}
            disabled={loading || !input.trim()}
            className="flex items-center gap-2"
            data-testid="execute-tool"
          >
            <Send className="w-4 h-4" />
            {loading ? 'İşleniyor...' : 'Oluştur'}
          </NeonButton>
          {result && (
            <NeonButton
              variant="glass"
              onClick={() => setInput('')}
            >
              Temizle
            </NeonButton>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-6 p-8 rounded-xl bg-white/5 flex flex-col items-center justify-center">
            <HologramLogo size="small" animate />
            <p className="mt-4 text-gray-400 text-sm">AI işliyor...</p>
          </div>
        )}

        {/* Result Section */}
        {result && !loading && (
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Sonuç
              </h3>
            </div>
            <div className="prose prose-invert max-w-none">
              {result.type === 'image' ? (
                <img 
                  src={`data:image/png;base64,${result.data}`} 
                  alt="AI Generated" 
                  className="w-full rounded-lg shadow-lg"
                />
              ) : result.type === 'audio' ? (
                <div>
                  <audio controls className="w-full mb-4">
                    <source src={`data:audio/mp3;base64,${result.data}`} type="audio/mp3" />
                    Tarayıcınız audio elementini desteklemiyor.
                  </audio>
                  <NeonButton
                    variant="glass"
                    size="sm"
                    onClick={() => {
                      const audio = new Audio(`data:audio/mp3;base64,${result.data}`);
                      audio.play();
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Oynat
                  </NeonButton>
                </div>
              ) : (
                <div className="text-gray-200 whitespace-pre-wrap break-words">
                  {result.data}
                </div>
              )}
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default CreativeToolModal;
