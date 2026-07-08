import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ModuleScreen } from '@/components/ModuleScreen';
import { BarChart } from '@/components/BarChart';
import { Card, Input, PrimaryButton, ProgressBar, SectionTitle, StatBox } from '@/components/ui';
import { colors, font, radius, spacing } from '@/constants/theme';
import { BRANDING } from '@/constants/branding';

const COLOR = '#0EA5E9';

// Seeded, anonymized aggregate data representing what an employer or campus
// admin sees. In production this comes from the AchieveOS B2B API (aggregate
// only — never individual user data). See docs/API.md.
const DEMO_ORG = {
  name: 'Northwind University',
  plan: 'Campus Success',
  members: 1284,
  activeThisWeek: 0.71,
  avgLifeScore: 62,
  scoreTrend: [54, 56, 55, 58, 60, 61, 62],
  engagementByModule: [
    { label: 'Mind', value: 78 },
    { label: 'Money', value: 64 },
    { label: 'Career', value: 59 },
    { label: 'Hustle', value: 41 },
    { label: 'Health', value: 47 },
  ],
  wellbeing: { thriving: 0.44, steady: 0.39, struggling: 0.17 },
};

export default function Teams() {
  const [code, setCode] = useState('');
  const [joined, setJoined] = useState(false);

  if (!joined) {
    return (
      <ModuleScreen
        title="Teams & Orgs"
        subtitle="Employer & campus wellness"
        icon="business"
        color={COLOR}
      >
        <Card style={styles.introCard}>
          <Text style={styles.introTitle}>Join your organization</Text>
          <Text style={styles.introText}>
            Employers and universities can offer {BRANDING.appName} to their people. Enter your
            organization's invite code to see your team's anonymized wellbeing dashboard.
          </Text>
          <Input
            placeholder="Organization code (try DEMO)"
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            style={{ backgroundColor: colors.cardAlt, marginTop: spacing.md, marginBottom: spacing.md }}
          />
          <PrimaryButton label="Join organization" onPress={() => setJoined(true)} />
          <TouchableOpacity onPress={() => setJoined(true)}>
            <Text style={styles.demoLink}>Preview the demo dashboard →</Text>
          </TouchableOpacity>
        </Card>

        <SectionTitle title="For organizations" />
        {[
          { icon: 'shield-checkmark', title: 'Privacy by design', text: 'Admins see only aggregate, anonymized trends — never any individual\'s data.' },
          { icon: 'trending-up', title: 'Measurable wellbeing', text: 'Track engagement, Life Score trends, and burnout risk across your people.' },
          { icon: 'cash', title: 'B2B pricing', text: '$8 / member / month for wellness + learning. University licensing available.' },
        ].map((f) => (
          <Card key={f.title} style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: `${COLOR}22` }]}>
              <Ionicons name={f.icon as keyof typeof Ionicons.glyphMap} size={18} color={COLOR} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          </Card>
        ))}
      </ModuleScreen>
    );
  }

  const trendBars = DEMO_ORG.scoreTrend.map((v, i) => ({
    label: `W${i + 1}`,
    value: v,
    color: COLOR,
  }));

  return (
    <ModuleScreen
      title="Teams & Orgs"
      subtitle={DEMO_ORG.name}
      icon="business"
      color={COLOR}
    >
      <Card style={styles.orgCard}>
        <View style={styles.orgHeader}>
          <View>
            <Text style={styles.orgName}>{DEMO_ORG.name}</Text>
            <Text style={styles.orgPlan}>{DEMO_ORG.plan} plan</Text>
          </View>
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>DEMO DATA</Text>
          </View>
        </View>
      </Card>

      <View style={[styles.statsRow, { marginTop: spacing.md }]}>
        <StatBox label="Members" value={DEMO_ORG.members.toLocaleString()} />
        <StatBox label="Active / wk" value={`${Math.round(DEMO_ORG.activeThisWeek * 100)}%`} color={colors.success} />
        <StatBox label="Avg score" value={String(DEMO_ORG.avgLifeScore)} color={COLOR} />
      </View>

      <SectionTitle title="Avg Life Score — 7 weeks" />
      <Card>
        <BarChart bars={trendBars} maxValue={100} height={100} />
      </Card>

      <SectionTitle title="Engagement by module" />
      <Card>
        {DEMO_ORG.engagementByModule.map((m) => (
          <View key={m.label} style={styles.engRow}>
            <Text style={styles.engLabel}>{m.label}</Text>
            <View style={{ flex: 1 }}>
              <ProgressBar value={m.value} color={COLOR} height={8} />
            </View>
            <Text style={styles.engValue}>{m.value}%</Text>
          </View>
        ))}
      </Card>

      <SectionTitle title="Wellbeing mix (anonymized)" />
      <Card style={styles.wellbeingCard}>
        <WellbeingBar label="Thriving" value={DEMO_ORG.wellbeing.thriving} color={colors.success} />
        <WellbeingBar label="Steady" value={DEMO_ORG.wellbeing.steady} color={colors.warning} />
        <WellbeingBar label="Struggling" value={DEMO_ORG.wellbeing.struggling} color={colors.danger} />
        <Text style={styles.privacyNote}>
          <Ionicons name="lock-closed" size={11} color={colors.muted} /> Aggregate only. No
          individual data is ever exposed to admins.
        </Text>
      </Card>

      <PrimaryButton
        label="Leave demo"
        variant="ghost"
        onPress={() => setJoined(false)}
        style={{ marginTop: spacing.lg }}
      />
    </ModuleScreen>
  );
}

function WellbeingBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.wbRow}>
      <Text style={styles.wbLabel}>{label}</Text>
      <View style={{ flex: 1 }}>
        <ProgressBar value={value * 100} color={color} height={8} />
      </View>
      <Text style={styles.wbValue}>{Math.round(value * 100)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  introCard: { borderColor: COLOR },
  introTitle: {
    color: colors.text,
    fontSize: font.subheading,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  introText: {
    color: colors.muted,
    fontSize: font.small,
    lineHeight: 20,
  },
  demoLink: {
    color: COLOR,
    fontSize: font.small,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '700',
  },
  featureText: {
    color: colors.muted,
    fontSize: font.small,
    marginTop: 2,
    lineHeight: 18,
  },
  orgCard: { borderColor: COLOR },
  orgHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orgName: {
    color: colors.text,
    fontSize: font.subheading,
    fontWeight: '800',
  },
  orgPlan: {
    color: colors.muted,
    fontSize: font.tiny,
    marginTop: 2,
  },
  liveBadge: {
    backgroundColor: `${COLOR}22`,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  liveText: {
    color: COLOR,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  engRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  engLabel: {
    color: colors.text,
    fontSize: font.small,
    fontWeight: '600',
    width: 56,
  },
  engValue: {
    color: colors.muted,
    fontSize: font.small,
    fontWeight: '700',
    width: 40,
    textAlign: 'right',
  },
  wellbeingCard: {},
  wbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  wbLabel: {
    color: colors.text,
    fontSize: font.small,
    fontWeight: '600',
    width: 80,
  },
  wbValue: {
    color: colors.muted,
    fontSize: font.small,
    fontWeight: '700',
    width: 40,
    textAlign: 'right',
  },
  privacyNote: {
    color: colors.muted,
    fontSize: font.tiny,
    lineHeight: 16,
    marginTop: spacing.xs,
  },
});
