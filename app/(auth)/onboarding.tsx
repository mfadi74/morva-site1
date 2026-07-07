import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PrimaryButton } from '@/components/ui';
import { colors, font, radius, spacing } from '@/constants/theme';
import { useAppStore } from '@/stores/appStore';

const FOCUS_AREAS: { key: string; icon: keyof typeof Ionicons.glyphMap; title: string; text: string }[] = [
  { key: 'money', icon: 'wallet', title: 'Get my money right', text: 'Budgeting, saving, and stress-free spending' },
  { key: 'mind', icon: 'heart', title: 'Protect my peace', text: 'Mood tracking, journaling, less burnout' },
  { key: 'hustle', icon: 'rocket', title: 'Launch a side hustle', text: 'Turn a skill into income in 30 days' },
  { key: 'growth', icon: 'trending-up', title: 'Level up daily', text: 'Streaks, XP, and visible progress' },
];

export default function Onboarding() {
  const profile = useAppStore((s) => s.profile);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [selected, setSelected] = useState<string[]>([]);

  function toggle(key: string) {
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  async function handleContinue() {
    await completeOnboarding(selected.length ? selected : FOCUS_AREAS.map((f) => f.key));
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Hey {profile?.full_name ?? 'there'} 👋{'\n'}What are we fixing first?
        </Text>
        <Text style={styles.subtitle}>Pick what matters most — you can do it all later.</Text>

        {FOCUS_AREAS.map((f) => {
          const active = selected.includes(f.key);
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.option, active && styles.optionActive]}
              onPress={() => toggle(f.key)}
              activeOpacity={0.8}
            >
              <View style={[styles.optionIcon, active && { backgroundColor: colors.primary }]}>
                <Ionicons name={f.icon} size={18} color={active ? colors.white : colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>{f.title}</Text>
                <Text style={styles.optionText}>{f.text}</Text>
              </View>
              <Ionicons
                name={active ? 'checkmark-circle' : 'ellipse-outline'}
                size={22}
                color={active ? colors.primary : colors.border}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label={selected.length ? `Let's go (${selected.length} picked)` : "Let's go"}
          onPress={() => void handleContinue()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: font.heading + 3,
    fontWeight: '800',
    lineHeight: 33,
  },
  subtitle: {
    color: colors.muted,
    fontSize: font.body,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  optionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  optionIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  optionTitle: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '700',
  },
  optionText: {
    color: colors.muted,
    fontSize: font.small,
    marginTop: 2,
  },
  footer: {
    padding: spacing.lg,
  },
});
