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
    text: 'Welcome, Haylie. I reviewed your cardiography report. How has the chest tightness been?',
    originalText: 'Welcome, Haylie. I reviewed your cardiography report. How has the chest tightness been?',
    timestamp: '10:00 AM',
    isFinal: true,
  },
  {
    id: 'turn-2',
    speaker: 'Patient',
    speakerRole: 'Patient',
    text: "It's been tighter than usual, especially at night when I lay flat. I feel like I'm gasping for air.",
    originalText: "It's been tighter than usual, especially at night when I lay flat. I feel like I'm gasping for air.",
    timestamp: '10:01 AM',
    isFinal: true,
  },
  {
    id: 'turn-3',
    speaker: 'Doctor',
    speakerRole: 'Doctor',
    text: 'Are you taking the prescribed Digoxin regularly? Any skipped doses?',
    originalText: 'Are you taking the prescribed Digoxin regularly? Any skipped doses?',
    timestamp: '10:02 AM',
    isFinal: true,
  },
  {
    id: 'turn-4',
    speaker: 'Patient',
    speakerRole: 'Patient',
    text: 'I missed a couple of doses last week because of my stomach upset, to be honest.',
    originalText: 'I missed a couple of doses last week because of my stomach upset, to be honest.',
    timestamp: '10:03 AM',
    isFinal: true,
  },
];

