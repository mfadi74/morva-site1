import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ModuleScreen } from '@/components/ModuleScreen';
import { Card, EmptyState, Input, Pill, PrimaryButton, ProgressBar, SectionTitle } from '@/components/ui';
import { CoachCard } from '@/components/CoachCard';
import { colors, font, radius, spacing } from '@/constants/theme';
import { SKILL_CATEGORIES, SKILL_SUGGESTIONS } from '@/constants/content';
import { askCoach } from '@/lib/ai';
import { skillsScore } from '@/lib/scores';
import { clamp } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore';

const COLOR = '#A78BFA';

export default function Sprinto() {
  const skills = useAppStore((s) => s.skills);
  const addSkill = useAppStore((s) => s.addSkill);
  const logSkillHours = useAppStore((s) => s.logSkillHours);
  const deleteSkill = useAppStore((s) => s.deleteSkill);

  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState(SKILL_CATEGORIES[0].key);
  const [target, setTarget] = useState('20');
  const [path, setPath] = useState('');
  const [pathLoading, setPathLoading] = useState(false);

  const score = skillsScore(skills);
  const suggestions = SKILL_SUGGESTIONS[category] ?? [];

  async function handleAdd() {
    if (name.trim().length < 2) {
      Alert.alert('Name it', 'Give your skill a name (e.g. Python, Video Editing).');
      return;
    }
    await addSkill(name, category, parseInt(target, 10) || 20);
    setName('');
    setTarget('20');
    setAdding(false);
  }

  function confirmDelete(id: string, skillName: string) {
    Alert.alert(`Remove ${skillName}?`, 'Your logged hours for it will be cleared.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => void deleteSkill(id) },
    ]);
  }

  async function handlePath() {
    setPathLoading(true);
    const list = skills.map((s) => `${s.name} (${s.logged_hours}/${s.target_hours}h)`).join(', ');
    const text = await askCoach(
      `I'm building these skills: ${list || 'none yet'}. ` +
        'Suggest one focused way to practice or a small project to build this week.',
      'skills',
    );
    setPath(text);
    setPathLoading(false);
  }

  return (
    <ModuleScreen
      title="Sprinto"
      subtitle="Close the skills gap"
      icon="school"
      color={COLOR}
      score={score}
    >
      <SectionTitle
        title="Your skills"
        action={
          <TouchableOpacity onPress={() => setAdding((v) => !v)}>
            <Text style={styles.refresh}>{adding ? 'Close' : '+ Add skill'}</Text>
          </TouchableOpacity>
        }
      />

      {adding && (
        <Card style={{ marginBottom: spacing.md }}>
          <View style={styles.pillWrap}>
            {SKILL_CATEGORIES.map((c) => (
              <Pill
                key={c.key}
                label={c.label}
                selected={category === c.key}
                onPress={() => setCategory(c.key)}
                icon={c.icon as keyof typeof Ionicons.glyphMap}
              />
            ))}
          </View>
          <Input
            placeholder="Skill name"
            value={name}
            onChangeText={setName}
            style={{ backgroundColor: colors.cardAlt, marginBottom: spacing.sm }}
          />
          {suggestions.length > 0 && (
            <View style={styles.pillWrap}>
              {suggestions.map((s) => (
                <Pill key={s} label={s} selected={name === s} onPress={() => setName(s)} />
              ))}
            </View>
          )}
          <Input
            placeholder="Target hours to feel confident (default 20)"
            value={target}
            onChangeText={setTarget}
            keyboardType="number-pad"
            style={{ backgroundColor: colors.cardAlt, marginBottom: spacing.md }}
          />
          <PrimaryButton label="Add skill (+15 XP)" onPress={() => void handleAdd()} />
        </Card>
      )}

      {skills.length === 0 && !adding ? (
        <EmptyState
          icon="school"
          title="No skills yet"
          subtitle="19% of Gen Z feel unprepared for work. Pick one skill, set target hours, and stack 20 minutes a day."
        />
      ) : (
        skills.map((skill) => {
          const pct = clamp((skill.logged_hours / Math.max(1, skill.target_hours)) * 100, 0, 100);
          const cat = SKILL_CATEGORIES.find((c) => c.key === skill.category);
          const done = pct >= 100;
          return (
            <Card key={skill.id} style={{ marginBottom: spacing.sm }}>
              <View style={styles.skillHeader}>
                <View style={[styles.skillIcon, { backgroundColor: `${COLOR}22` }]}>
                  <Ionicons
                    name={(cat?.icon ?? 'ellipse') as keyof typeof Ionicons.glyphMap}
                    size={16}
                    color={COLOR}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.skillName}>
                    {skill.name} {done ? '✅' : ''}
                  </Text>
                  <Text style={styles.skillMeta}>
                    {skill.logged_hours}h of {skill.target_hours}h · {cat?.label}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => confirmDelete(skill.id, skill.name)} hitSlop={8}>
                  <Ionicons name="ellipsis-horizontal" size={18} color={colors.muted} />
                </TouchableOpacity>
              </View>
              <ProgressBar value={pct} color={done ? colors.success : COLOR} height={6} />
              <View style={styles.logRow}>
                {[0.5, 1, 2].map((h) => (
                  <TouchableOpacity
                    key={h}
                    style={styles.logBtn}
                    onPress={() => void logSkillHours(skill.id, h)}
                  >
                    <Text style={styles.logBtnText}>+{h}h</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          );
        })
      )}

      <SectionTitle
        title="AI learning coach"
        action={
          <TouchableOpacity onPress={() => void handlePath()}>
            <Text style={styles.refresh}>{path ? 'Refresh' : 'Get a plan'}</Text>
          </TouchableOpacity>
        }
      />
      {path || pathLoading ? (
        <CoachCard message={path} loading={pathLoading} title="Learning Coach" />
      ) : (
        <Text style={styles.hint}>Tap "Get a plan" for a focused way to practice this week.</Text>
      )}
    </ModuleScreen>
  );
}

const styles = StyleSheet.create({
  refresh: {
    color: colors.primary,
    fontSize: font.small,
    fontWeight: '700',
  },
  pillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  skillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  skillIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skillName: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '700',
  },
  skillMeta: {
    color: colors.muted,
    fontSize: font.tiny,
    marginTop: 1,
  },
  logRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  logBtn: {
    flex: 1,
    backgroundColor: colors.cardAlt,
    borderRadius: radius.sm,
    paddingVertical: 8,
    alignItems: 'center',
  },
  logBtnText: {
    color: colors.text,
    fontSize: font.small,
    fontWeight: '700',
  },
  hint: {
    color: colors.muted,
    fontSize: font.small,
  },
});
