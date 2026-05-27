import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Rect, Path, Circle, Line, Text as SvgText, G } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { useHealthKit } from '../../hooks/useHealthKit';
import { getZoneColor, getZoneLabel } from '../../data/healthTypes';
import type { HeartRateSample } from '../../data/healthTypes';

function HeartRateChart({ samples }: { samples: HeartRateSample[] }) {
  const chartWidth = 320;
  const chartHeight = 100;
  const barWidth = chartWidth / samples.length - 2;
  const minBpm = 40;
  const maxBpm = 160;

  return (
    <Svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
      {samples.map((s, i) => {
        const pct = Math.max(0, Math.min(1, (s.bpm - minBpm) / (maxBpm - minBpm)));
        const barHeight = Math.max(4, pct * chartHeight);
        const x = i * (chartWidth / samples.length) + 1;
        const y = chartHeight - barHeight;
        const color = getZoneColor(s.zone);
        return (
          <Rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            rx={3}
            fill={color}
            opacity={0.85}
          />
        );
      })}
    </Svg>
  );
}

function WeeklyCaloriesChart({ weeklyData }: { weeklyData: Array<{ label: string; calories: number }> }) {
  const chartWidth = 300;
  const chartHeight = 80;
  const maxCal = Math.max(...weeklyData.map(d => d.calories), 100);
  const barWidth = chartWidth / weeklyData.length - 6;

  return (
    <Svg width={chartWidth} height={chartHeight + 20} viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`}>
      {weeklyData.map((d, i) => {
        const pct = d.calories / maxCal;
        const barHeight = Math.max(4, pct * chartHeight);
        const x = i * (chartWidth / weeklyData.length) + 3;
        const y = chartHeight - barHeight;
        const isToday = i === weeklyData.length - 1;
        return (
          <G key={i}>
            <Rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={4}
              fill={isToday ? Colors.accent : Colors.steps + '80'}
            />
            <SvgText
              x={x + barWidth / 2}
              y={chartHeight + 14}
              textAnchor="middle"
              fill={Colors.textMuted}
              fontSize={10}
              fontWeight="500"
            >
              {d.label}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
}

function WatchIcon({ size = 20, color = Colors.accent }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx={12} cy={12} r={7} />
      <Path d="M12 9v3l1.5 1.5" strokeLinecap="round" />
      <Path d="M16.51 17.35l-.35 3.83a2 2 0 01-2 1.82H9.83a2 2 0 01-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 019.83 1h4.35a2 2 0 012 1.82l.35 3.83" strokeLinecap="round" />
    </Svg>
  );
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function HealthScreen() {
  const { isLoading, isDemoMode, metrics, heartRateHistory, weeklyMetrics, watchStatus, refresh } = useHealthKit();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const recoveryScore = metrics ? Math.min(100, Math.round(metrics.hrv * 2)) : 0;
  const recoveryColor = recoveryScore >= 70 ? Colors.success : recoveryScore >= 40 ? Colors.warning : Colors.danger;
  const recoveryLabel = recoveryScore >= 70 ? 'Well Recovered' : recoveryScore >= 40 ? 'Moderate Recovery' : 'Rest Needed';

  const currentZone = heartRateHistory.length > 0 ? heartRateHistory[heartRateHistory.length - 1].zone : 'rest';
  const currentBPM = heartRateHistory.length > 0 ? heartRateHistory[heartRateHistory.length - 1].bpm : metrics?.restingHeartRate ?? 65;

  const weeklyCalData = weeklyMetrics.map((m, i) => ({
    label: DAY_LABELS[new Date(m.date).getDay() === 0 ? 6 : new Date(m.date).getDay() - 1],
    calories: m.activeCalories,
  }));

  const fitnessAge = metrics?.vo2Max
    ? Math.round(55 - (metrics.vo2Max - 30) * 0.5)
    : 55;

  const insights: string[] = [];
  if (metrics) {
    if (metrics.hrv > 50) insights.push(`Your HRV of ${metrics.hrv}ms indicates good recovery — today is a great day to train.`);
    else insights.push(`Your HRV of ${metrics.hrv}ms suggests your body needs more recovery. Consider the mobility session today.`);
    if (metrics.restingHeartRate < 65) insights.push(`Resting HR of ${metrics.restingHeartRate}bpm is excellent for your age — your cardiovascular fitness is improving.`);
    else insights.push(`Your resting HR of ${metrics.restingHeartRate}bpm is normal. As fitness improves, expect this to drop 5–10bpm over months.`);
    if (metrics.steps >= 6000) insights.push(`${metrics.steps.toLocaleString()} steps today — you're hitting your activity targets alongside training. Great work.`);
    else insights.push(`${metrics.steps.toLocaleString()} steps so far today. Try a 10-minute walk after lunch to boost your daily total.`);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.accent} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Health Analytics</Text>
          <Text style={styles.subtitle}>Powered by Apple Watch</Text>
        </View>

        {isDemoMode && (
          <View style={styles.demoBanner}>
            <Text style={styles.demoText}>⚡ Demo data shown — connect Apple Watch for live metrics</Text>
          </View>
        )}

        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={Colors.accent} size="large" />
            <Text style={styles.loadingText}>Reading Apple Watch data...</Text>
          </View>
        ) : (
          <>
            {/* Watch Status Card */}
            <LinearGradient colors={[Colors.surface, Colors.cardGradientEnd]} style={styles.watchCard}>
              <View style={styles.watchRow}>
                <View style={[styles.watchIconWrap, { backgroundColor: Colors.accentDim }]}>
                  <WatchIcon />
                </View>
                <View style={styles.watchInfo}>
                  <Text style={styles.watchTitle}>
                    {isDemoMode ? 'Demo Mode' : 'Apple Watch'}
                  </Text>
                  <Text style={styles.watchSub}>
                    {isDemoMode
                      ? 'Showing sample data'
                      : `Last sync: ${watchStatus.lastSync ? 'just now' : 'unknown'}`}
                  </Text>
                </View>
                <View style={styles.watchRight}>
                  <View style={[styles.statusDot, { backgroundColor: isDemoMode ? Colors.warning : Colors.success }]} />
                  {watchStatus.batteryLevel && !isDemoMode && (
                    <Text style={styles.batteryText}>{watchStatus.batteryLevel}%</Text>
                  )}
                </View>
              </View>
            </LinearGradient>

            {/* Heart Rate */}
            <Text style={styles.sectionTitle}>Heart Rate</Text>
            <LinearGradient colors={[Colors.surface, Colors.cardGradientEnd]} style={styles.card}>
              <View style={styles.hrRow}>
                <View>
                  <Text style={[styles.bpmValue, { color: Colors.heartRate }]}>{currentBPM}</Text>
                  <Text style={styles.bpmUnit}>BPM</Text>
                </View>
                <View style={[styles.zoneBadge, { backgroundColor: getZoneColor(currentZone) + '20', borderColor: getZoneColor(currentZone) + '40' }]}>
                  <View style={[styles.zoneDot, { backgroundColor: getZoneColor(currentZone) }]} />
                  <Text style={[styles.zoneLabel, { color: getZoneColor(currentZone) }]}>
                    {getZoneLabel(currentZone)}
                  </Text>
                </View>
              </View>
              <Text style={styles.chartTitle}>Last 24 Hours</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HeartRateChart samples={heartRateHistory} />
              </ScrollView>
              <View style={styles.zoneLegend}>
                {(['rest', 'fat-burn', 'cardio', 'peak'] as const).map(zone => (
                  <View key={zone} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: getZoneColor(zone) }]} />
                    <Text style={styles.legendText}>{getZoneLabel(zone)}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>

            {/* Recovery Score */}
            <Text style={styles.sectionTitle}>Recovery Score</Text>
            <LinearGradient colors={[Colors.surface, Colors.cardGradientEnd]} style={styles.card}>
              <View style={styles.recoveryRow}>
                <View style={[styles.recoveryCircle, { borderColor: recoveryColor }]}>
                  <Text style={[styles.recoveryScore, { color: recoveryColor }]}>{recoveryScore}</Text>
                  <Text style={styles.recoveryMax}>/100</Text>
                </View>
                <View style={styles.recoveryInfo}>
                  <Text style={[styles.recoveryLabel, { color: recoveryColor }]}>{recoveryLabel}</Text>
                  <Text style={styles.recoveryDesc}>
                    Based on HRV of {metrics?.hrv ?? '--'}ms.{'\n'}
                    {recoveryScore >= 70
                      ? 'Your nervous system is fully recovered — ideal for training.'
                      : recoveryScore >= 40
                      ? "Moderate recovery. Listen to your body during today's session."
                      : 'Your body needs rest. Consider skipping today\'s session or doing mobility only.'}
                  </Text>
                </View>
              </View>
            </LinearGradient>

            {/* Weekly Activity */}
            <Text style={styles.sectionTitle}>Weekly Activity</Text>
            <LinearGradient colors={[Colors.surface, Colors.cardGradientEnd]} style={styles.card}>
              <Text style={styles.chartSubtitle}>Active Calories — Last 7 Days</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <WeeklyCaloriesChart weeklyData={weeklyCalData} />
              </ScrollView>
              <View style={styles.weeklyTotal}>
                <Text style={styles.weeklyTotalLabel}>This week</Text>
                <Text style={[styles.weeklyTotalValue, { color: Colors.steps }]}>
                  {weeklyMetrics.reduce((s, m) => s + m.activeCalories, 0).toLocaleString()} cal burned
                </Text>
              </View>
            </LinearGradient>

            {/* Resting HR */}
            <Text style={styles.sectionTitle}>Resting Heart Rate</Text>
            <LinearGradient colors={[Colors.surface, Colors.cardGradientEnd]} style={styles.card}>
              <View style={styles.metricRow}>
                <Text style={[styles.bigValue, { color: Colors.heartRate }]}>{metrics?.restingHeartRate ?? '--'}</Text>
                <Text style={styles.bigUnit}>bpm</Text>
              </View>
              <Text style={styles.metricDesc}>
                A healthy resting HR for men 50–65 is typically 55–75 bpm. Elite endurance athletes often see 45–55 bpm. As your fitness improves with this plan, expect your resting HR to drop gradually over weeks.
              </Text>
            </LinearGradient>

            {/* VO2 Max */}
            {metrics?.vo2Max && (
              <>
                <Text style={styles.sectionTitle}>VO2 Max</Text>
                <LinearGradient colors={[Colors.surface, Colors.cardGradientEnd]} style={styles.card}>
                  <View style={styles.metricRow}>
                    <Text style={[styles.bigValue, { color: Colors.hrv }]}>{metrics.vo2Max.toFixed(1)}</Text>
                    <Text style={styles.bigUnit}>mL/kg/min</Text>
                  </View>
                  <View style={styles.fitnessAgeBadge}>
                    <Text style={styles.fitnessAgeLabel}>Fitness Age Estimate: </Text>
                    <Text style={[styles.fitnessAgeValue, { color: fitnessAge < 55 ? Colors.success : Colors.warning }]}>
                      {fitnessAge} years
                    </Text>
                  </View>
                  <Text style={styles.metricDesc}>
                    VO2 Max is the best single predictor of longevity. Average for your age group is 31–35. Above 40 is excellent. Consistent cardio training typically increases VO2 Max by 10–15% in 12 weeks.
                  </Text>
                </LinearGradient>
              </>
            )}

            {/* Insights */}
            <Text style={styles.sectionTitle}>Today's Insights</Text>
            {insights.map((insight, i) => (
              <View key={i} style={styles.insightRow}>
                <View style={[styles.insightDot, { backgroundColor: [Colors.accent, Colors.heartRate, Colors.steps][i % 3] }]} />
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            ))}
          </>
        )}

        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20 },
  header: { paddingTop: 16, marginBottom: 16 },
  title: { color: Colors.text, fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { color: Colors.textMuted, fontSize: 14, marginTop: 4 },
  demoBanner: {
    backgroundColor: Colors.warning + '15',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.warning + '30',
  },
  demoText: { color: Colors.warning, fontSize: 12, fontWeight: '500' },
  loadingBox: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  loadingText: { color: Colors.textMuted, fontSize: 14 },
  watchCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  watchRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  watchIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchInfo: { flex: 1 },
  watchTitle: { color: Colors.text, fontSize: 16, fontWeight: '600' },
  watchSub: { color: Colors.textMuted, fontSize: 12, marginTop: 2 },
  watchRight: { alignItems: 'flex-end', gap: 4 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  batteryText: { color: Colors.textMuted, fontSize: 12 },
  sectionTitle: { color: Colors.text, fontSize: 18, fontWeight: '700', marginBottom: 12, marginTop: 8 },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  hrRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  bpmValue: { fontSize: 52, fontWeight: '700', letterSpacing: -2 },
  bpmUnit: { color: Colors.textMuted, fontSize: 14, fontWeight: '500', marginTop: -4 },
  zoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  zoneDot: { width: 8, height: 8, borderRadius: 4 },
  zoneLabel: { fontSize: 13, fontWeight: '600' },
  chartTitle: { color: Colors.textMuted, fontSize: 12, fontWeight: '500', marginBottom: 8 },
  chartSubtitle: { color: Colors.textMuted, fontSize: 12, fontWeight: '500', marginBottom: 12 },
  zoneLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: Colors.textMuted, fontSize: 11 },
  recoveryRow: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  recoveryCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceLight,
  },
  recoveryScore: { fontSize: 32, fontWeight: '700' },
  recoveryMax: { color: Colors.textMuted, fontSize: 11, marginTop: -4 },
  recoveryInfo: { flex: 1 },
  recoveryLabel: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  recoveryDesc: { color: Colors.textMuted, fontSize: 13, lineHeight: 18 },
  weeklyTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  weeklyTotalLabel: { color: Colors.textMuted, fontSize: 13 },
  weeklyTotalValue: { fontSize: 15, fontWeight: '700' },
  metricRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 12 },
  bigValue: { fontSize: 44, fontWeight: '700', letterSpacing: -1 },
  bigUnit: { color: Colors.textMuted, fontSize: 14, fontWeight: '500' },
  metricDesc: { color: Colors.textMuted, fontSize: 13, lineHeight: 19 },
  fitnessAgeBadge: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  fitnessAgeLabel: { color: Colors.textMuted, fontSize: 14 },
  fitnessAgeValue: { fontSize: 16, fontWeight: '700' },
  insightRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  insightDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4, flexShrink: 0 },
  insightText: { color: Colors.textDim, fontSize: 14, lineHeight: 20, flex: 1 },
  bottomPad: { height: 20 },
});
