import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MobileHeader } from '../../components/common/MobileHeader';
import { CardContainer } from '../../components/common/CardContainer';
import { StatusBadge } from '../../components/common/StatusBadge';

interface Props {
  navigation: any;
}

export const ClinicManagementScreen: React.FC<Props> = ({ navigation }) => {
  const rooms = [
    { id: '1', name: 'Consultation Room 1', doctor: 'Dr. Anil Kumar', status: 'In Use', dept: 'Pulmonology' },
    { id: '2', name: 'Consultation Room 2', doctor: 'Dr. Sarah Jenkins', status: 'Available', dept: 'Cardiology' },
    { id: '3', name: 'Consultation Room 3', doctor: 'Dr. Marleen', status: 'Active Scribe', dept: 'Internal Medicine' },
    { id: '4', name: 'Virtual Room A', doctor: 'Telehealth Desk', status: 'Available', dept: 'Tele-Consult' },
  ];

  return (
    <View style={styles.container}>
      <MobileHeader title="Clinic & OPD Management" subtitle="Rooms, equipment & occupancy" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {rooms.map((r) => (
          <CardContainer key={r.id} style={styles.card}>
            <View style={styles.header}>
              <View>
                <Text style={styles.roomName}>{r.name}</Text>
                <Text style={styles.dept}>{r.dept} · {r.doctor}</Text>
              </View>
              <StatusBadge status={r.status} />
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
  card: {
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  dept: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});

