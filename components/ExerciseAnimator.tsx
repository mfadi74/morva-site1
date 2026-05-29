import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';

export interface ExerciseStep {
  title: string;
  cue: string;
  emoji: string;
  breathe?: 'inhale' | 'exhale' | 'hold' | 'natural';
}

interface Props {
  steps: ExerciseStep[];
  exerciseName: string;
  autoPlay?: boolean;
  stepDuration?: number; // ms per step
}

const BREATHE_COLORS: Record<string, string> = {
  inhale: Colors.accent,
  exhale: '#4f46e5',
  hold: Colors.warning,
  natural: Colors.textMuted,
};

const BREATHE_LABELS: Record<string, string> = {
  inhale: '↑ Inhale',
  exhale: '↓ Exhale',
  hold: '— Hold',
  natural: '~ Breathe naturally',
};

export function ExerciseAnimator({
  steps,
  exerciseName,
  autoPlay = true,
  stepDuration = 3500,
}: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToStep = useCallback((index: number) => {
    // Fade out
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.92, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setCurrentStep(index);
      progressAnim.setValue(0);
      // Fade in
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    });
  }, [fadeAnim, scaleAnim, progressAnim]);

  const nextStep = useCallback(() => {
    goToStep((currentStep + 1) % steps.length);
  }, [currentStep, steps.length, goToStep]);

  const prevStep = useCallback(() => {
    goToStep((currentStep - 1 + steps.length) % steps.length);
  }, [currentStep, steps.length, goToStep]);

  // Progress bar animation
  useEffect(() => {
    if (!isPlaying) return;
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: stepDuration,
      useNativeDriver: false,
    }).start();
  }, [currentStep, isPlaying, stepDuration, progressAnim]);

  // Auto-advance
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isPlaying) return;
    intervalRef.current = setInterval(nextStep, stepDuration);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, nextStep, stepDuration]);

  const step = steps[currentStep];
  const breatheColor = step.breathe ? BREATHE_COLORS[step.breathe] : Colors.textMuted;
  const breatheLabel = step.breathe ? BREATHE_LABELS[step.breathe] : BREATHE_LABELS.natural;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.label}>STEP-BY-STEP GUIDE</Text>
        <TouchableOpacity
          style={[styles.playBtn, isPlaying && styles.playBtnActive]}
          onPress={() => setIsPlaying(p => !p)}
        >
          <Text style={[styles.playBtnText, isPlaying && styles.playBtnTextActive]}>
            {isPlaying ? '⏸ Pause' : '▶ Auto'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      {isPlaying && (
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth, backgroundColor: breatheColor }]} />
        </View>
      )}

      {/* Main card */}
      <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <LinearGradient
          colors={[Colors.surfaceLight, Colors.surface]}
          style={styles.cardGradient}
        >
          {/* Step number */}
          <View style={styles.stepNumberRow}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>Step {currentStep + 1}</Text>
              <Text style={styles.stepTotalText}> / {steps.length}</Text>
            </View>
            {step.breathe && (
              <View style={[styles.breatheBadge, { backgroundColor: breatheColor + '20', borderColor: breatheColor + '40' }]}>
                <Text style={[styles.breatheText, { color: breatheColor }]}>{breatheLabel}</Text>
              </View>
            )}
          </View>

          {/* Emoji illustration */}
          <View style={styles.emojiWrap}>
            <Text style={styles.emoji}>{step.emoji}</Text>
          </View>

          {/* Step content */}
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepCue}>{step.cue}</Text>
        </LinearGradient>
      </Animated.View>

      {/* Navigation */}
      <View style={styles.navRow}>
        <TouchableOpacity style={styles.navBtn} onPress={prevStep}>
          <Text style={styles.navBtnText}>‹ Prev</Text>
        </TouchableOpacity>

        {/* Dots */}
        <View style={styles.dotsRow}>
          {steps.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => goToStep(i)}>
              <View style={[styles.dot, i === currentStep && styles.dotActive]} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.navBtn} onPress={nextStep}>
          <Text style={styles.navBtnText}>Next ›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  playBtn: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  playBtnActive: {
    backgroundColor: Colors.accentDim,
    borderColor: Colors.accent + '40',
  },
  playBtnText: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  playBtnTextActive: {
    color: Colors.accent,
  },
  progressTrack: {
    height: 3,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 2,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 220,
    justifyContent: 'center',
  },
  stepNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  stepNumberBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stepNumberText: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
  stepTotalText: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  breatheBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  breatheText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emojiWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  emoji: {
    fontSize: 52,
  },
  stepTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepCue: {
    color: Colors.textDim,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  navBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 72,
    alignItems: 'center',
  },
  navBtnText: {
    color: Colors.textDim,
    fontSize: 14,
    fontWeight: '600',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
    width: 18,
  },
});
