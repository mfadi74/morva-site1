import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { ModuleScreen } from '@/components/ModuleScreen';
import { Card, Input, PrimaryButton, SectionTitle } from '@/components/ui';
import { colors, font, radius, spacing } from '@/constants/theme';
import { ANON_HANDLES, CIRCLES, SEED_POSTS, Circle } from '@/constants/content';
import { useAppStore } from '@/stores/appStore';
import { CommunityPost } from '@/types';

const COLOR = '#818CF8';

// A post as rendered in the feed — either a seeded sample or a user post.
interface FeedItem {
  id: string;
  handle: string;
  text: string;
  likes: number;
  likedByMe: boolean;
  mine: boolean;
  when: string;
}

export default function Community() {
  const profile = useAppStore((s) => s.profile);
  const communityPosts = useAppStore((s) => s.communityPosts);
  const addCommunityPost = useAppStore((s) => s.addCommunityPost);
  const toggleCommunityLike = useAppStore((s) => s.toggleCommunityLike);

  const [activeCircle, setActiveCircle] = useState<Circle | null>(null);
  const [draft, setDraft] = useState('');

  // Stable anonymous handle derived from the profile id.
  const handle = useMemo(() => {
    const id = profile?.id ?? 'guest';
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    return ANON_HANDLES[h % ANON_HANDLES.length];
  }, [profile?.id]);

  const feed: FeedItem[] = useMemo(() => {
    if (!activeCircle) return [];
    const mine: FeedItem[] = communityPosts
      .filter((p) => p.circle === activeCircle.key)
      .map((p: CommunityPost) => ({
        id: p.id,
        handle: p.handle,
        text: p.text,
        likes: p.likes,
        likedByMe: p.likedByMe,
        mine: true,
        when: formatDistanceToNow(new Date(p.created_at), { addSuffix: true }),
      }));
    const seeded: FeedItem[] = (SEED_POSTS[activeCircle.key] ?? []).map((p, i) => ({
      id: `seed-${activeCircle.key}-${i}`,
      handle: p.handle,
      text: p.text,
      likes: p.likes,
      likedByMe: false,
      mine: false,
      when: 'earlier',
    }));
    return [...mine, ...seeded];
  }, [activeCircle, communityPosts]);

  async function handlePost() {
    if (!activeCircle || draft.trim().length < 2) return;
    await addCommunityPost(activeCircle.key, handle, draft);
    setDraft('');
  }

  // ── Circle list ─────────────────────────────────────────────────
  if (!activeCircle) {
    return (
      <ModuleScreen title="Community" subtitle="You're not alone" icon="chatbubbles" color={COLOR}>
        <Card style={styles.introCard}>
          <Text style={styles.introText}>
            Anonymous, supportive circles by topic. Post as{' '}
            <Text style={{ color: COLOR, fontWeight: '800' }}>@{handle}</Text> — no names, no
            follower counts, no pressure.
          </Text>
        </Card>

        <SectionTitle title="Circles" />
        {CIRCLES.map((c) => {
          const count =
            (SEED_POSTS[c.key]?.length ?? 0) +
            communityPosts.filter((p) => p.circle === c.key).length;
          return (
            <TouchableOpacity key={c.key} activeOpacity={0.8} onPress={() => setActiveCircle(c)}>
              <Card style={styles.circleRow}>
                <View style={[styles.circleIcon, { backgroundColor: `${c.color}22` }]}>
                  <Ionicons name={c.icon as keyof typeof Ionicons.glyphMap} size={20} color={c.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.circleName}>{c.name}</Text>
                  <Text style={styles.circleBlurb}>{c.blurb}</Text>
                </View>
                <Text style={styles.circleCount}>{count}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </Card>
            </TouchableOpacity>
          );
        })}

        <Text style={styles.disclaimer}>
          These circles include supportive sample posts to keep them welcoming. Your posts are saved
          privately on this device; connecting Supabase enables real shared circles. Be kind — this
          is a safe space.
        </Text>
      </ModuleScreen>
    );
  }

  // ── Circle feed ─────────────────────────────────────────────────
  return (
    <ModuleScreen
      title={activeCircle.name}
      subtitle={`Posting as @${handle}`}
      icon={activeCircle.icon as keyof typeof Ionicons.glyphMap}
      color={activeCircle.color}
    >
      <TouchableOpacity style={styles.backLink} onPress={() => setActiveCircle(null)}>
        <Ionicons name="arrow-back" size={14} color={colors.primary} />
        <Text style={styles.backLinkText}>All circles</Text>
      </TouchableOpacity>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Card style={{ marginBottom: spacing.md }}>
          <Input
            placeholder="Share something supportive or ask for support…"
            value={draft}
            onChangeText={setDraft}
            multiline
            style={styles.composer}
          />
          <PrimaryButton label="Post (+15 XP)" onPress={() => void handlePost()} />
        </Card>
      </KeyboardAvoidingView>

      {feed.map((item) => (
        <Card key={item.id} style={styles.postCard}>
          <View style={styles.postHeader}>
            <View style={[styles.avatar, { backgroundColor: `${activeCircle.color}22` }]}>
              <Text style={[styles.avatarText, { color: activeCircle.color }]}>
                {item.handle.slice(0, 1).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.postHandle}>
              @{item.handle}
              {item.mine ? <Text style={styles.you}> · you</Text> : null}
            </Text>
            <Text style={styles.postWhen}>{item.when}</Text>
          </View>
          <Text style={styles.postText}>{item.text}</Text>
          <TouchableOpacity
            style={styles.likeRow}
            disabled={!item.mine}
            onPress={() => item.mine && void toggleCommunityLike(item.id)}
          >
            <Ionicons
              name={item.likedByMe ? 'heart' : 'heart-outline'}
              size={16}
              color={item.likedByMe ? colors.secondary : colors.muted}
            />
            <Text style={styles.likeCount}>{item.likes}</Text>
          </TouchableOpacity>
        </Card>
      ))}
    </ModuleScreen>
  );
}

const styles = StyleSheet.create({
  introCard: {
    borderColor: COLOR,
  },
  introText: {
    color: colors.text,
    fontSize: font.small,
    lineHeight: 20,
  },
  circleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  circleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleName: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '700',
  },
  circleBlurb: {
    color: colors.muted,
    fontSize: font.tiny,
    marginTop: 1,
  },
  circleCount: {
    color: colors.muted,
    fontSize: font.small,
    fontWeight: '700',
    marginRight: 2,
  },
  disclaimer: {
    color: colors.muted,
    fontSize: font.tiny,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.md,
  },
  backLinkText: {
    color: colors.primary,
    fontSize: font.small,
    fontWeight: '700',
  },
  composer: {
    backgroundColor: colors.cardAlt,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: spacing.md,
  },
  postCard: {
    marginBottom: spacing.sm,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: font.small,
    fontWeight: '800',
  },
  postHandle: {
    color: colors.text,
    fontSize: font.small,
    fontWeight: '700',
    flex: 1,
  },
  you: {
    color: colors.muted,
    fontWeight: '400',
  },
  postWhen: {
    color: colors.muted,
    fontSize: font.tiny,
  },
  postText: {
    color: colors.text,
    fontSize: font.body,
    lineHeight: 21,
    marginBottom: spacing.sm,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  likeCount: {
    color: colors.muted,
    fontSize: font.small,
    fontWeight: '600',
  },
});
