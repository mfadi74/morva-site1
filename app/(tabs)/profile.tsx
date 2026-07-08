import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { Card, PrimaryButton, ProgressBar, SectionTitle, StatBox } from '@/components/ui';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { colors, font, radius, spacing } from '@/constants/theme';
import { BRANDING } from '@/constants/branding';
import { ACHIEVEMENTS } from '@/constants/content';
import { isSupabaseEnabled, supabase } from '@/lib/supabase';
import { isAiLive } from '@/lib/ai';
import { computeStreak, levelFromXp } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore';
import { useT } from '@/lib/i18n';

export default function Profile() {
  const profile = useAppStore((s) => s.profile);
  const { t } = useT();
  const transactions = useAppStore((s) => s.transactions);
  const moods = useAppStore((s) => s.moods);
  const signOutLocal = useAppStore((s) => s.signOutLocal);

  if (!profile) return null;

  const { level, intoLevel, forNext } = levelFromXp(profile.xp_points);
  const streak = computeStreak(profile.activity_dates);
  const initials = profile.full_name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  function handleSignOut() {
    Alert.alert(
      'Sign out?',
      profile?.is_guest
        ? 'Demo mode: signing out erases all data on this device. This cannot be undone.'
        : 'Your cloud data stays safe. Local data on this device will be cleared.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              if (isSupabaseEnabled && supabase) await supabase.auth.signOut();
              await signOutLocal();
              router.replace('/(auth)/welcome');
            })();
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{profile.full_name}</Text>
          <Text style={styles.meta}>
            {profile.country ? `${profile.country} · ` : ''}
            Member since {format(parseISO(profile.created_at), 'MMM yyyy')}
            {profile.is_guest ? ' · Demo mode' : ''}
          </Text>
        </View>

        <Card>
          <View style={styles.levelHeader}>
            <Text style={styles.levelTitle}>Level {level}</Text>
            <Text style={styles.xp}>{profile.xp_points} XP</Text>
          </View>
          <ProgressBar value={(intoLevel / forNext) * 100} />
          <Text style={styles.levelHint}>
            {forNext - intoLevel} XP to level {level + 1}
          </Text>
        </Card>

        <View style={styles.statsRow}>
          <StatBox label={t('profile.streak')} value={`${streak}🔥`} />
          <StatBox label={t('profile.checkins')} value={String(moods.length)} />
          <StatBox label={t('profile.transactions')} value={String(transactions.length)} />
        </View>

        <SectionTitle title={t('profile.teams')} />
        <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/modules/teams')}>
          <Card style={styles.teamsCard}>
            <View style={styles.teamsIcon}>
              <Ionicons name="business" size={20} color={BRANDING.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.teamsTitle}>{t('profile.teams')}</Text>
              <Text style={styles.teamsText}>{t('profile.teamsText')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </Card>
        </TouchableOpacity>

        <SectionTitle title={t('profile.settings')} />
        <Card>
          <Text style={styles.settingLabel}>{t('profile.language')}</Text>
          <LanguageSwitcher />
        </Card>

        <SectionTitle title={`${t('profile.achievements')} (${profile.achievements.length}/${ACHIEVEMENTS.length})`} />
        <View style={styles.achievementGrid}>
          {ACHIEVEMENTS.map((a) => {
            const earned = profile.achievements.includes(a.key);
            return (
              <Card key={a.key} style={[styles.achievement, !earned && { opacity: 0.4 }]}>
                <View style={[styles.achievementIcon, earned && { backgroundColor: 'rgba(251,191,36,0.15)' }]}>
                  <Ionicons
                    name={a.icon as keyof typeof Ionicons.glyphMap}
                    size={18}
                    color={earned ? colors.gold : colors.muted}
                  />
                </View>
                <Text style={styles.achievementTitle}>{a.title}</Text>
                <Text style={styles.achievementDesc} numberOfLines={2}>
                  {a.description}
                </Text>
              </Card>
            );
          })}
        </View>

        <SectionTitle title={t('profile.appStatus')} />
        <Card>
          <StatusRow
            icon="cloud"
            label="Cloud sync (Supabase)"
            value={isSupabaseEnabled ? 'Connected' : 'Off — local demo mode'}
            ok={isSupabaseEnabled}
          />
          <StatusRow
            icon="sparkles"
            label="AI coach (Claude)"
            value={isAiLive ? 'Live' : 'Built-in demo coach'}
            ok={isAiLive}
          />
          <Text style={styles.statusHint}>
            Add keys in your .env file to switch on cloud accounts and live AI — see README.
          </Text>
        </Card>

        <PrimaryButton
          label={t('profile.signOut')}
          variant="danger"
          onPress={handleSignOut}
          style={{ marginTop: spacing.lg }}
        />
        <Text style={styles.version}>
          {BRANDING.appName} v1.0.0 · {BRANDING.tagline}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusRow({
  icon,
  label,
  value,
  ok,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  ok: boolean;
}) {
  return (
    <View style={styles.statusRow}>
      <Ionicons name={icon} size={16} color={ok ? colors.success : colors.muted} />
      <Text style={styles.statusLabel}>{label}</Text>
      <Text style={[styles.statusValue, { color: ok ? colors.success : colors.muted }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  scroll: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    color: colors.white,
    fontSize: font.heading,
    fontWeight: '800',
  },
  name: {
    color: colors.text,
    fontSize: font.heading,
    fontWeight: '800',
  },
  meta: {
    color: colors.muted,
    fontSize: font.small,
    marginTop: 4,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  levelTitle: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '800',
  },
  xp: {
    color: colors.primary,
    fontSize: font.body,
    fontWeight: '800',
  },
  levelHint: {
    color: colors.muted,
    fontSize: font.tiny,
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  achievement: {
    width: '48%',
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  achievementTitle: {
    color: colors.text,
    fontSize: font.small,
    fontWeight: '800',
    textAlign: 'center',
  },
  achievementDesc: {
    color: colors.muted,
    fontSize: font.tiny,
    textAlign: 'center',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  statusLabel: {
    color: colors.text,
    fontSize: font.small,
    fontWeight: '600',
    flex: 1,
  },
  statusValue: {
    fontSize: font.small,
    fontWeight: '700',
  },
  statusHint: {
    color: colors.muted,
    fontSize: font.tiny,
    marginTop: spacing.xs,
  },
  version: {
    color: colors.muted,
    fontSize: font.tiny,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  teamsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  teamsIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamsTitle: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '700',
  },
  teamsText: {
    color: colors.muted,
    fontSize: font.small,
    marginTop: 2,
  },
  settingLabel: {
    color: colors.text,
    fontSize: font.small,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
});
