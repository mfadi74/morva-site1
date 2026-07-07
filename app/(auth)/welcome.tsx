import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '@/components/ui';
import { colors, font, radius, spacing } from '@/constants/theme';
import { isSupabaseEnabled } from '@/lib/supabase';

const FEATURES: { icon: keyof typeof Ionicons.glyphMap; title: string; text: string }[] = [
  { icon: 'wallet', title: 'MoneyMap', text: 'Track money, build a savings habit, get AI spending insights' },
  { icon: 'heart', title: 'Stillwell', text: 'Daily mood check-ins, journaling, and a coach that gets it' },
  { icon: 'rocket', title: 'LaunchPad', text: 'Pick a side hustle and launch it with a 30-day roadmap' },
];

export default function Welcome() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Ionicons name="flash" size={34} color={colors.white} />
        </View>
        <Text style={styles.title}>AchieveOS</Text>
        <Text style={styles.tagline}>Your life. Engineered.</Text>
      </View>

      <View style={{ flex: 1 }}>
        {FEATURES.map((f) => (
          <View key={f.title} style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name={f.icon} size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          </View>
        ))}
      </View>

      <PrimaryButton label="Get Started" onPress={() => router.push('/(auth)/signup')} />
      {isSupabaseEnabled ? (
        <PrimaryButton
          label="I already have an account"
          variant="ghost"
          onPress={() => router.push('/(auth)/login')}
          style={{ marginTop: spacing.sm }}
        />
      ) : (
        <Text style={styles.demoNote}>
          Running in local demo mode — your data stays on this device.
        </Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    marginTop: spacing.xl * 2,
    marginBottom: spacing.xl,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: font.title + 6,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    color: colors.muted,
    fontSize: font.subheading,
    marginTop: spacing.xs,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  featureIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  featureTitle: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '700',
  },
  featureText: {
    color: colors.muted,
    fontSize: font.small,
    marginTop: 2,
    lineHeight: 18,
  },
  demoNote: {
    color: colors.muted,
    fontSize: font.small,
    textAlign: 'center',
    marginTop: spacing.md,
  },
});
