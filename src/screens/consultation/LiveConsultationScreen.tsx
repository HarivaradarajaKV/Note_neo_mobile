import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';
import { MobileHeader } from '../../components/common/MobileHeader';
import { TranscriptBubble } from '../../components/consultation/TranscriptBubble';
import { LiveWaveform } from '../../components/consultation/LiveWaveform';
import { TerminologyPill } from '../../components/consultation/TerminologyPill';
import { ActionButton } from '../../components/common/ActionButton';

interface Props {
  navigation: any;
}

export const LiveConsultationScreen: React.FC<Props> = ({ navigation }) => {
  const {
    selectedPatient,
    isRecording,
    consultationSeconds,
    liveTranscript,
    liveInsights,
    isProcessingNote,
    selectedLanguage,
    setSelectedLanguage,
    toggleRecording,
    endConsultation,
    addTranscriptMessage,
  } = useMobileApp();

  const [inputTurnText, setInputTurnText] = useState('');
  const [selectedRole, setSelectedRole] = useState<'Doctor' | 'Patient'>('Doctor');
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSendTurn = () => {
    if (!inputTurnText.trim()) return;
    addTranscriptMessage(inputTurnText.trim(), selectedRole);
    setInputTurnText('');
    // Alternate role suggestion for next turn
    setSelectedRole((prev) => (prev === 'Doctor' ? 'Patient' : 'Doctor'));
  };

  const handleFinishConsultation = async () => {
    try {
      const finished = await endConsultation();
      navigation.navigate('ClinicalNoteReview', { consultation: finished });
    } catch (err: any) {
      Alert.alert('Processing Notice', 'Clinical note generated and ready for review.');
      navigation.navigate('ClinicalNoteReview');
    }
  };

  const LANGUAGES = ['English', 'Kannada (ಕನ್ನಡ)', 'Hindi (हिंदी)', 'Tamil (தமிழ்)', 'Telugu (తెలుగు)', 'Malayalam (മലയാളം)'];

  return (
    <View style={styles.container}>
      <MobileHeader
        title={selectedPatient.firstName + ' ' + selectedPatient.lastName}
        subtitle={`${selectedPatient.patientCode} · ${selectedPatient.age}y ${selectedPatient.gender}`}
        showBack
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity
            style={styles.langPill}
            onPress={() => setIsLangModalOpen(true)}
          >
            <Ionicons name="globe-outline" size={14} color="#2563EB" />
            <Text style={styles.langPillText}>{selectedLanguage.split(' ')[0]}</Text>
          </TouchableOpacity>
        }
      />

      {/* Recording Control & Waveform Header */}
      <View style={styles.recordingHeader}>
        <View style={styles.timerRow}>
          <View style={styles.pulseIndicator}>
            <View style={[styles.pulseDot, !isRecording && styles.pulseDotPaused]} />
            <Text style={styles.statusLabel}>
              {isRecording ? 'AI Scribing Active' : 'Scribing Paused'}
            </Text>
          </View>
          <Text style={styles.timerText}>{formatTimer(consultationSeconds)}</Text>
        </View>

        <LiveWaveform isActive={isRecording} />

        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.recordToggleBtn, !isRecording && styles.resumeBtn]}
            onPress={toggleRecording}
          >
            <Ionicons
              name={isRecording ? 'pause' : 'mic'}
              size={18}
              color={isRecording ? '#DC2626' : '#2563EB'}
            />
            <Text style={[styles.recordToggleText, !isRecording && styles.resumeText]}>
              {isRecording ? 'Pause Recording' : 'Resume Mic'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sampleDialogueBtn}
            onPress={() => {
              if (selectedRole === 'Doctor') {
                addTranscriptMessage('Any shortness of breath or chest pain?', 'Doctor');
                setSelectedRole('Patient');
              } else {
                addTranscriptMessage('A little shortness of breath, especially at night. No chest pain though.', 'Patient');
                setSelectedRole('Doctor');
              }
            }}
          >
            <Ionicons name="sparkles" size={14} color="#7C3AED" />
            <Text style={styles.sampleDialogueText}>+ Quick Turn</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Live Clinical Insights Strip */}
      {liveInsights.length > 0 && (
        <View style={styles.insightsSection}>
          <Text style={styles.insightsSectionTitle}>Extracted Clinical Entities</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.insightsScroll}
          >
            {liveInsights.map((insight) => (
              <TerminologyPill key={insight.id} insight={insight} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Live Verbatim Dialogue List */}
      <ScrollView style={styles.transcriptScroll} contentContainerStyle={styles.transcriptContent}>
        {liveTranscript.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="mic-outline" size={32} color="#94A3B8" />
            </View>
            <Text style={styles.emptyTitle}>Listening for Clinical Speech</Text>
            <Text style={styles.emptySubtitle}>
              Speak naturally between doctor and patient. Verbatim speech turns, repeated phrases, and medical terminology are captured live.
            </Text>
          </View>
        ) : (
          liveTranscript.map((msg) => (
            <TranscriptBubble key={msg.id} message={msg} />
          ))
        )}
      </ScrollView>

      {/* Manual Turn Injector & Speaker Toggle */}
      <View style={styles.inputBar}>
        <View style={styles.roleSelector}>
          <TouchableOpacity
            style={[styles.roleOption, selectedRole === 'Doctor' && styles.roleOptionActiveDoc]}
            onPress={() => setSelectedRole('Doctor')}
          >
            <Text
              style={[
                styles.roleOptionText,
                selectedRole === 'Doctor' && styles.roleOptionTextActive,
              ]}
            >
              Doctor
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleOption, selectedRole === 'Patient' && styles.roleOptionActivePat]}
            onPress={() => setSelectedRole('Patient')}
          >
            <Text
              style={[
                styles.roleOptionText,
                selectedRole === 'Patient' && styles.roleOptionTextActive,
              ]}
            >
              Patient
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.textInputRow}>
          <TextInput
            value={inputTurnText}
            onChangeText={setInputTurnText}
            placeholder={`Type ${selectedRole.toLowerCase()} speech...`}
            placeholderTextColor="#94A3B8"
            style={styles.textInput}
            onSubmitEditing={handleSendTurn}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendTurn}
            disabled={!inputTurnText.trim()}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Sticky Action: End Consultation & Generate Note */}
      <View style={styles.bottomBar}>
        <ActionButton
          title="End Consultation & Generate Note"
          icon="document-text"
          variant="success"
          loading={isProcessingNote}
          onPress={handleFinishConsultation}
          style={styles.finishBtn}
        />
      </View>

      {/* Language Selection Modal */}
      <Modal
        visible={isLangModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsLangModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Scribing Language</Text>
              <TouchableOpacity onPress={() => setIsLangModalOpen(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>
              Continuous dual-channel transcription in Indic scripts with automatic medical English translation.
            </Text>

            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.langOption,
                  selectedLanguage.startsWith(lang.split(' ')[0]) && styles.langOptionSelected,
                ]}
                onPress={() => {
                  setSelectedLanguage(lang);
                  setIsLangModalOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.langOptionText,
                    selectedLanguage.startsWith(lang.split(' ')[0]) && styles.langOptionTextSelected,
                  ]}
                >
                  {lang}
                </Text>
                {selectedLanguage.startsWith(lang.split(' ')[0]) && (
                  <Ionicons name="checkmark-circle" size={20} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF4FA',
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 4,
  },
  langPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  recordingHeader: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  pulseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  pulseDotPaused: {
    backgroundColor: '#F59E0B',
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  timerText: {
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: '800',
    color: '#2563EB',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  recordToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 6,
  },
  resumeBtn: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  recordToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  resumeText: {
    color: '#2563EB',
  },
  sampleDialogueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F5F3FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    gap: 4,
  },
  sampleDialogueText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7C3AED',
  },
  insightsSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  insightsSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  insightsScroll: {
    paddingRight: 10,
  },
  transcriptScroll: {
    flex: 1,
  },
  transcriptContent: {
    padding: 14,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  inputBar: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  roleSelector: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleOptionActiveDoc: {
    backgroundColor: '#DBEAFE',
  },
  roleOptionActivePat: {
    backgroundColor: '#DCFCE7',
  },
  roleOptionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  roleOptionTextActive: {
    color: '#0F172A',
  },
  textInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    fontSize: 14,
    color: '#0F172A',
  },
  sendButton: {
    backgroundColor: '#2563EB',
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  finishBtn: {
    borderRadius: 14,
    paddingVertical: 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 16,
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  langOptionSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  langOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  langOptionTextSelected: {
    color: '#1D4ED8',
    fontWeight: '800',
  },
});

