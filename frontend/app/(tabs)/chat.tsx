// Nova Q7 Ultra Titan v6 PLATINUM EDITION - Chat Screen
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { NovaColors, NovaGradients } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { useUserStore } from '../../store/userStore';
import { apiService } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatScreen() {
  const user = useUserStore((state) => state.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
    ])).start();
    
    const initSession = async () => {
      const storedSession = await AsyncStorage.getItem('current_chat_session');
      if (storedSession) {
        setSessionId(storedSession);
      } else {
        const newSession = `session_${Date.now()}`;
        setSessionId(newSession);
        await AsyncStorage.setItem('current_chat_session', newSession);
      }
    };
    initSession();
  }, []);
  
  const handleSend = async () => {
    if (!inputText.trim() || !user) return;
    
    const userMessage: Message = { id: `user_${Date.now()}`, role: 'user', content: inputText.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);
    
    try {
      const response = await apiService.chat(userMessage.content, user.id, sessionId);
      const assistantMessage: Message = { id: response.message_id, role: 'assistant', content: response.response, timestamp: new Date() };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      const errorMessage: Message = { id: `error_${Date.now()}`, role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date() };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };
  
  const startNewChat = async () => {
    const newSession = `session_${Date.now()}`;
    setSessionId(newSession);
    await AsyncStorage.setItem('current_chat_session', newSession);
    setMessages([]);
  };
  
  const glowOpacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });
  
  return (
    <LinearGradient colors={NovaGradients.cosmicBlue || NovaGradients.cosmicDepth} style={styles.container}>
      <View style={styles.cosmicOverlay} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header with Hologram Avatar */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Animated.View style={[styles.aiAvatar, { opacity: glowOpacity }]}>
              <LinearGradient colors={NovaGradients.primaryHologram} style={styles.avatarGradient}>
                <Ionicons name="sparkles" size={22} color={NovaColors.textPlatinum} />
              </LinearGradient>
            </Animated.View>
            <View>
              <Text style={styles.headerTitle}>Nova AI</Text>
              <Text style={styles.headerSubtitle}>GPT-4o • 24 Agents</Text>
            </View>
          </View>
          <TouchableOpacity onPress={startNewChat} style={styles.newChatBtn}>
            <Ionicons name="add-circle" size={28} color={NovaColors.hologramBlue} />
          </TouchableOpacity>
        </View>
        
        <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={100}>
          <ScrollView ref={scrollViewRef} style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
            {messages.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="chatbubbles-outline" size={80} color={NovaColors.textMuted} />
                <Text style={styles.emptyText}>Start a conversation</Text>
                <Text style={styles.emptySubtext}>Ask me anything!</Text>
              </View>
            ) : (
              messages.map((message) => (
                <View key={message.id} style={[styles.messageBubble, message.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
                  <Text style={[styles.messageText, message.role === 'user' ? styles.userText : styles.assistantText]}>{message.content}</Text>
                </View>
              ))
            )}
            {loading && (
              <LinearGradient colors={[NovaColors.glassLight, NovaColors.backgroundCard]} style={[styles.messageBubble, styles.assistantBubble]}>
                <ActivityIndicator size="small" color={NovaColors.hologramBlue} />
              </LinearGradient>
            )}
          </ScrollView>
          
          {/* Input with Glass Effect */}
          <LinearGradient colors={[NovaColors.glassLight, NovaColors.backgroundCard]} style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="Type your message..." placeholderTextColor={NovaColors.textMuted} value={inputText} onChangeText={setInputText} multiline maxLength={2000} />
            <TouchableOpacity style={[styles.sendButton, (!inputText.trim() || loading) && styles.sendButtonDisabled]} onPress={handleSend} disabled={!inputText.trim() || loading}>
              <LinearGradient colors={NovaGradients.primaryHologram} style={styles.sendGradient}>
                <Ionicons name="send" size={18} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cosmicOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,10,31,0.3)' },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: NovaColors.borderGlass },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  aiAvatar: { width: 48, height: 48, borderRadius: 24, overflow: 'hidden', marginRight: Spacing.sm, shadowColor: NovaColors.primaryGlow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.6, shadowRadius: 12 },
  avatarGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: Typography.fontSize.lg, fontWeight: Typography.fontWeight.bold, color: NovaColors.textPlatinum },
  headerSubtitle: { fontSize: Typography.fontSize.xs, color: NovaColors.textSilver, marginTop: 2 },
  newChatBtn: { padding: Spacing.xs },
  content: { flex: 1 },
  messagesContainer: { flex: 1 },
  messagesContent: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyText: { fontSize: Typography.fontSize.lg, color: NovaColors.textSilver, marginTop: Spacing.lg, textAlign: 'center' },
  emptySubtext: { fontSize: Typography.fontSize.sm, color: NovaColors.textMuted, marginTop: Spacing.xs },
  messageBubble: { maxWidth: '80%', padding: Spacing.md, borderRadius: 18, marginBottom: Spacing.sm },
  userBubble: { alignSelf: 'flex-end', borderBottomRightRadius: 6 },
  assistantBubble: { alignSelf: 'flex-start', borderBottomLeftRadius: 6, borderWidth: 1, borderColor: NovaColors.borderGlass },
  messageText: { fontSize: Typography.fontSize.md, lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.md },
  userText: { color: NovaColors.textPlatinum },
  assistantText: { color: NovaColors.textDiamond },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderTopWidth: 1, borderTopColor: NovaColors.borderGlass },
  input: { flex: 1, backgroundColor: NovaColors.backgroundCard, borderRadius: 20, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, paddingTop: Spacing.sm, marginRight: Spacing.sm, maxHeight: 100, color: NovaColors.textPlatinum, fontSize: Typography.fontSize.md, borderWidth: 1, borderColor: NovaColors.borderGlass },
  sendButton: { width: 44, height: 44, borderRadius: 22, overflow: 'hidden' },
  sendButtonDisabled: { opacity: 0.5 },
  sendGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
