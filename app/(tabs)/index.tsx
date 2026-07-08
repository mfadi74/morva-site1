import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Card, ProgressBar, SectionTitle } from '@/components/ui';
import { ScoreRing } from '@/components/ScoreRing';
import { CoachCard } from '@/components/CoachCard';
import { colors, font, radius, spacing } from '@/constants/theme';
import { growthScores, lifeScore, moduleScores } from '@/lib/scores';
import { askCoach, CoachContext } from '@/lib/ai';
import { computeStreak, dayKey, greeting, levelFromXp } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore';
import { GrowthKey } from '@/types';

const MODULE_META: Record<
  string,
  { icon: keyof typeof Ionicons.glyphMap; color: string; route: '/(tabs)/money' | '/(tabs)/mental' | '/(tabs)/hustle' | null }
> = {
  money: { icon: 'wallet', color: colors.success, route: '/(tabs)/money' },
  mind: { icon: 'heart', color: colors.secondary, route: '/(tabs)/mental' },
  hustle: { icon: 'rocket', color: colors.warning, route: '/(tabs)/hustle' },
  momentum: { icon: 'flame', color: colors.primary, route: null },
};

const GROWTH_META: Record<
  GrowthKey,
  { icon: keyof typeof Ionicons.glyphMap; color: string; route: '/modules/career' | '/modules/skills' | '/modules/health' | '/modules/social'; tag: string }
> = {
  career: { icon: 'compass', color: '#38BDF8', route: '/modules/career', tag: 'Career' },
  skills: { icon: 'school', color: '#A78BFA', route: '/modules/skills', tag: 'Skills' },
  health: { icon: 'fitness', color: '#34D399', route: '/modules/health', tag: 'Health' },
  social: { icon: 'people', color: '#F472B6', route: '/modules/social', tag: 'Social' },
};

