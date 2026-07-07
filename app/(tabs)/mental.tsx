import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, parseISO, subDays } from 'date-fns';
import { Card, EmptyState, Input, Pill, PrimaryButton, SectionTitle } from '@/components/ui';
import { BarChart } from '@/components/BarChart';
import { CoachCard } from '@/components/CoachCard';
import { colors, font, radius, spacing } from '@/constants/theme';
import { EMOTION_TAGS, JOURNAL_PROMPTS, MOODS } from '@/constants/content';
import { askCoach, CoachContext } from '@/lib/ai';
import { dayKey, todayKey } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore';

export default function Stillwell() {
  const moods = useAppStore((s) => s.moods);
  const journal = useAppStore((s) => s.journal);
  const addMood = useAppStore((s) => s.addMood);
  const addJournal = useAppStore((s) => s.addJournal);

  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [support, setSupport] = useState('');
  const [supportLoading, setSupportLoading] = useState(false);

  const [journalOpen, setJournalOpen] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [prompt] = useState(() => JOURNAL_PROMPTS[Math.floor(Math.random() * JOURNAL_PROMPTS.length)]);

  const checkedInToday = moods.some((m) => m.logged_at.slice(0, 10) === todayKey());

  const weekBars = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const key = dayKey(6 - i);
      const dayMoods = moods.filter((m) => m.logged_at.slice(0, 10) === key);
      const avg = dayMoods.length
        ? dayMoods.reduce((s, m) => s + m.mood_score, 0) / dayMoods.length
        : 0;
      return {
        label: format(subDays(new Date(), 6 - i), 'EEE'),
        value: avg,
        color: avg >= 5 ? colors.success : avg >= 3 ? colors.warning : colors.secondary,
      };
    });
  }, [moods]);

  function toggleEmotion(tag: string) {
    setSelectedEmotions((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  async function handleCheckIn() {
    if (selectedMood === null) {
      Alert.alert('One tap missing', 'Pick the emoji that matches how you feel.');
      return;
    }
    setSaving(true);
    await addMood(selectedMood, selectedEmotions, note);

    setSupportLoading(true);
    const moodLabel = MOODS.find((m) => m.score === selectedMood)?.label ?? 'unknown';
    const context: CoachContext = selectedMood <= 3 ? 'lowMood' : selectedMood <= 5 ? 'midMood' : 'highMood';
    const text = await askCoach(
      `I just checked in feeling "${moodLabel}" (${selectedMood}/7)` +
        (selectedEmotions.length ? `, tagged: ${selectedEmotions.join(', ')}` : '') +
        (note ? `. My note: "${note}"` : '') +
        '. Respond with warm, brief support.',
      context,
    );
    setSupport(text);
    setSupportLoading(false);

    setSelectedMood(null);
    setSelectedEmotions([]);
    setNote('');
    setSaving(false);
  }

  async function handleSaveJournal() {
    if (journalText.trim().length < 3) {
      Alert.alert('Keep going', 'Write at least a few words — no one sees this but you.');
      return;
    }
    await addJournal(journalText, prompt);
    setJournalText('');
    setJournalOpen(false);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Stillwell</Text>
        <Text style={styles.subtitle}>A quiet space to check in with yourself.</Text>

        <SectionTitle title={checkedInToday ? 'Check in again' : 'How are you feeling?'} />
        <Card>
          <View style={styles.moodRow}>
            {MOODS.map((m) => (
              <TouchableOpacity
                key={m.score}
                style={[styles.moodOption, selectedMood === m.score && styles.moodSelected]}
                onPress={() => setSelectedMood(m.score)}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text style={[styles.moodLabel, selectedMood === m.score && { color: colors.text }]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedMood !== null && (
            <>
              <Text style={styles.tagPrompt}>Any of these hitting today?</Text>
              <View style={styles.pillWrap}>
                {EMOTION_TAGS.map((tag) => (
                  <Pill
                    key={tag}
                    label={tag}
                    selected={selectedEmotions.includes(tag)}
                    onPress={() => toggleEmotion(tag)}
                  />
                ))}
              </View>
              <Input
                placeholder="Add a note (optional, private)"
                value={note}
                onChangeText={setNote}
                style={{ marginBottom: spacing.md, backgroundColor: colors.cardAlt }}
              />
              <PrimaryButton label="Check In (+15 XP)" onPress={() => void handleCheckIn()} loading={saving} />
            </>
          )}
        </Card>

        {(support || supportLoading) && (
          <View style={{ marginTop: spacing.md }}>
            <CoachCard message={support} loading={supportLoading} title="Stillwell Coach" />
          </View>
        )}

        <SectionTitle title="Your week" />
        <Card>
          {moods.length === 0 ? (
            <Text style={styles.chartHint}>Check in daily to see your mood pattern here.</Text>
          ) : (
            <BarChart bars={weekBars} maxValue={7} height={100} />
          )}
        </Card>

        <SectionTitle
          title="Journal"
          action={
            <TouchableOpacity onPress={() => setJournalOpen((v) => !v)}>
              <Text style={styles.refresh}>{journalOpen ? 'Close' : 'New entry'}</Text>
            </TouchableOpacity>
          }
        />
        {journalOpen && (
          <Card style={{ marginBottom: spacing.md }}>
            <Text style={styles.promptText}>💭 {prompt}</Text>
            <Input
              placeholder="Write freely — this stays on your device"
              value={journalText}
              onChangeText={setJournalText}
              multiline
              numberOfLines={5}
              style={styles.journalInput}
            />
            <PrimaryButton label="Save entry (+20 XP)" onPress={() => void handleSaveJournal()} />
          </Card>
        )}
        {journal.length === 0 && !journalOpen ? (
          <EmptyState
            icon="book"
            title="No entries yet"
            subtitle="Journaling for 2 minutes a day is one of the most evidence-backed ways to lower stress."
          />
        ) : (
          journal.slice(0, 10).map((entry) => (
            <Card key={entry.id} style={{ marginBottom: spacing.sm }}>
              <Text style={styles.entryDate}>
                {format(parseISO(entry.created_at), 'EEE, MMM d · h:mm a')}
              </Text>
              {entry.prompt ? <Text style={styles.entryPrompt}>💭 {entry.prompt}</Text> : null}
              <Text style={styles.entryContent}>{entry.content}</Text>
            </Card>
          ))
        )}

        <Text style={styles.disclaimer}>
          Stillwell is a self-care tool, not a substitute for professional help. If you're
          struggling, please reach out to someone you trust or a local support line.
        </Text>
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
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodOption: {
    alignItems: 'center',
    padding: 6,
    borderRadius: radius.sm,
    flex: 1,
  },
  moodSelected: {
    backgroundColor: colors.primarySoft,
  },
  moodEmoji: {
    fontSize: 24,
  },
  moodLabel: {
    color: colors.muted,
    fontSize: 9,
    marginTop: 4,
    fontWeight: '600',
  },
  tagPrompt: {
    color: colors.text,
    fontSize: font.small,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  pillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  chartHint: {
    color: colors.muted,
    fontSize: font.small,
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
  refresh: {
    color: colors.primary,
    fontSize: font.small,
    fontWeight: '700',
  },
  promptText: {
    color: colors.text,
    fontSize: font.body,
    lineHeight: 21,
    marginBottom: spacing.md,
  },
  journalInput: {
    backgroundColor: colors.cardAlt,
    minHeight: 110,
    textAlignVertical: 'top',
    marginBottom: spacing.md,
  },
  entryDate: {
    color: colors.muted,
    fontSize: font.tiny,
    marginBottom: spacing.xs,
  },
  entryPrompt: {
    color: colors.muted,
    fontSize: font.small,
    fontStyle: 'italic',
    marginBottom: spacing.xs,
  },
  entryContent: {
    color: colors.text,
    fontSize: font.body,
    lineHeight: 21,
  },
  disclaimer: {
    color: colors.muted,
    fontSize: font.tiny,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
});
