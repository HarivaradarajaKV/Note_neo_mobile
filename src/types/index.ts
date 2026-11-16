export type UserRole = 'doctor' | 'admin' | 'receptionist' | 'patient';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  specialty?: string;
  regNumber?: string;
  hospital?: string;
  avatar: string;
  phone?: string;
  department?: string;
  patientCode?: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  regNumber: string;
  email: string;
  avatar: string;
  hospital: string;
}

export interface Patient {
  id: string;
  patientCode: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  allergies: string[];
  existingMedications: string[];
  medicalHistory: string[];
  lastVisit: string;
  avatar?: string;
  condition?: string;
  statusRisk?: 'Under Risk' | 'Moderate' | 'Normal';
  dateAdded?: string;
  detailedDiagnosis?: string;
  tests?: string[];
  treatments?: { value: string; label: string; sub: string }[];
  nextVisitDate?: string;
  nyhaClass?: string;
  assignedDoctorId?: string;
  assignedDoctorName?: string;
}

export interface TranscriptMessage {
  id: string;
  consultationId?: string;
  speakerId?: string;
  speaker: 'Doctor' | 'Patient' | 'Speaker' | 'Unknown';
  speakerRole?: 'Doctor' | 'Patient' | 'Unknown';
  originalTranscript?: string;
  originalText?: string;
  text: string;
  detectedLanguage?: string;
  language?: string;
  englishTranslation?: string;
  englishText?: string;
  startTime?: string;
  endTime?: string;
  isFinal?: boolean;
  confidence?: number;
  timestamp: string;
  highlightKey?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MedicationCandidate {
  name: string;
  dose?: string;
  frequency?: string;
  duration?: string;
  status: 'NEW_PRESCRIPTION_CANDIDATE' | 'CURRENT_MEDICATION' | 'PATIENT_QUESTION';
  rawInstruction?: string;
}

export interface AIInsight {
  id: string;
  category: 'symptom' | 'medication' | 'negative' | 'vitals';
  title: string;
  detail: string;
  badge?: string;
  transcriptId?: string;
  originalPhrase?: string;
  standardTerm?: string;
  terminologyCode?: string;
}

export interface SOAPNote {
  id: string;
  consultationId: string;
  patientId: string;
  doctorId: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'review_required' | 'approved' | 'exported';
  approvedBy?: string;
  approvedAt?: string;
  templateType: string;
  subjective: {
    chiefComplaint: string;
    historyOfPresentIllness: string;
    associatedSymptoms: string[];
    negativeSymptoms: string[];
    medicationsMentioned: string[];
  };
  objective: {
    findings: string[];
    hasObjectiveFindings: boolean;
    note: string;
  };
  assessment: {
    differentialDiagnosis: string[];
    clinicalImpression: string;
    isAIDetermined: boolean;
  };
  plan: {
    recommendedInvestigations: string[];
    prescriptions: string[];
    advice: string[];
    followUp: string;
    hasPlanDiscussed: boolean;
  };
  conversationSummary?: string;
  conversationPurpose?: string;
  patientProblems?: Array<{ problem: string; duration?: string; severity?: string; onset?: string }>;
  doctorFindings?: string[];
  keywords?: string[];
  prescriptionDraft?: Array<{ name: string; dose?: string; frequency?: string; route?: string; duration?: string; instructions?: string; isAIDraft?: boolean }>;
}

export interface ConsultationSession {
  id: string;
  patient: Patient;
  doctor: Doctor;
  date: string;
  time: string;
  durationSeconds: number;
  reasonForVisit: string;
  status: 'in_progress' | 'paused' | 'processing' | 'review_required' | 'approved' | 'exported';
  transcript: TranscriptMessage[];
  insights: AIInsight[];
  note?: SOAPNote;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientCode: string;
  patientAvatar?: string;
  time: string;
  date: string;
  reason: string;
  type: 'In-Person' | 'Telehealth' | 'Follow-up';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  room?: string;
  doctorName?: string;
}

export interface TemplateItem {
  id: string;
  name: string;
  specialty: string;
  description: string;
  sections: string[];
  isDefault?: boolean;
}

export interface AuditLogItem {
  id: string;
  user: string;
  role: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
}

