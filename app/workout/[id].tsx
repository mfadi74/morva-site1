import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Polyline } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { WORKOUT_SESSIONS } from '../../data/workouts';
import type { Exercise, WorkoutSession } from '../../data/workouts';
import { ExerciseAnimator } from '../../components/ExerciseAnimator';
import { EXERCISE_STEPS } from '../../data/exerciseSteps';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Icons ──────────────────────────────────────────────────────────────────────

function BackIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={Colors.white} strokeWidth={2.5}>
      <Path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}


function TimerIcon({ color = Colors.accent, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Circle cx={12} cy={12} r={9} />
      <Polyline points="12 7 12 12 15 15" strokeLinecap="round" />
    </Svg>
  );
}

function CheckIcon({ color = Colors.success, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5}>
      <Path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PlayIcon({ color = Colors.white, size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M5 3l14 9-14 9V3z" />
    </Svg>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const MUSCLE_COLORS: Record<string, string> = {
  chest: '#4f46e5',
  shoulders: '#7c3aed',
  triceps: '#a78bfa',
  quads: '#0ea5e9',
  glutes: '#f59e0b',
  hamstrings: '#f97316',
  'lower back': '#ef4444',
  core: '#00d4aa',
  obliques: '#10b981',
  cardio: '#ff4060',
  legs: '#06b6d4',
  hips: '#8b5cf6',
  calves: '#14b8a6',
  neck: '#6b7a99',
  spine: '#94a3b8',
  diaphragm: '#64748b',
  'hip flexors': '#f472b6',
  'upper traps': '#a78bfa',
  'thoracic spine': '#60a5fa',
  'upper back': '#818cf8',
  ankles: '#34d399',
};

type Phase = 'warmup' | 'circuit' | 'cooldown';

// ── Exercise Video Card ────────────────────────────────────────────────────────

function ExerciseVideoCard({
  exercise,
  index,
  isCompleted,
  onComplete,
}: {
  exercise: Exercise;
  index: number;
  isCompleted: boolean;
  onComplete: () => void;
}) {
  const [expanded, setExpanded] = useState(index === 0);

  const difficultyColor =
    exercise.difficulty === 'easy' ? Colors.success
    : exercise.difficulty === 'moderate' ? Colors.warning
    : Colors.danger;

  return (
    <View style={[styles.exerciseCard, isCompleted && styles.exerciseCardDone]}>
      {/* Card header */}
      <TouchableOpacity style={styles.exerciseHeader} onPress={() => setExpanded(e => !e)} activeOpacity={0.8}>
        <View style={styles.exerciseHeaderLeft}>
          <View style={[styles.exerciseNumber, isCompleted && { backgroundColor: Colors.success }]}>
            {isCompleted
              ? <CheckIcon size={14} color={Colors.white} />
              : <Text style={styles.exerciseNumberText}>{index + 1}</Text>
            }
          </View>
          <View style={styles.exerciseTitleWrap}>
            <Text style={[styles.exerciseName, isCompleted && { color: Colors.textMuted }]}>
              {exercise.name}
            </Text>
            <View style={styles.muscleRow}>
              {exercise.muscleGroups.slice(0, 3).map(m => (
                <View key={m} style={[styles.muscleChip, { backgroundColor: (MUSCLE_COLORS[m] ?? Colors.surfaceLight) + '30' }]}>
                  <Text style={[styles.muscleChipText, { color: MUSCLE_COLORS[m] ?? Colors.textMuted }]}>{m}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.exerciseHeaderRight}>
          <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor + '20' }]}>
            <Text style={[styles.difficultyText, { color: difficultyColor }]}>
              {exercise.difficulty}
            </Text>
          </View>
          <Text style={styles.expandChevron}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.exerciseBody}>
          {/* Reps / Duration */}
          <View style={styles.statsStrip}>
            {exercise.reps ? (
              <View style={styles.statChip}>
                <Text style={styles.statChipValue}>{exercise.reps}</Text>
                <Text style={styles.statChipLabel}>reps</Text>
              </View>
            ) : null}
            {exercise.sets ? (
              <View style={styles.statChip}>
                <Text style={styles.statChipValue}>{exercise.sets}</Text>
                <Text style={styles.statChipLabel}>sets</Text>
              </View>
            ) : null}
            {exercise.duration ? (
              <View style={styles.statChip}>
                <Text style={styles.statChipValue}>{exercise.duration}</Text>
                <Text style={styles.statChipLabel}>sec</Text>
              </View>
            ) : null}
            {exercise.isFloor && (
              <View style={[styles.statChip, { backgroundColor: Colors.warning + '15' }]}>
                <Text style={[styles.statChipLabel, { color: Colors.warning }]}>floor exercise</Text>
              </View>
            )}
          </View>

          {/* Instructions */}
          <View style={styles.instructionBox}>
            <Text style={styles.instructionLabel}>HOW TO DO IT</Text>
            <Text style={styles.instructionText}>{exercise.instruction}</Text>
          </View>

          {/* Tip */}
          <View style={styles.tipBox}>
            <Text style={styles.tipLabel}>💡 TRAINER TIP</Text>
            <Text style={styles.tipText}>{exercise.tip}</Text>
          </View>

          {/* Step-by-step animated demonstration */}
          {EXERCISE_STEPS[exercise.id] && (
            <ExerciseAnimator
              steps={EXERCISE_STEPS[exercise.id]}
              exerciseName={exercise.name}
              autoPlay={expanded}
            />
          )}

          {/* Complete button */}
          <TouchableOpacity
            style={[styles.completeBtn, isCompleted && styles.completeBtnDone]}
            onPress={onComplete}
          >
            {isCompleted ? (
              <>
                <CheckIcon color={Colors.success} size={18} />
                <Text style={[styles.completeBtnText, { color: Colors.success }]}>Completed!</Text>
              </>
            ) : (
              <Text style={styles.completeBtnText}>Mark as Done</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ── Timer Modal ────────────────────────────────────────────────────────────────

function WorkoutTimer({
  session,
  onFinish,
}: {
  session: WorkoutSession;
  onFinish: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(session.totalMinutes * 60);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(intervalRef.current!);
          onFinish();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused, onFinish]);

  const progress = secondsLeft / (session.totalMinutes * 60);
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <LinearGradient colors={[Colors.background, Colors.surface]} style={styles.timerOverlay}>
      <Text style={styles.timerTitle}>{session.title}</Text>
      <Text style={styles.timerSubtitle}>Active Workout Session</Text>

      <View style={styles.timerRingWrap}>
        <Svg width={220} height={220} viewBox="0 0 220 220">
          <Circle cx={110} cy={110} r={radius} stroke={Colors.surfaceLight} strokeWidth={12} fill="none" />
          <Circle
            cx={110} cy={110} r={radius}
            stroke={Colors.accent}
            strokeWidth={12}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin="110, 110"
          />
        </Svg>
        <View style={styles.timerCenter}>
          <Text style={styles.timerTime}>{formatTime(secondsLeft)}</Text>
          <Text style={styles.timerTimeLabel}>remaining</Text>
        </View>
      </View>

      <View style={styles.timerBtns}>
        <TouchableOpacity
          style={[styles.timerBtn, styles.timerBtnPause]}
          onPress={() => setIsPaused(p => !p)}
        >
          <Text style={styles.timerBtnText}>{isPaused ? '▶  Resume' : '⏸  Pause'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timerBtn, styles.timerBtnFinish]}
          onPress={() => Alert.alert(
            'End Workout?',
            'Are you sure you want to finish this session early?',
            [
              { text: 'Keep Going', style: 'cancel' },
              { text: 'Finish', onPress: onFinish },
            ]
          )}
        >
          <Text style={[styles.timerBtnText, { color: Colors.text }]}>✓  Finish</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.timerNote}>
        Work through each exercise at your own pace. The timer is just a guide.
      </Text>
    </LinearGradient>
  );
}

// ── Main Screen ────────────────────────────────────────────────────────────────

export default function WorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const session = WORKOUT_SESSIONS.find(s => s.id === id);

  const [activePhase, setActivePhase] = useState<Phase>('warmup');
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [isTimerMode, setIsTimerMode] = useState(false);
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false);

  if (!session) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.notFound}>Workout not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: Colors.accent }}>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const phases: { key: Phase; label: string; exercises: Exercise[] }[] = [
    { key: 'warmup', label: `Warm-Up (${session.warmup.length})`, exercises: session.warmup },
    { key: 'circuit', label: `Circuit (${session.circuit.length})`, exercises: session.circuit },
    { key: 'cooldown', label: `Cool-Down (${session.cooldown.length})`, exercises: session.cooldown },
  ].filter(p => p.exercises.length > 0);

  const activeExercises = phases.find(p => p.key === activePhase)?.exercises ?? [];
  const totalExercises = session.warmup.length + session.circuit.length + session.cooldown.length;
  const completedCount = completedExercises.size;
  const allDone = completedCount === totalExercises;

  const toggleComplete = (exerciseId: string) => {
    setCompletedExercises(prev => {
      const next = new Set(prev);
      if (next.has(exerciseId)) next.delete(exerciseId);
      else next.add(exerciseId);
      return next;
    });
  };

  const handleWorkoutDone = () => {
    setIsTimerMode(false);
    setIsWorkoutComplete(true);
  };

  if (isTimerMode) {
    return <WorkoutTimer session={session} onFinish={handleWorkoutDone} />;
  }

  if (isWorkoutComplete) {
    return (
      <LinearGradient colors={[Colors.background, Colors.surface]} style={styles.completionScreen}>
        <Text style={styles.completionEmoji}>🏆</Text>
        <Text style={styles.completionTitle}>Session Complete!</Text>
        <Text style={styles.completionSubtitle}>{session.title}</Text>
        <View style={styles.completionStats}>
          <View style={styles.completionStat}>
            <Text style={[styles.completionStatValue, { color: Colors.accent }]}>{session.totalMinutes}</Text>
            <Text style={styles.completionStatLabel}>minutes</Text>
          </View>
          <View style={styles.completionStat}>
            <Text style={[styles.completionStatValue, { color: Colors.calories }]}>{session.caloriesBurn}</Text>
            <Text style={styles.completionStatLabel}>calories</Text>
          </View>
          <View style={styles.completionStat}>
            <Text style={[styles.completionStatValue, { color: Colors.steps }]}>{totalExercises}</Text>
            <Text style={styles.completionStatLabel}>exercises</Text>
          </View>
        </View>
        <Text style={styles.completionMsg}>
          Excellent work, Champion! Rest well, stay hydrated, and come back tomorrow stronger. 💪
        </Text>
        <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()}>
          <Text style={styles.doneBtnText}>Back to Plan</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Hero Header */}
      <LinearGradient
        colors={[session.colorStart, session.colorEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.heroNav}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <BackIcon />
            </TouchableOpacity>
            <View style={styles.progressPill}>
              <Text style={styles.progressPillText}>{completedCount}/{totalExercises} done</Text>
            </View>
          </View>
          <Text style={styles.heroDay}>{session.day}</Text>
          <Text style={styles.heroTitle}>{session.title}</Text>
          <Text style={styles.heroSub}>{session.subtitle}</Text>

          {/* Stats bar */}
          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{session.totalMinutes}</Text>
              <Text style={styles.heroStatLabel}>min</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{session.rounds}</Text>
              <Text style={styles.heroStatLabel}>rounds</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{session.caloriesBurn}</Text>
              <Text style={styles.heroStatLabel}>cal</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{totalExercises}</Text>
              <Text style={styles.heroStatLabel}>exercises</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Phase tabs */}
      <View style={styles.phaseTabs}>
        {phases.map(phase => (
          <TouchableOpacity
            key={phase.key}
            style={[styles.phaseTab, activePhase === phase.key && styles.phaseTabActive]}
            onPress={() => setActivePhase(phase.key)}
          >
            <Text style={[styles.phaseTabText, activePhase === phase.key && styles.phaseTabTextActive]}>
              {phase.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Phase instruction */}
      {activePhase === 'circuit' && session.rounds > 1 && (
        <View style={styles.roundsInfo}>
          <TimerIcon size={16} />
          <Text style={styles.roundsText}>
            Complete {session.rounds} rounds · {session.restBetweenRounds}s rest between rounds
          </Text>
        </View>
      )}

      {/* Exercise list */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeExercises.map((exercise, idx) => (
          <ExerciseVideoCard
            key={exercise.id}
            exercise={exercise}
            index={idx}
            isCompleted={completedExercises.has(exercise.id)}
            onComplete={() => toggleComplete(exercise.id)}
          />
        ))}

        {/* Start / progress CTA */}
        {activePhase === 'warmup' && completedCount === 0 && (
          <TouchableOpacity style={styles.startBtn} onPress={() => setIsTimerMode(true)}>
            <LinearGradient
              colors={[session.colorStart, session.colorEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startBtnGradient}
            >
              <PlayIcon color={Colors.white} size={22} />
              <Text style={styles.startBtnText}>Start 15-Minute Session</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {allDone && (
          <TouchableOpacity style={styles.startBtn} onPress={() => setIsWorkoutComplete(true)}>
            <LinearGradient
              colors={[Colors.success, '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startBtnGradient}
            >
              <CheckIcon color={Colors.white} size={22} />
              <Text style={styles.startBtnText}>Complete Workout</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <View style={styles.bottomPad} />
      </ScrollView>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  safeArea: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  notFound: { color: Colors.text, fontSize: 18, marginBottom: 16 },

  // Hero
  hero: { paddingBottom: 20 },
  heroNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    marginBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.black + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPill: {
    backgroundColor: Colors.black + '30',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  progressPillText: { color: Colors.white, fontSize: 13, fontWeight: '600' },
  heroDay: { color: Colors.white + '80', fontSize: 14, fontWeight: '500', paddingHorizontal: 20 },
  heroTitle: { color: Colors.white, fontSize: 28, fontWeight: '700', letterSpacing: -0.5, paddingHorizontal: 20, marginTop: 2 },
  heroSub: { color: Colors.white + 'cc', fontSize: 15, paddingHorizontal: 20, marginTop: 4, marginBottom: 16 },
  heroStats: {
    flexDirection: 'row',
    backgroundColor: Colors.black + '25',
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatValue: { color: Colors.white, fontSize: 20, fontWeight: '700' },
  heroStatLabel: { color: Colors.white + '80', fontSize: 11, fontWeight: '500' },
  heroStatDivider: { width: 1, height: 28, backgroundColor: Colors.white + '20' },

  // Phase tabs
  phaseTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  phaseTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  phaseTabActive: { borderBottomColor: Colors.accent },
  phaseTabText: { color: Colors.textMuted, fontSize: 13, fontWeight: '600' },
  phaseTabTextActive: { color: Colors.accent },

  // Rounds info
  roundsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.accentDim,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  roundsText: { color: Colors.accent, fontSize: 13, fontWeight: '500' },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },

  // Exercise card
  exerciseCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  exerciseCardDone: { borderColor: Colors.success + '40', backgroundColor: Colors.success + '08' },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  exerciseHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  exerciseNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  exerciseNumberText: { color: Colors.textMuted, fontSize: 13, fontWeight: '700' },
  exerciseTitleWrap: { flex: 1 },
  exerciseName: { color: Colors.text, fontSize: 16, fontWeight: '600', marginBottom: 4 },
  muscleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  muscleChip: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  muscleChipText: { fontSize: 10, fontWeight: '600' },
  exerciseHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  difficultyBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  difficultyText: { fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  expandChevron: { color: Colors.textMuted, fontSize: 11 },

  exerciseBody: { paddingHorizontal: 14, paddingBottom: 14 },
  statsStrip: { flexDirection: 'row', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
  statChip: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statChipValue: { color: Colors.text, fontSize: 18, fontWeight: '700' },
  statChipLabel: { color: Colors.textMuted, fontSize: 12 },

  instructionBox: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  instructionLabel: {
    color: Colors.accent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  instructionText: { color: Colors.textDim, fontSize: 14, lineHeight: 21 },

  tipBox: {
    backgroundColor: Colors.warning + '12',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.warning + '25',
  },
  tipLabel: {
    color: Colors.warning,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  tipText: { color: Colors.textDim, fontSize: 14, lineHeight: 20 },

  videoContainer: { marginBottom: 14 },
  videoLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  videoWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.black,
    marginBottom: 10,
  },
  playVideoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  playVideoBtnActive: { backgroundColor: Colors.accentDim, borderWidth: 1, borderColor: Colors.accent },
  playVideoBtnText: { color: Colors.background, fontSize: 14, fontWeight: '600' },
  videoSearchTip: { color: Colors.textMuted, fontSize: 11, marginTop: 6, fontStyle: 'italic' },

  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  completeBtnDone: { borderColor: Colors.success + '40', backgroundColor: Colors.success + '12' },
  completeBtnText: { color: Colors.text, fontSize: 15, fontWeight: '600' },

  // Start / complete CTA
  startBtn: { marginTop: 4, marginBottom: 8 },
  startBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: 16,
    paddingVertical: 18,
  },
  startBtnText: { color: Colors.white, fontSize: 18, fontWeight: '700' },

  // Timer
  timerOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  timerTitle: { color: Colors.text, fontSize: 24, fontWeight: '700', textAlign: 'center' },
  timerSubtitle: { color: Colors.textMuted, fontSize: 15 },
  timerRingWrap: { position: 'relative', alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
  timerCenter: { position: 'absolute', alignItems: 'center' },
  timerTime: { color: Colors.text, fontSize: 52, fontWeight: '700', letterSpacing: -2 },
  timerTimeLabel: { color: Colors.textMuted, fontSize: 14 },
  timerBtns: { flexDirection: 'row', gap: 12, marginTop: 8 },
  timerBtn: { borderRadius: 14, paddingVertical: 14, paddingHorizontal: 24 },
  timerBtnPause: { backgroundColor: Colors.accent },
  timerBtnFinish: { backgroundColor: Colors.surfaceLight, borderWidth: 1, borderColor: Colors.border },
  timerBtnText: { color: Colors.background, fontSize: 16, fontWeight: '700' },
  timerNote: { color: Colors.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 19 },

  // Completion
  completionScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  completionEmoji: { fontSize: 72, marginBottom: 8 },
  completionTitle: { color: Colors.text, fontSize: 32, fontWeight: '700' },
  completionSubtitle: { color: Colors.textMuted, fontSize: 16 },
  completionStats: { flexDirection: 'row', gap: 32, marginVertical: 16 },
  completionStat: { alignItems: 'center', gap: 4 },
  completionStatValue: { fontSize: 36, fontWeight: '700' },
  completionStatLabel: { color: Colors.textMuted, fontSize: 13 },
  completionMsg: {
    color: Colors.textDim,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginVertical: 8,
  },
  doneBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 48,
    marginTop: 8,
  },
  doneBtnText: { color: Colors.background, fontSize: 17, fontWeight: '700' },

  bottomPad: { height: 32 },
});
