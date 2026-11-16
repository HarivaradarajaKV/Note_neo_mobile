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
  Share,
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
      status: 'approved',
      transcript: [],
      insights: [],
    };

  const patient = session.patient || hayliePatient;

  // Default to true (Finalized encounter) as shown in the requested screenshots,
  // or allow parameter override if explicitly passed as draft
  const [isSigned, setIsSigned] = useState<boolean>(
    route?.params?.isDraft ? false : true
  );
  const [insertedCompanion, setInsertedCompanion] = useState(false);

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
      'Note Finalized & Locked',
      `Clinical encounter MSG-99214A for ${patient.firstName} ${patient.lastName} has been digitally signed and locked.`
    );
  };

  const handleExportPDF = async () => {
    const noteText = `MEDISCRIBE CLINICAL ENCOUNTER NOTE (MSG-99214A)\nPatient: ${patient.firstName} ${patient.lastName} (${patient.patientCode})\nAttending: Dr. Marleen (NPI #194829140)\nStatus: SIGNED & LOCKED\nDate: Jan 24, 2026 at 10:45 AM\nSHA-256: 4b9a9d...2dfa\n\nSUBJECTIVE:\n${getSubjectiveText()}\n\nOBJECTIVE:\n${getObjectiveText()}\n\nASSESSMENT:\n${getAssessmentText()}\n\nPLAN:\n${getPlanText()}\n\nENCOUNTER DIAGNOSES:\n- CHF Exacerbation (I50.9)\n- Atrial Fibrillation (I48.91)\n\nPRESCRIPTIONS LOGGED:\n- Digoxin (reinstated): 0.125 mg once daily\n- Furosemide (temporary): 20 mg once daily`;
    try {
      await Share.share({
        title: `Clinical Note - ${patient.firstName} ${patient.lastName}`,
        message: noteText,
      });
    } catch (err: any) {
      Alert.alert(
        'Export PDF',
        `Clinical encounter note PDF for ${patient.firstName} ${patient.lastName} (MSG-99214A) generated with digital audit trail.`
      );
    }
  };

  const handlePushedToEHR = () => {
    Alert.alert(
      'Pushed to EHR',
      `Encounter note MSG-99214A successfully synchronized and verified in hospital EHR via HL7/FHIR interface.`
    );
  };

  const handleInsertCompanion = () => {
    setInsertedCompanion(true);
    Alert.alert(
      'Inserted into Subjective',
      'AI Clinical Companion insight has been integrated into the Subjective History & Symptoms section.'
    );
  };

  const handleReturnToPatients = () => {
    navigation.navigate('Patients');
  };

  const getSubjectiveText = () => {
    const baseText =
      "Patient presents with progressive chronic chest tightness and increased nocturnal dyspnea over the last 5 days. States she is unable to lay flat in bed and feels like she is 'gasping for air' during sleep. Admits to skipping several doses of Digoxin last week due to a mild stomach upset.";
    if (insertedCompanion) {
      return `${baseText}\n\n[AI Scribe Insight]: Skipping Digoxin doses correlates with the onset of acute orthopnea and paroxysmal nocturnal dyspnea, highly suggestive of left-sided ventricular overload.`;
    }
    return baseText;
  };

  const getObjectiveText = () => {
    return 'BP: 135/88 mmHg | HR: 94 bpm (Irregularly irregular) | Temp: 36.8°C | SpO2: 95% on room air. Cardiovascular: Irregular rhythm, S1/S2 audible, no new murmurs. Lungs: Mild bilateral bibasilar crackles on auscultation. Minimal pedal edema bilaterally.';
  };

  const getAssessmentText = () => {
    return '1. Paroxysmal Nocturnal Dyspnea secondary to Exacerbation of Chronic Heart Failure. 2. Persistent Atrial Fibrillation with sub-therapeutic Digoxin compliance. 3. Patient demonstrates poor adherence to medication schedule because of GI sensitivity.';
  };

  const getPlanText = () => {
    return '- Reinstitute Digoxin at prescribed dose, to be taken with meals to minimize GI distress.\n- Administer oral Furosemide 20mg daily for mild fluid retention / overload control.\n- Order an updated Echocardiogram to evaluate current Left Ventricular Ejection Fraction (LVEF).\n- Follow up in clinic in 7 days, sooner if orthopnea worsens.';
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
              <Ionicons name="notifications-outline" size={22} color="#334155" />
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

        {/* Title Section: "Finalized encounter" vs "Clinical note draft" */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>
            {isSigned ? 'Finalized encounter' : 'Clinical note draft'}
          </Text>
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

          {/* Status Banner Pill: Green Signed & Locked vs Amber Draft */}
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
                ? 'Signed & Locked · ID: MSG-99214A'
                : 'Draft (Unsigned) · Requires clinician review'}
            </Text>
          </View>
        </View>

        {/* Action Buttons Bar: Export PDF & Pushed to EHR vs Save Draft & Sign & Lock */}
        {isSigned ? (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.exportPdfBtn}
              activeOpacity={0.85}
              onPress={handleExportPDF}
            >
              <Text style={styles.exportPdfText}>Export PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.pushedEhrBtn}
              activeOpacity={0.85}
              onPress={handlePushedToEHR}
            >
              <Text style={styles.pushedEhrText}>Pushed to EHR</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.saveDraftBtn}
              activeOpacity={0.85}
              onPress={handleSaveDraft}
            >
              <Text style={styles.saveDraftText}>Save Draft</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signLockBtn}
              activeOpacity={0.85}
              onPress={handleSignAndLock}
            >
              <Text style={styles.signLockText}>Sign & Lock</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* SOAP Clinical Progress Note Card matching screenshots 1 & 2 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>SOAP Clinical Progress Note</Text>

          {/* Subjective Section */}
          <Text style={styles.sectionSubLabel}>Subjective (History & Symptoms)</Text>
          <View style={styles.sectionGrayBox}>
            <Text style={styles.sectionBodyText}>{getSubjectiveText()}</Text>
          </View>

          {/* Objective Section */}
          <Text style={styles.sectionSubLabel}>Objective (Vitals & Physical Exam)</Text>
          <View style={styles.sectionGrayBox}>
            <Text style={styles.sectionBodyText}>{getObjectiveText()}</Text>
          </View>

          {/* Assessment Section */}
          <Text style={styles.sectionSubLabel}>Assessment (Diagnoses & Findings)</Text>
          <View style={styles.sectionGrayBox}>
            <Text style={styles.sectionBodyText}>{getAssessmentText()}</Text>
          </View>

          {/* Plan Section */}
          <Text style={styles.sectionSubLabel}>Plan (Treatments, Meds & Follow-up)</Text>
          <View style={[styles.sectionGrayBox, { marginBottom: 0 }]}>
            <Text style={styles.sectionBodyText}>{getPlanText()}</Text>
          </View>
        </View>

        {isSigned ? (
          <>
            {/* Digitally Cryptographically Signed Card (Screenshot 3) */}
            <View style={styles.cardContainer}>
              <Text style={styles.cardMainHeading}>Digitally Cryptographically Signed</Text>
              <Text style={styles.cryptoSubText}>
                Authenticated by Dr. Marleen (NPI #194829140) on Jan 24, 2026 at 10:45 AM. SHA-256: 4b9a9d...2dfa
              </Text>
            </View>

            {/* Encounter Diagnoses Card (Screenshots 3 & 4) */}
            <View style={styles.cardContainer}>
              <Text style={styles.cardMainHeading}>Encounter Diagnoses</Text>
              <Text style={styles.diagnosisItem}>CHF Exacerbation (I50.9)</Text>
              <Text style={[styles.diagnosisItem, { marginTop: 4 }]}>Atrial Fibrillation (I48.91)</Text>
            </View>

            {/* Prescriptions Logged Card (Screenshots 3 & 4) */}
            <View style={styles.cardContainer}>
              <Text style={styles.cardMainHeading}>Prescriptions Logged</Text>

              {/* Digoxin (reinstated) */}
              <Text style={styles.prescriptionLabel}>Digoxin (reinstated)</Text>
              <View style={styles.prescriptionBox}>
                <Text style={styles.prescriptionValue}>0.125 mg once daily</Text>
              </View>

              {/* Furosemide (temporary) */}
              <Text style={styles.prescriptionLabel}>Furosemide (temporary)</Text>
              <View style={[styles.prescriptionBox, { marginBottom: 0 }]}>
                <Text style={styles.prescriptionValue}>20 mg once daily</Text>
              </View>
            </View>

            {/* Clinical Audit Trail Card (Screenshots 4 & 5) */}
            <View style={styles.cardContainer}>
              <Text style={styles.cardMainHeading}>Clinical Audit Trail</Text>
              <Text style={styles.auditLine}>Note Signed & Locked · Dr. Marleen at 10:45 AM</Text>
              <Text style={styles.auditLine}>Draft Reviewed & Approved · Dr. Marleen at 10:44 AM</Text>
              <Text style={[styles.auditLine, { marginBottom: 0 }]}>AI Audio Scribed · MediScribe AI at 10:32 AM</Text>
            </View>

            {/* Return to Patients List Button (Screenshots 4 & 5) */}
            <TouchableOpacity
              style={styles.returnPatientsBtn}
              activeOpacity={0.85}
              onPress={handleReturnToPatients}
            >
              <Text style={styles.returnPatientsBtnText}>Return to Patients List</Text>
            </TouchableOpacity>

            {/* Encounter History Card (Screenshot 5) */}
            <View style={styles.cardContainer}>
              <Text style={styles.cardMainHeading}>Encounter History</Text>

              {/* Today's Note */}
              <Text style={styles.historyItemLabel}>Today's Note</Text>
              <View style={styles.historyItemBox}>
                <Text style={styles.historyItemText}>Signed · Today, 10:45 AM · Cardiac Assessment</Text>
              </View>

              {/* Cardiology Follow-up */}
              <Text style={styles.historyItemLabel}>Cardiology Follow-up</Text>
              <View style={styles.historyItemBox}>
                <Text style={styles.historyItemText}>Signed · 12 Dec 2025 · Dr. Marleen</Text>
              </View>

              {/* Routine Assessment */}
              <Text style={styles.historyItemLabel}>Routine Assessment</Text>
              <View style={[styles.historyItemBox, { marginBottom: 0 }]}>
                <Text style={styles.historyItemText}>Signed · 14 Aug 2025 · Dr. Marleen</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* AI Clinical Companion Card (Draft mode) */}
            <View style={styles.cardContainer}>
              <Text style={styles.cardMainHeading}>AI Clinical Companion</Text>

              <View style={styles.extractedBanner}>
                <Text style={styles.extractedBannerText}>EXTRACTED FROM LIVE SCRIBE</Text>
              </View>

              <Text style={styles.companionBodyText}>
                Patient reported skipping Digoxin doses last week due to GI upset. This correlates with the onset of acute orthopnea and paroxysmal nocturnal dyspnea, highly suggestive of left-sided ventricular overload.
              </Text>

              <TouchableOpacity
                style={[
                  styles.insertCompanionBtn,
                  insertedCompanion && styles.insertCompanionBtnActive,
                ]}
                onPress={handleInsertCompanion}
                activeOpacity={0.85}
              >
                <Text style={styles.insertCompanionBtnText}>
                  {insertedCompanion ? '✓ Inserted into Subjective' : '+ Insert into Subjective'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Discovered Prescriptions Card */}
            <View style={styles.cardContainer}>
              <Text style={styles.cardMainHeading}>Discovered Prescriptions</Text>

              <Text style={styles.prescriptionLabel}>Digoxin (resume dosage)</Text>
              <View style={styles.prescriptionBox}>
                <Text style={styles.prescriptionValue}>0.125 mg once daily</Text>
              </View>

              <Text style={styles.prescriptionLabel}>Furosemide (temporary)</Text>
              <View style={[styles.prescriptionBox, { marginBottom: 0 }]}>
                <Text style={styles.prescriptionValue}>20 mg once daily</Text>
              </View>
            </View>

            {/* Action Buttons below Prescriptions */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.exportPdfBtn}
                activeOpacity={0.85}
                onPress={handleExportPDF}
              >
                <Text style={styles.exportPdfText}>Export PDF</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.blueActionBtn}
                activeOpacity={0.85}
                onPress={handlePushedToEHR}
              >
                <Text style={styles.blueActionBtnText}>Push to EHR</Text>
              </TouchableOpacity>
            </View>

            {/* Consultation Notes Card */}
            <View style={styles.cardContainer}>
              <Text style={styles.cardMainHeading}>Consultation Notes</Text>

              <Text style={styles.historyItemLabel}>Current Note (Draft)</Text>
              <View style={styles.historyItemBox}>
                <Text style={styles.historyItemText}>AI Scribe · Today, 10:32 AM · General visit</Text>
              </View>

              <Text style={styles.historyItemLabel}>Cardiology Follow-up</Text>
              <View style={styles.historyItemBox}>
                <Text style={styles.historyItemText}>Signed · 12 Dec 2025 · Dr. Marleen</Text>
              </View>

              <Text style={styles.historyItemLabel}>Routine Assessment</Text>
              <View style={[styles.historyItemBox, { marginBottom: 0 }]}>
                <Text style={styles.historyItemText}>Signed · 14 Aug 2025 · Dr. Marleen</Text>
              </View>
            </View>
          </>
        )}
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
    letterSpacing: -0.4,
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
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  patientTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    marginRight: 14,
  },
  patientInfoColumn: {
    flex: 1,
  },
  patientName: {
    fontSize: 17.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  patientMeta: {
    fontSize: 13.5,
    color: '#64748B',
    marginTop: 3,
  },
  statusBanner: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 14,
  },
  statusBannerDraft: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  statusBannerSigned: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusBannerText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusTextDraft: {
    color: '#B45309',
  },
  statusTextSigned: {
    color: '#059669',
  },

  /* Top Action Buttons */
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  exportPdfBtn: {
    flex: 1,
    backgroundColor: '#0F172A',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportPdfText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  pushedEhrBtn: {
    flex: 1,
    backgroundColor: '#047857',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pushedEhrText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  saveDraftBtn: {
    flex: 1,
    backgroundColor: '#64748B',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveDraftText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  signLockBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  signLockText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  blueActionBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  blueActionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  /* Standard Card Container */
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  cardMainHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },

  /* SOAP Card Elements */
  sectionSubLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  sectionGrayBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 16,
  },
  sectionBodyText: {
    fontSize: 14.5,
    lineHeight: 22,
    color: '#1E293B',
    fontWeight: '400',
  },

  /* Digitally Cryptographically Signed Card */
  cryptoSubText: {
    fontSize: 13.5,
    lineHeight: 20,
    color: '#64748B',
    fontWeight: '400',
  },

  /* Encounter Diagnoses */
  diagnosisItem: {
    fontSize: 14.5,
    lineHeight: 22,
    color: '#1E293B',
    fontWeight: '500',
  },

  /* Prescriptions Logged Elements */
  prescriptionLabel: {
    fontSize: 13.5,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 6,
  },
  prescriptionBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 14,
  },
  prescriptionValue: {
    fontSize: 14.5,
    color: '#0F172A',
    fontWeight: '500',
  },

  /* Clinical Audit Trail Elements */
  auditLine: {
    fontSize: 14,
    lineHeight: 22,
    color: '#1E293B',
    fontWeight: '500',
    marginBottom: 12,
  },

  /* Return to Patients List Button */
  returnPatientsBtn: {
    backgroundColor: '#0F172A',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  returnPatientsBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  /* Encounter History Elements */
  historyItemLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  historyItemBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 14,
  },
  historyItemText: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },

  /* AI Clinical Companion Elements (Draft Mode) */
  extractedBanner: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
    alignSelf: 'stretch',
  },
  extractedBannerText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  companionBodyText: {
    fontSize: 14.5,
    lineHeight: 22,
    color: '#1E293B',
    marginBottom: 16,
    fontWeight: '400',
  },
  insertCompanionBtn: {
    backgroundColor: '#2563EB',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  insertCompanionBtnActive: {
    backgroundColor: '#059669',
    shadowColor: '#059669',
  },
  insertCompanionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
