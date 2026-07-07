import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing } from '@/constants/theme';
import { isAiLive } from '@/lib/ai';

/** Purple AI coach message card used across all modules. */
export function CoachCard({ message, loading, title = 'AI Coach' }: { message: string; loading?: boolean; title?: string }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons name="sparkles" size={14} color={colors.primary} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{isAiLive ? 'CLAUDE AI' : 'DEMO'}</Text>
        </View>
      </View>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.sm }} />
      ) : (
        <Text style={styles.message}>{message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.35)',
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(108, 99, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: font.small,
    fontWeight: '700',
    flex: 1,
  },
  badge: {
    backgroundColor: 'rgba(108, 99, 255, 0.25)',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  message: {
    color: colors.text,
    fontSize: font.body,
    lineHeight: 21,
  },
});
