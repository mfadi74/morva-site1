import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, subDays } from 'date-fns';
import { ModuleScreen } from '@/components/ModuleScreen';
import { Card, PrimaryButton, ProgressBar, SectionTitle } from '@/components/ui';
import { BarChart } from '@/components/BarChart';
import { CoachCard } from '@/components/CoachCard';
import { colors, font, radius, spacing } from '@/constants/theme';
import { HEALTH_TARGETS } from '@/constants/content';
import { askCoach } from '@/lib/ai';
import { healthScore } from '@/lib/scores';
import { clamp, dayKey, todayKey } from '@/lib/utils';
import { useAppStore, HealthInput } from '@/stores/appStore';

const COLOR = '#34D399';

interface Metric {
  key: keyof HealthInput;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  unit: string;
  step: number;
  target: number;
  lowerBetter?: boolean;
}

const METRICS: Metric[] = [
  { key: 'sleep_hours', label: 'Sleep', icon: 'moon', unit: 'h', step: 0.5, target: HEALTH_TARGETS.sleep_hours },
  { key: 'water_cups', label: 'Water', icon: 'water', unit: 'cups', step: 1, target: HEALTH_TARGETS.water_cups },
  { key: 'moved_minutes', label: 'Movement', icon: 'walk', unit: 'min', step: 5, target: HEALTH_TARGETS.moved_minutes },
  { key: 'screen_hours', label: 'Screen time', icon: 'phone-portrait', unit: 'h', step: 0.5, target: HEALTH_TARGETS.screen_hours_max, lowerBetter: true },
];

export default function RootHealth() {
  const healthLogs = useAppStore((s) => s.healthLogs);
  const saveHealthToday = useAppStore((s) => s.saveHealthToday);

  const today = healthLogs.find((l) => l.date === todayKey());
  const [draft, setDraft] = useState<HealthInput>({
    sleep_hours: today?.sleep_hours ?? 7,
    water_cups: today?.water_cups ?? 4,
    moved_minutes: today?.moved_minutes ?? 20,
    screen_hours: today?.screen_hours ?? 5,
  });
  const [nudge, setNudge] = useState('');
  const [nudgeLoading, setNudgeLoading] = useState(false);

  const score = healthScore([
    { date: todayKey(), ...draft, updated_at: new Date().toISOString() },
    ...healthLogs.filter((l) => l.date !== todayKey()),
  ]);

  const weekBars = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const key = dayKey(6 - i);
      const log = healthLogs.find((l) => l.date === key);
      const s = log ? healthScore([log]) : 0;
      return {
        label: format(subDays(new Date(), 6 - i), 'EEE'),
        value: s,
        color: s >= 70 ? COLOR : s >= 40 ? colors.warning : colors.danger,
      };
    });
  }, [healthLogs]);

  function adjust(m: Metric, dir: 1 | -1) {
    setDraft((d) => ({
      ...d,
      [m.key]: clamp(Number((d[m.key] + dir * m.step).toFixed(1)), 0, 24),
    }));
  }

  async function handleNudge() {
    setNudgeLoading(true);
    const text = await askCoach(
      `Today: ${draft.sleep_hours}h sleep, ${draft.water_cups} cups water, ` +
        `${draft.moved_minutes} min movement, ${draft.screen_hours}h screen time. ` +
        'Give me one specific, doable health nudge for today.',
      'health',
    );
    setNudge(text);
    setNudgeLoading(false);
  }

  return (
    <ModuleScreen
      title="RootHealth"
      subtitle="Beat burnout at the root"
      icon="fitness"
      color={COLOR}
      score={score}
    >
      <SectionTitle title="Today's habits" />
      {METRICS.map((m) => {
        const value = draft[m.key];
        const pct = m.lowerBetter
          ? clamp((1 - Math.max(0, value - m.target) / m.target) * 100, 0, 100)
          : clamp((value / m.target) * 100, 0, 100);
        return (
          <Card key={m.key} style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: `${COLOR}22` }]}>
              <Ionicons name={m.icon} size={18} color={COLOR} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>{m.label}</Text>
                <Text style={styles.metricValue}>
                  {value}
                  {m.unit}
                  <Text style={styles.metricTarget}>
                    {' '}
                    {m.lowerBetter ? `(≤${m.target})` : `/ ${m.target}`}
                  </Text>
                </Text>
              </View>
              <ProgressBar value={pct} color={pct >= 70 ? COLOR : colors.warning} height={5} />
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity style={styles.stepBtn} onPress={() => adjust(m, -1)}>
                <Ionicons name="remove" size={16} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.stepBtn} onPress={() => adjust(m, 1)}>
                <Ionicons name="add" size={16} color={colors.text} />
              </TouchableOpacity>
            </View>
          </Card>
        );
      })}

      <PrimaryButton
        label={today ? 'Update today' : 'Save today (+15 XP)'}
        onPress={() => void saveHealthToday(draft)}
        style={{ marginTop: spacing.sm }}
      />

      <SectionTitle title="Your week" />
      <Card>
        {healthLogs.length === 0 ? (
          <Text style={styles.hint}>Save a day to start building your health trend.</Text>
        ) : (
          <BarChart bars={weekBars} maxValue={100} height={100} />
        )}
      </Card>

      <SectionTitle
        title="AI health nudge"
        action={
          <TouchableOpacity onPress={() => void handleNudge()}>
            <Text style={styles.refresh}>{nudge ? 'Refresh' : 'Get a nudge'}</Text>
          </TouchableOpacity>
        }
      />
      {nudge || nudgeLoading ? (
        <CoachCard message={nudge} loading={nudgeLoading} title="Health Coach" />
      ) : (
        <Text style={styles.hint}>Tap "Get a nudge" for one doable thing today.</Text>
      )}
    </ModuleScreen>
  );
}

const styles = StyleSheet.create({
  metricCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  metricLabel: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '700',
  },
  metricValue: {
    color: colors.text,
    fontSize: font.small,
    fontWeight: '700',
  },
  metricTarget: {
    color: colors.muted,
    fontSize: font.tiny,
    fontWeight: '400',
  },
  stepper: {
    flexDirection: 'row',
    gap: 6,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refresh: {
    color: colors.primary,
    fontSize: font.small,
    fontWeight: '700',
  },
  hint: {
    color: colors.muted,
    fontSize: font.small,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
});
