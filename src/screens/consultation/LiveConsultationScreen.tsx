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
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';
import { LiveWaveform } from '../../components/consultation/LiveWaveform';

interface Props {
  navigation: any;
}

export const LiveConsultationScreen: React.FC<Props> = ({ navigation }) => {
  const {
    selectedPatient,
    isRecording,
    isPaused,
    isMuted,
    consultationSeconds,
    liveTranscript,
    isProcessingNote,
    togglePause,
    toggleMute,
    endConsultation,
    addTranscriptMessage,
  } = useMobileApp();

  const [showEndModal, setShowEndModal] = useState(false);
  const [showAddTurnInput, setShowAddTurnInput] = useState(false);
  const [newTurnText, setNewTurnText] = useState('');
  const [newTurnRole, setNewTurnRole] = useState<'Doctor' | 'Patient'>('Doctor');

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(
      Math.floor((totalSec * 10) % 60)
    ).padStart(2, '0').slice(0, 2)}`;
  };

  // Standard timer format (MM:SS or HH:MM:SS) - in screenshot: "00:04:32"
  const formatStandardTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
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

          {/* Large Bold Timer */}
          <Text style={styles.timerDisplay}>
            {formatStandardTimer(consultationSeconds)}
          </Text>

          {/* Symmetrical Vivid Waveform */}
          <LiveWaveform isActive={isRecording && !isPaused && !isMuted} />

          {/* Control Action Buttons Row matching screenshot */}
          <View style={styles.actionRow}>
            {/* Pause / Resume Button */}
            <TouchableOpacity
              style={[styles.actionBtn, isPaused && styles.actionBtnActive]}
              onPress={togglePause}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isPaused ? 'play' : 'pause'}
                size={22}
                color={isPaused ? '#2563EB' : '#334155'}
              />
              <Text style={[styles.actionBtnText, isPaused && styles.actionBtnTextActive]}>
                {isPaused ? 'Resume' : 'Pause'}
              </Text>
            </TouchableOpacity>

            {/* End Session Button */}
            <TouchableOpacity
              style={styles.endSessionBtn}
              onPress={() => setShowEndModal(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="stop" size={20} color="#EF4444" />
              <Text style={styles.endSessionText}>End session</Text>
            </TouchableOpacity>

            {/* Mute / Unmute Button */}
            <TouchableOpacity
              style={[styles.actionBtn, isMuted && styles.actionBtnActive]}
              onPress={toggleMute}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isMuted ? 'mic' : 'mic-off'}
                size={22}
                color={isMuted ? '#DC2626' : '#334155'}
              />
              <Text style={[styles.actionBtnText, isMuted && styles.actionBtnTextActive]}>
                {isMuted ? 'Unmute' : 'Mute'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Transcript Card matching screenshot */}
        <View style={styles.transcriptCard}>
          <View style={styles.transcriptCardHeader}>
            <Text style={styles.transcriptCardTitle}>Live Transcript</Text>
            <TouchableOpacity
              style={styles.addTurnToggleBtn}
              onPress={() => setShowAddTurnInput((prev) => !prev)}
            >
              <Ionicons
                name={showAddTurnInput ? 'close' : 'add-circle-outline'}
                size={20}
                color="#2563EB"
              />
              <Text style={styles.addTurnToggleText}>
                {showAddTurnInput ? 'Cancel' : 'Add Speech'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Speech Turn Input */}
          {showAddTurnInput && (
            <View style={styles.inputTurnContainer}>
              <View style={styles.speakerSelectorRow}>
                <TouchableOpacity
                  style={[
                    styles.roleTogglePill,
                    newTurnRole === 'Doctor' && styles.roleTogglePillActive,
                  ]}
                  onPress={() => setNewTurnRole('Doctor')}
                >
                  <Text
                    style={[
                      styles.roleToggleText,
                      newTurnRole === 'Doctor' && styles.roleToggleTextActive,
                    ]}
                  >
                    Doctor
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleTogglePill,
                    newTurnRole === 'Patient' && styles.roleTogglePillActive,
                  ]}
                  onPress={() => setNewTurnRole('Patient')}
                >
                  <Text
                    style={[
                      styles.roleToggleText,
                      newTurnRole === 'Patient' && styles.roleToggleTextActive,
                    ]}
                  >
                    Patient
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.textInput}
                  placeholder={`Spoken line as ${newTurnRole}...`}
                  placeholderTextColor="#94A3B8"
                  value={newTurnText}
                  onChangeText={setNewTurnText}
                />
                <TouchableOpacity
                  style={styles.sendTurnBtn}
                  onPress={handleAddTurn}
                  activeOpacity={0.8}
                >
                  <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Dialogue Turns */}
          <View style={styles.dialogueList}>
            {liveTranscript.map((turn) => {
              const speakerName = turn.speaker === 'Doctor' ? 'Doctor' : 'Patient';
              return (
                <View key={turn.id} style={styles.turnBlock}>
                  <Text style={styles.speakerLabel}>{speakerName}</Text>
                  <Text style={styles.turnSpeechText}>{turn.text}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Security & Encryption Banner matching screenshot */}
        <View style={styles.securityBanner}>
          <Text style={styles.securityBannerText}>
            Secure & Private · Consultations are encrypted
          </Text>
        </View>
      </ScrollView>

      {/* End Consultation Confirmation Modal */}
      <Modal visible={showEndModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <Ionicons name="document-text" size={32} color="#2563EB" />
            </View>
            <Text style={styles.modalTitle}>End Consultation Session</Text>
            <Text style={styles.modalDesc}>
              Finalize consultation for {selectedPatient.firstName} {selectedPatient.lastName}?
              Pivot AI will run speaker diarization, extract medical findings, and generate the SOAP
              note and prescription draft.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowEndModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleEndConsultationConfirm}
              >
                <Text style={styles.modalConfirmText}>Generate Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* AI Processing Overlay */}
      {isProcessingNote && (
        <Modal visible={isProcessingNote} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.processingCard}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={styles.processingTitle}>Generating Clinical Note...</Text>
              <Text style={styles.processingSubtitle}>
                Structuring SOAP documentation, prescription candidate review, and verified medical
                codes.
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EFF4FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#EFF4FA',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
  },
  /* Top MediScribe Header */
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 8,
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
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  /* Patient Details Card */
  patientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
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
    fontSize: 13.5,
    color: '#64748B',
    marginTop: 3,
  },
  patientCondition: {
    fontSize: 15,
    color: '#475569',
    marginTop: 12,
  },
  /* Live Scribe Card */
  scribeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: 'stretch',
  },
  statusBannerPaused: {
    backgroundColor: '#FEF3C7',
  },
  statusBannerMuted: {
    backgroundColor: '#FEE2E2',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  statusDotPaused: {
    backgroundColor: '#F59E0B',
  },
  statusDotMuted: {
    backgroundColor: '#EF4444',
  },
  statusText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#15803D',
  },
  statusTextPaused: {
    color: '#B45309',
  },
  statusTextMuted: {
    color: '#B91C1C',
  },
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    height: 180,
  },
  characterImage: {
    width: 130,
    height: 180,
    resizeMode: 'contain',
  },
  timerDisplay: {
    fontSize: 34,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 0.5,
    marginVertical: 4,
  },
  /* Control Action Buttons Row */
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    marginTop: 16,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    height: 58,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnActive: {
    backgroundColor: '#E2E8F0',
  },
  actionBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
    marginTop: 4,
  },
  actionBtnTextActive: {
    color: '#2563EB',
  },
  endSessionBtn: {
    flex: 1.25,
    height: 58,
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endSessionText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#EF4444',
    marginTop: 4,
  },
  /* Live Transcript Card */
  transcriptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  transcriptCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  transcriptCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  addTurnToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  addTurnToggleText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#2563EB',
  },
  inputTurnContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  speakerSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  roleTogglePill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
  },
  roleTogglePillActive: {
    backgroundColor: '#2563EB',
  },
  roleToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  roleToggleTextActive: {
    color: '#FFFFFF',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  sendTurnBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogueList: {
    marginTop: 4,
  },
  turnBlock: {
    marginBottom: 16,
  },
  speakerLabel: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 4,
  },
  turnSpeechText: {
    fontSize: 15,
    color: '#1E293B',
    lineHeight: 22,
  },
  /* Security Banner */
  securityBanner: {
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  securityBannerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#166534',
  },
  /* Modals */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  modalIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  modalConfirmBtn: {
    flex: 1.2,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalConfirmText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  processingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    maxWidth: 340,
  },
  processingTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 16,
    marginBottom: 8,
  },
  processingSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
});
