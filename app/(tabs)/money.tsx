import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { Card, EmptyState, Input, Pill, PrimaryButton, ProgressBar, SectionTitle, StatBox } from '@/components/ui';
import { BreakdownBars } from '@/components/BarChart';
import { CoachCard } from '@/components/CoachCard';
import { colors, font, radius, spacing } from '@/constants/theme';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/constants/content';
import { askCoach } from '@/lib/ai';
import { moneyScore } from '@/lib/scores';
import { formatMoney } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore';
import { TransactionType } from '@/types';

const BREAKDOWN_COLORS = [
  colors.primary,
  colors.secondary,
  colors.success,
  colors.warning,
  colors.danger,
  '#38BDF8',
  '#A78BFA',
  '#F472B6',
  '#94A3B8',
];

export default function MoneyMap() {
  const transactions = useAppStore((s) => s.transactions);
  const addTransaction = useAppStore((s) => s.addTransaction);
  const deleteTransaction = useAppStore((s) => s.deleteTransaction);

  const [modalOpen, setModalOpen] = useState(false);
  const [txType, setTxType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [insight, setInsight] = useState('');
  const [insightLoading, setInsightLoading] = useState(false);

  const income = useMemo(
    () => transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [transactions],
  );
  const expenses = useMemo(
    () => transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [transactions],
  );
  const net = income - expenses;
  const health = moneyScore(transactions);

  const breakdown = useMemo(() => {
    const byCategory = new Map<string, number>();
    for (const t of transactions) {
      if (t.type !== 'expense') continue;
      byCategory.set(t.category, (byCategory.get(t.category) ?? 0) + t.amount);
    }
    return [...byCategory.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value], i) => ({
        label,
        value,
        display: formatMoney(value),
        color: BREAKDOWN_COLORS[i % BREAKDOWN_COLORS.length],
      }));
  }, [transactions]);

  async function handleSave() {
    const value = parseFloat(amount.replace(',', '.'));
    if (!value || value <= 0) {
      Alert.alert('Almost there', 'Enter an amount greater than 0.');
      return;
    }
    const cats = txType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    await addTransaction({
      amount: value,
      category: category || cats[cats.length - 1],
      description,
      type: txType,
    });
    setAmount('');
    setCategory('');
    setDescription('');
    setModalOpen(false);
  }

  async function handleInsight() {
    setInsightLoading(true);
    const summary = breakdown.map((b) => `${b.label}: ${b.display}`).join(', ');
    const text = await askCoach(
      `This month I earned ${formatMoney(income)} and spent ${formatMoney(expenses)}. ` +
        `Top spending: ${summary || 'nothing logged yet'}. ` +
        'Give me one specific, realistic tip to improve my finances.',
      'money',
    );
    setInsight(text);
    setInsightLoading(false);
  }

  function confirmDelete(id: string) {
    Alert.alert('Delete transaction?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => void deleteTransaction(id) },
    ]);
  }

  const activeCategories = txType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>MoneyMap</Text>
            <Text style={styles.subtitle}>Know your money. Grow your money.</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalOpen(true)}>
            <Ionicons name="add" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <StatBox label="Income" value={formatMoney(income)} color={colors.success} />
          <StatBox label="Expenses" value={formatMoney(expenses)} color={colors.danger} />
          <StatBox label="Net" value={formatMoney(net)} color={net >= 0 ? colors.success : colors.danger} />
        </View>

        <Card style={{ marginTop: spacing.md }}>
          <View style={styles.healthHeader}>
            <Text style={styles.healthLabel}>Financial Health Score</Text>
            <Text style={styles.healthValue}>{health}/100</Text>
          </View>
          <ProgressBar value={health} color={health < 40 ? colors.danger : health < 70 ? colors.warning : colors.success} />
          <Text style={styles.healthHint}>
            Based on your savings rate and how consistently you track.
          </Text>
        </Card>

        {breakdown.length > 0 && (
          <>
            <SectionTitle title="Where it goes" />
            <Card>
              <BreakdownBars items={breakdown} />
            </Card>
          </>
        )}

        <SectionTitle
          title="AI money insight"
          action={
            <TouchableOpacity onPress={() => void handleInsight()}>
              <Text style={styles.refresh}>{insight ? 'Refresh' : 'Get insight'}</Text>
            </TouchableOpacity>
          }
        />
        {insight || insightLoading ? (
          <CoachCard message={insight} loading={insightLoading} title="Money Coach" />
        ) : (
          <Text style={styles.insightHint}>Tap "Get insight" for a personalized tip on your spending.</Text>
        )}

        <SectionTitle title="Transactions" />
        {transactions.length === 0 ? (
          <EmptyState
            icon="wallet"
            title="No transactions yet"
            subtitle="Tap + to log your first income or expense. Tracking alone usually cuts spending 10-15%."
          />
        ) : (
          transactions.slice(0, 30).map((t) => (
            <TouchableOpacity key={t.id} onLongPress={() => confirmDelete(t.id)} activeOpacity={0.8}>
              <Card style={styles.txRow}>
                <View
                  style={[
                    styles.txIcon,
                    { backgroundColor: t.type === 'income' ? colors.successSoft : colors.dangerSoft },
                  ]}
                >
                  <Ionicons
                    name={t.type === 'income' ? 'arrow-down' : 'arrow-up'}
                    size={16}
                    color={t.type === 'income' ? colors.success : colors.danger}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.txCategory}>{t.category}</Text>
                  <Text style={styles.txMeta}>
                    {t.description ? `${t.description} · ` : ''}
                    {format(parseISO(t.date), 'MMM d')}
                  </Text>
                </View>
                <Text
                  style={[styles.txAmount, { color: t.type === 'income' ? colors.success : colors.text }]}
                >
                  {t.type === 'income' ? '+' : '-'}
                  {formatMoney(t.amount)}
                </Text>
              </Card>
            </TouchableOpacity>
          ))
        )}
        {transactions.length > 0 && (
          <Text style={styles.deleteHint}>Long-press a transaction to delete it.</Text>
        )}
      </ScrollView>

      <Modal visible={modalOpen} animationType="slide" transparent onRequestClose={() => setModalOpen(false)}>
        <KeyboardAvoidingView
          style={styles.modalBackdrop}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add transaction</Text>

            <View style={styles.typeToggle}>
              {(['expense', 'income'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeOption, txType === type && styles.typeOptionActive]}
                  onPress={() => {
                    setTxType(type);
                    setCategory('');
                  }}
                >
                  <Text style={[styles.typeLabel, txType === type && { color: colors.white }]}>
                    {type === 'expense' ? 'Expense' : 'Income'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input
              placeholder="Amount (e.g. 12.50)"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              style={{ marginBottom: spacing.md }}
            />
            <View style={styles.pillWrap}>
              {activeCategories.map((c) => (
                <Pill key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
              ))}
            </View>
            <Input
              placeholder="Note (optional)"
              value={description}
              onChangeText={setDescription}
              style={{ marginBottom: spacing.md }}
            />

            <PrimaryButton label="Save" onPress={() => void handleSave()} />
            <PrimaryButton
              label="Cancel"
              variant="ghost"
              onPress={() => setModalOpen(false)}
              style={{ marginTop: spacing.sm }}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  healthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  healthLabel: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '700',
  },
  healthValue: {
    color: colors.primary,
    fontSize: font.body,
    fontWeight: '800',
  },
  healthHint: {
    color: colors.muted,
    fontSize: font.tiny,
    marginTop: spacing.sm,
  },
  refresh: {
    color: colors.primary,
    fontSize: font.small,
    fontWeight: '700',
  },
  insightHint: {
    color: colors.muted,
    fontSize: font.small,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingVertical: 12,
  },
  txIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  txCategory: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '600',
  },
  txMeta: {
    color: colors.muted,
    fontSize: font.tiny,
    marginTop: 2,
  },
  txAmount: {
    fontSize: font.body,
    fontWeight: '700',
  },
  deleteHint: {
    color: colors.muted,
    fontSize: font.tiny,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.cardAlt,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    color: colors.text,
    fontSize: font.subheading,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.md,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  typeOptionActive: {
    backgroundColor: colors.primary,
  },
  typeLabel: {
    color: colors.muted,
    fontSize: font.small,
    fontWeight: '700',
  },
  pillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
});
