import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';
import { MobileHeader } from '../../components/common/MobileHeader';
import { CardContainer } from '../../components/common/CardContainer';
import { StatusBadge } from '../../components/common/StatusBadge';

interface Props {
  navigation: any;
}

export const PatientDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { selectedPatient, appointments, consultations } = useMobileApp();

  return (
    <View style={styles.container}>
      <MobileHeader
        title={`Hello, ${selectedPatient.firstName}`}
        subtitle={`Health ID: ${selectedPatient.patientCode}`}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Next Visit Banner */}
        <CardContainer style={styles.heroBanner}>
          <View style={styles.heroRow}>
            <View style={styles.heroIconCircle}>
              <Ionicons name="calendar" size={20} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTag}>Upcoming Clinical Visit</Text>
              <Text style={styles.heroDoctor}>With Dr. Marleen</Text>
              <Text style={styles.heroTime}>Today · 10:00 AM · Consultation Room 3</Text>
            </View>
          </View>
        </CardContainer>

        {/* Quick Patient Actions */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('PatientVisits')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="document-text" size={20} color="#2563EB" />
            </View>
            <Text style={styles.actionTitle}>Visit Notes</Text>
            <Text style={styles.actionSub}>Summaries & Advice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('PatientPrescriptions')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="medical" size={20} color="#059669" />
            </View>
            <Text style={styles.actionTitle}>Prescriptions</Text>
            <Text style={styles.actionSub}>Active Medicines</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('PatientHealthRecords')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="fitness" size={20} color="#D97706" />
            </View>
            <Text style={styles.actionTitle}>Health Records</Text>
            <Text style={styles.actionSub}>Vitals & Allergies</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('PatientMessages')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#F5F3FF' }]}>
              <Ionicons name="chatbubbles" size={20} color="#7C3AED" />
            </View>
            <Text style={styles.actionTitle}>Messages</Text>
            <Text style={styles.actionSub}>Clinic Chat</Text>
          </TouchableOpacity>
        </View>

        {/* Active Medications List */}
        <CardContainer style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Medications</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PatientPrescriptions')}>
              <Text style={styles.linkText}>View All</Text>
            </TouchableOpacity>
          </View>

          {selectedPatient.existingMedications.map((med, idx) => (
            <View key={idx} style={styles.medItem}>
              <View style={styles.medIconBox}>
                <Ionicons name="medical-outline" size={16} color="#2563EB" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.medName}>{med}</Text>
                <Text style={styles.medTiming}>Take as advised by physician</Text>
              </View>
              <StatusBadge status="Active" variant="success" />
            </View>
          ))}
        </CardContainer>

        {/* Allergies Notice */}
        {selectedPatient.allergies.length > 0 && (
          <CardContainer style={styles.allergyCard}>
            <View style={styles.allergyHeader}>
              <Ionicons name="alert-circle" size={18} color="#DC2626" />
              <Text style={styles.allergyTitle}>Reported Allergies</Text>
            </View>
            <Text style={styles.allergyList}>{selectedPatient.allergies.join(', ')}</Text>
          </CardContainer>
        )}
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
  heroBanner: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  heroTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    textTransform: 'uppercase',
  },
  heroDoctor: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 1,
  },
  heroTime: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  actionSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  sectionCard: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  linkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  medItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  medIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  medName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  medTiming: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  allergyCard: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    marginBottom: 12,
  },
  allergyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  allergyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B91C1C',
  },
  allergyList: {
    fontSize: 13,
    color: '#7F1D1D',
    fontWeight: '600',
  },
});

