export interface HeartRateSample {
  timestamp: Date;
  bpm: number;
  zone: 'rest' | 'fat-burn' | 'cardio' | 'peak';
}

export interface WorkoutRecord {
  id: string;
  date: Date;
  type: string;
  duration: number; // seconds
  calories: number;
  avgHeartRate: number;
  maxHeartRate: number;
}

export interface DailyMetrics {
  date: Date;
  steps: number;
  activeCalories: number;
  restingCalories: number;
  totalCalories: number;
  standingHours: number;
  exerciseMinutes: number;
  restingHeartRate: number;
  hrv: number; // ms
  vo2Max?: number;
}

export interface AppleWatchStatus {
  isConnected: boolean;
  lastSync: Date | null;
  batteryLevel?: number;
}

export function getHeartRateZone(bpm: number, age: number = 55): HeartRateSample['zone'] {
  const maxHR = 220 - age;
  const pct = bpm / maxHR;
  if (pct < 0.5) return 'rest';
  if (pct < 0.7) return 'fat-burn';
  if (pct < 0.85) return 'cardio';
  return 'peak';
}

export function getZoneColor(zone: HeartRateSample['zone']): string {
  switch (zone) {
    case 'rest': return '#6b7a99';
    case 'fat-burn': return '#00d4aa';
    case 'cardio': return '#f59e0b';
    case 'peak': return '#ef4444';
  }
}

export function getZoneLabel(zone: HeartRateSample['zone']): string {
  switch (zone) {
    case 'rest': return 'Resting';
    case 'fat-burn': return 'Fat Burn';
    case 'cardio': return 'Cardio';
    case 'peak': return 'Peak';
  }
}
