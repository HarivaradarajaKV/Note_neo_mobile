import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';
import { Appointment } from '../../types';

interface Props {
  navigation: any;
}

interface WeekDayItem {
  id: string;
  dayLetter: string;
  dateNum: string;
  fullDate: string;
}

const WEEK_DAYS: WeekDayItem[] = [
  { id: 'mon', dayLetter: 'M', dateNum: '26', fullDate: 'Monday, January 26' },
  { id: 'tue', dayLetter: 'T', dateNum: '27', fullDate: 'Tuesday, January 27' },
  { id: 'wed', dayLetter: 'W', dateNum: '28', fullDate: 'Wednesday, January 28' },
  { id: 'thu', dayLetter: 'T', dateNum: '29', fullDate: 'Thursday, January 29' },
  { id: 'fri', dayLetter: 'F', dateNum: '30', fullDate: 'Friday, January 30' },
  { id: 'sat', dayLetter: 'S', dateNum: '31', fullDate: 'Saturday, January 31' },
  { id: 'sun', dayLetter: 'S', dateNum: '1', fullDate: 'Sunday, February 1' },
];

const WEEK_APPOINTMENTS_LIST = [
  { id: 'w-1', name: 'Albert Flores', details: 'Annual Physical · 08:30 AM · 30m · In-Person' },
  { id: 'w-2', name: 'Eleanor Pena', details: 'Post-Op Checkup · 10:00 AM · 45m · In-Person' },
  { id: 'w-3', name: 'Jane Cooper', details: 'Therapy Consult · 02:30 PM · 60m · Telehealth' },
  { id: 'w-4', name: 'Esther Howard', details: 'Hypertension Review · 09:00 AM · 30m · In-Person' },
  { id: 'w-5', name: 'Cameron Williamson', details: 'Lab Results Review · 01:30 PM · 30m · Telehealth' },
  { id: 'w-6', name: 'Leslie Alexander', details: 'Sleep Apnea Follow-up · 03:00 PM · 45m · In-Person' },
  { id: 'w-7', name: 'Darlene Robertson', details: 'Neurology Screening · 10:00 AM · 60m · In-Person' },
  { id: 'w-8', name: 'Courtney Henry', details: 'Allergy Test Read · 02:30 PM · 15m · In-Person' },
  { id: 'w-9', name: 'Theresa Webb', details: 'Thyroid Exam · 09:00 AM · 30m · Telehealth' },
  { id: 'w-10', name: 'Kristin Watson', details: 'Pediatric Consulting · 11:15 AM · 45m · In-Person' },
];

