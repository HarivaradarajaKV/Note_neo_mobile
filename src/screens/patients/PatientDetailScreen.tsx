import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';
import { MobileHeader } from '../../components/common/MobileHeader';
import { CardContainer } from '../../components/common/CardContainer';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { Patient } from '../../types';

interface Props {
  route?: any;
  navigation: any;
}

export const PatientDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { selectedPatient, startConsultation } = useMobileApp();
  const patient: Patient = route?.params?.patient || selectedPatient;

  const handleStart = () => {
    startConsultation(patient);
    navigation.navigate('LiveConsultation');
  };

  return (
    <View style={styles.container}>
      <MobileHeader
        title={`${patient.firstName} ${patient.lastName}`}
        subtitle={patient.patientCode}
        showBack
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Patient Profile Card */}
        <CardContainer style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{patient.firstName.charAt(0)}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.fullName}>{patient.firstName} {patient.lastName}</Text>
              <Text style={styles.metaLine}>{patient.patientCode} · {patient.age}y {patient.gender}</Text>
              <Text style={styles.phoneText}>{patient.phone}</Text>
            </View>
            <StatusBadge status={patient.statusRisk || 'Normal'} />
          </View>
        </CardContainer>

        {/* Current Chief Complaint & Presentation */}
        <CardContainer style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Active Clinical Presentation</Text>
          <Text style={styles.sectionBody}>{patient.condition || 'General health evaluation'}</Text>
        </CardContainer>

        {/* Allergies & Alerts */}
        <CardContainer style={styles.sectionCard}>
          <View style={styles.rowTitle}>
            <Ionicons name="warning" size={16} color="#DC2626" />
            <Text style={[styles.sectionTitle, { color: '#B91C1C', marginBottom: 0 }]}>
              Known Allergies
            </Text>
          </View>
          {patient.allergies.length === 0 ? (
            <Text style={styles.emptyText}>No known drug allergies reported.</Text>
          ) : (
            patient.allergies.map((all, idx) => (
              <Text key={idx} style={styles.bulletText}>• {all}</Text>
            ))
          )}
        </CardContainer>

        {/* Current Medications */}
        <CardContainer style={styles.sectionCard}>
          <View style={styles.rowTitle}>
            <Ionicons name="medical" size={16} color="#2563EB" />
            <Text style={[styles.sectionTitle, { color: '#1D4ED8', marginBottom: 0 }]}>
              Current Medications
            </Text>
          </View>
          {patient.existingMedications.length === 0 ? (
            <Text style={styles.emptyText}>No existing baseline medications.</Text>
          ) : (
            patient.existingMedications.map((med, idx) => (
              <Text key={idx} style={styles.bulletText}>• {med}</Text>
            ))
          )}
        </CardContainer>

        {/* Medical History */}
        <CardContainer style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Past Medical History</Text>
          {patient.medicalHistory.length === 0 ? (
            <Text style={styles.emptyText}>No major chronic illnesses recorded.</Text>
          ) : (
            patient.medicalHistory.map((hist, idx) => (
              <Text key={idx} style={styles.bulletText}>• {hist}</Text>
            ))
          )}
        </CardContainer>

        {/* Contact & Address */}
        <CardContainer style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Contact & Residence</Text>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{patient.email}</Text>
          <Text style={styles.infoLabel}>Address:</Text>
          <Text style={styles.infoValue}>{patient.address}</Text>
        </CardContainer>

        {/* Action Button */}
        <ActionButton
          title="Start Live Consultation Scribing"
          icon="mic"
          variant="primary"
          onPress={handleStart}
          style={styles.actionBtn}
        />
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
    paddingBottom: 36,
  },
  profileCard: {
    marginBottom: 12,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563EB',
  },
  profileInfo: {
    flex: 1,
  },
  fullName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  metaLine: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  phoneText: {
    fontSize: 11,
    color: '#2563EB',
    marginTop: 2,
    fontWeight: '600',
  },
  sectionCard: {
    marginBottom: 10,
  },
  rowTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  sectionBody: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
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
  infoLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    marginTop: 4,
  },
  infoValue: {
    fontSize: 13,
    color: '#1E293B',
    marginBottom: 4,
  },
  actionBtn: {
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 14,
  },
});

