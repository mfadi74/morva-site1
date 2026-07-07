import React from 'react';
import { Redirect } from 'expo-router';
import { useAppStore } from '@/stores/appStore';

/** Entry gate: route to welcome, onboarding, or the app. */
export default function Index() {
  const profile = useAppStore((s) => s.profile);

  if (!profile) return <Redirect href="/(auth)/welcome" />;
  if (!profile.onboarding_complete) return <Redirect href="/(auth)/onboarding" />;
  return <Redirect href="/(tabs)" />;
}
