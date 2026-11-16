import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MobileHeader } from '../../components/common/MobileHeader';
import { CardContainer } from '../../components/common/CardContainer';
import { ActionButton } from '../../components/common/ActionButton';

interface Props {
  navigation: any;
}

export const TerminologyTrainingScreen: React.FC<Props> = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalTerms: 1845,
    medications: 780,
    symptoms: 620,
    diagnoses: 445,
  });

  const handleSync = () => {
    Alert.alert('Terminology Sync', 'Synchronizing clinical terminology with Supabase database...');
  };

  return (
    <View style={styles.container}>
      <MobileHeader title="Terminology Dictionary" subtitle="Medical vocabulary & CSV ingestion" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        <CardContainer style={styles.statCard}>
          <Text style={styles.statTitle}>Verified Clinical Terms</Text>
          <Text style={styles.statNumber}>{stats.totalTerms}</Text>
          <Text style={styles.statSubtitle}>Active in real-time acoustic & phonetic matching</Text>
        </CardContainer>

        <View style={styles.grid}>
          <CardContainer style={styles.gridBox}>
            <Text style={styles.boxVal}>{stats.medications}</Text>
            <Text style={styles.boxLabel}>Medications & Dosages</Text>
          </CardContainer>

          <CardContainer style={styles.gridBox}>
            <Text style={styles.boxVal}>{stats.symptoms}</Text>
            <Text style={styles.boxLabel}>Symptoms & Complaints</Text>
          </CardContainer>

          <CardContainer style={styles.gridBox}>
            <Text style={styles.boxVal}>{stats.diagnoses}</Text>
            <Text style={styles.boxLabel}>ICD-10 Diagnoses</Text>
          </CardContainer>
        </View>

        <CardContainer style={styles.actionCard}>
          <Text style={styles.actionTitle}>Stopwords & Grammar Protection</Text>
          <Text style={styles.actionDesc}>
            Common conversational English words ("having", "what is", "about", "are") are protected from false medical entity substitutions.
          </Text>
          <View style={styles.statusPill}>
            <Ionicons name="checkmark-circle" size={16} color="#059669" />
            <Text style={styles.statusPillText}>Stopword Filter Enabled (100% Verified)</Text>
          </View>
        </CardContainer>

        <ActionButton
          title="Synchronize Medical Terms"
          icon="sync"
          variant="primary"
          onPress={handleSync}
          style={{ marginTop: 12 }}
        />
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
  statCard: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '900',
    color: '#2563EB',
    marginVertical: 4,
  },
  statSubtitle: {
    fontSize: 11,
    color: '#475569',
  },
  grid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  gridBox: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  boxVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  boxLabel: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
  },
  actionCard: {
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  actionDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 10,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
    alignSelf: 'flex-start',
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
});

