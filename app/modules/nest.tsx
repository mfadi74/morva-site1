import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ModuleScreen } from '@/components/ModuleScreen';
import { Card, Input, PrimaryButton, ProgressBar, SectionTitle } from '@/components/ui';
import { CoachCard } from '@/components/CoachCard';
import { colors, font, radius, spacing } from '@/constants/theme';
import { NEST_CHECKLIST } from '@/constants/content';
import { askCoach } from '@/lib/ai';
import { nestScore } from '@/lib/scores';
import { clamp, formatMoney } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore';

const COLOR = '#FBBF24';

export default function NestUp() {
  const nestGoal = useAppStore((s) => s.nestGoal);
  const setNestGoal = useAppStore((s) => s.setNestGoal);
  const addNestContribution = useAppStore((s) => s.addNestContribution);
  const toggleNestChecklist = useAppStore((s) => s.toggleNestChecklist);

  const [title, setTitle] = useState(nestGoal?.title ?? '');
  const [target, setTarget] = useState(nestGoal ? String(nestGoal.target_amount) : '');
  const [targetDate, setTargetDate] = useState(nestGoal?.target_date ?? '');
  const [contribution, setContribution] = useState('');
  const [advice, setAdvice] = useState('');
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [editing, setEditing] = useState(!nestGoal);

  const score = nestScore(nestGoal);

  async function handleSaveGoal() {
    const amount = parseFloat(target.replace(',', '.'));
    if (!title.trim()) {
      Alert.alert('Name your goal', 'e.g. "Move into my own place" or "Save a rental deposit".');
      return;
    }
    await setNestGoal(title, amount || 0, targetDate);
    setEditing(false);
  }

  async function handleContribute() {
    const value = parseFloat(contribution.replace(',', '.'));
    if (!value || value <= 0) {
      Alert.alert('Amount?', 'Enter how much you saved toward your goal.');
      return;
    }
    await addNestContribution(value);
    setContribution('');
  }

  async function handleAdvice() {
    setAdviceLoading(true);
    const pct = nestGoal && nestGoal.target_amount > 0
      ? Math.round((nestGoal.saved_amount / nestGoal.target_amount) * 100)
      : 0;
    const text = await askCoach(
      `My housing goal: "${nestGoal?.title ?? 'move out'}", saved ${formatMoney(nestGoal?.saved_amount ?? 0)} ` +
        `of ${formatMoney(nestGoal?.target_amount ?? 0)} (${pct}%). ` +
        `Checklist done: ${nestGoal?.checklist.length ?? 0}/6. Give me one practical next step.`,
      'nest',
    );
    setAdvice(text);
    setAdviceLoading(false);
  }

  const pct = nestGoal && nestGoal.target_amount > 0
    ? clamp((nestGoal.saved_amount / nestGoal.target_amount) * 100, 0, 100)
    : 0;

  return (
    <ModuleScreen
      title="NestUp"
      subtitle="Plan your own place"
      icon="home"
      color={COLOR}
      score={score}
    >
      {nestGoal && !editing ? (
        <Card style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.goalTitle}>{nestGoal.title}</Text>
              {nestGoal.target_date ? (
                <Text style={styles.goalDate}>Target: {nestGoal.target_date}</Text>
              ) : null}
            </View>
            <TouchableOpacity onPress={() => setEditing(true)} hitSlop={8}>
              <Ionicons name="create-outline" size={20} color={colors.muted} />
            </TouchableOpacity>
          </View>
          <Text style={styles.goalAmount}>
            {formatMoney(nestGoal.saved_amount)}{' '}
            <Text style={styles.goalTarget}>of {formatMoney(nestGoal.target_amount)}</Text>
          </Text>
          <ProgressBar value={pct} color={COLOR} height={8} />
          <Text style={styles.goalPct}>{Math.round(pct)}% toward your goal</Text>
        </Card>
      ) : (
        <Card>
          <Text style={styles.setupTitle}>{nestGoal ? 'Edit your goal' : 'Set your housing goal'}</Text>
          <Input
            placeholder="Goal (e.g. Move into my own place)"
            value={title}
            onChangeText={setTitle}
            style={{ backgroundColor: colors.cardAlt, marginBottom: spacing.sm }}
          />
          <Input
            placeholder="Target amount (deposit / upfront cost) $"
            value={target}
            onChangeText={setTarget}
            keyboardType="decimal-pad"
            style={{ backgroundColor: colors.cardAlt, marginBottom: spacing.sm }}
          />
          <Input
            placeholder="Target date (optional, e.g. Dec 2026)"
            value={targetDate}
            onChangeText={setTargetDate}
            style={{ backgroundColor: colors.cardAlt, marginBottom: spacing.md }}
          />
          <PrimaryButton label={nestGoal ? 'Update goal' : 'Set goal (+10 XP)'} onPress={() => void handleSaveGoal()} />
        </Card>
      )}

      {nestGoal && (
        <>
          <SectionTitle title="Add to your savings" />
          <Card>
            <View style={styles.contributeRow}>
              <Input
                placeholder="Amount saved ($)"
                value={contribution}
                onChangeText={setContribution}
                keyboardType="decimal-pad"
                style={{ flex: 1, backgroundColor: colors.cardAlt }}
              />
              <PrimaryButton
                label="Add"
                onPress={() => void handleContribute()}
                style={{ paddingHorizontal: spacing.lg }}
              />
            </View>
          </Card>
        </>
      )}

      <SectionTitle title="Readiness checklist" />
      <Text style={styles.hint}>
        Only 3.9% of Gen Z renters can afford to rent alone. Tick what's true — each one gets you closer.
      </Text>
      {NEST_CHECKLIST.map((item) => {
        const done = nestGoal?.checklist.includes(item.key) ?? false;
        return (
          <TouchableOpacity
            key={item.key}
            activeOpacity={0.8}
            disabled={!nestGoal}
            onPress={() => void toggleNestChecklist(item.key)}
          >
            <Card style={[styles.checkRow, done && styles.checkDone, !nestGoal && { opacity: 0.5 }]}>
              <Ionicons
                name={done ? 'checkmark-circle' : 'ellipse-outline'}
                size={22}
                color={done ? COLOR : colors.border}
              />
              <Text style={[styles.checkText, done && styles.checkTextDone]}>{item.label}</Text>
            </Card>
          </TouchableOpacity>
        );
      })}
      {!nestGoal && <Text style={styles.hint}>Set a goal above to unlock the checklist.</Text>}

      <SectionTitle
        title="AI housing coach"
        action={
          <TouchableOpacity onPress={() => void handleAdvice()}>
            <Text style={styles.refresh}>{advice ? 'Refresh' : 'Get advice'}</Text>
          </TouchableOpacity>
        }
      />
      {advice || adviceLoading ? (
        <CoachCard message={advice} loading={adviceLoading} title="Housing Coach" />
      ) : (
        <Text style={styles.hint}>Tap "Get advice" for your next practical step.</Text>
      )}
    </ModuleScreen>
  );
}

const styles = StyleSheet.create({
  goalCard: {
    borderColor: COLOR,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  goalTitle: {
    color: colors.text,
    fontSize: font.subheading,
    fontWeight: '800',
  },
  goalDate: {
    color: colors.muted,
    fontSize: font.tiny,
    marginTop: 2,
  },
  goalAmount: {
    color: COLOR,
    fontSize: font.heading,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  goalTarget: {
    color: colors.muted,
    fontSize: font.body,
    fontWeight: '400',
  },
  goalPct: {
    color: colors.muted,
    fontSize: font.tiny,
    marginTop: spacing.sm,
  },
  setupTitle: {
    color: colors.text,
    fontSize: font.subheading,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  contributeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  hint: {
    color: colors.muted,
    fontSize: font.small,
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  checkDone: {
    borderColor: COLOR,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
  },
  checkText: {
    color: colors.text,
    fontSize: font.small,
    fontWeight: '600',
    flex: 1,
  },
  checkTextDone: {
    color: colors.muted,
  },
  refresh: {
    color: colors.primary,
    fontSize: font.small,
    fontWeight: '700',
  },
});
