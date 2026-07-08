import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { ModuleScreen } from '@/components/ModuleScreen';
import { Card, EmptyState, Input, PrimaryButton, SectionTitle, StatBox } from '@/components/ui';
import { CoachCard } from '@/components/CoachCard';
import { colors, font, radius, spacing } from '@/constants/theme';
import { CAREER_ACTIONS } from '@/constants/content';
import { askCoach } from '@/lib/ai';
import { careerScore } from '@/lib/scores';
import { dayKey } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore';
import { CareerActionType } from '@/types';

const ENERGY_LABELS = ['Drained', 'Low', 'Okay', 'Good', 'Energized'];
const WORKLOAD_LABELS = ['Light', 'Steady', 'Full', 'Heavy', 'Crushing'];

export default function CareerGPS() {
  const careerActions = useAppStore((s) => s.careerActions);
  const careerProfile = useAppStore((s) => s.careerProfile);
  const saveCareerProfile = useAppStore((s) => s.saveCareerProfile);
  const logCareerAction = useAppStore((s) => s.logCareerAction);

  const [role, setRole] = useState(careerProfile?.target_role ?? '');
  const [energy, setEnergy] = useState(careerProfile?.energy ?? 3);
  const [workload, setWorkload] = useState(careerProfile?.workload ?? 3);
  const [note, setNote] = useState('');
  const [advice, setAdvice] = useState('');
  const [adviceLoading, setAdviceLoading] = useState(false);

  const score = careerScore(careerActions, careerProfile);
  const last30 = careerActions.filter((a) => a.date >= dayKey(29));
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const a of last30) map[a.type] = (map[a.type] ?? 0) + 1;
    return map;
  }, [last30]);

  const burntOut = careerProfile ? careerProfile.workload - careerProfile.energy >= 2 : false;

  async function handleSaveProfile() {
    await saveCareerProfile(role, energy, workload);
    Alert.alert('Saved', 'Your career target and check-in are updated.');
  }

  async function handleAction(type: CareerActionType) {
    await logCareerAction(type, note);
    setNote('');
  }

  async function handleAdvice() {
    setAdviceLoading(true);
    const text = await askCoach(
      `My target role is "${careerProfile?.target_role || 'undecided'}". ` +
        `Last 30 days: ${counts.application ?? 0} applications, ${counts.networking ?? 0} networking, ` +
        `${counts.interview ?? 0} interviews, ${counts.learning ?? 0} learning sessions. ` +
        `Energy ${energy}/5, workload ${workload}/5. Give me one specific next step for my career this week.`,
      'career',
    );
    setAdvice(text);
    setAdviceLoading(false);
  }

  return (
    <ModuleScreen
      title="CareerGPS"
      subtitle="Direction, not anxiety"
      icon="compass"
      color="#38BDF8"
      score={score}
    >
      <SectionTitle title="Your target" />
      <Card>
        <Input
          placeholder="Dream role or direction (e.g. UX Designer)"
          value={role}
          onChangeText={setRole}
          style={{ backgroundColor: colors.cardAlt, marginBottom: spacing.md }}
        />
        <Text style={styles.sliderLabel}>Energy right now: {ENERGY_LABELS[energy - 1]}</Text>
        <Scale value={energy} onChange={setEnergy} color={colors.success} />
        <Text style={[styles.sliderLabel, { marginTop: spacing.md }]}>
          Workload right now: {WORKLOAD_LABELS[workload - 1]}
        </Text>
        <Scale value={workload} onChange={setWorkload} color={colors.warning} />
        <PrimaryButton
          label="Save target & check-in"
          onPress={() => void handleSaveProfile()}
          style={{ marginTop: spacing.md }}
        />
      </Card>

      {burntOut && (
        <Card style={styles.burnout}>
          <Ionicons name="warning" size={18} color={colors.warning} />
          <Text style={styles.burnoutText}>
            Your workload is outrunning your energy — a classic burnout signal (86% of Gen Z report
            it). Protect one evening this week and say no to one thing.
          </Text>
        </Card>
      )}

      <SectionTitle title="Log a career move" />
      <Input
        placeholder="Optional note (role, company, who…)"
        value={note}
        onChangeText={setNote}
        style={{ backgroundColor: colors.card, marginBottom: spacing.sm }}
      />
      <View style={styles.actionGrid}>
        {CAREER_ACTIONS.map((a) => (
          <TouchableOpacity
            key={a.key}
            style={styles.actionBtn}
            onPress={() => void handleAction(a.key as CareerActionType)}
            activeOpacity={0.8}
          >
            <Ionicons name={a.icon as keyof typeof Ionicons.glyphMap} size={20} color="#38BDF8" />
            <Text style={styles.actionLabel}>{a.label}</Text>
            <Text style={styles.actionXp}>+{a.xp} XP</Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionTitle title="Last 30 days" />
      <View style={styles.statsRow}>
        <StatBox label="Applied" value={String(counts.application ?? 0)} />
        <StatBox label="Networked" value={String(counts.networking ?? 0)} />
        <StatBox label="Interviews" value={String(counts.interview ?? 0)} color={colors.success} />
      </View>

      <SectionTitle
        title="AI career coach"
        action={
          <TouchableOpacity onPress={() => void handleAdvice()}>
            <Text style={styles.refresh}>{advice ? 'Refresh' : 'Get advice'}</Text>
          </TouchableOpacity>
        }
      />
      {advice || adviceLoading ? (
        <CoachCard message={advice} loading={adviceLoading} title="Career Coach" />
      ) : (
        <Text style={styles.hint}>Tap "Get advice" for your specific next move.</Text>
      )}

      <SectionTitle title="Recent activity" />
      {careerActions.length === 0 ? (
        <EmptyState
          icon="compass"
          title="No moves logged yet"
          subtitle="Careers are built on reps. Log one application or one message above to start."
        />
      ) : (
        careerActions.slice(0, 12).map((a) => {
          const def = CAREER_ACTIONS.find((d) => d.key === a.type);
          return (
            <Card key={a.id} style={styles.logRow}>
              <Ionicons
                name={(def?.icon ?? 'ellipse') as keyof typeof Ionicons.glyphMap}
                size={16}
                color="#38BDF8"
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.logTitle}>{def?.label ?? a.type}</Text>
                {a.note ? <Text style={styles.logNote}>{a.note}</Text> : null}
              </View>
              <Text style={styles.logDate}>{format(parseISO(a.date), 'MMM d')}</Text>
            </Card>
          );
        })
      )}
    </ModuleScreen>
  );
}

function Scale({
  value,
  onChange,
  color,
}: {
  value: number;
  onChange: (v: number) => void;
  color: string;
}) {
  return (
    <View style={styles.scale}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity
          key={n}
          style={[
            styles.scaleDot,
            { borderColor: color },
            value >= n && { backgroundColor: color },
          ]}
          onPress={() => onChange(n)}
        >
          <Text style={[styles.scaleNum, value >= n && { color: colors.white }]}>{n}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sliderLabel: {
    color: colors.text,
    fontSize: font.small,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  scale: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  scaleDot: {
    flex: 1,
    height: 40,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaleNum: {
    color: colors.muted,
    fontWeight: '800',
    fontSize: font.body,
  },
  burnout: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    borderColor: colors.warning,
    backgroundColor: colors.warningSoft,
    alignItems: 'flex-start',
  },
  burnoutText: {
    color: colors.text,
    fontSize: font.small,
    lineHeight: 19,
    flex: 1,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  actionBtn: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  actionLabel: {
    color: colors.text,
    fontSize: font.small,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionXp: {
    color: colors.muted,
    fontSize: font.tiny,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  refresh: {
    color: colors.primary,
    fontSize: font.small,
    fontWeight: '700',
  },
  hint: {
    color: colors.muted,
    fontSize: font.small,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  logTitle: {
    color: colors.text,
    fontSize: font.small,
    fontWeight: '600',
  },
  logNote: {
    color: colors.muted,
    fontSize: font.tiny,
    marginTop: 1,
  },
  logDate: {
    color: colors.muted,
    fontSize: font.tiny,
  },
});
