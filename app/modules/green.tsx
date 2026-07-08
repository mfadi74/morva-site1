import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO, subDays } from 'date-fns';
import { ModuleScreen } from '@/components/ModuleScreen';
import { Card, EmptyState, PrimaryButton, SectionTitle, StatBox } from '@/components/ui';
import { BarChart } from '@/components/BarChart';
import { CoachCard } from '@/components/CoachCard';
import { colors, font, radius, spacing } from '@/constants/theme';
import { GREEN_ACTIONS } from '@/constants/content';
import { askCoach } from '@/lib/ai';
import { greenScore } from '@/lib/scores';
import { dayKey } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore';

const COLOR = '#34D399';

export default function Greenprint() {
  const greenActions = useAppStore((s) => s.greenActions);
  const logGreenAction = useAppStore((s) => s.logGreenAction);

  const [tip, setTip] = useState('');
  const [tipLoading, setTipLoading] = useState(false);

  const score = greenScore(greenActions);
  const weekCount = greenActions.filter((a) => a.date >= dayKey(6)).length;
  const variety = new Set(greenActions.filter((a) => a.date >= dayKey(6)).map((a) => a.category)).size;

  const weekBars = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const key = dayKey(6 - i);
      const count = greenActions.filter((a) => a.date === key).length;
      return {
        label: format(subDays(new Date(), 6 - i), 'EEE'),
        value: count,
        color: COLOR,
      };
    });
  }, [greenActions]);

  async function handleTip() {
    setTipLoading(true);
    const text = await askCoach(
      `I've logged ${greenActions.length} green actions (${weekCount} this week). ` +
        'Give me one easy, specific eco action I could do today.',
      'green',
    );
    setTip(text);
    setTipLoading(false);
  }

  return (
    <ModuleScreen
      title="Greenprint"
      subtitle="Small actions, real impact"
      icon="leaf"
      color={COLOR}
      score={score}
    >
      <View style={styles.statsRow}>
        <StatBox label="This week" value={String(weekCount)} color={COLOR} />
        <StatBox label="All time" value={String(greenActions.length)} />
        <StatBox label="Variety" value={`${variety}/5`} />
      </View>

      <SectionTitle title="Log a green action" />
      {GREEN_ACTIONS.map((a) => (
        <TouchableOpacity
          key={a.key}
          activeOpacity={0.8}
          onPress={() => void logGreenAction(a.key, a.label, a.xp)}
        >
          <Card style={styles.actionRow}>
            <View style={[styles.actionIcon, { backgroundColor: `${COLOR}22` }]}>
              <Ionicons name={a.icon as keyof typeof Ionicons.glyphMap} size={18} color={COLOR} />
            </View>
            <Text style={styles.actionLabel}>{a.label}</Text>
            <View style={styles.plusBadge}>
              <Ionicons name="add" size={16} color={colors.white} />
            </View>
          </Card>
        </TouchableOpacity>
      ))}

      <SectionTitle title="Your week" />
      <Card>
        {greenActions.length === 0 ? (
          <Text style={styles.chartHint}>Log an action to start your impact streak.</Text>
        ) : (
          <BarChart bars={weekBars} height={90} />
        )}
      </Card>

      <SectionTitle
        title="AI eco tip"
        action={
          <TouchableOpacity onPress={() => void handleTip()}>
            <Text style={styles.refresh}>{tip ? 'Another' : 'Get a tip'}</Text>
          </TouchableOpacity>
        }
      />
      {tip || tipLoading ? (
        <CoachCard message={tip} loading={tipLoading} title="Eco Coach" />
      ) : (
        <Text style={styles.chartHint}>
          Climate is a top concern for Gen Z globally. Tap "Get a tip" for one easy action.
        </Text>
      )}

      <SectionTitle title="Recent actions" />
      {greenActions.length === 0 ? (
        <EmptyState
          icon="leaf"
          title="No actions yet"
          subtitle="You don't need to be perfect to make a difference. One small swap today counts."
        />
      ) : (
        greenActions.slice(0, 12).map((a) => {
          const def = GREEN_ACTIONS.find((d) => d.key === a.category);
          return (
            <Card key={a.id} style={styles.logRow}>
              <Ionicons
                name={(def?.icon ?? 'leaf-outline') as keyof typeof Ionicons.glyphMap}
                size={16}
                color={COLOR}
              />
              <Text style={styles.logLabel}>{def?.label ?? a.category}</Text>
              <Text style={styles.logDate}>{format(parseISO(a.date), 'MMM d')}</Text>
            </Card>
          );
        })
      )}
    </ModuleScreen>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  actionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    color: colors.text,
    fontSize: font.small,
    fontWeight: '600',
    flex: 1,
  },
  plusBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartHint: {
    color: colors.muted,
    fontSize: font.small,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
  refresh: {
    color: colors.primary,
    fontSize: font.small,
    fontWeight: '700',
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  logLabel: {
    color: colors.text,
    fontSize: font.small,
    fontWeight: '600',
    flex: 1,
  },
  logDate: {
    color: colors.muted,
    fontSize: font.tiny,
  },
});
