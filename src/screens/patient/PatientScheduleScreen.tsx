import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MobileHeader } from '../../components/common/MobileHeader';
import { CardContainer } from '../../components/common/CardContainer';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ActionButton } from '../../components/common/ActionButton';

export const PatientScheduleScreen: React.FC = () => {
  const [appointments, setAppointments] = useState([
    {
      id: '1',
      doctor: 'Dr. Marleen',
      specialty: 'General Physician & Cardiology',
      date: 'Today, 24 Jan 2026',
      time: '10:00 AM',
      room: 'Consultation Room 3',
      type: 'In-Person Visit',
      status: 'Confirmed',
    },
    {
      id: '2',
      doctor: 'Dr. Sarah Jenkins',
      specialty: 'Cardiology Specialist',
      date: 'Friday, 30 Jan 2026',
      time: '02:30 PM',
      room: 'Virtual Room A',
      type: 'Telehealth Follow-up',
      status: 'Upcoming',
    },
  ]);

  const handleBook = () => {
    Alert.alert('Book Slot', 'Select a date and time slot with Dr. Marleen.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm for Tomorrow 11 AM',
        onPress: () => {
          setAppointments((prev) => [
            ...prev,
            {
              id: String(Date.now()),
              doctor: 'Dr. Marleen',
              specialty: 'General Physician',
              date: 'Tomorrow, 25 Jan 2026',
              time: '11:00 AM',
              room: 'Consultation Room 3',
              type: 'In-Person Visit',
              status: 'Confirmed',
            },
          ]);
          Alert.alert('Visit Confirmed', 'Appointment scheduled with Dr. Marleen.');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <MobileHeader title="My Appointments" subtitle="Manage upcoming doctor visits" />

      <ScrollView contentContainerStyle={styles.content}>
        <ActionButton
          title="Book New Clinical Visit"
          icon="calendar"
          variant="primary"
          onPress={handleBook}
          style={styles.bookBtn}
        />

        {appointments.map((apt) => (
          <CardContainer key={apt.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.doctorName}>{apt.doctor}</Text>
                <Text style={styles.specialty}>{apt.specialty}</Text>
              </View>
              <StatusBadge status={apt.status} variant="success" />
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="time-outline" size={14} color="#2563EB" />
              <Text style={styles.metaText}>{apt.date} · {apt.time}</Text>
            </View>

            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={14} color="#64748B" />
              <Text style={styles.metaText}>{apt.room} ({apt.type})</Text>
            </View>
          </CardContainer>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF4FA',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  bookBtn: {
    marginBottom: 16,
    borderRadius: 14,
  },
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  specialty: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 3,
  },
  metaText: {
    fontSize: 13,
    color: '#334155',
  },
});

