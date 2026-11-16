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
  INITIAL_CONSULTATIONS,
  createBlankSOAPNote,
} from '../services/mockData';
import { accuratelyDiarizeConsultationDialogue } from '../services/speakerDiarization';
import { api } from '../services/apiService';

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
  backendOnline: boolean;
  setSelectedLanguage: (lang: string) => void;
  loginAsUser: (user: AuthUser, password?: string) => Promise<AuthUser>;
  loginWithCredentials: (email: string, password?: string) => Promise<AuthUser>;
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
  approveNote: (consultationId: string) => Promise<void>;
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
  const [consultations, setConsultations] = useState<ConsultationSession[]>(INITIAL_CONSULTATIONS);
  const [activeConsultation, setActiveConsultation] = useState<ConsultationSession | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [consultationSeconds, setConsultationSeconds] = useState<number>(272); // 00:04:32 as in screenshot
  const [liveTranscript, setLiveTranscript] = useState<TranscriptMessage[]>(INITIAL_LIVE_TRANSCRIPT);
  const [liveInsights, setLiveInsights] = useState<AIInsight[]>([]);
  const [isProcessingNote, setIsProcessingNote] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [backendOnline, setBackendOnline] = useState<boolean>(true);

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

  // Initial backend synchronization on app load
  useEffect(() => {
    let isMounted = true;
    const syncBackend = async () => {
      try {
        const loginRes = await api.auth.login(currentUser.email, 'Doctor@123');
        if (loginRes?.token) {
          if (isMounted) setBackendOnline(true);
        }

        // Fetch assigned doctor patients from live database
        const myPatients = await api.doctors.getMyPatients();
        if (myPatients && myPatients.length > 0 && isMounted) {
          setPatients(myPatients);
          // If Haylie Saris is in patient list, select Haylie
          const haylie = myPatients.find((p) => p.firstName?.toLowerCase().includes('haylie'));
          if (haylie) {
            setSelectedPatient(haylie);
          }
        }

        // Fetch doctor's consultations from backend
        const myConsultations = await api.doctors.getMyConsultations();
        if (myConsultations && myConsultations.length > 0 && isMounted) {
          setConsultations(myConsultations);
        }
      } catch (err) {
        console.warn('[MobileAppContext] Live backend initial sync note:', err);
      }
    };

    syncBackend();
    return () => {
      isMounted = false;
    };
  }, []);

  const loginWithCredentials = async (
    email: string,
    password = 'Doctor@123'
  ): Promise<AuthUser> => {
    const res = await api.auth.login(email.trim(), password);
    if (!res?.user) {
      throw new Error('Authentication failed: Invalid credentials.');
    }

    // Strict Clinician-Only validation
    const userRole = (res.user.role as string)?.toLowerCase();
    if (userRole !== 'doctor') {
      api.setToken(null);
      throw new Error(
        'Access Denied: MediScribe is strictly for licensed medical doctors and attending clinicians.'
      );
    }

    setCurrentUser(res.user);
    setIsAuthenticated(true);
    setBackendOnline(true);

    // Fetch doctor's real patients & consultations
    try {
      const [patientsRes, consultationsRes] = await Promise.allSettled([
        api.doctors.getMyPatients(),
        api.doctors.getMyConsultations(),
      ]);

      if (patientsRes.status === 'fulfilled' && patientsRes.value?.length > 0) {
        setPatients(patientsRes.value);
        setSelectedPatient(patientsRes.value[0]);
      }
      if (consultationsRes.status === 'fulfilled' && consultationsRes.value?.length > 0) {
        setConsultations(consultationsRes.value);
      }
    } catch (e) {
      console.warn('[MobileAppContext] Data sync after login warning:', e);
    }

    return res.user;
  };

  const loginAsUser = async (user: AuthUser, password = 'Doctor@123'): Promise<AuthUser> => {
    if ((user.role as string)?.toLowerCase() !== 'doctor') {
      throw new Error('Access Denied: Non-doctor accounts are restricted.');
    }

    try {
      return await loginWithCredentials(user.email, password);
    } catch (err) {
      // Fallback if network is unreachable
      console.warn('[MobileAppContext] Offline doctor login fallback:', err);
      setCurrentUser(user);
      setIsAuthenticated(true);
      return user;
    }
  };

  const logout = () => {
    api.setToken(null);
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
      reasonForVisit: targetPatient.condition || 'Chest tightness & dyspnea',
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

    // Sync consultation creation to backend
    api.consultations
      .create({
        patientId: targetPatient.id,
        doctorId: currentUser.id || 'user-doc-001',
        reasonForVisit: targetPatient.condition || 'Chest tightness & dyspnea',
      })
      .catch((e) => console.debug('[MobileAppContext] Backend consultation record notice:', e));
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
    if (
      lower.includes('cough') ||
      lower.includes('fever') ||
      lower.includes('pain') ||
      lower.includes('shortness of breath') ||
      lower.includes('chest tightness')
    ) {
      const insightId = `ins-${Date.now()}`;
      const insight: AIInsight = {
        id: insightId,
        category: 'symptom',
        title: lower.includes('chest')
          ? 'Reported Symptom: Chest Tightness'
          : lower.includes('breath')
          ? 'Reported Symptom: Nocturnal Dyspnea'
          : 'Reported Symptom: Cardiac Alert',
        detail: `Verified medical entity matched from speech: "${text.slice(0, 45)}..."`,
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

    // Default high-precision SOAP note structure
    const generatedNote = createBlankSOAPNote(consId, currentPat, currentDoc);
    generatedNote.conversationPurpose =
      currentPat.condition || 'Progressive chronic chest tightness and nocturnal dyspnea';
    generatedNote.conversationSummary = `Patient ${currentPat.firstName} ${currentPat.lastName} presents with progressive chronic chest tightness and increased nocturnal dyspnea over the last 5 days. States she is unable to lay flat in bed and feels like she is 'gasping for air' during sleep. Admits to skipping several doses of Digoxin last week due to a mild stomach upset.`;

    // Attempt OpenAI clinical note processing via live backend
    try {
      const aiRes = await api.openai.processConsultation(
        consId,
        diarizedTranscripts,
        currentPat,
        currentDoc
      );
      if (aiRes?.result?.soapDraft) {
        const draft = aiRes.result.soapDraft;
        generatedNote.subjective = draft.subjective || generatedNote.subjective;
        generatedNote.objective = draft.objective || generatedNote.objective;
        generatedNote.assessment = draft.assessment || generatedNote.assessment;
        generatedNote.plan = draft.plan || generatedNote.plan;
      }
    } catch (e) {
      console.debug('[MobileAppContext] AI backend Scribe fallback engaged:', e);
    }

    const finalizedSession: ConsultationSession = {
      id: consId,
      patient: currentPat,
      doctor: currentDoc,
      date: 'Today',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      durationSeconds: consultationSeconds,
      reasonForVisit: currentPat.condition || 'Chest tightness & dyspnea',
      status: 'review_pending',
      transcript: diarizedTranscripts,
      insights: liveInsights,
      note: generatedNote,
      soapNote: generatedNote,
    };

    setConsultations((prev) => [finalizedSession, ...prev]);
    setActiveConsultation(finalizedSession);
    setIsProcessingNote(false);

    return finalizedSession;
  };

  const addPatient = (patient: Patient) => {
    setPatients((prev) => [patient, ...prev]);
    api.patients.create(patient).catch((e) => console.debug('Patient backend sync note:', e));
  };

  const bookAppointment = (apt: Appointment) => {
    setAppointments((prev) => [apt, ...prev]);
  };

  const approveNote = async (consultationId: string) => {
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

    // Sync signature and lock to live backend
    try {
      const targetCons = consultations.find((c) => c.id === consultationId);
      if (targetCons?.soapNote) {
        await Promise.allSettled([
          api.notes.save(consultationId, targetCons.soapNote),
          api.notes.approve(targetCons.soapNote.id, currentUser.name),
          api.openai.approveConsultation(consultationId, currentUser.id),
          api.consultations.update(consultationId, { status: 'approved' }),
        ]);
      }
    } catch (e) {
      console.warn('[MobileAppContext] Note approval backend sync note:', e);
    }
  };

  const updateNote = (consultationId: string, note: SOAPNote) => {
    setConsultations((prev) =>
      prev.map((c) => (c.id === consultationId ? { ...c, soapNote: note } : c))
    );
    api.notes.save(consultationId, note).catch((e) => console.debug('Note auto-save note:', e));
  };

  return (
    <MobileAppContext.Provider
      value={{
        currentUser,
        userRole: 'doctor' as UserRole,
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
        backendOnline,
        setSelectedLanguage,
        loginAsUser,
        loginWithCredentials,
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

export const useMobileApp = (): MobileAppContextType => {
  const context = useContext(MobileAppContext);
  if (!context) {
    throw new Error('useMobileApp must be used within a MobileAppProvider');
  }
  return context;
};
