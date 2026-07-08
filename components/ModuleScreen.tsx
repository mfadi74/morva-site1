import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing } from '@/constants/theme';
import { ProgressBar } from '@/components/ui';

/**
 * Shared shell for Phase 2 module screens (pushed over the tab bar):
 * a back header with the module identity + its score, then scrollable content.
 */
export function ModuleScreen({
  title,
  subtitle,
  icon,
  color,
  score,
  children,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  score: number;
  children: React.ReactNode;
}) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.back}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
          hitSlop={10}
        >
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={[styles.iconWrap, { backgroundColor: `${color}22` }]}>
          <Ionicons name={icon} size={18} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.scoreWrap}>
          <Text style={[styles.scoreValue, { color }]}>{score}</Text>
          <Text style={styles.scoreLabel}>SCORE</Text>
        </View>
      </View>
      <View style={styles.scoreBar}>
        <ProgressBar value={score} color={color} height={5} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  back: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    fontSize: font.subheading,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.muted,
    fontSize: font.tiny,
    marginTop: 1,
  },
  scoreWrap: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: font.heading,
    fontWeight: '800',
  },
  scoreLabel: {
    color: colors.muted,
    fontSize: 8,
    letterSpacing: 1,
    fontWeight: '700',
  },
  scoreBar: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  scroll: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
});
