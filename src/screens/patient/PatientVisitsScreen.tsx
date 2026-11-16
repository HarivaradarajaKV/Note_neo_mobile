import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';
import { MobileHeader } from '../../components/common/MobileHeader';
import { CardContainer } from '../../components/common/CardContainer';
import { StatusBadge } from '../../components/common/StatusBadge';

export const PatientVisitsScreen: React.FC = () => {
  const { selectedPatient, consultations } = useMobileApp();

  return (
    <View style={styles.container}>
      <MobileHeader title="Visit Summaries" subtitle="Doctor consultation notes & care plans" />

      <ScrollView contentContainerStyle={styles.content}>
        <CardContainer style={styles.visitCard}>
          <View style={styles.visitHeader}>
            <View>
              <Text style={styles.visitDate}>Today's Clinical Visit</Text>
              <Text style={styles.doctorName}>Dr. Marleen · General Physician</Text>
            </View>
            <StatusBadge status="Approved" variant="success" />
          </View>

          <Text style={styles.sectionHeading}>Summary of Discussion:</Text>
          <Text style={styles.bodyText}>
            Evaluated for {selectedPatient.condition || 'persistent cough and mild fever'}. Chest auscultation was clear. Vitals were stable. Continued hydration and prescribed medication advised.
          </Text>

          <Text style={styles.sectionHeading}>Physician Advice:</Text>
          <Text style={styles.bulletText}>• Take medications regularly after food.</Text>
          <Text style={styles.bulletText}>• Drink warm fluids and get adequate rest.</Text>
          <Text style={styles.bulletText}>• Return for review in 5 days if symptoms do not resolve.</Text>
        </CardContainer>

        <CardContainer style={styles.visitCard}>
          <View style={styles.visitHeader}>
            <View>
              <Text style={styles.visitDate}>Previous Visit · 18 Jan 2026</Text>
              <Text style={styles.doctorName}>Dr. Marleen · General Physician</Text>
            </View>
            <StatusBadge status="Completed" variant="neutral" />
          </View>

          <Text style={styles.sectionHeading}>Summary of Discussion:</Text>
          <Text style={styles.bodyText}>
            Routine health review and baseline blood work analysis. Advised maintaining physical exercise routine.
          </Text>
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
  visitCard: {
    marginBottom: 12,
  },
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  visitDate: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  doctorName: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginTop: 8,
    marginBottom: 2,
  },
  bodyText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  bulletText: {
    fontSize: 13,
    color: '#334155',
    marginVertical: 2,
    marginLeft: 4,
  },
});

