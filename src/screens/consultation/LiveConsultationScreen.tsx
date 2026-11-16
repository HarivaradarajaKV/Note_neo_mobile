import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  TextInput,
  Platform,
  Switch,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';
import { LiveWaveform } from '../../components/consultation/LiveWaveform';
import { Patient } from '../../types';

interface Props {
  navigation: any;
}

export const LiveConsultationScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const {
    activeConsultation,
    selectedPatient,
    selectPatient,
    patients,
    isRecording,
    isPaused,
    isMuted,
    consultationSeconds,
    liveTranscript,
    isProcessingNote,
    togglePause,
    toggleMute,
    startConsultation,
    cancelConsultation,
    endConsultation,
    addTranscriptMessage,
  } = useMobileApp();

  // Consultation Setup (Pre-session) State
  const [searchQuery, setSearchQuery] = useState('');
  const [visitReason, setVisitReason] = useState(
    selectedPatient.condition || 'Progressive chronic chest tightness and nocturnal dyspnea'
  );
  const [consentConfirmed, setConsentConfirmed] = useState(true);

  // Active Session State
  const [showEndModal, setShowEndModal] = useState(false);
  const [showAddTurnInput, setShowAddTurnInput] = useState(false);
  const [newTurnText, setNewTurnText] = useState('');
  const [newTurnRole, setNewTurnRole] = useState<'Doctor' | 'Patient'>('Doctor');

  // Format timer as HH:MM:SS
  const formatStandardTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartConsultation = () => {
    if (!consentConfirmed) {
      Alert.alert(
        'Consent Required',
        'Please confirm patient informed consent for ambient clinical AI documentation.'
      );
      return;
    }
    startConsultation(selectedPatient, visitReason);
  };

  const handleEndConsultationConfirm = async () => {
    setShowEndModal(false);
    try {
      const finished = await endConsultation();
      navigation.navigate('ClinicalNoteReview', { consultation: finished });
    } catch (err: any) {
      navigation.navigate('ClinicalNoteReview');
    }
  };

  const handleCancelSession = () => {
    Alert.alert(
      'Exit Session',
      'Are you sure you want to stop this consultation and return to patient selection?',
      [
        { text: 'Continue Session', style: 'cancel' },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: cancelConsultation,
        },
      ]
    );
  };

  const handleAddTurn = () => {
    if (!newTurnText.trim()) return;
    addTranscriptMessage(newTurnText.trim(), newTurnRole);
    setNewTurnText('');
    setNewTurnRole((prev) => (prev === 'Doctor' ? 'Patient' : 'Doctor'));
    setShowAddTurnInput(false);
  };

  const getStatusText = () => {
    if (isMuted) return 'Live Session · Microphone is muted';
    if (isPaused) return 'Live Session · AI Scribe is paused';
    if (isRecording) return 'Live Session · AI Scribe is listening';
    return 'Session Ended';
  };

  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q) ||
      p.patientCode.toLowerCase().includes(q) ||
      (p.condition && p.condition.toLowerCase().includes(q))
    );
  });

  const quickSymptoms = [
    'Chest tightness & dyspnea',
    'Persistent cough & mild fever',
    'Hypertension regular follow-up',
    'Palpitations & exertion fatigue',
    'Routine cardiology evaluation',
  ];

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
          { paddingBottom: Math.max(insets.bottom, 24) + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top MediScribe Header matching design */}
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
            {activeConsultation ? (
              <TouchableOpacity
                style={styles.cancelSessionBtn}
                onPress={handleCancelSession}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle-outline" size={20} color="#DC2626" />
                <Text style={styles.cancelSessionBtnText}>Exit</Text>
              </TouchableOpacity>
            ) : null}

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

        {/* =========================================================================
            STATE A: PRE-CONSULTATION SETUP & PATIENT SELECTION (NOT YET STARTED)
           ========================================================================= */}
        {!activeConsultation ? (
          <View>
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.mainTitle}>Clinical consultation</Text>
              <Text style={styles.subtitle}>
                Select patient & launch ambient AI scribe
              </Text>
            </View>

            {/* Patient Selection Card */}
            <View style={styles.cardContainer}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardMainHeading}>Select Patient</Text>
                <Text style={styles.patientCountBadge}>{patients.length} in DB</Text>
              </View>

              {/* Patient Search Input */}
              <View style={styles.searchBox}>
                <Ionicons
                  name="search-outline"
                  size={18}
                  color="#64748B"
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search patient by name, #code, or condition..."
                  placeholderTextColor="#94A3B8"
                />
                {searchQuery ? (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={16} color="#94A3B8" />
                  </TouchableOpacity>
                ) : null}
              </View>

              {/* Patients List */}
              <View style={styles.patientListContainer}>
                {filteredPatients.map((pat) => {
                  const isSelected = pat.id === selectedPatient.id;
                  const isHaylie =
                    pat.firstName.toLowerCase().includes('haylie') ||
                    pat.avatarKey === 'haylie' ||
                    pat.id === 'pat-7';

                  return (
                    <TouchableOpacity
                      key={pat.id}
                      style={[
                        styles.patientSelectCard,
                        isSelected && styles.patientSelectCardActive,
                      ]}
                      onPress={() => {
                        selectPatient(pat);
                        setVisitReason(
                          pat.condition || 'Progressive chronic chest tightness and nocturnal dyspnea'
                        );
                      }}
                      activeOpacity={0.8}
                    >
                      <View style={styles.patientCardLeft}>
                        <Image
                          source={
                            isHaylie
                              ? require('../../../assets/patient-avatar.png')
                              : require('../../../assets/patient-haylie.png')
                          }
                          style={styles.selectPatientAvatar}
                        />
                        <View style={styles.selectPatientMetaCol}>
                          <View style={styles.patientNameRow}>
                            <Text style={styles.selectPatientName}>
                              {pat.firstName} {pat.lastName}
                            </Text>
                            <View
                              style={[
                                styles.riskPill,
                                pat.statusRisk === 'Under Risk'
                                  ? styles.riskPillRed
                                  : styles.riskPillGreen,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.riskPillText,
                                  pat.statusRisk === 'Under Risk'
                                    ? styles.riskPillTextRed
                                    : styles.riskPillTextGreen,
                                ]}
                              >
                                {pat.statusRisk || 'Normal'}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.selectPatientDetails}>
                            {pat.gender} · {pat.age}y · {pat.patientCode}
                          </Text>
                          <Text style={styles.selectPatientCondition} numberOfLines={1}>
                            {pat.condition || 'General health evaluation'}
                          </Text>
                        </View>
                      </View>

                      {/* Radio Selection Icon */}
                      <Ionicons
                        name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                        size={22}
                        color={isSelected ? '#2563EB' : '#CBD5E1'}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Selected Patient Vitals & Clinical Context Card */}
            <View style={styles.cardContainer}>
              <Text style={styles.cardMainHeading}>Selected Patient Context</Text>

              <View style={styles.contextSummaryRow}>
                <View style={styles.contextCol}>
                  <Text style={styles.contextLabel}>CHIEF COMPLAINT</Text>
                  <Text style={styles.contextValue}>
                    {selectedPatient.condition || 'Chest tightness & dyspnea'}
                  </Text>
                </View>
                <View style={styles.contextCol}>
                  <Text style={styles.contextLabel}>CURRENT VITALS</Text>
                  <Text style={styles.contextValue}>BP 135/88 · 36.8°C</Text>
                </View>
              </View>

              <View style={[styles.contextSummaryRow, { marginTop: 12, marginBottom: 0 }]}>
                <View style={styles.contextCol}>
                  <Text style={styles.contextLabel}>ALLERGIES</Text>
                  <Text style={styles.contextValue}>
                    {selectedPatient.allergies?.join(', ') || 'No known allergies'}
                  </Text>
                </View>
                <View style={styles.contextCol}>
                  <Text style={styles.contextLabel}>MEDICATIONS</Text>
                  <Text style={styles.contextValue}>
                    {selectedPatient.existingMedications?.join(', ') || 'Digoxin 125mcg, Enalapril 5mg'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Reason for Visit Input Card */}
            <View style={styles.cardContainer}>
              <Text style={styles.cardMainHeading}>Clinical Reason for Visit</Text>

              <TextInput
                style={styles.reasonInput}
                value={visitReason}
                onChangeText={setVisitReason}
                placeholder="Enter encounter chief complaint..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={2}
              />

              {/* Quick Symptom Tags */}
              <Text style={styles.quickTagsHeading}>Quick Presets:</Text>
              <View style={styles.quickTagsRow}>
                {quickSymptoms.map((symp, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.quickTagPill}
                    onPress={() => setVisitReason(symp)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.quickTagText}>{symp}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Ambient Capture Mode & Consent Card */}
            <View style={styles.cardContainer}>
              <Text style={styles.cardMainHeading}>Encounter Protocol</Text>

              <View style={styles.protocolRow}>
                <View style={styles.protocolLeft}>
                  <Ionicons name="mic-circle" size={24} color="#2563EB" style={{ marginRight: 10 }} />
                  <View>
                    <Text style={styles.protocolTitle}>Dual-Channel Ambient Scribe</Text>
                    <Text style={styles.protocolSub}>Real-time speaker diarization & SOAP structuring</Text>
                  </View>
                </View>
              </View>

              <View style={styles.consentDivider} />

              <View style={styles.consentRow}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={styles.consentTitle}>Informed Patient Consent</Text>
                  <Text style={styles.consentSub}>
                    Patient verified for ambient documentation
                  </Text>
                </View>
                <Switch
                  value={consentConfirmed}
                  onValueChange={setConsentConfirmed}
                  trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            {/* Start Consultation CTA Button */}
            <TouchableOpacity
              style={styles.startConsultationBtn}
              onPress={handleStartConsultation}
              activeOpacity={0.85}
            >
              <FontAwesome5
                name="stethoscope"
                size={18}
                color="#FFFFFF"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.startConsultationBtnText}>
                Start Consultation
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* =========================================================================
              STATE B: ACTIVE LIVE CONSULTATION (EXACT MATCH TO USER SCREENSHOT)
             ========================================================================= */
          <View>
            {/* Live consultation Title */}
            <View style={styles.titleSection}>
              <Text style={styles.mainTitle}>Live consultation</Text>
              <Text style={styles.subtitle}>Your AI Clinical Assistant</Text>
            </View>

            {/* Patient Details Card matching screenshot */}
            <View style={styles.patientCard}>
              <View style={styles.patientTopRow}>
                <Image
                  source={require('../../../assets/patient-avatar.png')}
                  style={styles.patientAvatar}
                />
                <View style={styles.patientInfoColumn}>
                  <Text style={styles.patientName}>
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </Text>
                  <Text style={styles.patientMeta}>
                    {selectedPatient.gender} · {selectedPatient.age} years · {selectedPatient.patientCode}
                  </Text>
                </View>
              </View>
              <Text style={styles.patientCondition}>
                {selectedPatient.condition || 'Persistent cough and mild fever'}
              </Text>
            </View>

            {/* AI Scribe Session Card matching screenshot */}
            <View style={styles.scribeCard}>
              {/* Status Pill Banner */}
              <View
                style={[
                  styles.statusBanner,
                  isPaused && styles.statusBannerPaused,
                  isMuted && styles.statusBannerMuted,
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    isPaused && styles.statusDotPaused,
                    isMuted && styles.statusDotMuted,
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    isPaused && styles.statusTextPaused,
                    isMuted && styles.statusTextMuted,
                  ]}
                >
                  {getStatusText()}
                </Text>
              </View>

              {/* Illustrated Doctor Character */}
              <View style={styles.characterContainer}>
                <Image
                  source={require('../../../assets/doctor-character.png')}
                  style={styles.characterImage}
                />
              </View>

              {/* Digital Timer */}
              <Text style={styles.digitalTimer}>
                {formatStandardTimer(consultationSeconds)}
              </Text>

              {/* Animated Live Waveform */}
              <View style={styles.waveformWrapper}>
                <LiveWaveform isActive={isRecording && !isPaused && !isMuted} />
              </View>

              {/* Action Control Buttons */}
              <View style={styles.controlsRow}>
                {/* Pause / Resume Button */}
                <TouchableOpacity
                  style={[styles.controlBtn, isPaused && styles.controlBtnActive]}
                  onPress={togglePause}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isPaused ? 'play' : 'pause'}
                    size={20}
                    color={isPaused ? '#2563EB' : '#334155'}
                  />
                </TouchableOpacity>

                {/* Mute Microphone Button */}
                <TouchableOpacity
                  style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
                  onPress={toggleMute}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={isMuted ? 'mic-off' : 'mic'}
                    size={20}
                    color={isMuted ? '#DC2626' : '#334155'}
                  />
                </TouchableOpacity>

                {/* Add Dialogue Turn Button */}
                <TouchableOpacity
                  style={styles.controlBtn}
                  onPress={() => setShowAddTurnInput((prev) => !prev)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chatbubble-ellipses-outline" size={20} color="#334155" />
                </TouchableOpacity>

                {/* End Consultation Button */}
                <TouchableOpacity
                  style={styles.endConsultationBtn}
                  onPress={() => setShowEndModal(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.endConsultationBtnText}>End Consultation</Text>
                </TouchableOpacity>
              </View>

              {/* Add Turn Input Box */}
              {showAddTurnInput ? (
                <View style={styles.addTurnBox}>
                  <View style={styles.addTurnHeader}>
                    <Text style={styles.addTurnTitle}>Simulate Speech Dialogue Turn</Text>
                    <TouchableOpacity
                      style={styles.roleTogglePill}
                      onPress={() =>
                        setNewTurnRole((r) => (r === 'Doctor' ? 'Patient' : 'Doctor'))
                      }
                    >
                      <Text style={styles.roleToggleText}>Role: {newTurnRole}</Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={styles.turnTextInput}
                    placeholder={`Enter what ${newTurnRole} says...`}
                    placeholderTextColor="#94A3B8"
                    value={newTurnText}
                    onChangeText={setNewTurnText}
                    multiline
                  />
                  <TouchableOpacity style={styles.insertTurnBtn} onPress={handleAddTurn}>
                    <Text style={styles.insertTurnBtnText}>Insert into Live Stream</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>

            {/* Live Consultation Transcript Section */}
            <View style={styles.transcriptCard}>
              <View style={styles.transcriptHeader}>
                <View style={styles.transcriptHeaderLeft}>
                  <Ionicons name="document-text-outline" size={18} color="#2563EB" />
                  <Text style={styles.transcriptTitle}>Live Transcript</Text>
                </View>
                <View style={styles.liveSyncBadge}>
                  <View style={styles.greenPulseDot} />
                  <Text style={styles.liveSyncText}>Real-Time Sync</Text>
                </View>
              </View>

              {liveTranscript.map((turn, index) => {
                const isDoc = turn.speaker === 'Doctor';
                return (
                  <View
                    key={turn.id || index}
                    style={[
                      styles.dialogueRow,
                      isDoc ? styles.dialogueRowDoc : styles.dialogueRowPat,
                    ]}
                  >
                    <View style={styles.dialogueMeta}>
                      <Text
                        style={[
                          styles.dialogueSpeaker,
                          isDoc ? styles.dialogueSpeakerDoc : styles.dialogueSpeakerPat,
                        ]}
                      >
                        {isDoc ? 'Dr. Marleen' : selectedPatient.firstName}
                      </Text>
                      <Text style={styles.dialogueTime}>{turn.timestamp || '10:02 AM'}</Text>
                    </View>
                    <Text style={styles.dialogueText}>{turn.text}</Text>
                  </View>
                );
              })}
            </View>

            {/* Bottom Security / Encryption Banner */}
            <View style={styles.encryptionCard}>
              <Ionicons name="lock-closed" size={16} color="#059669" />
              <Text style={styles.encryptionText}>
                End-to-End HIPAA & SOC2 Compliant Encryption
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* End Consultation Confirmation Modal */}
      <Modal
        visible={showEndModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEndModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconWrap}>
              <Ionicons name="checkmark-done-circle" size={48} color="#2563EB" />
            </View>
            <Text style={styles.modalTitle}>End Consultation?</Text>
            <Text style={styles.modalDesc}>
              This will conclude the active ambient listening session for{' '}
              <Text style={{ fontWeight: '700', color: '#0F172A' }}>
                {selectedPatient.firstName} {selectedPatient.lastName}
              </Text>{' '}
              and trigger MediScribe AI to compile the comprehensive SOAP clinical progress note.
            </Text>

            {isProcessingNote ? (
              <View style={styles.modalProcessing}>
                <ActivityIndicator size="small" color="#2563EB" />
                <Text style={styles.modalProcessingText}>
                  AI Scribe generating SOAP note...
                </Text>
              </View>
            ) : (
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setShowEndModal(false)}
                >
                  <Text style={styles.modalCancelBtnText}>Continue Session</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalConfirmBtn}
                  onPress={handleEndConsultationConfirm}
                >
                  <Text style={styles.modalConfirmBtnText}>End & Generate Note</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
  cancelSessionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  cancelSessionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
    marginLeft: 4,
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
    marginBottom: 14,
    marginTop: 2,
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
    marginTop: 3,
    fontWeight: '400',
  },

  /* General Card Container */
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardMainHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  patientCountBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },

  /* Search Box */
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
  },

  /* Patient Selection List */
  patientListContainer: {
    gap: 8,
  },
  patientSelectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  patientSelectCardActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  patientCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  selectPatientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
    marginRight: 10,
  },
  selectPatientMetaCol: {
    flex: 1,
  },
  patientNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  selectPatientName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  riskPill: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  riskPillRed: {
    backgroundColor: '#FEE2E2',
  },
  riskPillGreen: {
    backgroundColor: '#ECFDF5',
  },
  riskPillText: {
    fontSize: 9.5,
    fontWeight: '700',
  },
  riskPillTextRed: {
    color: '#DC2626',
  },
  riskPillTextGreen: {
    color: '#059669',
  },
  selectPatientDetails: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  selectPatientCondition: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
    marginTop: 2,
  },

  /* Context Summary Row */
  contextSummaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  contextCol: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  contextLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  contextValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },

  /* Reason Input */
  reasonInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    fontSize: 14,
    color: '#0F172A',
    minHeight: 56,
    textAlignVertical: 'top',
  },
  quickTagsHeading: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 10,
    marginBottom: 6,
  },
  quickTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  quickTagPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  quickTagText: {
    fontSize: 11.5,
    color: '#2563EB',
    fontWeight: '600',
  },

  /* Protocol & Consent */
  protocolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  protocolLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  protocolTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  protocolSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  consentDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  consentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  consentSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },

  /* Start Consultation Button */
  startConsultationBtn: {
    backgroundColor: '#0F172A',
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  startConsultationBtnText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
  },

  /* Patient Card (Active State) */
  patientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
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
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E2E8F0',
    marginRight: 12,
  },
  patientInfoColumn: {
    flex: 1,
  },
  patientName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  patientMeta: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  patientCondition: {
    fontSize: 13.5,
    color: '#334155',
    fontWeight: '500',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },

  /* AI Scribe Session Card (Active State) */
  scribeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusBannerPaused: {
    backgroundColor: '#FEF3C7',
  },
  statusBannerMuted: {
    backgroundColor: '#FEE2E2',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginRight: 6,
  },
  statusDotPaused: {
    backgroundColor: '#D97706',
  },
  statusDotMuted: {
    backgroundColor: '#DC2626',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  statusTextPaused: {
    color: '#B45309',
  },
  statusTextMuted: {
    color: '#B91C1C',
  },
  characterContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    overflow: 'hidden',
  },
  characterImage: {
    width: 140,
    height: 140,
    resizeMode: 'cover',
  },
  digitalTimer: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 1.5,
    marginBottom: 8,
    fontVariant: ['tabular-nums'],
  },
  waveformWrapper: {
    width: '100%',
    marginVertical: 10,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: '100%',
    gap: 8,
  },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtnActive: {
    backgroundColor: '#DBEAFE',
  },
  endConsultationBtn: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  endConsultationBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /* Add Turn Box */
  addTurnBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addTurnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  addTurnTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  roleTogglePill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  roleToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  turnTextInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    fontSize: 13,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    minHeight: 44,
    marginBottom: 8,
  },
  insertTurnBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  insertTurnBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },

  /* Transcript Card */
  transcriptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  transcriptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  transcriptHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transcriptTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  liveSyncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
    marginRight: 5,
  },
  liveSyncText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  dialogueRow: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  dialogueRowDoc: {
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
  },
  dialogueRowPat: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 3,
    borderLeftColor: '#64748B',
  },
  dialogueMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dialogueSpeaker: {
    fontSize: 12,
    fontWeight: '700',
  },
  dialogueSpeakerDoc: {
    color: '#2563EB',
  },
  dialogueSpeakerPat: {
    color: '#475569',
  },
  dialogueTime: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  dialogueText: {
    fontSize: 13.5,
    color: '#1E293B',
    lineHeight: 19,
  },

  /* Encryption Card */
  encryptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  encryptionText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalIconWrap: {
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalProcessing: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  modalProcessingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 10,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  modalConfirmBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalConfirmBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
