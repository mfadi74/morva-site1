import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { colors } from '@/constants/theme';
import { useAppStore } from '@/stores/appStore';

export default function ModulesLayout() {
  const profile = useAppStore((s) => s.profile);
  if (!profile) return <Redirect href="/(auth)/welcome" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.dark },
        animation: 'slide_from_right',
      }}
    />
  );
}
