import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { NovaColors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { useUserStore } from '../../store/userStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useUserStore();
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/');
          }
        },
      ]
    );
  };
  
  const menuItems = [
    { id: 'subscription', icon: 'diamond', title: 'Subscription', subtitle: user?.subscription_tier || 'Basic Plan', color: NovaColors.primary },
    { id: 'language', icon: 'language', title: 'Language', subtitle: '65 languages supported', color: NovaColors.info },
    { id: 'offline', icon: 'cloud-offline', title: 'Offline Mode', subtitle: 'TFLite mini models', color: NovaColors.success },
    { id: 'agents', icon: 'git-network', title: 'Multi-Agent System', subtitle: '24 parallel agents', color: NovaColors.accent },
    { id: 'sync', icon: 'sync', title: 'Cloud Sync', subtitle: 'Sync across devices', color: NovaColors.business },
    { id: 'history', icon: 'time', title: 'History', subtitle: 'View all activities', color: NovaColors.education },
    { id: 'settings', icon: 'settings', title: 'Settings', subtitle: 'App preferences', color: NovaColors.textMuted },
    { id: 'help', icon: 'help-circle', title: 'Help & Support', subtitle: 'Get assistance', color: NovaColors.info },
    { id: 'about', icon: 'information-circle', title: 'About', subtitle: 'Nova Q7 Ultra Titan v5', color: NovaColors.textSecondary },
  ];
  
  const features = [
    '30+ AI Modules',
    '24 Parallel Agents',
    '65 Languages',
    'Offline Mode',
    'Cloud Sync',
    'Global Access',
  ];
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={48} color={NovaColors.primary} />
            </View>
            <View style={styles.subscriptionBadge}>
              <Ionicons name="star" size={12} color="#FFF" />
            </View>
          </View>
          <Text style={styles.userName}>{user?.email || 'Nova User'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.tierBadge}>
            <Text style={styles.tierText}>{user?.subscription_tier || 'Basic'} Member</Text>
          </View>
        </View>
        
        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>30+</Text>
            <Text style={styles.statLabel}>Modules</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Agents</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>∞</Text>
            <Text style={styles.statLabel}>Queries</Text>
          </View>
        </View>
        
        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id}
              style={styles.menuItem}
              onPress={() => {
                if (item.id === 'subscription') {
                  Alert.alert('Subscription', 'Current Plan: ' + (user?.subscription_tier || 'Basic') + '\n\nUpgrade options:\n• Basic ($9.99)\n• Pro ($19.99)\n• Premium ($29.99)');
                } else {
                  Alert.alert(item.title, item.subtitle);
                }
              }}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                  <Ionicons name={item.icon as any} size={20} color={item.color} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={NovaColors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Features */}
        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Nova Q7 Features</Text>
          <View style={styles.featuresList}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={NovaColors.success} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color={NovaColors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <View style={styles.version}>
          <Text style={styles.versionText}>Nova Q7 Ultra Titan v5.0</Text>
          <Text style={styles.versionText}>Build 2025.07</Text>
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
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: NovaColors.border,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: NovaColors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: NovaColors.primary,
  },
  subscriptionBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: NovaColors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: NovaColors.background,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: NovaColors.textPrimary,
    marginTop: Spacing.md,
  },
  userEmail: {
    fontSize: 14,
    color: NovaColors.textSecondary,
    marginTop: 4,
  },
  tierBadge: {
    backgroundColor: NovaColors.primary + '30',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: Spacing.sm,
  },
  tierText: {
    color: NovaColors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: NovaColors.border,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: NovaColors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: NovaColors.textSecondary,
    marginTop: 4,
  },
  menuContainer: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: NovaColors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: NovaColors.textPrimary,
  },
  menuSubtitle: {
    fontSize: 12,
    color: NovaColors.textSecondary,
    marginTop: 2,
  },
  featuresContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: NovaColors.textPrimary,
    marginBottom: Spacing.md,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: Spacing.sm,
  },
  featureText: {
    fontSize: 14,
    color: NovaColors.textSecondary,
    marginLeft: Spacing.xs,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: NovaColors.error + '20',
    marginHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    marginTop: Spacing.lg,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: NovaColors.error,
    marginLeft: Spacing.xs,
  },
  version: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  versionText: {
    fontSize: 12,
    color: NovaColors.textMuted,
    marginVertical: 2,
  },
});
