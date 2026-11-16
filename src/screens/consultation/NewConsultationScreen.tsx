import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';
import { MobileHeader } from '../../components/common/MobileHeader';
import { CardContainer } from '../../components/common/CardContainer';
import { ActionButton } from '../../components/common/ActionButton';
import { Patient } from '../../types';

interface Props {
  navigation: any;
}

export const NewConsultationScreen: React.FC<Props> = ({ navigation }) => {
  const { patients, selectedPatient, selectPatient, startConsultation } = useMobileApp();
  const [reason, setReason] = useState(selectedPatient.condition || '');
  const [consultationType, setConsultationType] = useState<'live' | 'audio'>('live');

  const handleStart = () => {
    const updatedPatient: Patient = {
      ...selectedPatient,
      condition: reason || selectedPatient.condition || 'General Clinical Review',
    };
    startConsultation(updatedPatient);
    navigation.navigate('LiveConsultation');
  };

  return (
    <View style={styles.container}>
      <MobileHeader title="New Consultation" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Patient Selection Card */}
        <CardContainer style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Select Patient</Text>
          <Text style={styles.sectionSubtitle}>Choose from registered OPD patients</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.patientRow}>
            {patients.map((pat) => {
              const isSelected = pat.id === selectedPatient.id;
              return (
                <TouchableOpacity
                  key={pat.id}
                  style={[styles.patientChip, isSelected && styles.patientChipActive]}
                  onPress={() => {
                    selectPatient(pat);
                    setReason(pat.condition || '');
                  }}
                >
                  <View style={[styles.avatar, isSelected && styles.avatarActive]}>
                    <Text style={[styles.avatarText, isSelected && styles.avatarTextActive]}>
                      {pat.firstName.charAt(0)}
                    </Text>
                  </View>
                  <Text style={[styles.patientName, isSelected && styles.patientNameActive]}>
                    {pat.firstName} {pat.lastName}
                  </Text>
                  <Text style={styles.patientCode}>{pat.patientCode}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </CardContainer>

        {/* Reason for Visit Input */}
        <CardContainer style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Reason for Visit / Clinical Presentation</Text>
          <TextInput
            style={styles.textInput}
            value={reason}
            onChangeText={setReason}
            placeholder="e.g. Persistent cough, fever for 3 days, headache..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
          />
        </CardContainer>

        {/* Consultation Mode Selector */}
        <CardContainer style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Capture Mode</Text>
          <View style={styles.modeRow}>
            <TouchableOpacity
              style={[styles.modeCard, consultationType === 'live' && styles.modeCardActive]}
              onPress={() => setConsultationType('live')}
            >
              <Ionicons
                name="mic"
                size={24}
                color={consultationType === 'live' ? '#2563EB' : '#64748B'}
              />
              <Text style={[styles.modeTitle, consultationType === 'live' && styles.modeTitleActive]}>
                Live Ambient Mic
              </Text>
              <Text style={styles.modeDesc}>Continuous multi-speaker audio capture</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeCard, consultationType === 'audio' && styles.modeCardActive]}
              onPress={() => setConsultationType('audio')}
            >
              <Ionicons
                name="cloud-upload"
                size={24}
                color={consultationType === 'audio' ? '#2563EB' : '#64748B'}
              />
              <Text style={[styles.modeTitle, consultationType === 'audio' && styles.modeTitleActive]}>
                Upload Audio File
              </Text>
              <Text style={styles.modeDesc}>Transcribe pre-recorded voice note</Text>
            </TouchableOpacity>
          </View>
        </CardContainer>

        {/* Start Action */}
        <ActionButton
          title="Launch Clinical Scribing"
          icon="mic"
          variant="primary"
          onPress={handleStart}
          style={styles.launchBtn}
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
  sectionCard: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  patientRow: {
    marginTop: 6,
  },
  patientChip: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginRight: 10,
    width: 105,
  },
  patientChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  avatarActive: {
    backgroundColor: '#2563EB',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#475569',
  },
  avatarTextActive: {
    color: '#FFFFFF',
  },
  patientName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
  },
  patientNameActive: {
    color: '#1D4ED8',
  },
  patientCode: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#0F172A',
    textAlignVertical: 'top',
    marginTop: 8,
    minHeight: 80,
  },
  modeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  modeCard: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeCardActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  modeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#475569',
    marginTop: 6,
    textAlign: 'center',
  },
  modeTitleActive: {
    color: '#1D4ED8',
  },
  modeDesc: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
  },
  launchBtn: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
});

