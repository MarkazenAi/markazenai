import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import HologramLogo from '../components/HologramLogo';
import VoiceButton from '../components/VoiceButton';
import { Send, Bot, User as UserIcon, Sparkles, Mic } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAds } from '../components/ads/AdManager';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ChatPage = ({ language }) => {
  const { showInterstitial, showRewarded } = useAds();
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [voiceUnlocked, setVoiceUnlocked] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Provider selection state
  const [providers, setProviders] = useState({});
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [selectedModel, setSelectedModel] = useState('gpt-5-mini');
  const [showProviderMenu, setShowProviderMenu] = useState(false);

  useEffect(() => {
    fetchAgents();
    fetchProviders();
    
    // Show interstitial ad on page enter (once per day)
    showInterstitial('full_chat_open', 'once_per_day', () => {
      console.log('Interstitial closed, chat ready');
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchAgents = async () => {
    try {
      const response = await axios.get(`${API}/agents`);
      setAgents(response.data.agents || []);
      if (response.data.agents && response.data.agents.length > 0) {
        setSelectedAgent(response.data.agents[0]);
      }
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleVoiceChat = () => {
    if (voiceUnlocked) {
      console.log('Voice chat activated');
      return;
    }

    showRewarded(
      'reward_voice',
      () => {
        setVoiceUnlocked(true);
        console.log('Voice chat unlocked!');
      },
      () => {
        console.log('Failed to unlock voice chat');
      }
    );
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedAgent) return;

    // Show interstitial ad on generate (once per action)
    showInterstitial('full_generate', 'once_per_action', () => {
      console.log('Generate ad shown');
    });

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        text: inputMessage,
        agent_id: selectedAgent.id,
        session_id: sessionId,
        language: language
      });

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.response,
        agent: selectedAgent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        error: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col" data-testid="chat-page">
      {/* Header with Agent Selection */}
      <div className="p-4 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4 animate-fade-up">
            <HologramLogo size="mini" animate />
            <div>
              <h1 className="text-2xl font-bold nova-hero-title tracking-tight">AI Chat & Voice</h1>
              <p className="text-sm text-gray-400 nova-subtitle">24 Autonomous AI Agents</p>
            </div>
          </div>
          
          {/* Agent Selector */}
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {agents.slice(0, 8).map(agent => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  data-testid={`agent-${agent.id}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all nova-agent-btn ${
                    selectedAgent?.id === agent.id
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <span>{agent.icon}</span>
                  <span>{agent.name}</span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 pb-32">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12 animate-fade-up" data-testid="chat-empty-state">
              <HologramLogo size="normal" animate />
              <h2 className="text-3xl font-bold mt-6 mb-2 nova-empty-title tracking-tight">Start a Conversation</h2>
              <p className="text-gray-400 nova-empty-sub">Ask me anything, I&apos;m here to help!</p>
            </div>
          )}

          {messages.map(message => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
              data-testid={`message-${message.role}`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                </div>
              )}
              
              <GlassCard
                className={`max-w-2xl nova-message ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20'
                    : message.error
                    ? 'bg-red-500/20'
                    : ''
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.agent && (
                  <p className="text-xs text-gray-400 mt-2">
                    {message.agent.icon} {message.agent.name}
                  </p>
                )}
              </GlassCard>

              {message.role === 'user' && (
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 flex items-center justify-center">
                    <UserIcon className="w-6 h-6" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start" data-testid="chat-loading">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
                <Bot className="w-6 h-6 animate-pulse" />
              </div>
              <GlassCard>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </GlassCard>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="fixed bottom-20 left-0 right-0 p-4 backdrop-blur-xl bg-black/30 border-t border-white/10">
        <div className="max-w-4xl mx-auto flex gap-2">
          <VoiceButton
            onVoiceInput={(text) => {
              setInputMessage(text);
              // Auto-send after voice input (optional)
              setTimeout(() => {
                if (text.trim()) {
                  sendMessage();
                }
              }, 500);
            }}
            disabled={loading}
          />
          <Input
            type="text"
            placeholder="Mesajınızı yazın veya 🎤 butonuna basın..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-400 h-12 rounded-xl nova-input"
            data-testid="chat-input"
          />
          <NeonButton
            onClick={sendMessage}
            disabled={loading || !inputMessage.trim()}
            data-testid="chat-send-button"
            className="h-12 w-12 p-0 flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </NeonButton>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;