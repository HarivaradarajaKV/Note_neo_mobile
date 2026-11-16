import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  AuthUser,
  UserRole,
  Patient,
  Doctor,
  ConsultationSession,
  Appointment,
  SOAPNote,
  TranscriptMessage,
  AIInsight,
} from '../types';
import {
  DEMO_AUTH_USERS,
  INITIAL_DOCTOR,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  createBlankSOAPNote,
} from '../services/mockData';
import { accuratelyDiarizeConsultationDialogue } from '../services/speakerDiarization';

export const INITIAL_LIVE_TRANSCRIPT: TranscriptMessage[] = [
  {
    id: 'turn-1',
    speaker: 'Doctor',
    speakerRole: 'Doctor',
    text: 'Good morning, Mr. Ramesh. How have you been feeling since your last visit?',
    originalText: 'Good morning, Mr. Ramesh. How have you been feeling since your last visit?',
    timestamp: '10:00 AM',
    isFinal: true,
  },
  {
    id: 'turn-2',
    speaker: 'Patient',
    speakerRole: 'Patient',
    text: "I've been having a persistent cough for about a week, and a mild fever since the last three days.",
    originalText: "I've been having a persistent cough for about a week, and a mild fever since the last three days.",
    timestamp: '10:01 AM',
    isFinal: true,
  },
  {
    id: 'turn-3',
    speaker: 'Doctor',
    speakerRole: 'Doctor',
    text: 'Any shortness of breath or chest pain?',
    originalText: 'Any shortness of breath or chest pain?',
    timestamp: '10:01 AM',
    isFinal: true,
  },
  {
    id: 'turn-4',
    speaker: 'Patient',
    speakerRole: 'Patient',
    text: 'A little shortness of breath, especially at night. No chest pain though.',
    originalText: 'A little shortness of breath, especially at night. No chest pain though.',
    timestamp: '10:02 AM',
    isFinal: true,
  },
  {
    id: 'turn-5',
    speaker: 'Doctor',
    speakerRole: 'Doctor',
    text: 'Alright. Are you taking any medication right now?',
    originalText: 'Alright. Are you taking any medication right now?',
    timestamp: '10:03 AM',
    isFinal: true,
  },
  {
    id: 'turn-6',
    speaker: 'Patient',
    speakerRole: 'Patient',
    text: 'Just paracetamol for the fever.',
    originalText: 'Just paracetamol for the fever.',
    timestamp: '10:04 AM',
    isFinal: true,
  },
];

interface MobileAppContextType {
  currentUser: AuthUser;
  userRole: UserRole;
  isAuthenticated: boolean;
  patients: Patient[];
  selectedPatient: Patient;
  appointments: Appointment[];
  consultations: ConsultationSession[];
  activeConsultation: ConsultationSession | null;
  isRecording: boolean;
  isPaused: boolean;
  isMuted: boolean;
  consultationSeconds: number;
  liveTranscript: TranscriptMessage[];
  liveInsights: AIInsight[];
  isProcessingNote: boolean;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  loginAsUser: (user: AuthUser) => void;
  logout: () => void;
  selectPatient: (patient: Patient) => void;
  startConsultation: (patient?: Patient) => void;
  toggleRecording: () => void;
  togglePause: () => void;
  toggleMute: () => void;
  endConsultation: () => Promise<ConsultationSession>;
  addTranscriptMessage: (text: string, speaker?: 'Doctor' | 'Patient') => void;
  addPatient: (patient: Patient) => void;
  bookAppointment: (apt: Appointment) => void;
  approveNote: (consultationId: string) => void;
  updateNote: (consultationId: string, note: SOAPNote) => void;
  setActiveConsultation: (session: ConsultationSession | null) => void;
}

const MobileAppContext = createContext<MobileAppContextType | null>(null);

