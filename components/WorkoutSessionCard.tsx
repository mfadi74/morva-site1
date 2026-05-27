import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors } from '../constants/colors';
import type { WorkoutSession } from '../data/workouts';

interface Props {
  session: WorkoutSession;
  isToday?: boolean;
  isCompleted?: boolean;
}

const TYPE_LABELS: Record<WorkoutSession['type'], string> = {
  strength: 'Strength',
  cardio: 'Cardio',
  mobility: 'Mobility',
  rest: 'Rest',
};

export function WorkoutSessionCard({ session, isToday, isCompleted }: Props) {
  const totalExercises = session.warmup.length + session.circuit.length + session.cooldown.length;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push(`/workout/${session.id}`)}
      style={styles.wrapper}
    >
      <LinearGradient
        colors={[session.colorStart + 'dd', session.colorEnd + 'dd']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, isToday && styles.cardToday]}
      >
        {isToday && (
          <View style={styles.todayBadge}>
            <Text style={styles.todayText}>TODAY</Text>
          </View>
        )}
        {isCompleted && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>✓ DONE</Text>
          </View>
        )}
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{TYPE_LABELS[session.type]}</Text>
        </View>
        <Text style={styles.day}>{session.day}</Text>
        <Text style={styles.title}>{session.title}</Text>
        <Text style={styles.subtitle}>{session.subtitle}</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{session.totalMinutes}</Text>
            <Text style={styles.statLabel}>min</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{totalExercises}</Text>
            <Text style={styles.statLabel}>exercises</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{session.caloriesBurn}</Text>
            <Text style={styles.statLabel}>cal</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
  },
  cardToday: {
    borderWidth: 2,
    borderColor: Colors.white + '40',
  },
  todayBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: Colors.white + '20',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  todayText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  completedBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: Colors.success + '30',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  completedText: {
    color: Colors.success,
    fontSize: 11,
    fontWeight: '700',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.white + '15',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 10,
  },
  typeText: {
    color: Colors.white + 'cc',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  day: {
    color: Colors.white + '80',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  title: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.white + 'cc',
    fontSize: 14,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.black + '20',
    borderRadius: 12,
    padding: 12,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: Colors.white + '80',
    fontSize: 11,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.white + '20',
  },
});
