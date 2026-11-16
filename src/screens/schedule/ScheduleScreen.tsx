import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';
import { MobileHeader } from '../../components/common/MobileHeader';
import { CardContainer } from '../../components/common/CardContainer';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { Appointment } from '../../types';

interface Props {
  navigation: any;
}

export const ScheduleScreen: React.FC<Props> = ({ navigation }) => {
  const { appointments, patients, bookAppointment, selectPatient, startConsultation } = useMobileApp();
  const [selectedDay, setSelectedDay] = useState<'Today' | 'Tomorrow' | 'This Week'>('Today');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Appointment Form
  const [patientName, setPatientName] = useState('');
  const [time, setTime] = useState('11:00 AM');
  const [reason, setReason] = useState('');
  const [type, setType] = useState<'In-Person' | 'Telehealth' | 'Follow-up'>('In-Person');

  const handleBook = () => {
    if (!patientName.trim() || !reason.trim()) {
      Alert.alert('Required Fields', 'Please enter patient name and reason.');
      return;
    }
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: `pat-${Date.now()}`,
      patientName: patientName.trim(),
      patientCode: `#PK${Math.floor(10000 + Math.random() * 90000)}`,
      time,
      date: selectedDay === 'This Week' ? 'Upcoming' : selectedDay,
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

  return (
    <View style={styles.container}>
      <MobileHeader
        title="Schedule & Appointments"
        subtitle={`${appointments.length} clinical visits booked`}
        rightAction={
          <TouchableOpacity style={styles.addBtn} onPress={() => setIsModalOpen(true)}>
            <Ionicons name="calendar-outline" size={18} color="#2563EB" />
          </TouchableOpacity>
        }
      />

      {/* Day Selector Tabs */}
      <View style={styles.daySelector}>
        {(['Today', 'Tomorrow', 'This Week'] as const).map((day) => (
          <TouchableOpacity
            key={day}
            style={[styles.dayTab, selectedDay === day && styles.dayTabActive]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={[styles.dayTabText, selectedDay === day && styles.dayTabTextActive]}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {appointments.map((apt) => {
          const matchPatient = patients.find((p) => p.id === apt.patientId) || patients[0];
          return (
            <CardContainer key={apt.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.timeTag}>
                  <Ionicons name="time" size={13} color="#2563EB" />
                  <Text style={styles.timeTagText}>{apt.time}</Text>
                </View>
                <StatusBadge status={apt.status} />
              </View>

              <View style={styles.bodyRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{apt.patientName.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.patientName}>{apt.patientName}</Text>
                  <Text style={styles.codeText}>{apt.patientCode} · {apt.room || 'OPD Room 3'}</Text>
                </View>
              </View>

              <Text style={styles.reasonText}>{apt.reason}</Text>

              <View style={styles.cardFooter}>
                <View style={styles.typeTag}>
                  <Ionicons
                    name={apt.type === 'Telehealth' ? 'videocam' : 'location'}
                    size={12}
                    color="#64748B"
                  />
                  <Text style={styles.typeText}>{apt.type}</Text>
                </View>

                <TouchableOpacity
                  style={styles.startBtn}
                  onPress={() => {
                    selectPatient(matchPatient);
                    startConsultation(matchPatient);
                    navigation.navigate('LiveConsultation');
                  }}
                >
                  <Ionicons name="mic" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.startBtnText}>Start Consultation</Text>
                </TouchableOpacity>
              </View>
            </CardContainer>
          );
        })}
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
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.formLabel}>Patient Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Ramesh Raj"
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

              <Text style={styles.formLabel}>Visit Reason</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Follow-up regarding cough"
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

              <ActionButton
                title="Confirm Appointment"
                variant="primary"
                onPress={handleBook}
                style={{ marginTop: 16, marginBottom: 24 }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF4FA',
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  daySelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  dayTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
  },
  dayTabActive: {
    backgroundColor: '#2563EB',
  },
  dayTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  dayTabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    padding: 16,
    paddingBottom: 96,
  },
  card: {
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  timeTagText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563EB',
  },
  patientName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  codeText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  reasonText: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typeText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  startBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
    marginTop: 8,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typeOptionActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  typeOptionText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  typeOptionTextActive: {
    color: '#2563EB',
    fontWeight: '800',
  },
});

