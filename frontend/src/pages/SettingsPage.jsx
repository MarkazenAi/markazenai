import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import NeonButton from '../components/NeonButton';
import HologramLogo from '../components/HologramLogo';
import { Globe, Moon, Bell, Wifi, Shield, HelpCircle, LogOut } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const SettingsPage = ({ language, setLanguage }) => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    offlineMode: false,
    language: language || 'en',
    analytics: true,
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const settingsGroups = [
    {
      title: 'Appearance',
      items: [
        {
          id: 'theme',
          icon: Moon,
          label: 'Dark Mode',
          description: 'Enable dark theme',
          value: settings.theme === 'dark',
          action: () => toggleSetting('theme')
        }
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          icon: Bell,
          label: 'Notifications',
          description: 'Enable push notifications',
          value: settings.notifications,
          action: () => toggleSetting('notifications')
        },
        {
          id: 'offline',
          icon: Wifi,
          label: 'Offline Mode',
          description: 'Enable offline AI with TFLite',
          value: settings.offlineMode,
          action: () => toggleSetting('offlineMode')
        },
        {
          id: 'analytics',
          icon: Shield,
          label: 'Usage Analytics',
          description: 'Help improve the app',
          value: settings.analytics,
          action: () => toggleSetting('analytics')
        }
      ]
    },
    {
      title: 'Language',
      items: [
        {
          id: 'language',
          icon: Globe,
          label: 'App Language',
          description: `Current: ${settings.language.toUpperCase()}`,
          value: null,
          isButton: true,
          action: () => console.log('Open language selector')
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          icon: HelpCircle,
          label: 'Help & Support',
          description: 'Get help with HoloUI',
          value: null,
          isButton: true,
          action: () => console.log('Open help')
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen p-6 pb-24" data-testid="settings-page">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <HologramLogo size="small" animate />
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-gray-400">Customize your experience</p>
          </div>
        </div>

        {/* Settings Groups */}
        <div className="space-y-6">
          {settingsGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h2 className="text-lg font-semibold mb-3 text-gray-300">{group.title}</h2>
              <GlassCard className="divide-y divide-white/5">
                {group.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                      data-testid={`setting-${item.id}`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.label}</h3>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                      {item.isButton ? (
                        <NeonButton
                          variant="glass"
                          size="sm"
                          onClick={item.action}
                          data-testid={`${item.id}-button`}
                        >
                          Change
                        </NeonButton>
                      ) : (
                        <Switch
                          checked={item.value}
                          onCheckedChange={item.action}
                          data-testid={`${item.id}-switch`}
                        />
                      )}
                    </div>
                  );
                })}
              </GlassCard>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <NeonButton
            variant="outline"
            className="w-full"
            data-testid="logout-button"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </NeonButton>
        </div>

        {/* App Version */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>HoloUI Platform v1.0.0</p>
          <p className="mt-1">Premium AI Multi-Agent System</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;