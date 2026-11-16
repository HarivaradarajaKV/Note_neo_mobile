import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MobileHeader } from '../../components/common/MobileHeader';
import { CardContainer } from '../../components/common/CardContainer';

export const AnalyticsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <MobileHeader title="Practice Analytics" subtitle="Ambient scribing efficiency & metrics" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Highlight KPI Card */}
        <CardContainer style={styles.highlightCard}>
          <View style={styles.highlightHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="trending-up" size={20} color="#2563EB" />
            </View>
            <View>
              <Text style={styles.highlightTitle}>Clinical Hours Saved</Text>
              <Text style={styles.highlightSubtitle}>Based on ambient voice documentation</Text>
            </View>
          </View>
          <Text style={styles.highlightNumber}>14.2 hrs</Text>
          <Text style={styles.highlightFootnote}>+3.4 hours compared to last week</Text>
        </CardContainer>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <CardContainer style={styles.metricCard}>
            <Text style={styles.metricVal}>98.4%</Text>
            <Text style={styles.metricName}>Speaker Diarization Accuracy</Text>
          </CardContainer>

          <CardContainer style={styles.metricCard}>
            <Text style={styles.metricVal}>2.1 min</Text>
            <Text style={styles.metricName}>Avg. Note Finalization Time</Text>
          </CardContainer>
        </View>

        {/* Top Diagnosed Conditions */}
        <CardContainer style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Top Clinical Conditions This Month</Text>
          <View style={styles.barItem}>
            <View style={styles.barLabelRow}>
              <Text style={styles.barName}>Upper Respiratory Infection</Text>
              <Text style={styles.barCount}>34%</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: '34%', backgroundColor: '#2563EB' }]} />
            </View>
          </View>

          <View style={styles.barItem}>
            <View style={styles.barLabelRow}>
              <Text style={styles.barName}>Hypertension Titration</Text>
              <Text style={styles.barCount}>26%</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: '26%', backgroundColor: '#059669' }]} />
            </View>
          </View>

          <View style={styles.barItem}>
            <View style={styles.barLabelRow}>
              <Text style={styles.barName}>Type 2 Diabetes Mellitus</Text>
              <Text style={styles.barCount}>20%</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: '20%', backgroundColor: '#D97706' }]} />
            </View>
          </View>

          <View style={styles.barItem}>
            <View style={styles.barLabelRow}>
              <Text style={styles.barName}>Gastritis & Dyspepsia</Text>
              <Text style={styles.barCount}>14%</Text>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: '14%', backgroundColor: '#7C3AED' }]} />
            </View>
          </View>
        </CardContainer>

        {/* Scribing Languages Utilized */}
        <CardContainer style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Multilingual Audio Utilization</Text>
          <Text style={styles.descText}>
            Dual-channel pipeline processing Indic speech with verbatim preservation and real-time medical translation:
          </Text>
          <View style={styles.langPillContainer}>
            <View style={styles.langBadge}><Text style={styles.langBadgeText}>English (54%)</Text></View>
            <View style={styles.langBadge}><Text style={styles.langBadgeText}>Kannada (24%)</Text></View>
            <View style={styles.langBadge}><Text style={styles.langBadgeText}>Hindi (14%)</Text></View>
            <View style={styles.langBadge}><Text style={styles.langBadgeText}>Tamil (8%)</Text></View>
          </View>
        </CardContainer>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF4FA',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  highlightCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    padding: 18,
    marginBottom: 12,
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  highlightSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  highlightNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#2563EB',
    marginBottom: 4,
  },
  highlightFootnote: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  metricName: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 14,
  },
  sectionCard: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  barItem: {
    marginBottom: 10,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  barName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  barCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  descText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 10,
  },
  langPillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  langBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  langBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
});

