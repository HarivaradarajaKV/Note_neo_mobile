import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';
import { MobileHeader } from '../../components/common/MobileHeader';
import { CardContainer } from '../../components/common/CardContainer';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { Patient } from '../../types';

interface Props {
  navigation: any;
}

export const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { currentUser, appointments, patients, consultations, startConsultation, selectPatient } = useMobileApp();

  const handleStartConsultation = (patient?: Patient) => {
    startConsultation(patient || patients[0]);
    navigation.navigate('LiveConsultation');
  };

  return (
    <View style={styles.container}>
      <MobileHeader
        title={currentUser.name}
        subtitle={currentUser.roleTitle}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Card: Start Live Consultation Scribing */}
        <CardContainer style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.aiBadge}>
              <Ionicons name="sparkles" size={14} color="#2563EB" />
              <Text style={styles.aiBadgeText}>AI Ambient Scribe Active</Text>
            </View>
            <Text style={styles.heroTime}>Ready to capture</Text>
          </View>

          <Text style={styles.heroTitle}>Live Clinical Consultation</Text>
          <Text style={styles.heroSubtitle}>
            Continuous dual-channel transcription in English, Kannada, Hindi & Indic languages with real-time SOAP note structuring.
          </Text>

          <ActionButton
            title="Start Live Consultation Scribing"
            icon="mic"
            variant="primary"
            style={styles.heroButton}
            onPress={() => handleStartConsultation()}
          />
        </CardContainer>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
          <CardContainer style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="people" size={18} color="#2563EB" />
            </View>
            <Text style={styles.statNumber}>{patients.length}</Text>
            <Text style={styles.statLabel}>Active Patients</Text>
          </CardContainer>

          <CardContainer style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="calendar" size={18} color="#059669" />
            </View>
            <Text style={styles.statNumber}>{appointments.length}</Text>
            <Text style={styles.statLabel}>Today's Schedule</Text>
          </CardContainer>

          <CardContainer style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="document-text" size={18} color="#D97706" />
            </View>
            <Text style={styles.statNumber}>
              {consultations.filter((c) => c.status === 'review_required').length || 1}
            </Text>
            <Text style={styles.statLabel}>Pending Review</Text>
          </CardContainer>
        </View>

        {/* Today's Appointments Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Appointments</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Schedule')}>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {appointments.map((apt) => {
          const matchPatient = patients.find((p) => p.id === apt.patientId) || patients[0];
          return (
            <CardContainer key={apt.id} style={styles.appointmentCard}>
              <View style={styles.aptHeader}>
                <View style={styles.patientInfoRow}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarInitial}>
                      {apt.patientName.charAt(0)}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.aptPatientName}>{apt.patientName}</Text>
                    <Text style={styles.aptPatientCode}>{apt.patientCode} · {apt.time}</Text>
                  </View>
                </View>
                <StatusBadge status={apt.status} />
              </View>

              <Text style={styles.aptReason}>{apt.reason}</Text>

              <View style={styles.aptFooter}>
                <TouchableOpacity
                  style={styles.aptActionBtn}
                  onPress={() => {
                    selectPatient(matchPatient);
                    navigation.navigate('PatientDetail', { patient: matchPatient });
                  }}
                >
                  <Text style={styles.aptActionText}>View Records</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.aptActionBtn, styles.startAptBtn]}
                  onPress={() => handleStartConsultation(matchPatient)}
                >
                  <Ionicons name="mic" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.startAptText}>Start Scribe</Text>
                </TouchableOpacity>
              </View>
            </CardContainer>
          );
        })}

        {/* Quick Review Shortcuts */}
        {consultations.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Consultations</Text>
              <TouchableOpacity onPress={() => navigation.navigate('ConsultationsList')}>
                <Text style={styles.seeAllText}>History</Text>
              </TouchableOpacity>
            </View>

            {consultations.slice(0, 3).map((cons) => (
              <TouchableOpacity
                key={cons.id}
                onPress={() => navigation.navigate('ClinicalNoteReview', { consultation: cons })}
              >
                <CardContainer style={styles.consultationCard}>
                  <View style={styles.consHeader}>
                    <Text style={styles.consPatientName}>
                      {cons.patient.firstName} {cons.patient.lastName}
                    </Text>
                    <StatusBadge status={cons.status} />
                  </View>
                  <Text style={styles.consReason}>{cons.reasonForVisit}</Text>
                  <View style={styles.consMeta}>
                    <Text style={styles.consMetaText}>
                      {cons.date} · {cons.transcript.length} turns · {Math.floor(cons.durationSeconds / 60)}m {cons.durationSeconds % 60}s
                    </Text>
                    <Ionicons name="arrow-forward" size={16} color="#2563EB" />
                  </View>
                </CardContainer>
              </TouchableOpacity>
            ))}
          </View>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 96,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    padding: 18,
    borderRadius: 20,
    marginBottom: 16,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    gap: 4,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  heroTime: {
    fontSize: 11,
    color: '#64748B',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 16,
  },
  heroButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 14,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  appointmentCard: {
    marginBottom: 10,
  },
  aptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  patientInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  avatarInitial: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2563EB',
  },
  aptPatientName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  aptPatientCode: {
    fontSize: 12,
    color: '#64748B',
  },
  aptReason: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 12,
  },
  aptFooter: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  aptActionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  aptActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  startAptBtn: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
    flexDirection: 'row',
  },
  startAptText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  consultationCard: {
    marginBottom: 8,
  },
  consHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  consPatientName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  consReason: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 6,
  },
  consMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  consMetaText: {
    fontSize: 11,
    color: '#64748B',
  },
});

