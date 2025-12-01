import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NovaColors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { LinearGradient } from 'expo-linear-gradient';

interface Module {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  category: string;
}

export default function ModulesScreen() {
  const modules: Module[] = [
    // Business & Manufacturing
    { id: 'business', name: 'Business AI', icon: 'analytics', color: NovaColors.business, description: 'AI-powered business analytics', category: 'Business' },
    { id: 'manufacturing', name: 'Manufacturing', icon: 'construct', color: '#FF9800', description: 'Manufacturing orders & tracking', category: 'Business' },
    { id: 'factory', name: 'Factory Chain', icon: 'git-network', color: '#9C27B0', description: 'Factory supply chain management', category: 'Business' },
    
    // IoT & Smart Home
    { id: 'iot', name: 'IoT Control', icon: 'radio', color: NovaColors.iot, description: 'Control smart devices', category: 'IoT' },
    { id: 'energy', name: 'Energy Control', icon: 'flash', color: '#FFEB3B', description: 'Monitor & control energy usage', category: 'IoT' },
    
    // Communication
    { id: 'social', name: 'Social Media AI', icon: 'share-social', color: NovaColors.social, description: 'Manage social media posts', category: 'Communication' },
    { id: 'email', name: 'Nova Mail AI', icon: 'mail', color: '#03A9F4', description: 'AI-powered email assistant', category: 'Communication' },
    { id: 'whatsapp', name: 'WhatsApp AI', icon: 'logo-whatsapp', color: '#25D366', description: 'WhatsApp auto-reply (mock)', category: 'Communication' },
    
    // Education & Learning
    { id: 'education', name: 'Education Pro', icon: 'school', color: NovaColors.education, description: 'AI-powered learning tutor', category: 'Education' },
    
    // Legal & Travel
    { id: 'legal', name: 'Legal AI', icon: 'document-text', color: NovaColors.legal, description: 'Legal document analysis', category: 'Professional' },
    { id: 'travel', name: 'Travel Planner', icon: 'airplane', color: NovaColors.travel, description: 'AI travel itinerary planner', category: 'Lifestyle' },
    
    // Utilities
    { id: 'pdf', name: 'PDF Tools', icon: 'document', color: '#E91E63', description: 'PDF analyzer & converter', category: 'Utilities' },
    { id: 'qr', name: 'QR Tools', icon: 'qr-code', color: '#00BCD4', description: 'QR code generator & scanner', category: 'Utilities' },
    { id: 'converter', name: 'Unit Converter', icon: 'calculator', color: '#8BC34A', description: 'Convert units & currencies', category: 'Utilities' },
    
    // Productivity
    { id: 'notes', name: 'Smart Notes', icon: 'create', color: '#FFC107', description: 'AI-enhanced notes', category: 'Productivity' },
    { id: 'todo', name: 'To-Do AI', icon: 'checkbox', color: '#9C27B0', description: 'Intelligent task management', category: 'Productivity' },
    { id: 'password', name: 'Password Vault', icon: 'key', color: '#F44336', description: 'Secure password manager', category: 'Security' },
    
    // AI Analysis
    { id: 'skin', name: 'Skin Analysis', icon: 'body', color: '#FF6F00', description: 'AI skin health analysis', category: 'Health' },
    { id: 'relationship', name: 'Relationship AI', icon: 'heart', color: '#E91E63', description: 'Relationship insights', category: 'Lifestyle' },
    
    // Advanced
    { id: 'website', name: 'Website Builder', icon: 'code', color: '#00BCD4', description: 'AI website generator', category: 'Advanced' },
    { id: 'trend', name: 'Trend Engine', icon: 'trending-up', color: '#4CAF50', description: 'Market trend analysis', category: 'Advanced' },
  ];
  
  const categories = [...new Set(modules.map(m => m.category))];
  
  const handleModulePress = (module: Module) => {
    Alert.alert(
      module.name,
      `${module.description}\n\nThis feature is part of Nova Q7 Ultra Titan v5. Full implementation available in production release.`,
      [
        { text: 'OK', style: 'default' },
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Modules</Text>
        <Text style={styles.headerSubtitle}>30+ AI-Powered Features</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {categories.map((category) => (
          <View key={category} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <View style={styles.modulesGrid}>
              {modules
                .filter(m => m.category === category)
                .map((module) => (
                  <TouchableOpacity
                    key={module.id}
                    style={styles.moduleCard}
                    onPress={() => handleModulePress(module)}
                  >
                    <LinearGradient
                      colors={[module.color + '20', module.color + '05']}
                      style={styles.moduleGradient}
                    >
                      <View style={[styles.moduleIcon, { backgroundColor: module.color }]}>
                        <Ionicons name={module.icon as any} size={24} color="#FFF" />
                      </View>
                      <Text style={styles.moduleName}>{module.name}</Text>
                      <Text style={styles.moduleDescription} numberOfLines={2}>
                        {module.description}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))
              }
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NovaColors.background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: NovaColors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: NovaColors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: NovaColors.textSecondary,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  categorySection: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: NovaColors.textPrimary,
    marginBottom: Spacing.md,
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  moduleCard: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: Spacing.sm,
    borderRadius: 12,
    overflow: 'hidden',
  },
  moduleGradient: {
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: NovaColors.border,
    borderRadius: 12,
    minHeight: 130,
  },
  moduleIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  moduleName: {
    fontSize: 14,
    fontWeight: '600',
    color: NovaColors.textPrimary,
    marginBottom: 4,
  },
  moduleDescription: {
    fontSize: 12,
    color: NovaColors.textSecondary,
    lineHeight: 16,
  },
});
