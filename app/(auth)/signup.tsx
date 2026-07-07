import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input, PrimaryButton } from '@/components/ui';
import { colors, font, spacing } from '@/constants/theme';
import { isSupabaseEnabled, supabase } from '@/lib/supabase';
import { useAppStore } from '@/stores/appStore';

export default function Signup() {
  const createProfile = useAppStore((s) => s.createProfile);
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name.trim()) {
      Alert.alert('One thing missing', 'Tell us your name (or a nickname).');
      return;
    }
    setLoading(true);
    try {
      if (isSupabaseEnabled && supabase) {
        if (!email.trim() || password.length < 6) {
          Alert.alert('Check your details', 'Enter an email and a password with 6+ characters.');
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: name.trim() } },
        });
        if (error) {
          Alert.alert('Sign up failed', error.message);
          setLoading(false);
          return;
        }
        await createProfile(name, country, false);
      } else {
        await createProfile(name, country, true);
      }
      router.replace('/(auth)/onboarding');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            {isSupabaseEnabled
              ? 'Your progress syncs to the cloud, private to you.'
              : 'Demo mode: everything is saved privately on this device.'}
          </Text>

          <Input placeholder="Your name or nickname" value={name} onChangeText={setName} style={styles.field} />
          <Input placeholder="Country (optional)" value={country} onChangeText={setCountry} style={styles.field} />

          {isSupabaseEnabled && (
            <>
              <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.field}
              />
              <Input
                placeholder="Password (6+ characters)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.field}
              />
            </>
          )}

          <PrimaryButton
            label={isSupabaseEnabled ? 'Sign Up' : 'Start My Journey'}
            onPress={() => void handleCreate()}
            loading={loading}
            style={{ marginTop: spacing.md }}
          />
          <Text style={styles.privacy}>
            No creepy tracking. Your data is yours — always.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  scroll: {
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
    lineHeight: 21,
  },
  field: {
    marginBottom: spacing.md,
  },
  privacy: {
    color: colors.muted,
    fontSize: font.small,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
