import { useState, useEffect, useCallback } from 'react';
import type { DailyMetrics, HeartRateSample, WorkoutRecord, AppleWatchStatus } from '../data/healthTypes';
import { getHeartRateZone } from '../data/healthTypes';

// Demo data generator for when HealthKit is unavailable (simulator, Android, no permission)
function generateDemoData(): {
  metrics: DailyMetrics;
  heartRateHistory: HeartRateSample[];
  recentWorkouts: WorkoutRecord[];
  weeklyMetrics: DailyMetrics[];
} {
  const now = new Date();

  const metrics: DailyMetrics = {
    date: now,
    steps: 4823,
    activeCalories: 287,
    restingCalories: 1650,
    totalCalories: 1937,
    standingHours: 8,
    exerciseMinutes: 22,
    restingHeartRate: 62,
    hrv: 48,
    vo2Max: 36.2,
  };

  const heartRateHistory: HeartRateSample[] = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    let baseBpm = 62;
    if (hour >= 7 && hour <= 8) baseBpm = 95; // morning workout
    else if (hour >= 12 && hour <= 13) baseBpm = 75; // lunch walk
    else if (hour >= 22 || hour <= 5) baseBpm = 55; // sleep
    const bpm = baseBpm + Math.round((Math.random() - 0.5) * 10);
    const timestamp = new Date(now);
    timestamp.setHours(hour, 0, 0, 0);
    return { timestamp, bpm, zone: getHeartRateZone(bpm) };
  });

  const recentWorkouts: WorkoutRecord[] = [
    {
      id: 'w1',
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      type: 'Full Body Strength A',
      duration: 900,
      calories: 87,
      avgHeartRate: 98,
      maxHeartRate: 118,
    },
    {
      id: 'w2',
      date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      type: 'Cardio & Core Burn',
      duration: 900,
      calories: 112,
      avgHeartRate: 108,
      maxHeartRate: 127,
    },
    {
      id: 'w3',
      date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      type: 'Mobility & Recovery',
      duration: 900,
      calories: 42,
      avgHeartRate: 72,
      maxHeartRate: 85,
    },
  ];

  const weeklyMetrics: DailyMetrics[] = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (6 - i));
    return {
      date,
      steps: 3000 + Math.round(Math.random() * 5000),
      activeCalories: 150 + Math.round(Math.random() * 250),
      restingCalories: 1600 + Math.round(Math.random() * 100),
      totalCalories: 1750 + Math.round(Math.random() * 350),
      standingHours: 6 + Math.round(Math.random() * 4),
      exerciseMinutes: 10 + Math.round(Math.random() * 30),
      restingHeartRate: 60 + Math.round(Math.random() * 8),
      hrv: 42 + Math.round(Math.random() * 20),
    };
  });

  return { metrics, heartRateHistory, recentWorkouts, weeklyMetrics };
}

export function useHealthKit() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [metrics, setMetrics] = useState<DailyMetrics | null>(null);
  const [heartRateHistory, setHeartRateHistory] = useState<HeartRateSample[]>([]);
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutRecord[]>([]);
  const [weeklyMetrics, setWeeklyMetrics] = useState<DailyMetrics[]>([]);
  const [watchStatus] = useState<AppleWatchStatus>({
    isConnected: true,
    lastSync: new Date(),
    batteryLevel: 78,
  });

  const loadDemoData = useCallback(() => {
    const data = generateDemoData();
    setMetrics(data.metrics);
    setHeartRateHistory(data.heartRateHistory);
    setRecentWorkouts(data.recentWorkouts);
    setWeeklyMetrics(data.weeklyMetrics);
    setIsDemoMode(true);
    setIsLoading(false);
  }, []);

  const requestPermissions = useCallback(async () => {
    setIsLoading(true);
    try {
      // Attempt to use expo-health if available
      const Health = await import('expo-health').catch(() => null);

      if (!Health) {
        loadDemoData();
        return;
      }

      const permissions = [
        Health.HealthDataType.HEART_RATE,
        Health.HealthDataType.STEP_COUNT,
        Health.HealthDataType.ACTIVE_ENERGY_BURNED,
        Health.HealthDataType.RESTING_HEART_RATE,
        Health.HealthDataType.HEART_RATE_VARIABILITY_SDNN,
        Health.HealthDataType.VO2MAX,
        Health.HealthDataType.WORKOUT,
      ];

      const status = await Health.requestPermissionsAsync(
        permissions.map(type => ({ type, access: Health.HealthAccessType.READ }))
      );

      if (status.status === 'granted') {
        setIsAuthorized(true);
        await loadRealData(Health);
      } else {
        loadDemoData();
      }
    } catch {
      loadDemoData();
    }
  }, [loadDemoData]);

  async function loadRealData(Health: any) {
    try {
      const now = new Date();
      const startOfDay = new Date(now);
      startOfDay.setHours(0, 0, 0, 0);

      const [steps, activeCalories, restingHR, hrv] = await Promise.allSettled([
        Health.getHealthDataAsync({ type: Health.HealthDataType.STEP_COUNT, startDate: startOfDay, endDate: now }),
        Health.getHealthDataAsync({ type: Health.HealthDataType.ACTIVE_ENERGY_BURNED, startDate: startOfDay, endDate: now }),
        Health.getHealthDataAsync({ type: Health.HealthDataType.RESTING_HEART_RATE, startDate: startOfDay, endDate: now }),
        Health.getHealthDataAsync({ type: Health.HealthDataType.HEART_RATE_VARIABILITY_SDNN, startDate: startOfDay, endDate: now }),
      ]);

      const stepsValue = steps.status === 'fulfilled' ? steps.value?.reduce((s: number, r: any) => s + r.quantity, 0) ?? 0 : 0;
      const caloriesValue = activeCalories.status === 'fulfilled' ? activeCalories.value?.reduce((s: number, r: any) => s + r.quantity, 0) ?? 0 : 0;
      const restingHRValue = restingHR.status === 'fulfilled' && restingHR.value?.length ? restingHR.value[0].quantity : 65;
      const hrvValue = hrv.status === 'fulfilled' && hrv.value?.length ? hrv.value[0].quantity : 45;

      setMetrics({
        date: now,
        steps: Math.round(stepsValue),
        activeCalories: Math.round(caloriesValue),
        restingCalories: 1650,
        totalCalories: Math.round(caloriesValue + 1650),
        standingHours: 8,
        exerciseMinutes: 22,
        restingHeartRate: Math.round(restingHRValue),
        hrv: Math.round(hrvValue),
        vo2Max: 36.2,
      });

      setIsLoading(false);
    } catch {
      loadDemoData();
    }
  }

  useEffect(() => {
    requestPermissions();
  }, [requestPermissions]);

  return {
    isAuthorized,
    isLoading,
    isDemoMode,
    metrics,
    heartRateHistory,
    recentWorkouts,
    weeklyMetrics,
    watchStatus,
    refresh: requestPermissions,
  };
}
