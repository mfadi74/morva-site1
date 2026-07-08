import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import { useAppStore } from '@/stores/appStore';
import { AchievementToast } from '@/components/AchievementToast';
import { isRTL } from '@/lib/i18n';

export default function RootLayout() {
  const hydrated = useAppStore((s) => s.hydrated);
  const hydrate = useAppStore((s) => s.hydrate);
  const language = useAppStore((s) => s.language);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  // Apply right-to-left layout for Arabic. On web we flip the document
  // direction (mirrors flex layouts automatically); on native, full RTL
  // mirroring requires I18nManager + reload, so we localize text direction.
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.documentElement.dir = isRTL(language) ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  if (!hydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.dark },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modules" />
      </Stack>
      <AchievementToast />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
