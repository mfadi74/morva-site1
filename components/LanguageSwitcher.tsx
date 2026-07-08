import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, font, radius, spacing } from '@/constants/theme';
import { BRANDING } from '@/constants/branding';
import { LANGUAGES } from '@/lib/i18n';
import { useAppStore } from '@/stores/appStore';

/** Segmented language picker used on Welcome and in Settings. */
export function LanguageSwitcher({ compact }: { compact?: boolean }) {
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);

  return (
    <View style={[styles.row, compact && styles.compact]}>
      {LANGUAGES.map((l) => {
        const active = language === l.key;
        return (
          <TouchableOpacity
            key={l.key}
            style={[styles.option, active && styles.optionActive]}
            onPress={() => void setLanguage(l.key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{l.native}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    gap: 4,
  },
  compact: {
    alignSelf: 'center',
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  optionActive: {
    backgroundColor: BRANDING.accent,
  },
  label: {
    color: colors.muted,
    fontSize: font.small,
    fontWeight: '700',
  },
  labelActive: {
    color: colors.white,
  },
});
