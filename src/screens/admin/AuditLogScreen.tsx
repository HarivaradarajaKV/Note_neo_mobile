import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MobileHeader } from '../../components/common/MobileHeader';
import { CardContainer } from '../../components/common/CardContainer';

interface Props {
  navigation: any;
}

export const AuditLogScreen: React.FC<Props> = ({ navigation }) => {
  const logs = [
    { id: '1', user: 'Dr. Marleen', action: 'Approved clinical note', patient: 'Ramesh Raj (#PK45311)', time: 'Today 10:25 AM' },
    { id: '2', user: 'Dr. Marleen', action: 'Ended live consultation session', patient: 'Ramesh Raj (#PK45311)', time: 'Today 10:20 AM' },
    { id: '3', user: 'Dr. Marleen', action: 'Started ambient scribing', patient: 'Ramesh Raj (#PK45311)', time: 'Today 10:00 AM' },
    { id: '4', user: 'Priya Sharma (Receptionist)', action: 'Booked appointment', patient: 'Robert Fox (#PK45294)', time: 'Today 09:15 AM' },
    { id: '5', user: 'Suresh Kumar (Admin)', action: 'Imported bulk medical terminology', patient: 'System Dictionary', time: 'Yesterday' },
  ];

  return (
    <View style={styles.container}>
      <MobileHeader title="Audit & Compliance Logs" subtitle="Tamper-evident activity trail" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {logs.map((log) => (
          <CardContainer key={log.id} style={styles.card}>
            <View style={styles.header}>
              <Ionicons name="shield-checkmark" size={16} color="#059669" />
              <Text style={styles.timeText}>{log.time}</Text>
            </View>
            <Text style={styles.actionText}>{log.action}</Text>
            <Text style={styles.detailText}>By {log.user} · Target: {log.patient}</Text>
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
    marginBottom: 6,
  },
  timeText: {
    fontSize: 11,
    color: '#64748B',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  detailText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
});