export default function Home() {
  const profile = useAppStore((s) => s.profile);
  const transactions = useAppStore((s) => s.transactions);
  const moods = useAppStore((s) => s.moods);
  const hustle = useAppStore((s) => s.hustle);
  const careerActions = useAppStore((s) => s.careerActions);
  const careerProfile = useAppStore((s) => s.careerProfile);
  const skills = useAppStore((s) => s.skills);
  const healthLogs = useAppStore((s) => s.healthLogs);
  const connections = useAppStore((s) => s.connections);
  const socialChallenges = useAppStore((s) => s.socialChallenges);

  const [insight, setInsight] = useState('');
  const [insightLoading, setInsightLoading] = useState(true);

  const scores = useMemo(
    () => (profile ? moduleScores(profile, transactions, moods, hustle) : []),
    [profile, transactions, moods, hustle],
  );
  const growth = useMemo(() => {
    const challengesLast7 = socialChallenges.filter((c) => c.date >= dayKey(6)).length;
    return growthScores(careerActions, careerProfile, skills, healthLogs, connections, challengesLast7);
  }, [careerActions, careerProfile, skills, healthLogs, connections, socialChallenges]);
  const life = lifeScore(scores, growth);
  const streak = profile ? computeStreak(profile.activity_dates) : 0;
  const { level, intoLevel, forNext } = levelFromXp(profile?.xp_points ?? 0);

  useEffect(() => {
    let cancelled = false;
    async function loadInsight() {
      const weakest = [...scores].sort((a, b) => a.score - b.score)[0];
      const context: CoachContext =
        weakest?.key === 'money' ? 'money' : weakest?.key === 'hustle' ? 'hustle' : 'general';
      const text = await askCoach(
        `My Life Score is ${life}/100. Module scores: ${scores
          .map((s) => `${s.label} ${s.score}`)
          .join(', ')}. My weakest area is ${weakest?.label ?? 'unknown'}. ` +
          'Give me one specific, encouraging suggestion for today.',
        context,
      );
      if (!cancelled) {
        setInsight(text);
        setInsightLoading(false);
      }
    }
    void loadInsight();
    return () => {
      cancelled = true;
    };
    // Refresh the insight when the overall picture changes meaningfully.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [life]);

  if (!profile) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>
              {greeting()}, {profile.full_name.split(' ')[0]}
            </Text>
            <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM d')}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={16} color={streak > 0 ? colors.warning : colors.muted} />
            <Text style={[styles.streakText, streak > 0 && { color: colors.warning }]}>
              {streak}
            </Text>
          </View>
        </View>

        <Card style={styles.scoreCard}>
          <ScoreRing score={life} />
          <Text style={styles.scoreHint}>
            {life === 0
              ? 'Log your first mood or transaction to power up your score'
              : life < 40
                ? 'Building the foundation — keep stacking small wins'
                : life < 70
                  ? 'Solid momentum. Your future self says thanks 🙌'
                  : 'Elite mode. You are genuinely running your life 🏆'}
          </Text>
          <View style={styles.levelRow}>
            <Text style={styles.levelText}>LVL {level}</Text>
            <ProgressBar value={(intoLevel / forNext) * 100} height={6} />
            <Text style={styles.xpText}>{profile.xp_points} XP</Text>
          </View>
        </Card>

        <SectionTitle title="Today's insight" />
        <CoachCard message={insight} loading={insightLoading} />

        <SectionTitle title="Your modules" />
        {scores.map((m) => {
          const meta = MODULE_META[m.key];
          return (
            <TouchableOpacity
              key={m.key}
              activeOpacity={meta.route ? 0.75 : 1}
              onPress={() => meta.route && router.push(meta.route)}
            >
              <Card style={styles.moduleCard}>
                <View style={[styles.moduleIcon, { backgroundColor: `${meta.color}22` }]}>
                  <Ionicons name={meta.icon} size={18} color={meta.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.moduleHeader}>
                    <Text style={styles.moduleName}>{m.label}</Text>
                    <Text style={[styles.moduleScore, { color: meta.color }]}>{m.score}</Text>
                  </View>
                  <ProgressBar value={m.score} color={meta.color} height={6} />
                </View>
                {meta.route && (
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.muted}
                    style={{ marginLeft: spacing.sm }}
                  />
                )}
              </Card>
            </TouchableOpacity>
          );
        })}

        <SectionTitle
          title="Grow your life"
          action={<Text style={styles.phaseTag}>PHASE 2</Text>}
        />
        <View style={styles.growGrid}>
          {growth.map((g) => {
            const meta = GROWTH_META[g.key];
            return (
              <TouchableOpacity
                key={g.key}
                style={styles.growCard}
                activeOpacity={0.8}
                onPress={() => router.push(meta.route)}
              >
                <View style={styles.growTop}>
                  <View style={[styles.growIcon, { backgroundColor: `${meta.color}22` }]}>
                    <Ionicons name={meta.icon} size={18} color={meta.color} />
                  </View>
                  {g.hasData ? (
                    <Text style={[styles.growScore, { color: meta.color }]}>{g.score}</Text>
                  ) : (
                    <Ionicons name="add-circle" size={20} color={colors.muted} />
                  )}
                </View>
                <Text style={styles.growName}>{g.label}</Text>
                <Text style={styles.growTag}>{meta.tag}</Text>
                <ProgressBar value={g.score} color={meta.color} height={4} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  greeting: {
    color: colors.text,
    fontSize: font.heading,
    fontWeight: '800',
  },
  date: {
    color: colors.muted,
    fontSize: font.small,
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  streakText: {
    color: colors.muted,
    fontSize: font.small,
    fontWeight: '800',
  },
  scoreCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  scoreHint: {
    color: colors.muted,
    fontSize: font.small,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 19,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    width: '100%',
    gap: spacing.sm,
  },
  levelText: {
    color: colors.primary,
    fontSize: font.tiny,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  xpText: {
    color: colors.muted,
    fontSize: font.tiny,
    fontWeight: '700',
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  moduleIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  moduleName: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '700',
  },
  moduleScore: {
    fontSize: font.body,
    fontWeight: '800',
  },
  phaseTag: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  growGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  growCard: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  growTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  growIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  growScore: {
    fontSize: font.subheading,
    fontWeight: '800',
  },
  growName: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '700',
  },
  growTag: {
    color: colors.muted,
    fontSize: font.tiny,
    marginBottom: spacing.sm,
  },
});
