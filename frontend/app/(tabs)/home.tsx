// Nova Q7 Ultra Titan v6 PLATINUM EDITION - Home Screen
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NovaColors, NovaGradients } from '../../theme/colors';
import { Typography } from '../../theme/typography';
import { Spacing } from '../../theme/spacing';
import { useUserStore } from '../../store/userStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  
  const zones = [
    { id: 1, title: 'Chat & Voice Zone', icon: 'chatbubbles', color: NovaColors.chat, modules: ['AI Chat', 'Voice Assistant', 'Voice Chat'], route: '/chat' },
    { id: 2, title: 'Creative Zone', icon: 'color-palette', color: NovaColors.creative, modules: ['Image Gen', 'Face Swap', 'Remove BG', 'Photo Edit'], route: '/creative' },
    { id: 3, title: 'Work Zone', icon: 'briefcase', color: NovaColors.business, modules: ['Business AI', 'Manufacturing', 'IoT', 'Factory'], route: '/modules' },
    { id: 4, title: 'Learn Zone', icon: 'school', color: NovaColors.education, modules: ['Education', 'Legal AI', 'Travel', 'Email AI'], route: '/modules' },
  ];
  
  return (
    <LinearGradient colors={NovaGradients.cosmicDepth} style={styles.container}>
      <View style={styles.cosmicOverlay} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>{user?.email?.split('@')[0] || 'Nova User'}</Text>
              <LinearGradient colors={[NovaColors.primary + '40', NovaColors.primary + '20']} style={styles.subscriptionBadge}>
                <Ionicons name="star" size={12} color={NovaColors.neonGold} />
                <Text style={styles.subscriptionText}>{user?.subscription_tier || 'Basic'} Plan</Text>
              </LinearGradient>
            </View>
            <View style={styles.logoMini}>
              <LinearGradient colors={NovaGradients.primaryHologram} style={styles.logoGradient}>
                <Ionicons name="flash" size={28} color={NovaColors.textPlatinum} />
              </LinearGradient>
            </View>
          </View>
          
          {/* Stats */}
          <View style={styles.statsContainer}>
            {[
              { number: '30+', label: 'AI Modules', color: NovaColors.hologramPurple },
              { number: '24', label: 'Agents', color: NovaColors.hologramBlue },
              { number: '65', label: 'Languages', color: NovaColors.hologramPink },
            ].map((stat, idx) => (
              <LinearGradient key={idx} colors={[stat.color + '20', stat.color + '05']} style={styles.statCard}>
                <Text style={[styles.statNumber, { color: stat.color }]}>{stat.number}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </LinearGradient>
            ))}
          </View>
          
          {/* Zones */}
          <Text style={styles.sectionTitle}>Explore Zones</Text>
          {zones.map((zone) => (
            <TouchableOpacity key={zone.id} style={styles.zoneCard} onPress={() => router.push(zone.route as any)} activeOpacity={0.85}>
              <LinearGradient colors={[zone.color + '25', zone.color + '08']} style={styles.zoneGradient}>
                <View style={[styles.zoneIcon, { backgroundColor: zone.color }]}>
                  <Ionicons name={zone.icon as any} size={26} color="#FFF" />
                </View>
                <View style={styles.zoneContent}>
                  <Text style={styles.zoneTitle}>{zone.title}</Text>
                  <View style={styles.moduleList}>
                    {zone.modules.map((module, idx) => (
                      <Text key={idx} style={styles.moduleText}>• {module}</Text>
                    ))}
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={22} color={NovaColors.textSilver} />
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cosmicOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(26,0,51,0.15)' },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, marginBottom: Spacing.lg },
  greeting: { fontSize: Typography.fontSize.sm, color: NovaColors.textSilver, fontWeight: Typography.fontWeight.medium },
  userName: { fontSize: Typography.fontSize.xxl, fontWeight: Typography.fontWeight.bold, color: NovaColors.textPlatinum, marginTop: 4 },
  subscriptionBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: 12, marginTop: Spacing.sm, alignSelf: 'flex-start' },
  subscriptionText: { color: NovaColors.neonGold, fontSize: Typography.fontSize.xs, fontWeight: Typography.fontWeight.semibold },
  logoMini: { width: 56, height: 56, borderRadius: 16, overflow: 'hidden', shadowColor: NovaColors.primaryGlow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 6 },
  logoGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statsContainer: { flexDirection: 'row', paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl, gap: Spacing.sm },
  statCard: { flex: 1, padding: Spacing.md, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: NovaColors.borderGlass },
  statNumber: { fontSize: Typography.fontSize.xxl, fontWeight: Typography.fontWeight.heavy },
  statLabel: { fontSize: Typography.fontSize.xs, color: NovaColors.textSilver, marginTop: 4, fontWeight: Typography.fontWeight.medium },
  sectionTitle: { fontSize: Typography.fontSize.xl, fontWeight: Typography.fontWeight.bold, color: NovaColors.textDiamond, paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  zoneCard: { marginHorizontal: Spacing.lg, marginBottom: Spacing.md, borderRadius: 20, overflow: 'hidden' },
  zoneGradient: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, borderWidth: 1, borderColor: NovaColors.borderGlass },
  zoneIcon: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  zoneContent: { flex: 1 },
  zoneTitle: { fontSize: Typography.fontSize.lg, fontWeight: Typography.fontWeight.bold, color: NovaColors.textPlatinum, marginBottom: Spacing.xs },
  moduleList: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  moduleText: { fontSize: Typography.fontSize.xs, color: NovaColors.textSilver },
});
