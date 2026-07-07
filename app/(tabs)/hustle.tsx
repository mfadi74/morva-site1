import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card, Input, PrimaryButton, ProgressBar, SectionTitle, StatBox } from '@/components/ui';
import { CoachCard } from '@/components/CoachCard';
import { colors, font, radius, spacing } from '@/constants/theme';
import { HUSTLE_CATEGORIES, ROADMAP_STEPS } from '@/constants/content';
import { askCoach } from '@/lib/ai';
import { formatMoney } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore';

export default function LaunchPad() {
  const hustle = useAppStore((s) => s.hustle);
  const startHustle = useAppStore((s) => s.startHustle);
  const completeRoadmapStep = useAppStore((s) => s.completeRoadmapStep);
  const logHustleIncome = useAppStore((s) => s.logHustleIncome);

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [income, setIncome] = useState('');
  const [coachAnswer, setCoachAnswer] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);
  const [question, setQuestion] = useState('');

  async function handleStart() {
    if (!selectedType) return;
    const goalValue = parseFloat(goal.replace(',', '.')) || 500;
    const category = HUSTLE_CATEGORIES.find((c) => c.key === selectedType);
    await startHustle(name || category?.name || 'My Hustle', selectedType, goalValue);
  }

  async function handleLogIncome() {
    const value = parseFloat(income.replace(',', '.'));
    if (!value || value <= 0) {
      Alert.alert('Almost there', 'Enter an amount greater than 0.');
      return;
    }
    await logHustleIncome(value);
    setIncome('');
  }

  async function handleAsk() {
    if (question.trim().length < 3) return;
    setCoachLoading(true);
    const category = HUSTLE_CATEGORIES.find((c) => c.key === hustle?.type);
    const text = await askCoach(
      `My side hustle: "${hustle?.name}" (${category?.name ?? 'general'}), ` +
        `currently at roadmap step ${hustle?.roadmap_step ?? 0}/6, earning ${formatMoney(
          hustle?.monthly_income ?? 0,
        )}/mo toward a ${formatMoney(hustle?.goal_income ?? 0)}/mo goal. My question: ${question}`,
      'hustle',
    );
    setCoachAnswer(text);
    setCoachLoading(false);
    setQuestion('');
  }

  // ── Browser: no hustle yet ───────────────────────────────────────
  if (!hustle) {
    const selected = HUSTLE_CATEGORIES.find((c) => c.key === selectedType);
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>LaunchPad</Text>
          <Text style={styles.subtitle}>Pick a hustle. Launch in 30 days.</Text>

          <SectionTitle title="Choose your lane" />
          {HUSTLE_CATEGORIES.map((c) => {
            const active = selectedType === c.key;
            return (
              <TouchableOpacity key={c.key} onPress={() => setSelectedType(c.key)} activeOpacity={0.8}>
                <Card style={[styles.categoryCard, active && styles.categoryActive]}>
                  <View style={[styles.categoryIcon, active && { backgroundColor: colors.primary }]}>
                    <Ionicons
                      name={c.icon as keyof typeof Ionicons.glyphMap}
                      size={18}
                      color={active ? colors.white : colors.primary}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.categoryHeader}>
                      <Text style={styles.categoryName}>{c.name}</Text>
                      <Text style={styles.categoryIncome}>{c.avgIncome}</Text>
                    </View>
                    <Text style={styles.categoryBlurb}>{c.blurb}</Text>
                    <Text style={styles.difficulty}>
                      Difficulty: {'●'.repeat(c.difficulty)}{'○'.repeat(3 - c.difficulty)}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}

          {selected && (
            <Card style={{ marginTop: spacing.sm }}>
              <Text style={styles.setupTitle}>Set up: {selected.name}</Text>
              <Input
                placeholder="Name your hustle (optional)"
                value={name}
                onChangeText={setName}
                style={{ marginBottom: spacing.md, backgroundColor: colors.cardAlt }}
              />
              <Input
                placeholder="Monthly income goal in $ (default 500)"
                value={goal}
                onChangeText={setGoal}
                keyboardType="decimal-pad"
                style={{ marginBottom: spacing.md, backgroundColor: colors.cardAlt }}
              />
              <PrimaryButton label="Start my roadmap (+30 XP)" onPress={() => void handleStart()} />
            </Card>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Active hustle: roadmap + income + coach ──────────────────────
  const category = HUSTLE_CATEGORIES.find((c) => c.key === hustle.type);
  const progress = Math.round((hustle.roadmap_step / 6) * 100);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{hustle.name}</Text>
        <Text style={styles.subtitle}>
          {category?.name ?? 'Side hustle'} ·{' '}
          {hustle.status === 'planning' ? 'Building 🛠️' : hustle.status === 'launched' ? 'Launched 🚀' : 'Earning 💸'}
        </Text>

        <View style={[styles.statsRow, { marginTop: spacing.md }]}>
          <StatBox label="This month" value={formatMoney(hustle.monthly_income)} color={colors.success} />
          <StatBox label="Goal" value={formatMoney(hustle.goal_income)} />
          <StatBox label="Roadmap" value={`${progress}%`} color={colors.warning} />
        </View>

        <SectionTitle title="30-day launch roadmap" />
        {ROADMAP_STEPS.map((step, i) => {
          const done = i < hustle.roadmap_step;
          const current = i === hustle.roadmap_step;
          return (
            <Card
              key={step.title}
              style={[styles.stepCard, current && { borderColor: colors.primary }]}
            >
              <View
                style={[
                  styles.stepBadge,
                  done && { backgroundColor: colors.success },
                  current && { backgroundColor: colors.primary },
                ]}
              >
                {done ? (
                  <Ionicons name="checkmark" size={14} color={colors.white} />
                ) : (
                  <Text style={styles.stepNumber}>{i + 1}</Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.stepTitle, done && styles.stepDone]}>{step.title}</Text>
                <Text style={styles.stepDetail}>{step.detail}</Text>
                {current && (
                  <PrimaryButton
                    label="Mark complete (+25 XP)"
                    onPress={() => void completeRoadmapStep()}
                    style={{ marginTop: spacing.sm, paddingVertical: 10 }}
                  />
                )}
              </View>
            </Card>
          );
        })}
        {hustle.roadmap_step >= 6 && (
          <Card style={{ borderColor: colors.gold, marginBottom: spacing.sm }}>
            <Text style={styles.launchedText}>
              🏆 Roadmap complete — you launched! Keep logging income and scale it up.
            </Text>
          </Card>
        )}

        <SectionTitle title="Log income" />
        <Card>
          <View style={styles.incomeRow}>
            <Input
              placeholder="Amount earned ($)"
              value={income}
              onChangeText={setIncome}
              keyboardType="decimal-pad"
              style={{ flex: 1, backgroundColor: colors.cardAlt }}
            />
            <PrimaryButton
              label="Add"
              onPress={() => void handleLogIncome()}
              style={{ paddingHorizontal: spacing.lg }}
            />
          </View>
          {hustle.goal_income > 0 && (
            <View style={{ marginTop: spacing.md }}>
              <ProgressBar
                value={(hustle.monthly_income / hustle.goal_income) * 100}
                color={colors.success}
              />
              <Text style={styles.goalHint}>
                {formatMoney(hustle.monthly_income)} of {formatMoney(hustle.goal_income)} monthly goal
              </Text>
            </View>
          )}
        </Card>

        <SectionTitle title="Ask your hustle coach" />
        <Card>
          <Input
            placeholder='e.g. "How do I find my first client?"'
            value={question}
            onChangeText={setQuestion}
            style={{ marginBottom: spacing.md, backgroundColor: colors.cardAlt }}
          />
          <PrimaryButton label="Ask" onPress={() => void handleAsk()} loading={coachLoading} />
        </Card>
        {(coachAnswer || coachLoading) && (
          <View style={{ marginTop: spacing.md }}>
            <CoachCard message={coachAnswer} loading={coachLoading} title="Hustle Coach" />
          </View>
        )}
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
  title: {
    color: colors.text,
    fontSize: font.heading,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.muted,
    fontSize: font.small,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  categoryCard: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  categoryActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  categoryIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '700',
  },
  categoryIncome: {
    color: colors.success,
    fontSize: font.tiny,
    fontWeight: '700',
  },
  categoryBlurb: {
    color: colors.muted,
    fontSize: font.small,
    marginTop: 2,
    lineHeight: 18,
  },
  difficulty: {
    color: colors.warning,
    fontSize: font.tiny,
    marginTop: 4,
  },
  setupTitle: {
    color: colors.text,
    fontSize: font.subheading,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  stepCard: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  stepNumber: {
    color: colors.text,
    fontSize: font.tiny,
    fontWeight: '800',
  },
  stepTitle: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '700',
  },
  stepDone: {
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
  stepDetail: {
    color: colors.muted,
    fontSize: font.small,
    marginTop: 2,
    lineHeight: 18,
  },
  launchedText: {
    color: colors.text,
    fontSize: font.body,
    lineHeight: 21,
    textAlign: 'center',
  },
  incomeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  goalHint: {
    color: colors.muted,
    fontSize: font.tiny,
    marginTop: spacing.sm,
  },
});
