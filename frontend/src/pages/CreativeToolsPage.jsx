import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import HologramLogo from '../components/HologramLogo';
import CreativeToolModal from '../components/CreativeToolModal';
import { Wand2, Image, Music, Video, FileText, Code, Palette, Mic } from 'lucide-react';

const CreativeToolsPage = ({ language }) => {
  const [selectedTool, setSelectedTool] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const tools = [
    { id: 'text-gen', icon: FileText, name: 'Text Generator', description: 'İçerik oluştur', color: 'from-cyan-500 to-blue-500' },
    { id: 'image-gen', icon: Image, name: 'Image Creator', description: 'AI görsel üret', color: 'from-purple-500 to-pink-500' },
    { id: 'code-gen', icon: Code, name: 'Code Assistant', description: 'Kod oluştur & debug', color: 'from-green-500 to-emerald-500' },
    { id: 'music-gen', icon: Music, name: 'Music Composer', description: 'Müzik bestele', color: 'from-pink-500 to-rose-500' },
    { id: 'video-gen', icon: Video, name: 'Video Editor', description: 'AI video düzenle', color: 'from-orange-500 to-red-500' },
    { id: 'voice-gen', icon: Mic, name: 'Voice Generator', description: 'Metin -> Ses', color: 'from-indigo-500 to-purple-500' },
    { id: 'design-gen', icon: Palette, name: 'Design Tools', description: 'UI/UX yardımı', color: 'from-yellow-500 to-orange-500' },
    { id: 'story-gen', icon: Wand2, name: 'Story Writer', description: 'Hikaye yaz', color: 'from-teal-500 to-cyan-500' },
  ];

  const handleToolClick = (toolId) => {
    setSelectedTool(tools.find(t => t.id === toolId));
    setShowModal(true);
  };

  return (
    <div className="min-h-screen p-6 pb-24" data-testid="creative-tools-page">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-up">
          <div className="flex items-center gap-4">
            <HologramLogo size="small" animate />
            <div>
              <h1 className="text-4xl font-bold nova-hero-title tracking-tight">Creative Intelligence</h1>
              <p className="text-gray-400 nova-subtitle text-sm">AI-Powered Content Creation</p>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <GlassCard neon className="mb-8 text-center p-12">
          <Wand2 className="w-16 h-16 mx-auto mb-4 text-purple-400" />
          <h2 className="text-4xl font-bold mb-4 nova-hero-title tracking-tight">Unleash Your Creativity</h2>
          <p className="text-gray-300 max-w-2xl mx-auto nova-hero-sub">
            Transform your ideas into reality with Nova Q7 creative tools. From text to images, code to music.
          </p>
        </GlassCard>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <GlassCard
                key={tool.id}
                hover
                neon={selectedTool?.id === tool.id}
                onClick={() => handleToolClick(tool.id)}
                data-testid={`creative-tool-${tool.id}`}
                className="cursor-pointer"
              >
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${tool.color} flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1 nova-tool-name tracking-tight">{tool.name}</h3>
                  <p className="text-sm text-gray-400 nova-tool-desc">{tool.description}</p>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {/* Creative Tool Modal */}
        {showModal && selectedTool && (
          <CreativeToolModal
            tool={selectedTool}
            onClose={() => {
              setShowModal(false);
              setSelectedTool(null);
            }}
            language={language || 'tr'}
          />
        )}
      </div>
    </div>
  );
};

export default CreativeToolsPage;