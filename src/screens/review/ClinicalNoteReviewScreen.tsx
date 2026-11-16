import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';
import { ConsultationSession, Patient } from '../../types';
import { INITIAL_PATIENTS } from '../../services/mockData';

interface Props {
  route?: any;
  navigation: any;
}

export const ClinicalNoteReviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { activeConsultation, approveNote } = useMobileApp();

  // Find Haylie Saris as default reference from screenshot if session not passed
  const hayliePatient =
    INITIAL_PATIENTS.find((p) => p.firstName.toLowerCase().includes('haylie')) ||
    INITIAL_PATIENTS[0];

  const session: ConsultationSession =
    route?.params?.consultation || activeConsultation || {
      id: 'cons-haylie-default',
      patient: hayliePatient,
      doctor: {
        id: 'doc-1',
        name: 'Dr. Marleen',
        title: 'General Physician',
        specialty: 'Internal Medicine',
        regNumber: 'MCI-2018-84729',
        email: 'marleen.d@apollohealth.in',
        avatar: '',
        hospital: 'Apex Multi-Specialty Clinic',
      },
      date: 'Today',
      time: '10:30 AM',
      durationSeconds: 272,
      reasonForVisit: 'Progressive chronic chest tightness and nocturnal dyspnea',
      status: 'review_required',
      transcript: [],
      insights: [],
    };

  const patient = session.patient || hayliePatient;
  const isHaylie = patient.firstName.toLowerCase().includes('haylie');

  const [isSigned, setIsSigned] = useState(session.status === 'approved');

  const getPatientAvatarSource = (pat: Patient) => {
    const fName = pat.firstName.toLowerCase();
    if (pat.avatarKey === 'haylie' || fName.includes('haylie')) {
      return require('../../../assets/patient-haylie.png');
    }
    if (pat.avatarKey === 'brooklyn' || fName.includes('brooklyn')) {
      return require('../../../assets/patient-brooklyn.png');
    }
    if (pat.avatarKey === 'eleanor' || fName.includes('eleanor')) {
      return require('../../../assets/patient-eleanor.png');
    }
    if (pat.avatarKey === 'guy' || fName.includes('guy')) {
      return require('../../../assets/patient-guy.png');
    }
    return require('../../../assets/patient-avatar.png');
  };

  const handleSaveDraft = () => {
    Alert.alert(
      'Draft Saved',
      `Clinical note draft for ${patient.firstName} ${patient.lastName} saved successfully. You can return to edit or finalize at any time.`
    );
  };

  const handleSignAndLock = () => {
    setIsSigned(true);
    if (session.id) {
      approveNote(session.id);
    }
    Alert.alert(
      'Note Signed & Locked',
      `Clinical progress note for ${patient.firstName} ${patient.lastName} has been digitally signed and locked in EHR records.`
    );
  };

  // Content for Subjective
  const getSubjectiveText = () => {
    if (isHaylie) {
      return 'Patient presents with progressive chronic chest tightness and increased nocturnal dyspnea over the last 5 days. States she is unable to lay flat in bed and feels like she is "gasping for air" during sleep. Admits to skipping several doses of Digoxin last week due to a mild stomach upset.';
    }
    const note = session.note || session.soapNote;
    if (note?.subjective?.historyOfPresentIllness) {
      return note.subjective.historyOfPresentIllness;
    }
    return 'Patient presents with a persistent cough and mild fever. Denies any severe chest pain but reports minor nocturnal shortness of breath. Has been taking paracetamol for temporary relief with moderate symptom control.';
  };

  // Content for Objective
  const getObjectiveText = () => {
    if (isHaylie) {
      return 'BP: 135/88 mmHg | HR: 94 bpm (Irregularly irregular) | Temp: 36.8°C | SpO2: 95% on room air.\nCardiovascular: Irregular rhythm, S1/S2 present, trace bilateral pedal edema.';
    }
    return 'BP: 120/80 mmHg | HR: 74 bpm | Temp: 37.2°C | SpO2: 98% on room air.\nRespiratory: Clear to auscultation bilaterally, no acute wheezes or crackles. Oropharynx mildly erythematous.';
  };

  // Content for Assessment
  const getAssessmentText = () => {
    if (isHaylie) {
      return '1. Decompensated congestive heart failure secondary to Digoxin non-compliance.\n2. Atrial fibrillation with rapid ventricular response.';
    }
    return '1. Acute viral upper respiratory tract infection with associated nocturnal tracheobronchial hyperreactivity.\n2. Mild febrile illness without lower respiratory tract consolidation.';
  };

  // Content for Plan
  const getPlanText = () => {
    if (isHaylie) {
      return '• Resume Digoxin 0.125mg PO once daily.\n• Furosemide (Lasix) 40mg PO stat, then 20mg daily.\n• Check serum electrolytes and Digoxin level in 48 hours.\n• Low-sodium diet & daily weight monitoring.';
    }
    return '• Tab. Paracetamol 650mg PO TDS SOS for fever/pain.\n• Steam inhalation twice daily & warm saline gargles.\n• Strict hydration advice & return if fever exceeds 101°F or chest pain occurs.';
  };

  return (
    <View
      style={[
        styles.rootContainer,
        { paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 12 : 24) },
      ]}
    >
      <StatusBar style="dark" />

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 60 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top MediScribe Header matching screenshot */}
        <View style={styles.topHeader}>
          <View style={styles.brandContainer}>
            <View style={styles.stethoscopeIconContainer}>
              <FontAwesome5 name="stethoscope" size={24} color="#2563EB" />
            </View>
            <View style={styles.brandTextColumn}>
              <Text style={styles.brandTitle}>MediScribe</Text>
              <Text style={styles.brandSubtitle}>CLINICIAN</Text>
            </View>
          </View>

          <View style={styles.headerRightActions}>
            <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7}>
              <Ionicons name="notifications-outline" size={24} color="#334155" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Settings')}
            >
              <Image
                source={require('../../../assets/doctor-avatar.png')}
                style={styles.doctorAvatar}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Clinical note draft Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Clinical note draft</Text>
          <Text style={styles.subtitle}>Your AI Clinical Assistant</Text>
        </View>

        {/* Patient Details Card matching screenshot */}
        <View style={styles.patientCard}>
          <View style={styles.patientTopRow}>
            <Image
              source={getPatientAvatarSource(patient)}
              style={styles.patientAvatar}
            />
            <View style={styles.patientInfoColumn}>
              <Text style={styles.patientName}>
                {patient.firstName} {patient.lastName}
              </Text>
              <Text style={styles.patientMeta}>
                {patient.gender} · {patient.age} years · {patient.patientCode}
              </Text>
            </View>
          </View>

          {/* Draft (Unsigned) Status Banner Pill */}
          <View
            style={[
              styles.statusBanner,
              isSigned ? styles.statusBannerSigned : styles.statusBannerDraft,
            ]}
          >
            <Text
              style={[
                styles.statusBannerText,
                isSigned ? styles.statusTextSigned : styles.statusTextDraft,
              ]}
            >
              {isSigned
                ? 'Final (Signed) · Clinician approved & EHR locked'
                : 'Draft (Unsigned) · Requires clinician review'}
            </Text>
          </View>
        </View>

        {/* Action Buttons Bar: Save Draft & Sign & Lock matching screenshot */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.saveDraftBtn}
            activeOpacity={0.8}
            onPress={handleSaveDraft}
          >
            <Text style={styles.saveDraftText}>Save Draft</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signLockBtn}
            activeOpacity={0.8}
            onPress={handleSignAndLock}
          >
            <Text style={styles.signLockText}>Sign & Lock</Text>
          </TouchableOpacity>
        </View>

        {/* SOAP Clinical Progress Note Card matching screenshot */}
        <View style={styles.soapCard}>
          <Text style={styles.soapCardTitle}>SOAP Clinical Progress Note</Text>

          {/* Subjective Section */}
          <Text style={styles.sectionLabel}>Subjective (History & Symptoms)</Text>
          <View style={styles.sectionBox}>
            <Text style={styles.sectionText}>{getSubjectiveText()}</Text>
          </View>

          {/* Objective Section */}
          <Text style={styles.sectionLabel}>Objective (Vitals & Physical Exam)</Text>
          <View style={styles.sectionBox}>
            <Text style={styles.sectionText}>{getObjectiveText()}</Text>
          </View>

          {/* Assessment Section */}
          <Text style={styles.sectionLabel}>Assessment (Clinical Impression)</Text>
          <View style={styles.sectionBox}>
            <Text style={styles.sectionText}>{getAssessmentText()}</Text>
          </View>

          {/* Plan Section */}
          <Text style={styles.sectionLabel}>Plan & Prescriptions</Text>
          <View style={styles.sectionBox}>
            <Text style={styles.sectionText}>{getPlanText()}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#EFF4FA',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#EFF4FA',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  /* Top MediScribe Header */
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 6,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stethoscopeIconContainer: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTextColumn: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginTop: -1,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBtn: {
    padding: 6,
    marginRight: 10,
  },
  doctorAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E2E8F0',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  /* Title Section */
  titleSection: {
    marginBottom: 16,
    marginTop: 4,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14.5,
    color: '#64748B',
    marginTop: 4,
  },
  /* Patient Details Card */
  patientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  patientTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#E2E8F0',
  },
  patientInfoColumn: {
    marginLeft: 14,
    flex: 1,
    justifyContent: 'center',
  },
  patientName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  patientMeta: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  statusBanner: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 14,
    alignSelf: 'stretch',
  },
  statusBannerDraft: {
    backgroundColor: '#FFFBEB',
  },
  statusBannerSigned: {
    backgroundColor: '#ECFDF5',
  },
  statusBannerText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  statusTextDraft: {
    color: '#92400E',
  },
  statusTextSigned: {
    color: '#166534',
  },
  /* Action Row: Save Draft & Sign & Lock */
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  saveDraftBtn: {
    flex: 1,
    height: 52,
    backgroundColor: '#475569',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveDraftText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  signLockBtn: {
    flex: 1,
    height: 52,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signLockText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  /* SOAP Card */
  soapCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  soapCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
    marginTop: 12,
  },
  sectionBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionText: {
    fontSize: 14.5,
    color: '#334155',
    lineHeight: 22,
  },
});
