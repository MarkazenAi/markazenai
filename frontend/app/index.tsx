// Nova Q7 Ultra Titan v6 PLATINUM EDITION - Splash Screen
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '../store/userStore';
import { NovaColors, NovaGradients, NovaShadows } from '../theme/colors';
import { Typography } from '../theme/typography';
import { Spacing } from '../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, loadUser } = useUserStore();
  const [loading, setLoading] = useState(true);
  
  // Hologram animations
  const glowAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  useEffect(() => {
    // Hologram glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Hologram rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();
    
    // Scale in animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
    
    const init = async () => {
      await loadUser();
      setTimeout(() => {
        setLoading(false);
      }, 2500);
    };
    init();
  }, []);
  
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/(tabs)/home');
    }
  }, [loading, isAuthenticated]);
  
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });
  
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  if (loading) {
    return (
      <LinearGradient
        colors={NovaGradients.cosmicDepth}
        style={styles.container}
      >
        <View style={styles.cosmicOverlay} />
        
        <View style={styles.logoContainer}>
          {/* Hologram rings */}
          <Animated.View 
            style={[
              styles.hologramRing,
              {
                opacity: glowOpacity,
                transform: [{ rotate: rotation }, { scale: scaleAnim }],
              }
            ]}
          >
            <LinearGradient
              colors={[NovaColors.hologramPurple, NovaColors.hologramBlue]}
              style={styles.ringGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.hologramRingOuter,
              {
                opacity: glowOpacity,
                transform: [{ rotate: rotation }, { scale: scaleAnim }],
              }
            ]}
          >
            <LinearGradient
              colors={[NovaColors.hologramBlue, NovaColors.hologramPink]}
              style={styles.ringGradient}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
          </Animated.View>
          
          {/* Logo center */}
          <Animated.View 
            style={[
              styles.logoCircle,
              {
                transform: [{ scale: scaleAnim }],
              }
            ]}
          >
            <LinearGradient
              colors={NovaGradients.primaryHologram}
              style={styles.logoGradient}
            >
              <Ionicons name="flash" size={100} color={NovaColors.textPlatinum} />
            </LinearGradient>
          </Animated.View>
          
          <Animated.View style={{ opacity: scaleAnim }}>
            <Text style={styles.title}>NOVA Q7</Text>
            <LinearGradient
              colors={[NovaColors.neonGold, NovaColors.hologramGold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.subtitleGradient}
            >
              <Text style={styles.subtitle}>Ultra Titan v6 Platinum</Text>
            </LinearGradient>
            
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={NovaColors.hologramBlue} />
              <Text style={styles.loadingText}>Initializing AI Systems...</Text>
            </View>
          </Animated.View>
        </View>
        
        {/* Cosmic particles */}
        <View style={styles.particlesContainer}>
          {[...Array(6)].map((_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.particle,
                {
                  opacity: glowOpacity,
                  left: `${(i * 15) + 10}%`,
                  top: `${(i * 12) + 20}%`,
                }
              ]}
            />
          ))}
        </View>
      </LinearGradient>
    );
  }
  
  return (
    <LinearGradient
      colors={NovaGradients.cosmicDepth}
      style={styles.container}
    >
      <View style={styles.cosmicOverlay} />
      
      <View style={styles.content}>
        {/* Logo Section - Centered */}
        <View style={styles.logoSection}>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <View style={styles.logoCircle}>
              <LinearGradient
                colors={NovaGradients.primaryHologram}
                style={styles.logoGradient}
              >
                <Ionicons name="flash" size={80} color={NovaColors.textPlatinum} />
              </LinearGradient>
            </View>
          </Animated.View>
          
          <Text style={styles.title}>NOVA Q7</Text>
          <LinearGradient
            colors={[NovaColors.neonGold, NovaColors.hologramGold]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.subtitleGradient}
          >
            <Text style={styles.subtitle}>Ultra Titan v6 Platinum</Text>
          </LinearGradient>
          <Text style={styles.tagline}>AI-Powered Super App</Text>
        </View>
        
        {/* Features Section - Equal Spacing */}
        <View style={styles.featuresSection}>
          {[
            { icon: 'apps', text: '30+ AI Modules', color: NovaColors.hologramPurple },
            { icon: 'git-network', text: '24 Parallel Agents', color: NovaColors.hologramBlue },
            { icon: 'language', text: '65 Languages', color: NovaColors.hologramPink },
            { icon: 'cloud-offline', text: 'Offline Mode', color: NovaColors.neonGold },
          ].map((feature, idx) => (
            <View key={idx} style={styles.featureCard}>
              <LinearGradient
                colors={[feature.color + '30', feature.color + '08']}
                style={styles.featureIcon}
              >
                <Ionicons name={feature.icon as any} size={22} color={feature.color} />
              </LinearGradient>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>
        
        {/* Buttons Section - Unified Radius */}
        <View style={styles.buttonsSection}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('/auth/login')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={NovaGradients.primaryHologram}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={18} color={NovaColors.textPlatinum} />
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push('/auth/register')}
            activeOpacity={0.85}
          >
            <View style={styles.secondaryButtonContent}>
              <Text style={styles.secondaryButtonText}>Create Account</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // Base container with cosmic gradient
  container: {
    flex: 1,
  },
  cosmicOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,0,51,0.15)',
  },
  
  // Main content - centered with equal spacing
  content: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  
  // Logo Section - centered alignment
  logoSection: {
    alignItems: 'center',
    width: '100%',
  },
  hologramRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  hologramRingOuter: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ringGradient: {
    flex: 1,
    borderRadius: 130,
  },
  logoCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  logoGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.fontSize.ultra,
    fontWeight: Typography.fontWeight.heavy,
    color: NovaColors.textPlatinum,
    letterSpacing: Typography.letterSpacing.widest,
    marginTop: Spacing.lg,
    textShadowColor: NovaColors.primaryGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitleGradient: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    marginTop: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    color: NovaColors.background,
    letterSpacing: Typography.letterSpacing.wide,
    textAlign: 'center',
  },
  tagline: {
    fontSize: Typography.fontSize.md,
    color: NovaColors.textSilver,
    marginTop: Spacing.md,
    letterSpacing: Typography.letterSpacing.normal,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xl,
    gap: Spacing.sm,
  },
  loadingText: {
    fontSize: Typography.fontSize.sm,
    color: NovaColors.textSilver,
    marginLeft: Spacing.sm,
  },
  features: {
    width: '100%',
    gap: Spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NovaColors.backgroundCard,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: NovaColors.borderGlass,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  featureText: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium,
    color: NovaColors.textDiamond,
  },
  buttonContainer: {
    width: '100%',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  primaryButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md + 4,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  primaryButtonText: {
    color: NovaColors.textPlatinum,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: Typography.letterSpacing.wide,
  },
  secondaryButton: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: NovaColors.borderGlow,
  },
  secondaryButtonText: {
    color: NovaColors.textDiamond,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: NovaColors.hologramBlue,
  },
});
