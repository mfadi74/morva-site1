import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { ModuleScreen } from '@/components/ModuleScreen';
import { Card, EmptyState, Input, Pill, PrimaryButton, SectionTitle, StatBox } from '@/components/ui';
import { CoachCard } from '@/components/CoachCard';
import { colors, font, radius, spacing } from '@/constants/theme';
import { BRAND_PILLARS, BRAND_PLATFORMS } from '@/constants/content';
import { askCoach } from '@/lib/ai';
import { brandScore } from '@/lib/scores';
import { dayKey } from '@/lib/utils';
import { useAppStore } from '@/stores/appStore';

const COLOR = '#FB7185';

export default function BrandSelf() {
  const brandProfile = useAppStore((s) => s.brandProfile);
  const brandPosts = useAppStore((s) => s.brandPosts);
  const saveBrandProfile = useAppStore((s) => s.saveBrandProfile);
  const addBrandPost = useAppStore((s) => s.addBrandPost);

  const [pillars, setPillars] = useState<string[]>(brandProfile?.pillars ?? []);
  const [bio, setBio] = useState(brandProfile?.bio ?? '');
  const [platform, setPlatform] = useState(BRAND_PLATFORMS[0].key);
  const [note, setNote] = useState('');
  const [ideas, setIdeas] = useState('');
  const [ideasLoading, setIdeasLoading] = useState(false);

  const score = brandScore(brandProfile, brandPosts);
  const postsLast30 = brandPosts.filter((p) => p.date >= dayKey(29)).length;

  function togglePillar(p: string) {
    setPillars((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : prev.length < 3 ? [...prev, p] : prev,
    );
  }

  async function handleSave() {
    if (pillars.length === 0) {
      Alert.alert('Pick your lane', 'Choose up to 3 topics you want to be known for.');
      return;
    }
    await saveBrandProfile(pillars, bio);
    Alert.alert('Saved', 'Your brand identity is set. Now stay consistent!');
  }

  async function handlePost() {
    await addBrandPost(platform, note);
    setNote('');
  }

  async function handleIdeas() {
    setIdeasLoading(true);
    const text = await askCoach(
      `My personal brand is about: ${pillars.join(', ') || 'undecided'}. ` +
        `My bio: "${bio || 'none yet'}". Give me 3 short, specific content ideas I could post this week.`,
      'brand',
    );
    setIdeas(text);
    setIdeasLoading(false);
  }

  return (
    <ModuleScreen
      title="BrandSelf"
      subtitle="Build your name online"
      icon="megaphone"
      color={COLOR}
      score={score}
    >
      <SectionTitle title="Your brand pillars" />
      <Text style={styles.hint}>Pick up to 3 topics you want to be known for ({pillars.length}/3).</Text>
      <Card>
        <View style={styles.pillWrap}>
          {BRAND_PILLARS.map((p) => (
            <Pill key={p} label={p} selected={pillars.includes(p)} onPress={() => togglePillar(p)} />
          ))}
        </View>
        <Input
          placeholder="One-line bio: I help ___ do ___"
          value={bio}
          onChangeText={setBio}
          style={{ backgroundColor: colors.cardAlt, marginTop: spacing.sm, marginBottom: spacing.md }}
        />
        <PrimaryButton label="Save brand identity" onPress={() => void handleSave()} />
      </Card>

      {brandProfile && (
        <Card style={styles.previewCard}>
          <Text style={styles.previewLabel}>YOUR BRAND SNAPSHOT</Text>
          <Text style={styles.previewBio}>{brandProfile.bio || 'Add a bio to complete your brand.'}</Text>
          <View style={styles.pillWrap}>
            {brandProfile.pillars.map((p) => (
              <View key={p} style={styles.tag}>
                <Text style={styles.tagText}>#{p.replace(/\s+/g, '')}</Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      <SectionTitle title="Log content you posted" />
      <Card>
        <View style={styles.pillWrap}>
          {BRAND_PLATFORMS.map((p) => (
            <Pill
              key={p.key}
              label={p.label}
              icon={p.icon as keyof typeof Ionicons.glyphMap}
              selected={platform === p.key}
              onPress={() => setPlatform(p.key)}
            />
          ))}
        </View>
        <Input
          placeholder="What did you post? (optional)"
          value={note}
          onChangeText={setNote}
          style={{ backgroundColor: colors.cardAlt, marginTop: spacing.sm, marginBottom: spacing.md }}
        />
        <PrimaryButton label="Log post (+15 XP)" onPress={() => void handlePost()} />
      </Card>

      <View style={[styles.statsRow, { marginTop: spacing.md }]}>
        <StatBox label="Total posts" value={String(brandPosts.length)} />
        <StatBox label="Last 30 days" value={String(postsLast30)} color={COLOR} />
        <StatBox label="Pillars" value={String(brandProfile?.pillars.length ?? 0)} />
      </View>

      <SectionTitle
        title="AI content coach"
        action={
          <TouchableOpacity onPress={() => void handleIdeas()}>
            <Text style={styles.refresh}>{ideas ? 'More ideas' : 'Get ideas'}</Text>
          </TouchableOpacity>
        }
      />
      {ideas || ideasLoading ? (
        <CoachCard message={ideas} loading={ideasLoading} title="Brand Coach" />
      ) : (
        <Text style={styles.hint}>Tap "Get ideas" for 3 post ideas tailored to your pillars.</Text>
      )}

      <SectionTitle title="Recent posts" />
      {brandPosts.length === 0 ? (
        <EmptyState
          icon="megaphone"
          title="No posts logged"
          subtitle="44% of Gen Z use social media as their main business tool. Consistency compounds — log your first post."
        />
      ) : (
        brandPosts.slice(0, 12).map((p) => {
          const plat = BRAND_PLATFORMS.find((x) => x.key === p.platform);
          return (
            <Card key={p.id} style={styles.postRow}>
              <Ionicons
                name={(plat?.icon ?? 'globe-outline') as keyof typeof Ionicons.glyphMap}
                size={18}
                color={COLOR}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.postPlatform}>{plat?.label ?? p.platform}</Text>
                {p.note ? <Text style={styles.postNote}>{p.note}</Text> : null}
              </View>
              <Text style={styles.postDate}>{format(parseISO(p.date), 'MMM d')}</Text>
            </Card>
          );
        })
      )}
    </ModuleScreen>
  );
}

const styles = StyleSheet.create({
  hint: {
    color: colors.muted,
    fontSize: font.small,
    marginBottom: spacing.sm,
  },
  pillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  previewCard: {
    marginTop: spacing.md,
    borderColor: COLOR,
  },
  previewLabel: {
    color: COLOR,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  previewBio: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '600',
    marginBottom: spacing.md,
    lineHeight: 21,
  },
  tag: {
    backgroundColor: `${COLOR}22`,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  tagText: {
    color: COLOR,
    fontSize: font.small,
    fontWeight: '700',
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
  postRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  postPlatform: {
    color: colors.text,
    fontSize: font.small,
    fontWeight: '700',
  },
  postNote: {
    color: colors.muted,
    fontSize: font.tiny,
    marginTop: 1,
  },
  postDate: {
    color: colors.muted,
    fontSize: font.tiny,
  },
});
