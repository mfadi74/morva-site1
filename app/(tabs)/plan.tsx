import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { WORKOUT_SESSIONS, WEEK_SCHEDULE, getAdjustedDayIndex } from '../../data/workouts';
import { WorkoutSessionCard } from '../../components/WorkoutSessionCard';

// getAdjustedDayIndex imported from workouts (Sat=0)

const NUTRITION_TIPS = [
  { icon: '🥚', title: 'Protein First', body: 'Aim for 25–30g protein per meal. Eggs, fish, chicken, legumes. Preserves muscle while losing fat.' },
  { icon: '💧', title: 'Hydrate', body: 'Drink 2L of water daily. Metabolism slows significantly with even mild dehydration.' },
  { icon: '🌙', title: 'Sleep = Results', body: '7–8 hours of sleep. Poor sleep raises cortisol, which stores belly fat. Sleep IS part of the plan.' },
  { icon: '⏰', title: 'Don\'t Skip Breakfast', body: 'Kickstarts your metabolism. A protein-rich breakfast sets your energy and hunger for the whole day.' },
];

const PROGRESSION: { week: string; tip: string }[] = [
  { week: 'Week 1–2', tip: 'Learn the movements. Focus on form, not speed. Do 2 rounds if tired — that\'s OK.' },
  { week: 'Week 3–4', tip: 'Full 3 rounds every session. Try to reduce rest between rounds to 45 seconds.' },
  { week: 'Week 5–6', tip: 'Add 2 reps to each exercise. Wall push-up → incline push-up. Feel the progress!' },
  { week: 'Week 7+', tip: 'Reassess — you\'ll likely be ready for an intermediate plan. Check in with your trainer.' },
];

export default function PlanScreen() {
  const todayIndex = getAdjustedDayIndex();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your 6-Week Plan</Text>
          <Text style={styles.subtitle}>15 minutes · 5 days/week · Strength + Tai Chi</Text>
        </View>

        {/* Profile badge */}
        <LinearGradient
          colors={['#4f46e5dd', '#7c3aeddd']}
          style={styles.profileBadge}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View>
            <Text style={styles.profileLabel}>Your Profile</Text>
            <Text style={styles.profileText}>Beginner · No Equipment · Weight Loss + Tai Chi</Text>
          </View>
          <View style={styles.profileStats}>
            <Text style={styles.profileStat}>4x{'\n'}<Text style={styles.profileStatLabel}>per week</Text></Text>
            <Text style={styles.profileStat}>15m{'\n'}<Text style={styles.profileStatLabel}>per session</Text></Text>
            <Text style={styles.profileStat}>6wk{'\n'}<Text style={styles.profileStatLabel}>program</Text></Text>
          </View>
        </LinearGradient>

        {/* Tai Chi benefits */}
        <LinearGradient
          colors={['#7c3aed44', '#4f46e544']}
          style={styles.taiChiCard}
        >
          <Text style={styles.taiChiTitle}>🥋 Why Tai Chi?</Text>
          <Text style={styles.taiChiBody}>
            For men over 50, Tai Chi is one of the most evidence-backed exercises for longevity. Two 15-minute sessions per week improves balance (reducing fall risk by 45%), lowers blood pressure, reduces cortisol, and strengthens joints without impact stress.
          </Text>
        </LinearGradient>

        {/* Weekly calendar strip */}
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.weekStrip}>
          {WEEK_SCHEDULE.map((day) => {
            const session = day.sessionId
              ? WORKOUT_SESSIONS.find(s => s.id === day.sessionId)
              : null;
            const isToday = day.dayIndex === todayIndex;
            return (
              <View key={day.dayIndex} style={[styles.dayCell, isToday && styles.dayCellToday]}>
                <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>{day.label}</Text>
                {day.isRest ? (
                  <View style={styles.restDot}>
                    <Text style={styles.restDotText}>–</Text>
                  </View>
                ) : (
                  <View style={[styles.workoutDot, { backgroundColor: session?.colorStart ?? Colors.accent }]}>
                    <Text style={styles.workoutDotText}>
                      {session?.type === 'strength' ? '💪' : session?.type === 'cardio' ? '🔥' : session?.type === 'taichi' ? '🥋' : session?.type === 'mobility' ? '🌿' : '–'}
                    </Text>
                  </View>
                )}
                <Text style={[styles.dayTypeLabel, isToday && { color: Colors.accent }]}>
                  {day.isRest ? 'Rest' : session?.type ?? ''}
                </Text>
              </View>
            );
          })}
        </View>

        {/* All workout sessions */}
        <Text style={styles.sectionTitle}>Training Sessions</Text>
        {WORKOUT_SESSIONS.map((session) => (
          <WorkoutSessionCard
            key={session.id}
            session={session}
            isToday={session.dayIndex === todayIndex}
          />
        ))}

        {/* Progression plan */}
        <Text style={styles.sectionTitle}>Progression Plan</Text>
        {PROGRESSION.map((item, i) => (
          <View key={i} style={styles.progressionRow}>
            <View style={styles.progressionWeekBadge}>
              <Text style={styles.progressionWeek}>{item.week}</Text>
            </View>
            <Text style={styles.progressionTip}>{item.tip}</Text>
          </View>
        ))}

        {/* Nutrition section */}
        <Text style={styles.sectionTitle}>Nutrition for Fat Loss</Text>
        <View style={styles.nutritionGrid}>
          {NUTRITION_TIPS.map((tip, i) => (
            <LinearGradient
              key={i}
              colors={[Colors.surface, Colors.cardGradientEnd]}
              style={styles.nutritionCard}
            >
              <Text style={styles.nutritionIcon}>{tip.icon}</Text>
              <Text style={styles.nutritionTitle}>{tip.title}</Text>
              <Text style={styles.nutritionBody}>{tip.body}</Text>
            </LinearGradient>
          ))}
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
  header: { paddingTop: 16, marginBottom: 20 },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  profileBadge: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    gap: 16,
  },
  profileLabel: {
    color: Colors.white + '80',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  profileText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  profileStats: {
    flexDirection: 'row',
    gap: 24,
  },
  profileStat: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '700',
  },
  profileStatLabel: {
    color: Colors.white + '80',
    fontSize: 11,
    fontWeight: '400',
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 8,
  },
  weekStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    borderRadius: 10,
  },
  dayCellToday: {
    backgroundColor: Colors.accentDim,
  },
  dayLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  dayLabelToday: {
    color: Colors.accent,
  },
  restDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restDotText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  workoutDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutDotText: { fontSize: 14 },
  dayTypeLabel: {
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  progressionRow: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  progressionWeekBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentDim,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  progressionWeek: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  progressionTip: {
    color: Colors.textDim,
    fontSize: 14,
    lineHeight: 20,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  nutritionCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  nutritionIcon: { fontSize: 28 },
  nutritionTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  nutritionBody: {
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
  bottomPad: { height: 20 },
  taiChiCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#7c3aed40',
  },
  taiChiTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  taiChiBody: {
    color: Colors.textDim,
    fontSize: 13,
    lineHeight: 19,
  },
});
