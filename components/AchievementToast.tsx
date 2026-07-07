import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ACHIEVEMENTS } from '@/constants/content';
import { colors, font, radius, spacing } from '@/constants/theme';
import { useAppStore } from '@/stores/appStore';

/** Slides in whenever the store reports newly unlocked achievements. */
export function AchievementToast() {
  const lastUnlocked = useAppStore((s) => s.lastUnlocked);
  const clearUnlocked = useAppStore((s) => s.clearUnlocked);
  const opacity = React.useRef(new Animated.Value(0)).current;

  const def = lastUnlocked.length
    ? ACHIEVEMENTS.find((a) => a.key === lastUnlocked[lastUnlocked.length - 1])
    : undefined;

  useEffect(() => {
    if (!def) return;
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(2600),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => clearUnlocked());
  }, [def, opacity, clearUnlocked]);

  if (!def) return null;

  return (
    <Animated.View style={[styles.toast, { opacity }]} pointerEvents="none">
      <View style={styles.icon}>
        <Ionicons name={def.icon as keyof typeof Ionicons.glyphMap} size={18} color={colors.gold} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Achievement unlocked · {def.title}</Text>
        <Text style={styles.subtitle}>
          {def.description}
          {def.xp > 0 ? `  ·  +${def.xp} XP` : ''}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 60,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.gold,
    padding: spacing.md,
    zIndex: 100,
    elevation: 8,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: font.small,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.muted,
    fontSize: font.tiny,
    marginTop: 2,
  },
});
