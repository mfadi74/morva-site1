import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '@/constants/theme';
import { clamp } from '@/lib/utils';

/** Circular Life Score gauge (0–100). */
export function ScoreRing({ score, size = 150 }: { score: number; size?: number }) {
  const strokeWidth = 12;
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const pct = clamp(score, 0, 100) / 100;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.border}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.primary}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c * (1 - pct)}`}
          strokeDashoffset={c * 0.25}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={styles.score}>{Math.round(score)}</Text>
        <Text style={styles.label}>LIFE SCORE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '800',
  },
  label: {
    color: colors.muted,
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: '700',
  },
});
