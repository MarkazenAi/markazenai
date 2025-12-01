import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { NovaColors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { useUserStore } from '../../store/userStore';
import { apiService } from '../../services/api';

export default function CreativeScreen() {
  const user = useUserStore((state) => state.user);
  const [activeTab, setActiveTab] = useState('image');
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const handleGenerateImage = async () => {
    if (!prompt.trim() || !user) return;
    
    setLoading(true);
    try {
      const response = await apiService.generateImage(prompt.trim(), user.id);
      setGeneratedImage(`data:image/png;base64,${response.image_base64}`);
      Alert.alert('Success', 'Image generated successfully!');
    } catch (error: any) {
      console.error('Image generation error:', error);
      Alert.alert('Error', 'Failed to generate image. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 1,
      base64: true,
    });
    
    if (!result.canceled && result.assets[0].base64) {
      setSelectedImage(`data:image/png;base64,${result.assets[0].base64}`);
    }
  };
  
  const handleFaceSwap = async () => {
    Alert.alert('Coming Soon', 'Face Swap feature will be available in the next update!');
  };
  
  const handleRemoveBackground = async () => {
    if (!selectedImage || !user) return;
    
    setLoading(true);
    try {
      const base64 = selectedImage.split(',')[1];
      const response = await apiService.removeBackground(base64, user.id);
      setGeneratedImage(`data:image/png;base64,${response.result_image_base64}`);
      Alert.alert('Success', 'Background removed! (Mock demo)');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to process image.');
    } finally {
      setLoading(false);
    }
  };
  
  const tabs = [
    { id: 'image', name: 'Image Gen', icon: 'image' },
    { id: 'face', name: 'Face Swap', icon: 'people' },
    { id: 'bg', name: 'Remove BG', icon: 'color-wand' },
  ];
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Creative Zone</Text>
        <Text style={styles.headerSubtitle}>AI-Powered Creative Tools</Text>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons 
              name={tab.icon as any} 
              size={20} 
              color={activeTab === tab.id ? NovaColors.primary : NovaColors.textMuted} 
            />
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <ScrollView style={styles.content}>
        {activeTab === 'image' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Generate 8K Images</Text>
            <Text style={styles.sectionSubtitle}>Powered by gpt-image-1</Text>
            
            <TextInput
              style={styles.promptInput}
              placeholder="Describe your image..."
              placeholderTextColor={NovaColors.textMuted}
              value={prompt}
              onChangeText={setPrompt}
              multiline
              numberOfLines={4}
            />
            
            <TouchableOpacity 
              style={[styles.generateButton, loading && styles.buttonDisabled]}
              onPress={handleGenerateImage}
              disabled={loading || !prompt.trim()}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={20} color="#FFF" />
                  <Text style={styles.generateButtonText}>Generate Image</Text>
                </>
              )}
            </TouchableOpacity>
            
            {generatedImage && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>Generated Image:</Text>
                <Image source={{ uri: generatedImage }} style={styles.generatedImage} />
              </View>
            )}
          </View>
        )}
        
        {activeTab === 'face' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Face Swap</Text>
            <Text style={styles.sectionSubtitle}>Swap faces between photos (Mock)</Text>
            
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Ionicons name="cloud-upload" size={32} color={NovaColors.primary} />
              <Text style={styles.uploadText}>Upload Images</Text>
            </TouchableOpacity>
            
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            )}
            
            <TouchableOpacity 
              style={styles.generateButton}
              onPress={handleFaceSwap}
            >
              <Ionicons name="swap-horizontal" size={20} color="#FFF" />
              <Text style={styles.generateButtonText}>Swap Faces</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {activeTab === 'bg' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Remove Background</Text>
            <Text style={styles.sectionSubtitle}>Remove image backgrounds instantly (Mock)</Text>
            
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
              <Ionicons name="cloud-upload" size={32} color={NovaColors.primary} />
              <Text style={styles.uploadText}>Upload Image</Text>
            </TouchableOpacity>
            
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            )}
            
            <TouchableOpacity 
              style={[styles.generateButton, loading && styles.buttonDisabled]}
              onPress={handleRemoveBackground}
              disabled={loading || !selectedImage}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Ionicons name="cut" size={20} color="#FFF" />
                  <Text style={styles.generateButtonText}>Remove Background</Text>
                </>
              )}
            </TouchableOpacity>
            
            {generatedImage && generatedImage !== selectedImage && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>Result:</Text>
                <Image source={{ uri: generatedImage }} style={styles.generatedImage} />
              </View>
            )}
          </View>
        )}
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
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: NovaColors.backgroundCard,
    borderBottomWidth: 1,
    borderBottomColor: NovaColors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: NovaColors.primary + '20',
  },
  tabText: {
    fontSize: 14,
    color: NovaColors.textMuted,
    marginLeft: Spacing.xs,
  },
  activeTabText: {
    color: NovaColors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: NovaColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: NovaColors.textSecondary,
    marginBottom: Spacing.lg,
  },
  promptInput: {
    backgroundColor: NovaColors.backgroundCard,
    borderRadius: 12,
    padding: Spacing.md,
    color: NovaColors.textPrimary,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: NovaColors.border,
    marginBottom: Spacing.md,
  },
  generateButton: {
    backgroundColor: NovaColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  generateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  uploadButton: {
    backgroundColor: NovaColors.backgroundCard,
    borderRadius: 12,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: NovaColors.border,
    marginBottom: Spacing.md,
  },
  uploadText: {
    color: NovaColors.textSecondary,
    fontSize: 16,
    marginTop: Spacing.sm,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: Spacing.md,
    backgroundColor: NovaColors.backgroundCard,
  },
  resultContainer: {
    marginTop: Spacing.lg,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: NovaColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  generatedImage: {
    width: '100%',
    height: 400,
    borderRadius: 12,
    backgroundColor: NovaColors.backgroundCard,
  },
});
