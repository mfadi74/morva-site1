import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Circle } from 'react-native-svg';
import HomeScreen from './screens/HomeScreen';
import PlanScreen from './screens/PlanScreen';
import HealthScreen from './screens/HealthScreen';
import ProfileScreen from './screens/ProfileScreen';
import WorkoutDetailScreen from './screens/WorkoutDetailScreen';

type Tab = 'home' | 'plan' | 'health' | 'profile';

const ACCENT = '#00d4aa';
const INACTIVE = '#6b7a99';
const SURFACE = '#151b2e';
const BORDER = '#1e2a45';
const BG = '#0a0f1e';

function HomeIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <Path d="M9 22V12h6v10" />
    </Svg>
  );
}

function PlanIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 11l3 3L22 4" />
      <Path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </Svg>
  );
}

function HealthIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </Svg>
  );
}

function ProfileIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={8} r={4} />
      <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </Svg>
  );
}

const TABS: { key: Tab; label: string; Icon: React.ComponentType<{ color: string }> }[] = [
  { key: 'home', label: 'Home', Icon: HomeIcon },
  { key: 'plan', label: 'Plan', Icon: PlanIcon },
  { key: 'health', label: 'Health', Icon: HealthIcon },
  { key: 'profile', label: 'Profile', Icon: ProfileIcon },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [workoutId, setWorkoutId] = useState<string | null>(null);

  const tabBarHeight = Platform.OS === 'ios' ? 88 : 64;
  const paddingBottom = Platform.OS === 'ios' ? 28 : 8;

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            onOpenWorkout={setWorkoutId}
            onNavigatePlan={() => setActiveTab('plan')}
          />
        );
      case 'plan':
        return <PlanScreen onOpenWorkout={setWorkoutId} />;
      case 'health':
        return <HealthScreen />;
      case 'profile':
        return <ProfileScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={[styles.root, { backgroundColor: BG }]}>
        {workoutId ? (
          <WorkoutDetailScreen id={workoutId} onBack={() => setWorkoutId(null)} />
        ) : (
          <>
            <View style={styles.screenContainer}>
              {renderScreen()}
            </View>

            {/* Bottom Tab Bar */}
            <View
              style={[
                styles.tabBar,
                {
                  height: tabBarHeight,
                  paddingBottom,
                  backgroundColor: SURFACE,
                  borderTopWidth: 1,
                  borderTopColor: BORDER,
                  paddingTop: 8,
                },
              ]}
            >
              {TABS.map(({ key, label, Icon }) => {
                const color = activeTab === key ? ACCENT : INACTIVE;
                return (
                  <TouchableOpacity
                    key={key}
                    style={styles.tabButton}
                    onPress={() => setActiveTab(key)}
                    activeOpacity={0.7}
                  >
                    <Icon color={color} />
                    <Text style={[styles.tabLabel, { color }]}>{label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
