# Note Neo - Mobile Application (React Native / Expo SDK 58)

A comprehensive cross-platform mobile application for **Note Neo (Pivot Clinical AI)**, providing ambient medical consultation scribing, dual-channel multilingual transcription, verified Doctor vs. Patient speaker diarization, real-time clinical terminology matching, and complete SOAP note review.

Built on **Expo SDK 58**, compatible with **Expo Go (SDK 58)**, iOS, and Android.

---

## 📱 Mobile Architecture & Screens

The mobile application translates all clinical, patient, and administrative screens from the web application into a touch-optimized mobile experience:

### 1. Doctor & Clinician Experience
- **AuthScreen** (`src/screens/auth/AuthScreen.tsx`): 1-tap quick role switcher for Doctor, Patient, Receptionist, and Admin.
- **DashboardScreen** (`src/screens/dashboard/DashboardScreen.tsx`): Overview with hero *"Start Live Consultation Scribing"* card, OPD stats, today's schedule, and pending note reviews.
- **LiveConsultationScreen** (`src/screens/consultation/LiveConsultationScreen.tsx`): Ambient scribing interface with live pulsing waveform, timer, language selector (English, Kannada, Hindi, Tamil, Telugu), real-time dialogue turns, terminology entity pills, and instant *"End Consultation & Generate Note"* action.
- **NewConsultationScreen** (`src/screens/consultation/NewConsultationScreen.tsx`): Patient selector, presentation / visit reason input, and ambient mic vs. audio upload mode.
- **ConsultationsListScreen** (`src/screens/consultation/ConsultationsListScreen.tsx`): Full consultation history with search, status filters (Needs Review, Approved), and tap to review.
- **ClinicalNoteReviewScreen** (`src/screens/review/ClinicalNoteReviewScreen.tsx`): Complete mobile SOAP note review with:
  - **SOAP Note Tab**: Subjective, Objective, Assessment, and Plan with pertinent negatives and findings.
  - **Transcript Tab**: Unified verbatim paragraph and turn-by-turn dialogue with verified Doctor vs. Patient speaker attribution.
  - **Rx Draft Tab**: Prescription candidates with dosage, frequency, route, and instructions.
  - **One-Tap Actions**: Digital signature approval & note export/sharing.
- **PatientsScreen & PatientDetailScreen** (`src/screens/patients/`): Directory of OPD patients, risk status, allergies, baseline medications, chronic history, and registration modal.
- **ScheduleScreen** (`src/screens/schedule/ScheduleScreen.tsx`): Day-by-day appointment timeline with 1-tap consultation launch and booking modal.
- **NotesListScreen** (`src/screens/notes/NotesListScreen.tsx`): All clinical notes across patients with status tracking.
- **TemplatesScreen** (`src/screens/templates/TemplatesScreen.tsx`): Specialty documentation templates (General, Cardiology, Pulmonology, Pediatrics).
- **AnalyticsScreen** (`src/screens/analytics/AnalyticsScreen.tsx`): Scribing efficiency, clinical hours saved, diarization accuracy, and multilingual breakdown.
- **SettingsScreen** (`src/screens/settings/SettingsScreen.tsx`): Clinician profile, clinic info, microphone auto-gain boost, language selection, and sign-out.

### 2. Patient Portal Experience (When logged in as Patient)
- **PatientDashboardScreen**: Personalized greeting, upcoming appointments banner, active medicines, allergy alerts.
- **PatientVisitsScreen**: Patient-friendly visit summaries, physician instructions, and follow-up precautions.
- **PatientPrescriptionsScreen**: Digital prescription cards with directions and dosages.
- **PatientHealthRecordsScreen**: Latest vital signs, lab reports, and allergy logs.
- **PatientMessagesScreen**: Secure two-way messaging with the attending doctor.
- **PatientScheduleScreen**: Book and manage upcoming clinical visits.

### 3. Clinic Administration (When logged in as Admin)
- **AdminDashboardScreen**: Facility overview and system health monitoring.
- **TeamAccessScreen**: Role-based access control for doctors, receptionists, and staff.
- **ClinicManagementScreen**: Consultation room management and equipment status.
- **AuditLogScreen**: Tamper-evident HIPAA compliance logs.
- **TerminologyTrainingScreen**: Medical dictionary verification, stopwords protection, and CSV ingestion stats.

---

## 🚀 Getting Started with Expo Go (SDK 58)

### Prerequisites
- Node.js (v18+)
- Expo Go App on Android or iOS (SDK 58)

### Installation
```bash
git clone https://github.com/Harivaradarajakv/Note_neo_mobile.git
cd Note_neo_mobile
npm install
```

### Running the App
```bash
# Start Expo development server
npx expo start

# Or with specific platforms
npx expo start --android
npx expo start --ios
npx expo start --web
```
Scan the QR code in the terminal with the **Expo Go** app on your phone.
