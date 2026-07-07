import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, font, spacing } from '@/constants/theme';

export interface Bar {
  label: string;
  value: number;
  color?: string;
}

/** Lightweight vertical bar chart (no chart library needed). */
export function BarChart({ bars, maxValue, height = 120 }: { bars: Bar[]; maxValue?: number; height?: number }) {
  const max = maxValue ?? Math.max(1, ...bars.map((b) => b.value));
  return (
    <View style={[styles.row, { height: height + 24 }]}>
      {bars.map((b, i) => (
        <View key={`${b.label}-${i}`} style={styles.barCol}>
          <View style={[styles.barTrack, { height }]}>
            <View
              style={{
                width: '100%',
                height: Math.max(4, (b.value / max) * height),
                borderRadius: 6,
                backgroundColor: b.value > 0 ? (b.color ?? colors.primary) : colors.border,
              }}
            />
          </View>
          <Text style={styles.barLabel} numberOfLines={1}>
            {b.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

/** Horizontal breakdown bars with labels and amounts (category spending). */
export function BreakdownBars({
  items,
}: {
  items: { label: string; value: number; display: string; color: string }[];
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <View>
      {items.map((item, i) => (
        <View key={`${item.label}-${i}`} style={styles.breakdownRow}>
          <View style={styles.breakdownHeader}>
            <Text style={styles.breakdownLabel}>{item.label}</Text>
            <Text style={styles.breakdownValue}>{item.display}</Text>
          </View>
          <View style={styles.breakdownTrack}>
            <View
              style={{
                width: `${Math.max(2, (item.value / max) * 100)}%`,
                height: 8,
                borderRadius: 4,
                backgroundColor: item.color,
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  barTrack: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barLabel: {
    color: colors.muted,
    fontSize: font.tiny,
    marginTop: 6,
  },
  breakdownRow: {
    marginBottom: spacing.md,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  breakdownLabel: {
    color: colors.text,
    fontSize: font.small,
    fontWeight: '600',
  },
  breakdownValue: {
    color: colors.muted,
    fontSize: font.small,
  },
  breakdownTrack: {
    backgroundColor: colors.border,
    borderRadius: 4,
    height: 8,
    overflow: 'hidden',
  },
});
