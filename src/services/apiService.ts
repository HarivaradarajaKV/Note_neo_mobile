import {
  AuthUser,
  Patient,
  Doctor,
  ConsultationSession,
  SOAPNote,
  TranscriptMessage,
  AIInsight,
} from '../types';

export const API_BASE_URL = 'https://health-care-backend-gilt.vercel.app/api';

class ApiService {
  private token: string | null = null;

  public setToken(token: string | null) {
    this.token = token;
  }

  public getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.headers) {
      Object.assign(headers, options.headers as Record<string, string>);
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error?.message || `HTTP Error ${response.status}`);
      }

      return data.data !== undefined ? data.data : data;
    } catch (error) {
      console.warn(`[Mobile ApiService] Call to ${endpoint} failed:`, error);
      throw error;
    }
  }

  // Health check
  public async checkHealth(): Promise<{ status: string; database?: { connected: boolean } }> {
    return this.request<{ status: string; database?: { connected: boolean } }>('/health');
  }

  // Authentication endpoints
  public auth = {
    login: async (
      email: string,
      password = 'Doctor@123'
    ): Promise<{ user: AuthUser; token: string }> => {
      const res = await this.request<{ user: AuthUser; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res?.token) {
        this.setToken(res.token);
      }
      return res;
    },

    getUsers: async (): Promise<AuthUser[]> => {
      return this.request<AuthUser[]>('/auth/users');
    },

    getDoctors: async (): Promise<AuthUser[]> => {
      const users = await this.request<AuthUser[]>('/auth/users');
      return (users || []).filter(
        (u) => (u.role as string)?.toLowerCase() === 'doctor'
      );
    },
  };

  // Doctors endpoints
  public doctors = {
    getMe: async (): Promise<Doctor> => {
      return this.request<Doctor>('/doctors/me');
    },

    getMyPatients: async (): Promise<Patient[]> => {
      return this.request<Patient[]>('/doctors/me/patients');
    },

    getMySchedule: async (): Promise<any[]> => {
      return this.request<any[]>('/doctors/me/schedule');
    },

    getMyConsultations: async (): Promise<ConsultationSession[]> => {
      return this.request<ConsultationSession[]>('/doctors/me/consultations');
    },

    getMyNotes: async (): Promise<SOAPNote[]> => {
      return this.request<SOAPNote[]>('/doctors/me/notes');
    },

    getAll: async (): Promise<Doctor[]> => {
      return this.request<Doctor[]>('/doctors');
    },

    createAppointment: async (payload: {
      patientId: string;
      doctorId: string;
      date?: string;
      time?: string;
      reasonForVisit?: string;
    }): Promise<any> => {
      return this.request<any>('/doctors/appointments', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
  };

  // Patients endpoints
  public patients = {
    getAll: async (): Promise<Patient[]> => {
      return this.request<Patient[]>('/patients');
    },

    getById: async (id: string): Promise<Patient> => {
      return this.request<Patient>(`/patients/${id}`);
    },

    create: async (
      patient: Omit<Patient, 'id' | 'patientCode' | 'lastVisit'>
    ): Promise<Patient> => {
      return this.request<Patient>('/patients', {
        method: 'POST',
        body: JSON.stringify(patient),
      });
    },

    update: async (id: string, patient: Partial<Patient>): Promise<Patient> => {
      return this.request<Patient>(`/patients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(patient),
      });
    },
  };

  // Consultations endpoints
  public consultations = {
    getAll: async (): Promise<ConsultationSession[]> => {
      return this.request<ConsultationSession[]>('/consultations');
    },

    getById: async (id: string): Promise<ConsultationSession> => {
      return this.request<ConsultationSession>(`/consultations/${id}`);
    },

    create: async (payload: {
      patientId: string;
      doctorId?: string;
      reasonForVisit?: string;
      date?: string;
      time?: string;
    }): Promise<ConsultationSession> => {
      return this.request<ConsultationSession>('/consultations', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },

    update: async (
      id: string,
      updates: Partial<ConsultationSession>
    ): Promise<ConsultationSession> => {
      return this.request<ConsultationSession>(`/consultations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },

    addTranscript: async (
      id: string,
      msg: Partial<TranscriptMessage>
    ): Promise<TranscriptMessage> => {
      return this.request<TranscriptMessage>(`/consultations/${id}/transcript`, {
        method: 'POST',
        body: JSON.stringify(msg),
      });
    },

    addInsight: async (id: string, insight: Partial<AIInsight>): Promise<AIInsight> => {
      return this.request<AIInsight>(`/consultations/${id}/insights`, {
        method: 'POST',
        body: JSON.stringify(insight),
      });
    },
  };

  // SOAP Notes endpoints
  public notes = {
    getByConsultation: async (consultationId: string): Promise<SOAPNote> => {
      return this.request<SOAPNote>(`/notes/consultation/${consultationId}`);
    },

    save: async (consultationId: string, note: Partial<SOAPNote>): Promise<SOAPNote> => {
      return this.request<SOAPNote>(`/notes/consultation/${consultationId}`, {
        method: 'PUT',
        body: JSON.stringify(note),
      });
    },

    approve: async (id: string, approvedBy: string): Promise<SOAPNote> => {
      return this.request<SOAPNote>(`/notes/${id}/approve`, {
        method: 'POST',
        body: JSON.stringify({ approvedBy }),
      });
    },
  };

  // OpenAI / AI Scribe Clinical Processing endpoints
  public openai = {
    saveTranscripts: async (
      consultationId: string,
      transcripts: TranscriptMessage[]
    ): Promise<any> => {
      return this.request<any>(`/openai/transcripts/${consultationId}`, {
        method: 'POST',
        body: JSON.stringify({ transcripts }),
      });
    },

    processConsultation: async (
      consultationId: string,
      transcripts: TranscriptMessage[],
      patient: Patient,
      doctor: Doctor
    ): Promise<any> => {
      return this.request<any>(`/openai/process/${consultationId}`, {
        method: 'POST',
        body: JSON.stringify({ transcripts, patient, doctor }),
      });
    },

    approveConsultation: async (consultationId: string, doctorId: string): Promise<any> => {
      return this.request<any>(`/openai/approve/${consultationId}`, {
        method: 'POST',
        body: JSON.stringify({ doctorId }),
      });
    },

    finalizeAndProcess: async (payload: {
      consultationId: string;
      transcripts: TranscriptMessage[];
      totalAudioSec?: number;
    }): Promise<any> => {
      return this.request<any>('/openai/finalize-and-process', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
  };
}

export const api = new ApiService();
