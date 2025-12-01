import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NovaColors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { useUserStore } from '../../store/userStore';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  
  const zones = [
    {
      id: 1,
      title: 'Chat & Voice Zone',
      icon: 'chatbubbles',
      color: NovaColors.chat,
      modules: ['AI Chat', 'Voice Assistant', 'Voice Chat'],
      route: '/chat',
    },
    {
      id: 2,
      title: 'Creative Zone',
      icon: 'color-palette',
      color: NovaColors.creative,
      modules: ['Image Gen', 'Face Swap', 'Remove BG', 'Photo Edit'],
      route: '/creative',
    },
    {
      id: 3,
      title: 'Work Zone',
      icon: 'briefcase',
      color: NovaColors.business,
      modules: ['Business AI', 'Manufacturing', 'IoT', 'Factory'],
      route: '/modules',
    },
    {
      id: 4,
      title: 'Learn Zone',
      icon: 'school',
      color: NovaColors.education,
      modules: ['Education', 'Legal AI', 'Travel', 'Email AI'],
      route: '/modules',
    },
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.email || 'Nova User'}</Text>
            <View style={styles.subscriptionBadge}>
              <Text style={styles.subscriptionText}>{user?.subscription_tier || 'Basic'} Plan</Text>
            </View>
          </View>
          <View style={styles.logoCircle}>
            <Ionicons name="flash" size={32} color={NovaColors.primary} />
          </View>
        </View>
        
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>30+</Text>
            <Text style={styles.statLabel}>AI Modules</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Parallel Agents</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>65</Text>
            <Text style={styles.statLabel}>Languages</Text>
          </View>
        </View>
        
        {/* Zones */}
        <Text style={styles.sectionTitle}>Explore Zones</Text>
        <View style={styles.zonesContainer}>
          {zones.map((zone) => (
            <TouchableOpacity
              key={zone.id}
              style={styles.zoneCard}
              onPress={() => router.push(zone.route as any)}
            >
              <LinearGradient
                colors={[zone.color + '40', zone.color + '10']}
                style={styles.zoneGradient}
              >
                <View style={[styles.zoneIcon, { backgroundColor: zone.color }]}>
                  <Ionicons name={zone.icon as any} size={28} color="#FFF" />
                </View>
                <Text style={styles.zoneTitle}>{zone.title}</Text>
                <View style={styles.moduleList}>
                  {zone.modules.map((module, idx) => (
                    <Text key={idx} style={styles.moduleText}>• {module}</Text>
                  ))}
                </View>
                <View style={styles.zoneAction}>
                  <Text style={styles.exploreText}>Explore</Text>
                  <Ionicons name="arrow-forward" size={16} color={NovaColors.primary} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionBtn} onPress={() => router.push('/chat')}>
            <Ionicons name="chatbubble" size={24} color={NovaColors.primary} />
            <Text style={styles.quickActionText}>New Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionBtn} onPress={() => router.push('/creative')}>
            <Ionicons name="image" size={24} color={NovaColors.creative} />
            <Text style={styles.quickActionText}>Generate Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionBtn}>
            <Ionicons name="document-text" size={24} color={NovaColors.info} />
            <Text style={styles.quickActionText}>Analyze PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NovaColors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  greeting: {
    fontSize: 16,
    color: NovaColors.textSecondary,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: NovaColors.textPrimary,
    marginTop: Spacing.xs,
  },
  subscriptionBadge: {
    backgroundColor: NovaColors.primary + '30',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
  },
  subscriptionText: {
    color: NovaColors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: NovaColors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: NovaColors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: NovaColors.backgroundCard,
    padding: Spacing.md,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: NovaColors.border,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: NovaColors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: NovaColors.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: NovaColors.textPrimary,
    marginBottom: Spacing.md,
  },
  zonesContainer: {
    marginBottom: Spacing.xl,
  },
  zoneCard: {
    marginBottom: Spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
  },
  zoneGradient: {
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: NovaColors.border,
  },
  zoneIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  zoneTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: NovaColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  moduleList: {
    marginBottom: Spacing.md,
  },
  moduleText: {
    fontSize: 14,
    color: NovaColors.textSecondary,
    marginVertical: 2,
  },
  zoneAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exploreText: {
    fontSize: 16,
    fontWeight: '600',
    color: NovaColors.primary,
    marginRight: Spacing.xs,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxl,
  },
  quickActionBtn: {
    flex: 1,
    backgroundColor: NovaColors.backgroundCard,
    padding: Spacing.md,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: NovaColors.border,
  },
  quickActionText: {
    fontSize: 12,
    color: NovaColors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
});
