import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, PrimaryButton } from '@/components/ui';
import { colors, font, spacing } from '@/constants/theme';
import { isSupabaseEnabled, supabase } from '@/lib/supabase';
import { useAppStore } from '@/stores/appStore';

export default function Login() {
  const createProfile = useAppStore((s) => s.createProfile);
  const profile = useAppStore((s) => s.profile);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!isSupabaseEnabled || !supabase) {
      router.replace('/(auth)/signup');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      Alert.alert('Login failed', error.message);
      setLoading(false);
      return;
    }
    // Ensure a local profile exists for this device.
    if (!profile) {
      const meta = data.user?.user_metadata as { full_name?: string } | null;
      await createProfile(meta?.full_name ?? 'Achiever', '', false);
    }
    setLoading(false);
    router.replace('/');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Pick up right where you left off.</Text>

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.field}
        />
        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.field}
        />
        <PrimaryButton label="Sign In" onPress={() => void handleLogin()} loading={loading} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl * 2,
  },
  title: {
    color: colors.text,
    fontSize: font.title,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.muted,
    fontSize: font.body,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  field: {
    marginBottom: spacing.md,
  },
});
