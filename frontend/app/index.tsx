import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '../store/userStore';
import { NovaColors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

export default function SplashScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, loadUser } = useUserStore();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const init = async () => {
      await loadUser();
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };
    init();
  }, []);
  
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.replace('/(tabs)/home');
      }
    }
  }, [loading, isAuthenticated]);
  
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="flash" size={80} color={NovaColors.primary} />
          </View>
          <Text style={styles.title}>NOVA Q7</Text>
          <Text style={styles.subtitle}>Ultra Titan v5</Text>
          <ActivityIndicator size="large" color={NovaColors.primary} style={{ marginTop: 40 }} />
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="flash" size={80} color={NovaColors.primary} />
          </View>
          <Text style={styles.title}>NOVA Q7</Text>
          <Text style={styles.subtitle}>Ultra Titan v5</Text>
          <Text style={styles.tagline}>AI-Powered Super App</Text>
        </View>
        
        <View style={styles.features}>
          <Text style={styles.featureText}>• 30+ AI Modules</Text>
          <Text style={styles.featureText}>• 24 Parallel Agents</Text>
          <Text style={styles.featureText}>• 65 Languages</Text>
          <Text style={styles.featureText}>• Offline Mode</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push('/auth/register')}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NovaColors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: NovaColors.backgroundCard,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: NovaColors.primary,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: NovaColors.textPrimary,
    letterSpacing: 4,
    marginTop: Spacing.md,
  },
  subtitle: {
    fontSize: 20,
    color: NovaColors.primary,
    marginTop: Spacing.xs,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: NovaColors.textSecondary,
    marginTop: Spacing.md,
  },
  features: {
    alignItems: 'flex-start',
  },
  featureText: {
    fontSize: 18,
    color: NovaColors.textSecondary,
    marginVertical: Spacing.xs,
  },
  buttonContainer: {
    width: '80%',
  },
  primaryButton: {
    backgroundColor: NovaColors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  primaryButtonText: {
    color: NovaColors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: NovaColors.primary,
  },
  secondaryButtonText: {
    color: NovaColors.primary,
    fontSize: 18,
    fontWeight: '600',
  },
});