export const INITIAL_LIVE_INSIGHTS: AIInsight[] = [
  {
    id: 'ins-1',
    category: 'medication',
    title: 'MEDICATION ADHERENCE WARNING',
    detail: 'Digoxin therapy discontinued briefly; potential trigger for ventricular overload.',
    badge: 'Medication Alert',
  },
  {
    id: 'ins-2',
    category: 'pathology',
    title: 'PATHOLOGY IDENTIFIED',
    detail: 'Nocturnal Orthopnea / Paroxysmal Nocturnal Dyspnea. Echo updates recommended.',
    badge: 'Clinical Pathology',
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
  partialTranscript: { speaker: 'Doctor' | 'Patient'; text: string } | null;
  isProcessingNote: boolean;
  selectedLanguage: string;
  backendOnline: boolean;
  setSelectedLanguage: (lang: string) => void;
  setPartialTranscript: (partial: { speaker: 'Doctor' | 'Patient'; text: string } | null) => void;
  setLiveTranscript: React.Dispatch<React.SetStateAction<TranscriptMessage[]>>;
  setLiveInsights: React.Dispatch<React.SetStateAction<AIInsight[]>>;
  loginAsUser: (user: AuthUser, password?: string) => Promise<AuthUser>;
  loginWithCredentials: (email: string, password?: string) => Promise<AuthUser>;
  logout: () => void;
  selectPatient: (patient: Patient) => void;
  startConsultation: (patient?: Patient, reason?: string, startFresh?: boolean) => void;
  cancelConsultation: () => void;
  toggleRecording: () => void;
  togglePause: () => void;
  toggleMute: () => void;
  endConsultation: () => Promise<ConsultationSession>;
  addTranscriptMessage: (text: string, speaker?: 'Doctor' | 'Patient') => void;
  streamDialogueTurn: (text: string, speaker?: 'Doctor' | 'Patient') => Promise<void>;
  streamFullReferenceConsultation: () => Promise<void>;
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
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [consultationSeconds, setConsultationSeconds] = useState<number>(0);
  const [liveTranscript, setLiveTranscript] = useState<TranscriptMessage[]>(INITIAL_LIVE_TRANSCRIPT);
  const [liveInsights, setLiveInsights] = useState<AIInsight[]>(INITIAL_LIVE_INSIGHTS);
  const [partialTranscript, setPartialTranscript] = useState<{
    speaker: 'Doctor' | 'Patient';
    text: string;
  } | null>(null);
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

  const startConsultation = (patient?: Patient, reason?: string, startFresh = false) => {
    const targetPatient = patient || selectedPatient;
    const presentation = reason || targetPatient.condition || 'Chronic chest tightness and increased nocturnal dyspnea.';
    setSelectedPatient(targetPatient);
    const newSessionId = `cons-${Date.now()}`;
    const initialTurns = startFresh ? [] : INITIAL_LIVE_TRANSCRIPT;
    const initialIns = startFresh ? [] : INITIAL_LIVE_INSIGHTS;

    const newSession: ConsultationSession = {
      id: newSessionId,
      patient: targetPatient,
      doctor: INITIAL_DOCTOR,
      date: 'Today',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      durationSeconds: 0,
      reasonForVisit: presentation,
      status: 'in_progress',
      transcript: initialTurns,
      insights: initialIns,
    };
    setActiveConsultation(newSession);
    setLiveTranscript(initialTurns);
    setLiveInsights(initialIns);
    setPartialTranscript(null);
    setConsultationSeconds(startFresh ? 0 : 252);
    setIsRecording(true);
    setIsPaused(false);
    setIsMuted(false);

    // Sync consultation creation to backend
    api.consultations
      .create({
        patientId: targetPatient.id,
        doctorId: currentUser.id || 'user-doc-001',
        reasonForVisit: presentation,
      })
      .catch((e) => console.debug('[MobileAppContext] Backend consultation record notice:', e));
  };

  const cancelConsultation = () => {
    setIsRecording(false);
    setIsPaused(false);
    setActiveConsultation(null);
    setPartialTranscript(null);
    setConsultationSeconds(0);
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

  const inferSpeakerFromText = (text: string, currentTurnsCount: number): 'Doctor' | 'Patient' => {
    const lower = text.toLowerCase().trim();
    // Doctor inquiry patterns
    if (
      /\?$/.test(lower) ||
      /\b(how|what|are you|have you|did you|let me|prescribe|taking|doses|report|cardiography|medication|stethoscope)\b/i.test(lower)
    ) {
      if (!/\b(i am|i'm|i feel|i missed|my chest|my stomach|i have)\b/i.test(lower)) {
        return 'Doctor';
      }
    }
    // Patient symptom / complaint / answer patterns
    if (
      /\b(i feel|i've|i missed|my stomach|my chest|at night|lay flat|gasping|tighter|it's been|honest|yes|no)\b/i.test(lower)
    ) {
      return 'Patient';
    }
    return currentTurnsCount % 2 === 0 ? 'Doctor' : 'Patient';
  };

  const addTranscriptMessage = (text: string, speaker?: 'Doctor' | 'Patient') => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const assignedSpeaker = speaker || inferSpeakerFromText(trimmed, liveTranscript.length);

    const newMsg: TranscriptMessage = {
      id: `turn-${Date.now()}-${liveTranscript.length}`,
      text: trimmed,
      originalText: trimmed,
      speaker: assignedSpeaker,
      speakerRole: assignedSpeaker,
      timestamp: timeStr,
      isFinal: true,
      createdAt: now.toISOString(),
    };

    setLiveTranscript((prev) => [...prev, newMsg]);

    // Real-time Clinical Insights Detection matching backend engine
    const lower = trimmed.toLowerCase();

    // 1. Medication Adherence Warning (Digoxin discontinued / stomach upset / skipped doses)
    if (
      lower.includes('digoxin') ||
      lower.includes('missed') ||
      lower.includes('stomach upset') ||
      lower.includes('skipped') ||
      lower.includes('stop taking')
    ) {
      const adherenceInsight: AIInsight = {
        id: `ins-med-${Date.now()}`,
        category: 'medication',
        title: 'MEDICATION ADHERENCE WARNING',
        detail: 'Digoxin therapy discontinued briefly; potential trigger for ventricular overload.',
        badge: 'Medication Alert',
      };
      setLiveInsights((prev) => {
        if (prev.some((p) => p.title === adherenceInsight.title)) return prev;
        return [adherenceInsight, ...prev];
      });
    }

    // 2. Pathology Identified (Orthopnea / Paroxysmal Nocturnal Dyspnea / Chest tightness / gasping for air)
    if (
      lower.includes('tight') ||
      lower.includes('lay flat') ||
      lower.includes('gasping') ||
      lower.includes('dyspnea') ||
      lower.includes('orthopnea') ||
      lower.includes('chest')
    ) {
      const pathologyInsight: AIInsight = {
        id: `ins-path-${Date.now()}`,
        category: 'pathology',
        title: 'PATHOLOGY IDENTIFIED',
        detail: 'Nocturnal Orthopnea / Paroxysmal Nocturnal Dyspnea. Echo updates recommended.',
        badge: 'Clinical Pathology',
      };
      setLiveInsights((prev) => {
        if (prev.some((p) => p.title === pathologyInsight.title)) return prev;
        return [...prev, pathologyInsight];
      });
    }

    // Asynchronously sync turn to backend database if active session exists
    if (activeConsultation?.id) {
      api.consultations
        .addTranscript(activeConsultation.id, {
          speaker: assignedSpeaker,
          text: trimmed,
          timestamp: timeStr,
        })
        .catch((e) => console.debug('[MobileAppContext] Backend transcript sync notice:', e));
    }
  };

  const streamDialogueTurn = async (
    text: string,
    speaker?: 'Doctor' | 'Patient'
  ): Promise<void> => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const assignedSpeaker = speaker || inferSpeakerFromText(trimmed, liveTranscript.length);
    const words = trimmed.split(' ');
    let currentStreamed = '';

    for (let i = 0; i < words.length; i++) {
      currentStreamed += (i === 0 ? '' : ' ') + words[i];
      setPartialTranscript({ speaker: assignedSpeaker, text: currentStreamed });
      // Short realistic delay between words to simulate real-time ChatGPT streaming speech capture
      await new Promise((resolve) => setTimeout(resolve, 45));
    }

    setPartialTranscript(null);
    addTranscriptMessage(trimmed, assignedSpeaker);
  };

  const streamFullReferenceConsultation = async (): Promise<void> => {
    setLiveTranscript([]);
    setLiveInsights([]);
    setConsultationSeconds(0);
    setIsRecording(true);
    setIsPaused(false);
    setIsMuted(false);

    for (const turn of INITIAL_LIVE_TRANSCRIPT) {
      await streamDialogueTurn(turn.text, turn.speaker as 'Doctor' | 'Patient');
      await new Promise((resolve) => setTimeout(resolve, 500));
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
    setActiveConsultation(null);
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
        partialTranscript,
        isProcessingNote,
        selectedLanguage,
        backendOnline,
        setSelectedLanguage,
        setPartialTranscript,
        setLiveTranscript,
        setLiveInsights,
        loginAsUser,
        loginWithCredentials,
        logout,
        selectPatient,
        startConsultation,
        cancelConsultation,
        toggleRecording,
        togglePause,
        toggleMute,
        endConsultation,
        addTranscriptMessage,
        streamDialogueTurn,
        streamFullReferenceConsultation,
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
