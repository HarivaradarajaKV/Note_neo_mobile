import { Patient, Doctor, SOAPNote, TranscriptMessage, ConsultationSession } from '../types';

const API_BASE_URL = 'http://localhost:5001/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error [${response.status}]: ${errorText || response.statusText}`);
  }

  return response.json();
}

export const api = {
  consultations: {
    list: () => request<ConsultationSession[]>('/consultations'),
    get: (id: string) => request<ConsultationSession>(`/consultations/${id}`),
    create: (data: Partial<ConsultationSession>) => request<ConsultationSession>('/consultations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: Partial<ConsultationSession>) => request<ConsultationSession>(`/consultations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  },
  patients: {
    list: () => request<Patient[]>('/patients'),
    get: (id: string) => request<Patient>(`/patients/${id}`),
    create: (data: Partial<Patient>) => request<Patient>('/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  },
  notes: {
    get: (consultationId: string) => request<SOAPNote>(`/notes/${consultationId}`),
    save: (consultationId: string, note: Partial<SOAPNote>) => request<SOAPNote>(`/notes/${consultationId}`, {
      method: 'PUT',
      body: JSON.stringify(note),
    }),
    approve: (noteId: string, doctorName: string) => request<{ success: boolean; approvedAt: string }>(`/notes/${noteId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ doctorName }),
    }),
  },
  openai: {
    processConsultation: (consultationId: string, transcripts: TranscriptMessage[], patientInfo?: any, doctorInfo?: any) =>
      request<any>('/openai/process-consultation', {
        method: 'POST',
        body: JSON.stringify({ consultationId, transcripts, patientInfo, doctorInfo }),
      }),
    finalizeAndProcess: (payload: { consultationId: string; transcripts: TranscriptMessage[]; totalAudioSec?: number }) =>
      request<any>('/openai/finalize-and-process', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },
};

