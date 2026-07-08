import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '@/components/ui';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { colors, font, radius, spacing } from '@/constants/theme';
import { BRANDING } from '@/constants/branding';
import { isSupabaseEnabled } from '@/lib/supabase';
import { useT } from '@/lib/i18n';

export default function Welcome() {
  const { t } = useT();
  const features: { icon: keyof typeof Ionicons.glyphMap; title: string; text: string }[] = [
    { icon: 'wallet', title: t('welcome.money.title'), text: t('welcome.money.text') },
    { icon: 'heart', title: t('welcome.mind.title'), text: t('welcome.mind.text') },
    { icon: 'rocket', title: t('welcome.hustle.title'), text: t('welcome.hustle.text') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <View style={[styles.logo, { backgroundColor: BRANDING.accent }]}>
          <Ionicons name="flash" size={34} color={colors.white} />
        </View>
        <Text style={styles.title}>{BRANDING.appName}</Text>
        <Text style={styles.tagline}>{BRANDING.tagline}</Text>
      </View>

      <View style={{ flex: 1 }}>
        {features.map((f) => (
          <View key={f.title} style={styles.feature}>
            <View style={styles.featureIcon}>
              <Ionicons name={f.icon} size={20} color={BRANDING.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          </View>
        ))}
      </View>

      <LanguageSwitcher />
      <PrimaryButton
        label={t('welcome.getStarted')}
        onPress={() => router.push('/(auth)/signup')}
        style={{ marginTop: spacing.md }}
      />
      {isSupabaseEnabled ? (
        <PrimaryButton
          label={t('welcome.haveAccount')}
          variant="ghost"
          onPress={() => router.push('/(auth)/login')}
          style={{ marginTop: spacing.sm }}
        />
      ) : (
        <Text style={styles.demoNote}>{t('welcome.demoNote')}</Text>
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
