import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Path, Circle, Polyline } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { WORKOUT_SESSIONS, WEEK_SCHEDULE } from '../../data/workouts';
import { WorkoutSessionCard } from '../../components/WorkoutSessionCard';
import { MetricCard } from '../../components/MetricCard';
import { ProgressRing } from '../../components/ProgressRing';
import { useHealthKit } from '../../hooks/useHealthKit';

function HeartIcon({ color = Colors.heartRate, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </Svg>
  );
}

function StepsIcon({ color = Colors.steps, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CaloriesIcon({ color = Colors.calories, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Path d="M12 2a7 7 0 017 7c0 5-7 13-7 13S5 14 5 9a7 7 0 017-7z" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={12} cy={9} r={2.5} stroke={color} />
    </Svg>
  );
}

function HRVIcon({ color = Colors.hrv, size = 18 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function WatchIcon({ color = Colors.accent, size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx={12} cy={12} r={7} />
      <Polyline points="12 9 12 12 13.5 13.5" strokeLinecap="round" />
      <Path d="M16.51 17.35l-.35 3.83a2 2 0 01-2 1.82H9.83a2 2 0 01-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 019.83 1h4.35a2 2 0 012 1.82l.35 3.83" strokeLinecap="round" />
    </Svg>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getTodaySession() {
  const dayIndex = new Date().getDay(); // 0=Sun,1=Mon...
  // Convert JS day (Sun=0) to our Mon-based index (Mon=0)
  const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
  const schedule = WEEK_SCHEDULE.find(s => s.dayIndex === adjustedIndex);
  if (!schedule || schedule.isRest || !schedule.sessionId) return null;
  return WORKOUT_SESSIONS.find(s => s.id === schedule.sessionId) ?? null;
}

const TIPS = [
  'At 50+, consistency beats intensity. Showing up 4 times a week changes everything.',
  'Protein at every meal preserves the muscle you work hard to build.',
  'Sleep is when fat burns and muscle grows. Protect 7-8 hours every night.',
  'Recovery IS training. Rest days make you stronger, not weaker.',
  'Your resting heart rate dropping over weeks is a sign your fitness is improving.',
  'HRV above 50ms means your nervous system is recovered — great day to push harder.',
];

export default function HomeScreen() {
  const { metrics, isLoading, isDemoMode, watchStatus, refresh, heartRateHistory } = useHealthKit();
  const [refreshing, setRefreshing] = React.useState(false);
  const todaySession = getTodaySession();
  const tip = TIPS[new Date().getDate() % TIPS.length];

  const currentHR = heartRateHistory.length > 0
    ? heartRateHistory[heartRateHistory.length - 1].bpm
    : metrics?.restingHeartRate ?? 65;

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accent}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}, Champion!</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>
          <View style={[styles.watchBadge, isDemoMode && styles.watchBadgeDemo]}>
            <WatchIcon color={isDemoMode ? Colors.warning : Colors.accent} />
            <View style={[styles.watchDot, isDemoMode && styles.watchDotDemo]} />
          </View>
        </View>

        {/* Watch status */}
        <View style={[styles.watchStatus, isDemoMode && styles.watchStatusDemo]}>
          <Text style={[styles.watchStatusText, isDemoMode && styles.watchStatusTextDemo]}>
            {isDemoMode
              ? '⚡ Demo Mode — Connect Apple Watch in Settings for live data'
              : '● Apple Watch Connected · Synced just now'}
          </Text>
        </View>

        {/* Metrics grid */}
        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={Colors.accent} size="large" />
            <Text style={styles.loadingText}>Reading Apple Watch data...</Text>
          </View>
        ) : (
          <View style={styles.metricsGrid}>
            <View style={styles.metricsRow}>
              <MetricCard
                icon={<HeartIcon />}
                label="Heart Rate"
                value={String(currentHR)}
                unit="bpm"
                color={Colors.heartRate}
                subtitle="Current"
              />
              <MetricCard
                icon={<StepsIcon />}
                label="Steps"
                value={metrics ? (metrics.steps >= 1000 ? `${(metrics.steps / 1000).toFixed(1)}k` : String(metrics.steps)) : '--'}
                unit={metrics && metrics.steps >= 1000 ? '' : 'steps'}
                color={Colors.steps}
                subtitle={`Goal: 8,000`}
              />
            </View>
            <View style={styles.metricsRow}>
              <MetricCard
                icon={<CaloriesIcon />}
                label="Active Cal"
                value={metrics ? String(metrics.activeCalories) : '--'}
                unit="kcal"
                color={Colors.calories}
                subtitle={`Goal: 400`}
              />
              <MetricCard
                icon={<HRVIcon />}
                label="HRV"
                value={metrics ? String(metrics.hrv) : '--'}
                unit="ms"
                color={Colors.hrv}
                subtitle={metrics && metrics.hrv > 50 ? 'Good recovery' : 'Rest today'}
              />
            </View>
          </View>
        )}

        {/* Today's workout */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Session</Text>
          <TouchableOpacity onPress={() => router.push('/plan')}>
            <Text style={styles.seeAll}>View Plan →</Text>
          </TouchableOpacity>
        </View>

        {todaySession ? (
          <WorkoutSessionCard session={todaySession} isToday />
        ) : (
          <LinearGradient
            colors={[Colors.surface, Colors.cardGradientEnd]}
            style={styles.restCard}
          >
            <Text style={styles.restEmoji}>🌿</Text>
            <Text style={styles.restTitle}>Rest Day</Text>
            <Text style={styles.restSubtitle}>
              Recovery is where results are made.{'\n'}Take a gentle walk and stay hydrated.
            </Text>
          </LinearGradient>
        )}

        {/* Daily progress rings */}
        {metrics && (
          <>
            <Text style={styles.sectionTitle}>Daily Progress</Text>
            <LinearGradient
              colors={[Colors.surface, Colors.cardGradientEnd]}
              style={styles.ringsCard}
            >
              <View style={styles.ringsRow}>
                <View style={styles.ringItem}>
                  <ProgressRing
                    size={88}
                    strokeWidth={8}
                    progress={metrics.steps / 8000}
                    color={Colors.steps}
                    value={(metrics.steps >= 1000 ? `${(metrics.steps / 1000).toFixed(1)}k` : String(metrics.steps))}
                    label="steps"
                  />
                </View>
                <View style={styles.ringItem}>
                  <ProgressRing
                    size={88}
                    strokeWidth={8}
                    progress={metrics.activeCalories / 400}
                    color={Colors.calories}
                    value={String(metrics.activeCalories)}
                    label="calories"
                  />
                </View>
                <View style={styles.ringItem}>
                  <ProgressRing
                    size={88}
                    strokeWidth={8}
                    progress={metrics.exerciseMinutes / 30}
                    color={Colors.accent}
                    value={String(metrics.exerciseMinutes)}
                    label="min active"
                  />
                </View>
              </View>
            </LinearGradient>
          </>
        )}

        {/* Tip */}
        <LinearGradient
          colors={[Colors.accentDim, Colors.surface]}
          style={styles.tipCard}
        >
          <Text style={styles.tipLabel}>TRAINER TIP</Text>
          <Text style={styles.tipText}>{tip}</Text>
        </LinearGradient>

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 16,
    marginBottom: 12,
  },
  greeting: {
    color: Colors.text,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  date: {
    color: Colors.textMuted,
    fontSize: 14,
    marginTop: 2,
  },
  watchBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.accent + '40',
    position: 'relative',
  },
  watchBadgeDemo: {
    backgroundColor: Colors.warning + '15',
    borderColor: Colors.warning + '40',
  },
  watchDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    borderWidth: 1.5,
    borderColor: Colors.surface,
  },
  watchDotDemo: {
    backgroundColor: Colors.warning,
  },
  watchStatus: {
    backgroundColor: Colors.accentDim,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.accent + '30',
  },
  watchStatusDemo: {
    backgroundColor: Colors.warning + '10',
    borderColor: Colors.warning + '30',
  },
  watchStatusText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '500',
  },
  watchStatusTextDemo: {
    color: Colors.warning,
  },
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  loadingText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  metricsGrid: {
    marginBottom: 24,
    gap: 0,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  seeAll: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  restCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  restEmoji: { fontSize: 40, marginBottom: 8 },
  restTitle: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  restSubtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  ringsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ringsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  ringItem: {
    alignItems: 'center',
    gap: 8,
  },
  tipCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.accent + '20',
  },
  tipLabel: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  tipText: {
    color: Colors.textDim,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  bottomPad: { height: 20 },
});