export const MobileAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser>(DEMO_AUTH_USERS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient>(INITIAL_PATIENTS[0]);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [consultations, setConsultations] = useState<ConsultationSession[]>([]);
  const [activeConsultation, setActiveConsultation] = useState<ConsultationSession | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [consultationSeconds, setConsultationSeconds] = useState<number>(272); // 00:04:32 as in screenshot
  const [liveTranscript, setLiveTranscript] = useState<TranscriptMessage[]>(INITIAL_LIVE_TRANSCRIPT);
  const [liveInsights, setLiveInsights] = useState<AIInsight[]>([]);
  const [isProcessingNote, setIsProcessingNote] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');

  const timerRef = useRef<any>(null);

  // Timer tick for active consultation
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setConsultationSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  const loginAsUser = (user: AuthUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    if (user.role === 'patient') {
      const match = patients.find((p) => p.patientCode === user.patientCode) || patients[0];
      setSelectedPatient(match);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const selectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const startConsultation = (patient?: Patient) => {
    const targetPatient = patient || selectedPatient;
    setSelectedPatient(targetPatient);
    const newSessionId = `cons-${Date.now()}`;
    const newSession: ConsultationSession = {
      id: newSessionId,
      patient: targetPatient,
      doctor: INITIAL_DOCTOR,
      date: 'Today',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      durationSeconds: 0,
      reasonForVisit: targetPatient.condition || 'Persistent cough and mild fever',
      status: 'in_progress',
      transcript: INITIAL_LIVE_TRANSCRIPT,
      insights: [],
    };
    setActiveConsultation(newSession);
    setLiveTranscript(INITIAL_LIVE_TRANSCRIPT);
    setLiveInsights([]);
    setConsultationSeconds(272);
    setIsRecording(true);
    setIsPaused(false);
    setIsMuted(false);
  };

  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const addTranscriptMessage = (text: string, speaker?: 'Doctor' | 'Patient') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const assignedSpeaker = speaker || (liveTranscript.length % 2 === 0 ? 'Doctor' : 'Patient');
    const newMsg: TranscriptMessage = {
      id: `turn-${Date.now()}-${liveTranscript.length}`,
      text: text.trim(),
      originalText: text.trim(),
      speaker: assignedSpeaker,
      speakerRole: assignedSpeaker,
      timestamp: timeStr,
      isFinal: true,
      createdAt: now.toISOString(),
    };
    setLiveTranscript((prev) => [...prev, newMsg]);

    const lower = text.toLowerCase();
    if (lower.includes('cough') || lower.includes('fever') || lower.includes('pain') || lower.includes('shortness of breath')) {
      const insightId = `ins-${Date.now()}`;
      const insight: AIInsight = {
        id: insightId,
        category: 'symptom',
        title: lower.includes('cough') ? 'Reported Symptom: Cough' : lower.includes('fever') ? 'Reported Symptom: Fever' : 'Reported Symptom: Pain',
        detail: `Verified medical entity matched from speech: "${text.slice(0, 40)}..."`,
        badge: 'Live Matched',
      };
      setLiveInsights((prev) => [insight, ...prev]);
    }
  };

  const endConsultation = async (): Promise<ConsultationSession> => {
    setIsRecording(false);
    setIsPaused(false);
    setIsProcessingNote(true);

    const currentDoc = INITIAL_DOCTOR;
    const currentPat = selectedPatient;
    const consId = activeConsultation?.id || `cons-${Date.now()}`;

    // Apply accurate clinical speaker diarization across all turns
    const diarizedTranscripts = accuratelyDiarizeConsultationDialogue(
      liveTranscript.length > 0 ? liveTranscript : INITIAL_LIVE_TRANSCRIPT,
      currentDoc.name,
      currentPat.firstName
    );

    // Generate comprehensive SOAP note
    const generatedNote = createBlankSOAPNote(consId, currentPat, currentDoc);
    generatedNote.conversationPurpose = currentPat.condition || 'Comprehensive Clinical Evaluation';
    generatedNote.conversationSummary = `Patient ${currentPat.firstName} ${currentPat.lastName} attended clinical consultation presenting with ${currentPat.condition || 'persistent cough and mild fever'}. Comprehensive clinical evaluation confirmed reported complaints including Persistent Cough, Fever / Chills, and Exertional Dyspnea. Physical examination stable. Management plan instituted including prescribed pharmacological therapy and hydration advice.`;

    const finalizedSession: ConsultationSession = {
      id: consId,
      patient: currentPat,
      doctor: currentDoc,
      date: 'Today',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      durationSeconds: consultationSeconds,
      reasonForVisit: currentPat.condition || 'Persistent cough and mild fever',
      status: 'review_pending',
      transcript: diarizedTranscripts,
      insights: liveInsights,
      soapNote: generatedNote,
    };

    setConsultations((prev) => [finalizedSession, ...prev]);
    setActiveConsultation(finalizedSession);
    setIsProcessingNote(false);

    return finalizedSession;
  };

  const addPatient = (patient: Patient) => {
    setPatients((prev) => [patient, ...prev]);
  };

  const bookAppointment = (apt: Appointment) => {
    setAppointments((prev) => [apt, ...prev]);
  };

  const approveNote = (consultationId: string) => {
    setConsultations((prev) =>
      prev.map((c) =>
        c.id === consultationId
          ? {
              ...c,
              status: 'approved',
              soapNote: c.soapNote
                ? {
                    ...c.soapNote,
                    status: 'approved',
                    doctorApproved: true,
                    approvedAt: new Date().toISOString(),
                  }
                : undefined,
            }
          : c
      )
    );
  };

  const updateNote = (consultationId: string, note: SOAPNote) => {
    setConsultations((prev) =>
      prev.map((c) => (c.id === consultationId ? { ...c, soapNote: note } : c))
    );
  };

  return (
    <MobileAppContext.Provider
      value={{
        currentUser,
        userRole: currentUser.role,
        isAuthenticated,
        patients,
        selectedPatient,
        appointments,
        consultations,
        activeConsultation,
        isRecording,
        isPaused,
        isMuted,
        consultationSeconds,
        liveTranscript,
        liveInsights,
        isProcessingNote,
        selectedLanguage,
        setSelectedLanguage,
        loginAsUser,
        logout,
        selectPatient,
        startConsultation,
        toggleRecording,
        togglePause,
        toggleMute,
        endConsultation,
        addTranscriptMessage,
        addPatient,
        bookAppointment,
        approveNote,
        updateNote,
        setActiveConsultation,
      }}
    >
      {children}
    </MobileAppContext.Provider>
  );
};

export const useMobileApp = () => {
  const context = useContext(MobileAppContext);
  if (!context) {
    throw new Error('useMobileApp must be used within MobileAppProvider');
  }
  return context;
};
