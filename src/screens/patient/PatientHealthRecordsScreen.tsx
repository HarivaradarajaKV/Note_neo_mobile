import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';
import { MobileHeader } from '../../components/common/MobileHeader';
import { CardContainer } from '../../components/common/CardContainer';

export const PatientHealthRecordsScreen: React.FC = () => {
  const { selectedPatient } = useMobileApp();

  return (
    <View style={styles.container}>
      <MobileHeader title="Health Records" subtitle="Lab results, vitals & clinical history" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Latest Vitals Card */}
        <CardContainer style={styles.card}>
          <Text style={styles.cardTitle}>Recent Clinical Vitals</Text>
          <View style={styles.vitalsGrid}>
            <View style={styles.vitalBox}>
              <Ionicons name="heart" size={16} color="#DC2626" />
              <Text style={styles.vitalVal}>120/80</Text>
              <Text style={styles.vitalUnit}>mmHg · BP</Text>
            </View>

            <View style={styles.vitalBox}>
              <Ionicons name="pulse" size={16} color="#2563EB" />
              <Text style={styles.vitalVal}>72</Text>
              <Text style={styles.vitalUnit}>bpm · Pulse</Text>
            </View>

            <View style={styles.vitalBox}>
              <Ionicons name="water" size={16} color="#059669" />
              <Text style={styles.vitalVal}>98%</Text>
              <Text style={styles.vitalUnit}>SpO2</Text>
            </View>

            <View style={styles.vitalBox}>
              <Ionicons name="thermometer" size={16} color="#D97706" />
              <Text style={styles.vitalVal}>98.6°F</Text>
              <Text style={styles.vitalUnit}>Temp</Text>
            </View>
          </View>
        </CardContainer>

        {/* Known Allergies */}
        <CardContainer style={styles.card}>
          <View style={styles.headerRow}>
            <Ionicons name="warning" size={18} color="#DC2626" />
            <Text style={[styles.cardTitle, { color: '#B91C1C', marginBottom: 0 }]}>
              Allergies & Sensitivities
            </Text>
          </View>
          {selectedPatient.allergies.length === 0 ? (
            <Text style={styles.emptyText}>No known drug allergies reported.</Text>
          ) : (
            selectedPatient.allergies.map((all, idx) => (
              <Text key={idx} style={styles.bulletText}>• {all}</Text>
            ))
          )}
        </CardContainer>

        {/* Diagnostic Reports */}
        <CardContainer style={styles.card}>
          <Text style={styles.cardTitle}>Diagnostic Lab Reports</Text>
          <View style={styles.reportRow}>
            <Ionicons name="document-text" size={20} color="#2563EB" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.reportName}>Complete Blood Count (CBC)</Text>
              <Text style={styles.reportDate}>18 Jan 2026 · Apex Pathology Lab</Text>
            </View>
            <Ionicons name="download-outline" size={18} color="#2563EB" />
          </View>

          <View style={styles.reportRow}>
            <Ionicons name="document-text" size={20} color="#2563EB" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.reportName}>Chest X-Ray PA View</Text>
              <Text style={styles.reportDate}>10 Jan 2026 · Apex Imaging</Text>
            </View>
            <Ionicons name="download-outline" size={18} color="#2563EB" />
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
  card: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  vitalsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  vitalBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  vitalVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  vitalUnit: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  bulletText: {
    fontSize: 13,
    color: '#1E293B',
    marginVertical: 2,
    marginLeft: 4,
  },
  emptyText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  reportName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  reportDate: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
});

