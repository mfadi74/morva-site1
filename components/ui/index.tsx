import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing } from '@/constants/theme';
import { clamp } from '@/lib/utils';

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionTitle({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <View style={styles.sectionRow}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action}
    </View>
  );
}

export function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  style,
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'ghost' | 'danger';
  style?: StyleProp<ViewStyle>;
}) {
  const bg =
    variant === 'primary' ? colors.primary : variant === 'danger' ? colors.dangerSoft : 'transparent';
  const fg = variant === 'primary' ? colors.white : variant === 'danger' ? colors.danger : colors.primary;
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: bg, opacity: disabled || loading ? 0.6 : 1 },
        variant === 'ghost' && { borderWidth: 1, borderColor: colors.border },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <Text style={[styles.buttonLabel, { color: fg }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

export function Input(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.muted}
      {...props}
      style={[styles.input, props.style]}
    />
  );
}

export function ProgressBar({
  value,
  color = colors.primary,
  height = 8,
}: {
  value: number; // 0–100
  color?: string;
  height?: number;
}) {
  return (
    <View style={[styles.progressTrack, { height, borderRadius: height / 2 }]}>
      <View
        style={{
          width: `${clamp(value, 0, 100)}%`,
          backgroundColor: color,
          height,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
}

export function Pill({
  label,
  selected,
  onPress,
  icon,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <TouchableOpacity
      style={[styles.pill, selected && styles.pillSelected]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={14}
          color={selected ? colors.white : colors.muted}
          style={{ marginRight: 4 }}
        />
      ) : null}
      <Text style={[styles.pillLabel, selected && { color: colors.white }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function EmptyState({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={28} color={colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
    </View>
  );
}

export function StatBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, color ? { color } : null]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: font.subheading,
    fontWeight: '700',
  },
  button: {
    borderRadius: radius.md,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: font.body,
    fontWeight: '700',
  },
  input: {
    backgroundColor: colors.card,
    color: colors.text,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: font.body,
  },
  progressTrack: {
    backgroundColor: colors.border,
    overflow: 'hidden',
    flex: 1,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  pillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillLabel: {
    color: colors.muted,
    fontSize: font.small,
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: font.subheading,
    fontWeight: '700',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: colors.muted,
    fontSize: font.small,
    textAlign: 'center',
    lineHeight: 19,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    color: colors.text,
    fontSize: font.subheading,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.muted,
    fontSize: font.tiny,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
