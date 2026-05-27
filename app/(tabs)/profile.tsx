import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { useHealthKit } from '../../hooks/useHealthKit';

function ChevronRight({ color = Colors.textMuted }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

interface SettingRowProps {
  label: string;
  value?: string;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
  color?: string;
  danger?: boolean;
}

function SettingRow({ label, value, toggle, toggleValue, onToggle, onPress, color, danger }: SettingRowProps) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} disabled={toggle || !onPress}>
      <Text style={[styles.settingLabel, danger && { color: Colors.danger }]}>{label}</Text>
      {toggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: Colors.surfaceLight, true: Colors.accent + '80' }}
          thumbColor={toggleValue ? Colors.accent : Colors.textMuted}
        />
      ) : value ? (
        <View style={styles.settingRight}>
          <Text style={[styles.settingValue, color ? { color } : {}]}>{value}</Text>
          <ChevronRight />
        </View>
      ) : (
        <ChevronRight color={danger ? Colors.danger : Colors.textMuted} />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { isDemoMode, metrics, watchStatus, refresh } = useHealthKit();
  const [notifications, setNotifications] = useState(true);
  const [motivationReminders, setMotivationReminders] = useState(true);
  const [autoTrackWorkouts, setAutoTrackWorkouts] = useState(true);

  const handleConnectWatch = () => {
    Alert.alert(
      'Connect Apple Watch',
      'Open the Apple Health app on your iPhone and enable FitOver50 as a health data source. Make sure your Apple Watch is paired and synced.',
      [{ text: 'Got it' }]
    );
  };

  const handleRefreshData = async () => {
    await refresh();
    Alert.alert('Refreshed', 'Health data has been updated from Apple Watch.');
  };

  const currentWeek = Math.ceil((new Date().getDate()) / 7);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Profile Header */}
        <LinearGradient
          colors={['#4f46e5dd', '#7c3aeddd']}
          style={styles.profileHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>💪</Text>
          </View>
          <Text style={styles.profileName}>Champion</Text>
          <Text style={styles.profileSub}>FitOver50 Member · Week {currentWeek} of 6</Text>
          <View style={styles.profileBadges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Beginner</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Weight Loss</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>No Equipment</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Stats summary */}
        <LinearGradient colors={[Colors.surface, Colors.cardGradientEnd]} style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.accent }]}>4</Text>
              <Text style={styles.statLabel}>Workouts{'\n'}This Week</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.calories }]}>
                {metrics ? Math.round(metrics.activeCalories) : '--'}
              </Text>
              <Text style={styles.statLabel}>Cal Burned{'\n'}Today</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: Colors.heartRate }]}>
                {metrics?.restingHeartRate ?? '--'}
              </Text>
              <Text style={styles.statLabel}>Resting HR{'\n'}BPM</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Apple Watch */}
        <Text style={styles.sectionTitle}>Apple Watch</Text>
        <LinearGradient colors={[Colors.surface, Colors.cardGradientEnd]} style={styles.section}>
          <SettingRow
            label={isDemoMode ? 'Connect Apple Watch' : 'Apple Watch Connected'}
            value={isDemoMode ? 'Not connected' : 'Active'}
            color={isDemoMode ? Colors.warning : Colors.success}
            onPress={isDemoMode ? handleConnectWatch : undefined}
          />
          <SettingRow
            label="Auto-Track Workouts"
            toggle
            toggleValue={autoTrackWorkouts}
            onToggle={setAutoTrackWorkouts}
          />
          <SettingRow
            label="Refresh Health Data"
            onPress={handleRefreshData}
          />
        </LinearGradient>

        {/* Training profile */}
        <Text style={styles.sectionTitle}>Training Profile</Text>
        <LinearGradient colors={[Colors.surface, Colors.cardGradientEnd]} style={styles.section}>
          <SettingRow label="Fitness Level" value="Beginner" onPress={() => {}} />
          <SettingRow label="Primary Goal" value="Weight Loss" onPress={() => {}} />
          <SettingRow label="Equipment" value="None" onPress={() => {}} />
          <SettingRow label="Program Week" value={`Week ${currentWeek} of 6`} color={Colors.accent} />
        </LinearGradient>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <LinearGradient colors={[Colors.surface, Colors.cardGradientEnd]} style={styles.section}>
          <SettingRow
            label="Workout Reminders"
            toggle
            toggleValue={notifications}
            onToggle={setNotifications}
          />
          <SettingRow
            label="Motivation Messages"
            toggle
            toggleValue={motivationReminders}
            onToggle={setMotivationReminders}
          />
        </LinearGradient>

        {/* About */}
        <Text style={styles.sectionTitle}>About</Text>
        <LinearGradient colors={[Colors.surface, Colors.cardGradientEnd]} style={styles.section}>
          <SettingRow label="App Version" value="1.0.0" />
          <SettingRow label="Trainer" value="AI Coach · Over 50 Specialist" />
        </LinearGradient>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ⚠️ Always consult your physician before starting a new exercise program. This app is for informational purposes and does not constitute medical advice. Stop any exercise that causes pain and seek medical attention if needed.
          </Text>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20 },
  profileHeader: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
    gap: 8,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.white + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarText: { fontSize: 36 },
  profileName: { color: Colors.white, fontSize: 24, fontWeight: '700' },
  profileSub: { color: Colors.white + '80', fontSize: 14 },
  profileBadges: { flexDirection: 'row', gap: 8, marginTop: 4, flexWrap: 'wrap', justifyContent: 'center' },
  badge: {
    backgroundColor: Colors.white + '20',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { color: Colors.white, fontSize: 12, fontWeight: '600' },
  statsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 28, fontWeight: '700' },
  statLabel: { color: Colors.textMuted, fontSize: 11, textAlign: 'center', lineHeight: 15 },
  statDivider: { width: 1, height: 40, backgroundColor: Colors.border },
  sectionTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 8,
    paddingLeft: 4,
  },
  section: {
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLabel: { color: Colors.text, fontSize: 15, fontWeight: '500' },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingValue: { color: Colors.textMuted, fontSize: 14 },
  disclaimer: {
    backgroundColor: Colors.warning + '10',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.warning + '30',
  },
  disclaimerText: { color: Colors.textMuted, fontSize: 12, lineHeight: 17 },
  bottomPad: { height: 20 },
});
