import React, { useState, useEffect } from 'react';
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
    liveInsights,
    partialTranscript,
    setPartialTranscript,
    streamDialogueTurn,
    streamFullReferenceConsultation,
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
    selectedPatient.condition || 'Chronic chest tightness and increased nocturnal dyspnea.'
  );
  const [consentConfirmed, setConsentConfirmed] = useState(true);

  // Active Session State
  const [showEndModal, setShowEndModal] = useState(false);
  const [showAddTurnInput, setShowAddTurnInput] = useState(false);
  const [newTurnText, setNewTurnText] = useState('');
  const [newTurnRole, setNewTurnRole] = useState<'Doctor' | 'Patient'>('Doctor');
  const [isStreamingDemo, setIsStreamingDemo] = useState(false);

  // Web Speech API for Ambient Microphone Transcription
  useEffect(() => {
    if (!activeConsultation || !isRecording || isPaused || isMuted) return;

    if (typeof window === 'undefined') return;
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) return;

    let recognizer: any = null;
    let isTerminated = false;

    const startRecognition = () => {
      if (isTerminated) return;
      try {
        recognizer = new SpeechRec();
        recognizer.continuous = true;
        recognizer.interimResults = true;
        recognizer.lang = 'en-US';

        recognizer.onresult = (event: any) => {
          if (isMuted || isPaused || isTerminated) return;
          let interimText = '';
          let finalText = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const chunk = event.results[i][0]?.transcript || '';
            if (event.results[i].isFinal) {
              finalText += chunk;
            } else {
              interimText += chunk;
            }
          }

          if (interimText.trim()) {
            const inferred = inferRole(interimText);
            setPartialTranscript({ speaker: inferred, text: interimText.trim() });
          }

          if (finalText.trim()) {
            const inferred = inferRole(finalText);
            setPartialTranscript(null);
            addTranscriptMessage(finalText.trim(), inferred);
          }
        };

        recognizer.onerror = () => {
          if (!isTerminated && isRecording && !isPaused && !isMuted) {
            setTimeout(startRecognition, 300);
          }
        };

        recognizer.onend = () => {
          if (!isTerminated && isRecording && !isPaused && !isMuted) {
            setTimeout(startRecognition, 200);
          }
        };

        recognizer.start();
      } catch (err) {
        console.debug('[Ambient Speech Recognition Notice]:', err);
      }
    };

    startRecognition();

    return () => {
      isTerminated = true;
      if (recognizer) {
        try {
          recognizer.abort();
        } catch {}
      }
    };
  }, [activeConsultation, isRecording, isPaused, isMuted]);

  const inferRole = (text: string): 'Doctor' | 'Patient' => {
    const lower = text.toLowerCase().trim();
    if (
      /\?$/.test(lower) ||
      /\b(how|what|are you|have you|did you|let me|prescribe|taking|doses|report|cardiography|regularly)\b/i.test(lower)
    ) {
      if (!/\b(i am|i'm|i feel|i missed|my stomach|my chest)\b/i.test(lower)) {
        return 'Doctor';
      }
    }
    if (
      /\b(i feel|i've|i missed|my stomach|my chest|at night|lay flat|gasping|tighter|honest)\b/i.test(lower)
    ) {
      return 'Patient';
    }
    return liveTranscript.length % 2 === 0 ? 'Doctor' : 'Patient';
  };

  // Format timer as HH:MM:SS - e.g. "00:04:12" as in screenshot 1
  const formatStandardTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartConsultation = (startFresh = false) => {
    if (!consentConfirmed) {
      Alert.alert(
        'Consent Required',
        'Please confirm patient informed consent for ambient clinical AI documentation.'
      );
      return;
    }
    startConsultation(selectedPatient, visitReason, startFresh);
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
      'Are you sure you want to exit this consultation and return to patient selection?',
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

  const handleStreamTurn = async () => {
    if (!newTurnText.trim()) return;
    const textToStream = newTurnText.trim();
    const roleToStream = newTurnRole;
    setNewTurnText('');
    setNewTurnRole((prev) => (prev === 'Doctor' ? 'Patient' : 'Doctor'));
    await streamDialogueTurn(textToStream, roleToStream);
  };

  const handleRunFullStreamDemo = async () => {
    setIsStreamingDemo(true);
    try {
      await streamFullReferenceConsultation();
    } finally {
      setIsStreamingDemo(false);
    }
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
    'Chronic chest tightness and increased nocturnal dyspnea.',
    'Persistent cough & mild fever',
    'Hypertension regular follow-up',
    'Palpitations & exertion fatigue',
    'Routine cardiology evaluation',
  ];

  const hayliePatient =
    patients.find(
      (p) =>
        p.firstName.toLowerCase().includes('haylie') ||
        p.avatarKey === 'haylie' ||
        p.id === 'pat-7'
    ) || selectedPatient;

  const currentPatient = activeConsultation?.patient || selectedPatient || hayliePatient;

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
            {activeConsultation ? (
              <TouchableOpacity
                style={styles.exitSessionBtn}
                onPress={handleCancelSession}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle-outline" size={18} color="#DC2626" />
                <Text style={styles.exitSessionBtnText}>Exit</Text>
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

        {/* Title Section matching screenshot 1 */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Consultation workspace</Text>
          <Text style={styles.subtitle}>Your AI Clinical Assistant</Text>
        </View>

        {/* =========================================================================
            STATE A: PRE-CONSULTATION SETUP & PATIENT SELECTION (WHEN NOT IN ACTIVE SESSION)
           ========================================================================= */}
        {!activeConsultation ? (
          <View>
            {/* Patient Selection Card */}
            <View style={styles.cardContainer}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardMainHeading}>Select Patient for Consultation</Text>
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
                          pat.condition || 'Chronic chest tightness and increased nocturnal dyspnea.'
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
                            {pat.condition || 'General clinical review'}
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
                    {selectedPatient.condition || 'Chronic chest tightness & dyspnea'}
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
                    {selectedPatient.allergies?.join(', ') || 'Penicillin'}
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
                placeholder="Enter clinical encounter reason..."
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
                <Ionicons name="mic-circle" size={24} color="#2563EB" style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.protocolTitle}>Dual-Channel Ambient Scribe</Text>
                  <Text style={styles.protocolSub}>Real-time speaker diarization & SOAP structuring</Text>
                </View>
              </View>

              <View style={styles.consentDivider} />

              <View style={styles.consentRow}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={styles.consentTitle}>Informed Patient Consent</Text>
                  <Text style={styles.consentSub}>
                    Patient verified for ambient audio documentation
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
              onPress={() => handleStartConsultation()}
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
              STATE B: ACTIVE LIVE CONSULTATION (EXACT MATCH TO SCREENSHOTS 1, 2 & 3)
             ========================================================================= */
          <View>
            {/* Card 1: Patient Card matching screenshot 1 */}
            <View style={styles.patientCard}>
              <View style={styles.patientTopRow}>
                <Image
                  source={require('../../../assets/patient-avatar.png')}
                  style={styles.patientAvatar}
                />
                <View style={styles.patientInfoColumn}>
                  <Text style={styles.patientName}>
                    {currentPatient.firstName} {currentPatient.lastName}
                  </Text>
                  <Text style={styles.patientMeta}>
                    {currentPatient.gender} · {currentPatient.age} years · {currentPatient.patientCode || '#HS15922'}
                  </Text>
                </View>
              </View>

              {/* Chief Complaint matching screenshot 1 */}
              <Text style={styles.patientCondition}>
                {currentPatient.condition || 'Chronic chest tightness and increased nocturnal dyspnea.'}
              </Text>

              {/* Red Alert Pill Banner matching screenshot 1 */}
              <View style={styles.pathologyAlertBanner}>
                <Text style={styles.pathologyAlertText}>
                  Persistent Atrial Fibrillation · Chronic Heart Failure
                </Text>
              </View>
            </View>

            {/* Card 2: AI Scribe Session Card matching screenshot 1 */}
            <View style={styles.scribeCard}>
              {/* Status Pill Banner matching screenshot 1 */}
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

              {/* 3D Doctor Character matching screenshot 1 & Web App Video */}
              <View style={styles.characterContainer}>
                {Platform.OS === 'web' && typeof document !== 'undefined' ? (
                  React.createElement('video', {
                    src: '/assets/avatar-video.mp4',
                    autoPlay: true,
                    loop: true,
                    muted: true,
                    playsInline: true,
                    style: {
                      width: 140,
                      height: 140,
                      objectFit: 'contain',
                      pointerEvents: 'none',
                    },
                  })
                ) : (
                  <Image
                    source={require('../../../assets/doctor-character.png')}
                    style={styles.characterImage}
                  />
                )}
              </View>

              {/* Digital Timer matching screenshot 1: 00:04:12 */}
              <Text style={styles.digitalTimer}>
                {formatStandardTimer(consultationSeconds)}
              </Text>

              {/* Animated Live Waveform matching screenshot 1 */}
              <View style={styles.waveformWrapper}>
                <LiveWaveform isActive={isRecording && !isPaused && !isMuted} />
              </View>

              {/* 3 Control Buttons Row matching screenshot 1 */}
              <View style={styles.controlsRow}>
                {/* Pause / Resume Button */}
                <TouchableOpacity
                  style={[styles.controlBoxBtn, isPaused && styles.controlBoxBtnActive]}
                  onPress={togglePause}
                  activeOpacity={0.75}
                >
                  <Ionicons
                    name={isPaused ? 'play' : 'pause'}
                    size={22}
                    color={isPaused ? '#2563EB' : '#334155'}
                  />
                  <Text style={[styles.controlBoxLabel, isPaused && styles.controlBoxLabelActive]}>
                    {isPaused ? 'Resume' : 'Pause'}
                  </Text>
                </TouchableOpacity>

                {/* End Session Center Button matching screenshot 1 */}
                <TouchableOpacity
                  style={styles.endSessionBoxBtn}
                  onPress={() => setShowEndModal(true)}
                  activeOpacity={0.8}
                >
                  <View style={styles.stopIconCircle}>
                    <Ionicons name="stop" size={14} color="#DC2626" />
                  </View>
                  <Text style={styles.endSessionBoxLabel}>End session</Text>
                </TouchableOpacity>

                {/* Mute Microphone Button */}
                <TouchableOpacity
                  style={[styles.controlBoxBtn, isMuted && styles.controlBoxBtnActive]}
                  onPress={toggleMute}
                  activeOpacity={0.75}
                >
                  <Ionicons
                    name={isMuted ? 'mic-off' : 'mic-off-outline'}
                    size={22}
                    color={isMuted ? '#DC2626' : '#334155'}
                  />
                  <Text style={[styles.controlBoxLabel, isMuted && styles.controlBoxLabelMuted]}>
                    {isMuted ? 'Muted' : 'Mute'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Real-time Voice Capture & Speech Toolbar */}
              <View style={styles.liveSpeechToolbar}>
                <View style={styles.liveSpeechStatusRow}>
                  <View style={styles.liveAudioDot} />
                  <Text style={styles.liveSpeechStatusText}>
                    {isPaused
                      ? 'AI Scribe Paused'
                      : isMuted
                      ? 'Microphone Muted'
                      : 'Ambient Mic Active · Transcribing Spoken Dialogue'}
                  </Text>
                </View>

                {/* Quick Spoken Turn Presets */}
                <View style={styles.quickSpokenPresetsRow}>
                  <TouchableOpacity
                    style={styles.quickSpeechPill}
                    onPress={() => streamDialogueTurn('Welcome, Haylie. I reviewed your cardiography report. How has the chest tightness been?', 'Doctor')}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.quickSpeechPillText}>+ Dr. Marleen (Inquiry)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.quickSpeechPill, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}
                    onPress={() => streamDialogueTurn("It's been tighter than usual, especially at night when I lay flat. I feel like I'm gasping for air.", 'Patient')}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.quickSpeechPillText, { color: '#2563EB' }]}>+ Haylie (Symptoms)</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.quickSpokenPresetsRow}>
                  <TouchableOpacity
                    style={styles.quickSpeechPill}
                    onPress={() => streamDialogueTurn('Are you taking the prescribed Digoxin regularly? Any skipped doses?', 'Doctor')}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.quickSpeechPillText}>+ Dr. Marleen (Digoxin)</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.quickSpeechPill, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}
                    onPress={() => streamDialogueTurn('I missed a couple of doses last week because of my stomach upset, to be honest.', 'Patient')}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.quickSpeechPillText, { color: '#2563EB' }]}>+ Haylie (Adherence)</Text>
                  </TouchableOpacity>
                </View>

                {/* Stream Full Consultation Button */}
                <TouchableOpacity
                  style={styles.streamFullConsultationBtn}
                  onPress={handleRunFullStreamDemo}
                  disabled={isStreamingDemo}
                  activeOpacity={0.85}
                >
                  <Ionicons name="play-circle" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.streamFullConsultationBtnText}>
                    {isStreamingDemo ? 'Transcribing Real-time Conversation...' : '▶ Stream Full Live Consultation (ChatGPT Real-time)'}
                  </Text>
                </TouchableOpacity>

                {/* Custom Spoken Dialogue Dictation Input */}
                <View style={styles.dictationRow}>
                  <TouchableOpacity
                    style={styles.roleToggleMiniBtn}
                    onPress={() => setNewTurnRole((r) => (r === 'Doctor' ? 'Patient' : 'Doctor'))}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.roleToggleMiniText}>{newTurnRole}</Text>
                  </TouchableOpacity>

                  <TextInput
                    style={styles.dictationInput}
                    placeholder={`Speak or enter live dialogue for ${newTurnRole}...`}
                    placeholderTextColor="#94A3B8"
                    value={newTurnText}
                    onChangeText={setNewTurnText}
                  />

                  <TouchableOpacity
                    style={styles.dictationSendBtn}
                    onPress={handleStreamTurn}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="send" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Card 3: Live Transcript Card matching screenshot 2 & ChatGPT Real-time streaming */}
            <View style={styles.cardContainer}>
              <View style={styles.transcriptCardHeader}>
                <Text style={styles.cardMainHeading}>Live Transcript</Text>
                {isRecording && !isPaused && !isMuted ? (
                  <View style={styles.liveIndicatorBadge}>
                    <View style={styles.livePulseDot} />
                    <Text style={styles.liveIndicatorText}>LIVE</Text>
                  </View>
                ) : null}
              </View>

              {/* Confirmed Spoken Dialogue Turns */}
              {liveTranscript.map((turn, index) => {
                const isDoc = turn.speaker === 'Doctor';
                const speakerName = isDoc
                  ? 'Dr. Marleen'
                  : currentPatient.firstName
                  ? `${currentPatient.firstName} ${currentPatient.lastName}`
                  : 'Haylie Saris';

                return (
                  <View key={turn.id || index} style={styles.transcriptTurnBlock}>
                    {/* Speaker Name in Primary Blue matching screenshot 2 */}
                    <Text style={styles.transcriptSpeakerName}>{speakerName}</Text>
                    {/* Speech Text matching screenshot 2 */}
                    <Text style={styles.transcriptSpeechText}>{turn.text}</Text>
                  </View>
                );
              })}

              {/* Real-time Streaming Transcript (ChatGPT word-by-word streaming animation with blinking cursor) */}
              {partialTranscript && partialTranscript.text ? (
                <View style={[styles.transcriptTurnBlock, styles.streamingTurnBlock]}>
                  <View style={styles.streamingSpeakerRow}>
                    <Text style={styles.transcriptSpeakerName}>
                      {partialTranscript.speaker === 'Doctor'
                        ? 'Dr. Marleen'
                        : currentPatient.firstName
                        ? `${currentPatient.firstName} ${currentPatient.lastName}`
                        : 'Haylie Saris'}
                    </Text>
                    <View style={styles.streamingTag}>
                      <View style={styles.livePulseDot} />
                      <Text style={styles.streamingTagText}>transcribing live...</Text>
                    </View>
                  </View>
                  <Text style={styles.transcriptSpeechText}>
                    {partialTranscript.text}
                    <Text style={styles.streamingCursor}> ▋</Text>
                  </Text>
                </View>
              ) : null}

              {/* Listening State when transcript is empty */}
              {liveTranscript.length === 0 && !partialTranscript ? (
                <View style={styles.emptyTranscriptBlock}>
                  <Ionicons name="mic-outline" size={26} color="#2563EB" style={{ marginBottom: 6 }} />
                  <Text style={styles.emptyTranscriptTitle}>AI Scribe is listening to room conversation</Text>
                  <Text style={styles.emptyTranscriptSubtitle}>
                    Speak into your microphone or tap dialogue to transcribe in real time.
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Card 4: AI Assistant Insights Card matching screenshot 3 */}
            <View style={styles.cardContainer}>
              <Text style={styles.cardMainHeading}>AI Assistant Insights</Text>

              {/* Insight 1: Medication Adherence Warning */}
              <Text style={styles.insightCategoryLabel}>MEDICATION ADHERENCE WARNING</Text>
              <View style={styles.insightBox}>
                <Text style={styles.insightBoxText}>
                  Digoxin therapy discontinued briefly; potential trigger for ventricular overload.
                </Text>
              </View>

              {/* Insight 2: Pathology Identified */}
              <Text style={styles.insightCategoryLabel}>PATHOLOGY IDENTIFIED</Text>
              <View style={[styles.insightBox, { marginBottom: 0 }]}>
                <Text style={styles.insightBoxText}>
                  Nocturnal Orthopnea / Paroxysmal Nocturnal Dyspnea. Echo updates recommended.
                </Text>
              </View>
            </View>

            {/* Bottom Security Banner matching screenshot 3 */}
            <View style={styles.securityEncryptedBanner}>
              <Text style={styles.securityEncryptedText}>
                Secure & Private · Consultations are encrypted
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
              Conclude the ambient listening session for{' '}
              <Text style={{ fontWeight: '700', color: '#0F172A' }}>
                {currentPatient.firstName} {currentPatient.lastName}
              </Text>{' '}
              and trigger MediScribe AI to compile the SOAP clinical progress note.
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
  exitSessionBtn: {
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
  exitSessionBtnText: {
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

  /* Title Section matching screenshot 1 */
  titleSection: {
    marginBottom: 16,
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
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardMainHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
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

  /* Card 1: Patient Card matching screenshot 1 */
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
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E2E8F0',
    marginRight: 14,
  },
  patientInfoColumn: {
    flex: 1,
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
    fontSize: 14.5,
    color: '#475569',
    lineHeight: 20,
    marginTop: 14,
  },
  pathologyAlertBanner: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 14,
  },
  pathologyAlertText: {
    color: '#DC2626',
    fontSize: 12.5,
    fontWeight: '700',
  },

  /* Card 2: AI Scribe Session Card matching screenshot 1 */
  scribeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
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
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'stretch',
    marginBottom: 16,
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
    backgroundColor: '#059669',
    marginRight: 8,
  },
  statusDotPaused: {
    backgroundColor: '#D97706',
  },
  statusDotMuted: {
    backgroundColor: '#DC2626',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  characterImage: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
  },
  digitalTimer: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 1.5,
    marginBottom: 10,
    fontVariant: ['tabular-nums'],
  },
  waveformWrapper: {
    width: '100%',
    marginVertical: 10,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    width: '100%',
    gap: 10,
  },
  controlBoxBtn: {
    flex: 1,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  controlBoxBtnActive: {
    backgroundColor: '#DBEAFE',
  },
  controlBoxLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
    marginTop: 4,
  },
  controlBoxLabelActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  controlBoxLabelMuted: {
    color: '#DC2626',
    fontWeight: '700',
  },
  endSessionBoxBtn: {
    flex: 1.2,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  stopIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endSessionBoxLabel: {
    color: '#DC2626',
    fontSize: 12.5,
    fontWeight: '700',
    marginTop: 4,
  },

  /* Real-time Voice Capture & Speech Toolbar */
  liveSpeechToolbar: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  liveSpeechStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  liveAudioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginRight: 6,
  },
  liveSpeechStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  quickSpokenPresetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  quickSpeechPill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickSpeechPillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#334155',
  },
  streamFullConsultationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  streamFullConsultationBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  dictationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  roleToggleMiniBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  roleToggleMiniText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  dictationInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 12.5,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  dictationSendBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Card 3: Live Transcript Card matching screenshot 2 */
  transcriptCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  liveIndicatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  liveIndicatorText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#DC2626',
    marginLeft: 4,
  },
  livePulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
  },
  transcriptTurnBlock: {
    marginBottom: 16,
  },
  transcriptSpeakerName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 4,
  },
  transcriptSpeechText: {
    fontSize: 14.5,
    color: '#0F172A',
    lineHeight: 22,
    fontWeight: '400',
  },
  streamingTurnBlock: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
  },
  streamingSpeakerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  streamingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  streamingTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
    marginLeft: 4,
  },
  streamingCursor: {
    color: '#2563EB',
    fontWeight: '800',
  },
  emptyTranscriptBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  emptyTranscriptTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
    textAlign: 'center',
  },
  emptyTranscriptSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },

  /* Card 4: AI Assistant Insights Card matching screenshot 3 */
  insightCategoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  insightBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  insightBoxText: {
    fontSize: 14,
    color: '#0F172A',
    lineHeight: 20,
    fontWeight: '500',
  },

  /* Bottom Security Banner matching screenshot 3 */
  securityEncryptedBanner: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityEncryptedText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#059669',
    textAlign: 'center',
  },

  /* End Consultation Modal */
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
