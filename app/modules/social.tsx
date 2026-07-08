import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { ModuleScreen } from '@/components/ModuleScreen';
import { Card, EmptyState, Input, PrimaryButton, SectionTitle } from '@/components/ui';
import { CoachCard } from '@/components/CoachCard';
import { colors, font, radius, spacing } from '@/constants/theme';
import { CONVERSATION_STARTERS, SOCIAL_CHALLENGES } from '@/constants/content';
import { askCoach } from '@/lib/ai';
import { socialScore } from '@/lib/scores';
import { dayKey, todayKey } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore';

const COLOR = '#F472B6';

export default function Connekt() {
  const connections = useAppStore((s) => s.connections);
  const socialChallenges = useAppStore((s) => s.socialChallenges);
  const toggleSocialChallenge = useAppStore((s) => s.toggleSocialChallenge);
  const addConnection = useAppStore((s) => s.addConnection);

  const [name, setName] = useState('');
  const [context, setContext] = useState('');
  const [adding, setAdding] = useState(false);
  const [starter, setStarter] = useState('');
  const [starterLoading, setStarterLoading] = useState(false);

  const challengesLast7 = socialChallenges.filter((c) => c.date >= dayKey(6)).length;
  const score = socialScore(connections, challengesLast7);
  const doneToday = new Set(
    socialChallenges.filter((c) => c.date === todayKey()).map((c) => c.key),
  );

  async function handleAddConnection() {
    if (name.trim().length < 2) {
      Alert.alert('Who was it?', 'Add a name or nickname of the person you connected with.');
      return;
    }
    await addConnection(name, context);
    setName('');
    setContext('');
    setAdding(false);
  }

  async function handleStarter() {
    setStarterLoading(true);
    const text = await askCoach(
      'Give me one natural, low-pressure conversation starter or a short script to reconnect with someone. Keep it casual and Gen Z.',
      'social',
    );
    setStarter(text);
    setStarterLoading(false);
  }

  return (
    <ModuleScreen
      title="Connekt"
      subtitle="Confidence is a muscle"
      icon="people"
      color={COLOR}
      score={score}
    >
      <SectionTitle title="Today's brave moves" />
      <Text style={styles.intro}>
        Small reps build social confidence. Tap one when you do it — {doneToday.size}/
        {SOCIAL_CHALLENGES.length} done today.
      </Text>
      {SOCIAL_CHALLENGES.map((c) => {
        const done = doneToday.has(c.key);
        return (
          <TouchableOpacity
            key={c.key}
            activeOpacity={0.8}
            onPress={() => void toggleSocialChallenge(c.key, c.xp)}
          >
            <Card style={[styles.challenge, done && styles.challengeDone]}>
              <Ionicons
                name={done ? 'checkmark-circle' : 'ellipse-outline'}
                size={22}
                color={done ? COLOR : colors.border}
              />
              <Text style={[styles.challengeText, done && styles.challengeTextDone]}>{c.label}</Text>
              <Text style={styles.challengeXp}>+{c.xp}</Text>
            </Card>
          </TouchableOpacity>
        );
      })}

      <SectionTitle
        title="AI conversation coach"
        action={
          <TouchableOpacity onPress={() => void handleStarter()}>
            <Text style={styles.refresh}>{starter ? 'Another' : 'Get a starter'}</Text>
          </TouchableOpacity>
        }
      />
      {starter || starterLoading ? (
        <CoachCard message={starter} loading={starterLoading} title="Social Coach" />
      ) : (
        <Card>
          <Text style={styles.starterHint}>Stuck for words? A few openers that always work:</Text>
          {CONVERSATION_STARTERS.slice(0, 3).map((s) => (
            <Text key={s} style={styles.starterLine}>
              💬 {s}
            </Text>
          ))}
          <Text style={[styles.starterHint, { marginTop: spacing.sm }]}>
            Or tap "Get a starter" for a fresh one from the AI coach.
          </Text>
        </Card>
      )}

      <SectionTitle
        title={`Connections (${connections.length})`}
        action={
          <TouchableOpacity onPress={() => setAdding((v) => !v)}>
            <Text style={styles.refresh}>{adding ? 'Close' : '+ Log one'}</Text>
          </TouchableOpacity>
        }
      />
      {adding && (
        <Card style={{ marginBottom: spacing.md }}>
          <Input
            placeholder="Who did you connect with?"
            value={name}
            onChangeText={setName}
            style={{ backgroundColor: colors.cardAlt, marginBottom: spacing.sm }}
          />
          <Input
            placeholder="Context (met at…, reconnected, etc.)"
            value={context}
            onChangeText={setContext}
            style={{ backgroundColor: colors.cardAlt, marginBottom: spacing.md }}
          />
          <PrimaryButton label="Log connection (+15 XP)" onPress={() => void handleAddConnection()} />
        </Card>
      )}
      {connections.length === 0 && !adding ? (
        <EmptyState
          icon="people"
          title="No connections logged"
          subtitle="Networking fear is near-universal. Every real connection you log is proof you're growing your circle."
        />
      ) : (
        connections.slice(0, 12).map((c) => (
          <Card key={c.id} style={styles.connectionRow}>
            <View style={[styles.avatar, { backgroundColor: `${COLOR}22` }]}>
              <Text style={[styles.avatarText, { color: COLOR }]}>
                {c.name.slice(0, 1).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.connName}>{c.name}</Text>
              {c.context ? <Text style={styles.connContext}>{c.context}</Text> : null}
            </View>
            <Text style={styles.connDate}>{format(parseISO(c.date), 'MMM d')}</Text>
          </Card>
        ))
      )}
    </ModuleScreen>
  );
}

const styles = StyleSheet.create({
  intro: {
    color: colors.muted,
    fontSize: font.small,
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  challenge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  challengeDone: {
    borderColor: COLOR,
    backgroundColor: 'rgba(244, 114, 182, 0.1)',
  },
  challengeText: {
    color: colors.text,
    fontSize: font.small,
    fontWeight: '600',
    flex: 1,
  },
  challengeTextDone: {
    color: colors.muted,
    textDecorationLine: 'line-through',
  },
  challengeXp: {
    color: colors.muted,
    fontSize: font.tiny,
    fontWeight: '700',
  },
  refresh: {
    color: colors.primary,
    fontSize: font.small,
    fontWeight: '700',
  },
  starterHint: {
    color: colors.muted,
    fontSize: font.small,
    marginBottom: spacing.sm,
  },
  starterLine: {
    color: colors.text,
    fontSize: font.small,
    lineHeight: 22,
  },
  connectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: font.body,
    fontWeight: '800',
  },
  connName: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '600',
  },
  connContext: {
    color: colors.muted,
    fontSize: font.tiny,
    marginTop: 1,
  },
  connDate: {
    color: colors.muted,
    fontSize: font.tiny,
  },
});
