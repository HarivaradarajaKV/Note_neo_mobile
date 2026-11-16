import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';
import { MobileHeader } from '../../components/common/MobileHeader';
import { CardContainer } from '../../components/common/CardContainer';
import { StatusBadge } from '../../components/common/StatusBadge';

export const PatientPrescriptionsScreen: React.FC = () => {
  const { selectedPatient } = useMobileApp();

  return (
    <View style={styles.container}>
      <MobileHeader title="My Prescriptions" subtitle="Active medications & dosage instructions" />

      <ScrollView contentContainerStyle={styles.content}>
        <CardContainer style={styles.rxCard}>
          <View style={styles.rxHeader}>
            <View>
              <Text style={styles.rxName}>Paracetamol 650mg</Text>
              <Text style={styles.rxSub}>Oral (PO) · Tablet</Text>
            </View>
            <StatusBadge status="Active" variant="success" />
          </View>

          <View style={styles.grid}>
            <View style={styles.gridBox}>
              <Text style={styles.gridLabel}>Dosage</Text>
              <Text style={styles.gridVal}>1 Tablet</Text>
            </View>
            <View style={styles.gridBox}>
              <Text style={styles.gridLabel}>Frequency</Text>
              <Text style={styles.gridVal}>TDS (Thrice daily)</Text>
            </View>
            <View style={styles.gridBox}>
              <Text style={styles.gridLabel}>Duration</Text>
              <Text style={styles.gridVal}>3 Days</Text>
            </View>
          </View>

          <Text style={styles.directions}>
            Special Instructions: Take after food with warm water. Discontinue if fever subsides.
          </Text>
        </CardContainer>

        {selectedPatient.existingMedications.map((med, idx) => (
          <CardContainer key={idx} style={styles.rxCard}>
            <View style={styles.rxHeader}>
              <View>
                <Text style={styles.rxName}>{med}</Text>
                <Text style={styles.rxSub}>Baseline Prescribed</Text>
              </View>
              <StatusBadge status="Current" variant="info" />
            </View>
            <Text style={styles.directions}>
              Continue taking as directed by your primary physician.
            </Text>
          </CardContainer>
        ))}
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
  rxCard: {
    marginBottom: 12,
  },
  rxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rxName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  rxSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  gridBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  gridLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  gridVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  directions: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
});