export const ScheduleScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { patients, bookAppointment, selectPatient, startConsultation } = useMobileApp();

  const [selectedDayId, setSelectedDayId] = useState<string>('tue');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Quick-fill slot status tracker
  const [filledSlots, setFilledSlots] = useState<{ [key: string]: boolean }>({});

  // New Appointment Form
  const [patientName, setPatientName] = useState('');
  const [time, setTime] = useState('11:00 AM');
  const [reason, setReason] = useState('');
  const [type, setType] = useState<'In-Person' | 'Telehealth' | 'Follow-up'>('In-Person');

  const selectedDay = WEEK_DAYS.find((d) => d.id === selectedDayId) || WEEK_DAYS[1];

  const handleStartConsultationWithHaylie = () => {
    const haylie =
      patients.find(
        (p) =>
          p.firstName.toLowerCase().includes('haylie') ||
          p.avatarKey === 'haylie' ||
          p.id === 'pat-7'
      ) || patients[0];

    selectPatient(haylie);
    startConsultation(haylie);
    navigation.navigate('LiveConsultation');
  };

  const handleBook = () => {
    if (!patientName.trim() || !reason.trim()) {
      Alert.alert('Required Fields', 'Please enter patient name and visit reason.');
      return;
    }
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: `pat-${Date.now()}`,
      patientName: patientName.trim(),
      patientCode: `#PK${Math.floor(10000 + Math.random() * 90000)}`,
      time,
      date: selectedDay.fullDate,
      reason: reason.trim(),
      type,
      status: 'Scheduled',
      room: type === 'Telehealth' ? 'Virtual Room A' : 'Consultation Room 3',
      doctorName: 'Dr. Marleen',
    };
    bookAppointment(newApt);
    setIsModalOpen(false);
    setPatientName('');
    setReason('');
    Alert.alert('Appointment Booked', `Slot booked for ${newApt.patientName} at ${newApt.time}.`);
  };

  const handleQuickFillSlot = (key: string, name: string, slotTime: string) => {
    setFilledSlots((prev) => ({ ...prev, [key]: true }));
    Alert.alert(
      'Slot Allocated',
      `${name} has been assigned to the ${slotTime} slot on ${selectedDay.fullDate}. Notification sent to patient.`
    );
  };

  return (
    <View style={[styles.rootContainer, { paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 12 : 24) }]}>
      <StatusBar style="dark" />

      {/* Main Scrollable View */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 60 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top MediScribe Header */}
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
            <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7}>
              <Ionicons name="notifications-outline" size={22} color="#334155" />
            </TouchableOpacity>
            <Image
              source={require('../../../assets/doctor-avatar.png')}
              style={styles.doctorAvatar}
            />
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.screenTitle}>Clinic schedule</Text>
          <Text style={styles.screenSubtitle}>January 26 – February 1, 2026</Text>
        </View>

        {/* Weekly Day Selector Bar */}
        <View style={styles.weekSelectorRow}>
          {WEEK_DAYS.map((day) => {
            const isActive = day.id === selectedDayId;
            return (
              <TouchableOpacity
                key={day.id}
                style={[styles.dayPill, isActive ? styles.dayPillActive : styles.dayPillInactive]}
                onPress={() => setSelectedDayId(day.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.dayLetter, isActive ? styles.dayLetterActive : styles.dayLetterInactive]}>
                  {day.dayLetter}
                </Text>
                <Text style={[styles.dateNum, isActive ? styles.dateNumActive : styles.dateNumInactive]}>
                  {day.dateNum}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Hero Card: Next Up Patient */}
        <View style={styles.heroCard}>
          <Text style={styles.heroCardTitle}>Next Up Patient</Text>

          <View style={styles.patientRow}>
            <Image
              source={require('../../../assets/patient-haylie.png')}
              style={styles.patientAvatar}
            />
            <View style={styles.patientMetaCol}>
              <Text style={styles.patientName}>Haylie Saris</Text>
              <Text style={styles.patientSub}>Female · 32 years</Text>
            </View>
          </View>

          {/* Urgent Checked-In Pill */}
          <View style={styles.urgentPill}>
            <Text style={styles.urgentPillText}>URGENT · Checked-In</Text>
          </View>

          {/* Vitals & Presentation */}
          <Text style={styles.presentationText}>Chest tightness & dyspnea</Text>
          <Text style={styles.vitalsText}>BP 135/88 | Temp 36.8°C</Text>

          {/* Start Consultation Button */}
          <TouchableOpacity
            style={styles.startConsultationBtn}
            onPress={handleStartConsultationWithHaylie}
            activeOpacity={0.85}
          >
            <Text style={styles.startConsultationBtnText}>Start Consultation</Text>
          </TouchableOpacity>
        </View>

        {/* 3 Metrics Cards Row */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricNumber}>18</Text>
            <Text style={styles.metricLabel}>Scheduled</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricNumber}>12</Text>
            <Text style={styles.metricLabel}>Completed</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricNumber}>2</Text>
            <Text style={styles.metricLabel}>Waiting</Text>
          </View>
        </View>

        {/* Action Button: + Add Appointment */}
        <TouchableOpacity
          style={styles.addAppointmentBtn}
          onPress={() => setIsModalOpen(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.addAppointmentBtnText}>+ Add Appointment</Text>
        </TouchableOpacity>

        {/* Day Timeline Section: Tuesday, January 27 */}
        <View style={styles.timelineSection}>
          <Text style={styles.timelineHeading}>{selectedDay.fullDate}</Text>

          {/* Appointment 1: Brooklyn Simmons */}
          <View style={styles.appointmentCard}>
            <Text style={styles.appointmentTitle}>08:15 AM · Brooklyn Simmons</Text>
            <Text style={styles.appointmentSub}>Cardiac Assessment · 45m</Text>
            <View style={styles.statusPillBox}>
              <Text style={styles.statusPillText}>Completed</Text>
            </View>
          </View>

          {/* Appointment 2: Haylie Saris */}
          <View style={styles.appointmentCard}>
            <Text style={styles.appointmentTitle}>10:45 AM · Haylie Saris</Text>
            <Text style={styles.appointmentSub}>Chest Dyspnea Check · 30m</Text>
            <View style={styles.statusPillBox}>
              <Text style={styles.statusPillText}>Checked-In</Text>
            </View>
          </View>

          {/* Appointment 3: Guy Hawkins */}
          <View style={styles.appointmentCard}>
            <Text style={styles.appointmentTitle}>02:00 PM · Guy Hawkins</Text>
            <Text style={styles.appointmentSub}>EHR Attestation Sign · 15m</Text>
            <View style={styles.statusPillBox}>
              <Text style={styles.statusPillText}>Waiting</Text>
            </View>
          </View>
        </View>

        {/* Week appointments Section */}
        <View style={styles.sectionContainerCard}>
          <Text style={styles.sectionCardTitle}>Week appointments</Text>

          {WEEK_APPOINTMENTS_LIST.map((apt) => (
            <View key={apt.id} style={styles.weekAptBlock}>
              <Text style={styles.weekAptName}>{apt.name}</Text>
              <View style={styles.weekAptDetailBox}>
                <Text style={styles.weekAptDetailText}>{apt.details}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Waitlist & Quick-Fill Section */}
        <View style={styles.sectionContainerCard}>
          <Text style={styles.sectionCardTitle}>Waitlist & Quick-Fill</Text>

          {/* Waitlist Item 1: Arthur Shelby */}
          <View style={styles.waitlistBlock}>
            <Text style={styles.waitlistName}>Arthur Shelby · High Priority</Text>
            <View style={styles.waitlistDetailBox}>
              <Text style={styles.waitlistDetailText}>Ear pain & headache · Wait time: 3 days</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.quickFillBtn,
                filledSlots['arthur'] && styles.quickFillBtnFilled,
              ]}
              onPress={() => handleQuickFillSlot('arthur', 'Arthur Shelby', '11:30 AM')}
              activeOpacity={0.85}
              disabled={filledSlots['arthur']}
            >
              <Text style={styles.quickFillBtnText}>
                {filledSlots['arthur'] ? 'Slot Filled · 11:30 AM' : 'Fill 11:30 AM Slot'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Waitlist Item 2: Ada Thorne */}
          <View style={[styles.waitlistBlock, { marginTop: 16 }]}>
            <Text style={styles.waitlistName}>Ada Thorne · Routine</Text>
            <View style={styles.waitlistDetailBox}>
              <Text style={styles.waitlistDetailText}>Bloodwork follow-up · Wait time: 5 days</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.quickFillBtn,
                filledSlots['ada'] && styles.quickFillBtnFilled,
              ]}
              onPress={() => handleQuickFillSlot('ada', 'Ada Thorne', '03:30 PM')}
              activeOpacity={0.85}
              disabled={filledSlots['ada']}
            >
              <Text style={styles.quickFillBtnText}>
                {filledSlots['ada'] ? 'Slot Offered · 03:30 PM' : 'Offer 03:30 PM Slot'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Book Appointment Modal */}
      <Modal
        visible={isModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book New Appointment</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)} style={{ padding: 4 }}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.formLabel}>Patient Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Ramesh Kumar"
                placeholderTextColor="#94A3B8"
                value={patientName}
                onChangeText={setPatientName}
              />

              <Text style={styles.formLabel}>Time Slot</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. 11:30 AM"
                placeholderTextColor="#94A3B8"
                value={time}
                onChangeText={setTime}
              />

              <Text style={styles.formLabel}>Visit Reason *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Chest tightness review"
                placeholderTextColor="#94A3B8"
                value={reason}
                onChangeText={setReason}
              />

              <Text style={styles.formLabel}>Consultation Type</Text>
              <View style={styles.typeSelectorRow}>
                {(['In-Person', 'Telehealth', 'Follow-up'] as const).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typeOption, type === t && styles.typeOptionActive]}
                    onPress={() => setType(t)}
                  >
                    <Text style={[styles.typeOptionText, type === t && styles.typeOptionTextActive]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.confirmModalBtn}
                onPress={handleBook}
                activeOpacity={0.85}
              >
                <Text style={styles.confirmModalBtnText}>Confirm Appointment</Text>
              </TouchableOpacity>
            </ScrollView>
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

  /* Title Section */
  titleSection: {
    marginBottom: 16,
    marginTop: 4,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  screenSubtitle: {
    fontSize: 14.5,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '400',
  },

  /* Week Day Selector Row */
  weekSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayPill: {
    width: 44,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPillActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  dayPillInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  dayLetter: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 3,
  },
  dayLetterActive: {
    color: '#FFFFFF',
  },
  dayLetterInactive: {
    color: '#64748B',
  },
  dateNum: {
    fontSize: 16,
    fontWeight: '700',
  },
  dateNumActive: {
    color: '#FFFFFF',
  },
  dateNumInactive: {
    color: '#0F172A',
  },

  /* Hero Card: Next Up Patient */
  heroCard: {
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
  heroCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    marginRight: 14,
  },
  patientMetaCol: {
    flex: 1,
  },
  patientName: {
    fontSize: 17.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  patientSub: {
    fontSize: 13.5,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '400',
  },
  urgentPill: {
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 14,
    marginBottom: 12,
  },
  urgentPillText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#DC2626',
    letterSpacing: 0.2,
  },
  presentationText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  vitalsText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    fontWeight: '400',
  },
  startConsultationBtn: {
    backgroundColor: '#0F172A',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startConsultationBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  /* 3 Metrics Cards Row */
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  metricNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563EB',
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },

  /* Action Button: + Add Appointment */
  addAppointmentBtn: {
    backgroundColor: '#2563EB',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  addAppointmentBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  /* Day Timeline Section */
  timelineSection: {
    marginBottom: 20,
  },
  timelineHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  appointmentTitle: {
    fontSize: 16.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  appointmentSub: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 12,
  },
  statusPillBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: 'stretch',
  },
  statusPillText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#2563EB',
  },

  /* Section Container Card (Week Appointments & Waitlist) */
  sectionContainerCard: {
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
  sectionCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },

  /* Week Appointments Items */
  weekAptBlock: {
    marginBottom: 12,
  },
  weekAptName: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  weekAptDetailBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  weekAptDetailText: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },

  /* Waitlist & Quick-Fill */
  waitlistBlock: {
    marginBottom: 4,
  },
  waitlistName: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  waitlistDetailBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 10,
  },
  waitlistDetailText: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  quickFillBtn: {
    backgroundColor: '#2563EB',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  quickFillBtnFilled: {
    backgroundColor: '#059669',
    shadowColor: '#059669',
  },
  quickFillBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  /* Modal Styles */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    maxHeight: '82%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  formLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 14,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  typeOptionActive: {
    backgroundColor: '#2563EB',
  },
  typeOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  typeOptionTextActive: {
    color: '#FFFFFF',
  },
  confirmModalBtn: {
    backgroundColor: '#2563EB',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 28,
  },
  confirmModalBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
