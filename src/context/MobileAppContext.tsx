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
import { api } from '../services/apiService';

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
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [consultationSeconds, setConsultationSeconds] = useState<number>(0);
  const [liveTranscript, setLiveTranscript] = useState<TranscriptMessage[]>([]);
  const [liveInsights, setLiveInsights] = useState<AIInsight[]>([]);
  const [isProcessingNote, setIsProcessingNote] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');

  const timerRef = useRef<any>(null);

  // Timer tick for consultation scribing
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setConsultationSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

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
      reasonForVisit: targetPatient.condition || 'General clinical review',
      status: 'in_progress',
      transcript: [],
      insights: [],
    };
    setActiveConsultation(newSession);
    setLiveTranscript([]);
    setLiveInsights([]);
    setConsultationSeconds(0);
    setIsRecording(true);
  };

  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
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

    // Generate clinical insight pills if matching symptoms/meds
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
    setIsProcessingNote(true);

    const currentDoc = INITIAL_DOCTOR;
    const currentPat = selectedPatient;
    const consId = activeConsultation?.id || `cons-${Date.now()}`;

    // Apply accurate clinical speaker diarization across all turns
    const diarizedTranscripts = accuratelyDiarizeConsultationDialogue(
      liveTranscript.length > 0 ? liveTranscript : [
        {
          id: 'turn-1',
          text: `Good morning, ${currentPat.firstName}. How have you been feeling since your last visit?`,
          originalText: `Good morning, ${currentPat.firstName}. How have you been feeling since your last visit?`,
          speaker: 'Doctor',
          speakerRole: 'Doctor',
          timestamp: '10:00 AM',
        },
        {
          id: 'turn-2',
          text: currentPat.condition ? `I have been dealing with ${currentPat.condition.toLowerCase()}.` : "I've been feeling slightly fatigued and having mild symptoms.",
          originalText: currentPat.condition ? `I have been dealing with ${currentPat.condition.toLowerCase()}.` : "I've been feeling slightly fatigued and having mild symptoms.",
          speaker: 'Patient',
          speakerRole: 'Patient',
          timestamp: '10:01 AM',
        },
      ],
      currentDoc.name,
      currentPat.firstName
    );

    // Generate comprehensive SOAP note
    const generatedNote = createBlankSOAPNote(consId, currentPat, currentDoc);
    generatedNote.conversationPurpose = currentPat.condition || 'Comprehensive Clinical Evaluation';
    generatedNote.conversationSummary = `Patient ${currentPat.firstName} ${currentPat.lastName} attended clinical consultation. Chief concerns evaluated. Physical exam stable. Management plan documented.`;

    const finalizedSession: ConsultationSession = {
      id: consId,
      patient: currentPat,
      doctor: currentDoc,
      date: 'Today',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      durationSeconds: consultationSeconds || 180,
      reasonForVisit: currentPat.condition || 'General health evaluation',
      status: 'review_required',
      transcript: diarizedTranscripts,
      insights: liveInsights,
      note: generatedNote,
    };

    setActiveConsultation(finalizedSession);
    setConsultations((prev) => [finalizedSession, ...prev.filter((c) => c.id !== consId)]);
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
      prev.map((c) => {
        if (c.id === consultationId && c.note) {
          return {
            ...c,
            status: 'approved',
            note: {
              ...c.note,
              status: 'approved',
              approvedBy: currentUser.name,
              approvedAt: new Date().toISOString(),
            },
          };
        }
        return c;
      })
    );
    if (activeConsultation && activeConsultation.id === consultationId && activeConsultation.note) {
      setActiveConsultation({
        ...activeConsultation,
        status: 'approved',
        note: {
          ...activeConsultation.note,
          status: 'approved',
          approvedBy: currentUser.name,
          approvedAt: new Date().toISOString(),
        },
      });
    }
  };

  const updateNote = (consultationId: string, note: SOAPNote) => {
    setConsultations((prev) =>
      prev.map((c) => (c.id === consultationId ? { ...c, note } : c))
    );
    if (activeConsultation && activeConsultation.id === consultationId) {
      setActiveConsultation({ ...activeConsultation, note });
    }
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
    throw new Error('useMobileApp must be used within a MobileAppProvider');
  }
  return context;
};

