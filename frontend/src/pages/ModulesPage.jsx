import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import HologramLogo from '../components/HologramLogo';
import { Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ModulesPage = ({ language }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [executing, setExecuting] = useState(null);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await axios.get(`${API}/modules`);
      setModules(response.data.modules || []);
    } catch (error) {
      console.error('Failed to fetch modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(modules.map(m => m.category))];

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleModuleClick = async (module) => {
    setExecuting(module.id);
    setTimeout(() => setExecuting(null), 2000);
  };

  return (
    <div className="min-h-screen p-6 pb-24" data-testid="modules-page">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-up">
          <div className="flex items-center gap-4">
            <HologramLogo size="small" animate />
            <div>
              <h1 className="text-4xl font-bold nova-hero-title tracking-tight">Smart AI Modules</h1>
              <p className="text-gray-400 nova-subtitle text-sm">30+ Specialized Intelligence Tools</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-400 h-12 rounded-xl"
              data-testid="module-search-input"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                data-testid={`category-${category}`}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all nova-filter-btn ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Modules Grid */}
        {loading ? (
          <div className="text-center py-12">
            <HologramLogo size="normal" animate />
            <p className="mt-4 text-gray-400 nova-loading">Loading modules...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredModules.map((module) => (
              <GlassCard
                key={module.id}
                hover
                onClick={() => handleModuleClick(module)}
                data-testid={`module-${module.id}`}
                className={`cursor-pointer ${
                  executing === module.id ? 'animate-pulse' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{module.icon}</div>
                  <h3 className="font-semibold mb-1 nova-module-name tracking-tight">{module.name}</h3>
                  <span className="text-xs text-gray-400 px-3 py-1 rounded-full bg-white/5 nova-module-cat">
                    {module.category}
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {filteredModules.length === 0 && !loading && (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-400 nova-empty">No modules found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModulesPage;