import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';
import { MobileHeader } from '../../components/common/MobileHeader';
import { CardContainer } from '../../components/common/CardContainer';
import { ActionButton } from '../../components/common/ActionButton';

export const SettingsScreen: React.FC = () => {
  const { currentUser, logout, selectedLanguage } = useMobileApp();

  return (
    <View style={styles.container}>
      <MobileHeader title="Settings & Profile" subtitle="Account & audio configuration" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <CardContainer style={styles.profileCard}>
          <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{currentUser.name}</Text>
            <Text style={styles.roleTitle}>{currentUser.roleTitle}</Text>
            {currentUser.regNumber && (
              <Text style={styles.regNumber}>Reg: {currentUser.regNumber}</Text>
            )}
            <Text style={styles.email}>{currentUser.email}</Text>
          </View>
        </CardContainer>

        {/* Hospital & Clinic Details */}
        <CardContainer style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Hospital & Clinic Affiliation</Text>
          <View style={styles.itemRow}>
            <Ionicons name="business-outline" size={18} color="#64748B" />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.itemTitle}>Apex Multi-Specialty Clinic</Text>
              <Text style={styles.itemSub}>Bangalore, Karnataka · Outpatient Department</Text>
            </View>
          </View>
        </CardContainer>

        {/* Audio Scribing Preferences */}
        <CardContainer style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Voice & Audio Scribing Engine</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingIconWrap}>
              <Ionicons name="mic-outline" size={18} color="#2563EB" />
            </View>
            <View style={styles.settingTextWrap}>
              <Text style={styles.settingTitle}>Primary Transcription Language</Text>
              <Text style={styles.settingSub}>{selectedLanguage}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingIconWrap}>
              <Ionicons name="volume-high-outline" size={18} color="#059669" />
            </View>
            <View style={styles.settingTextWrap}>
              <Text style={styles.settingTitle}>Ambient Microphone Gain</Text>
              <Text style={styles.settingSub}>3.5x Auto-Boost Enabled (Mobile & Far-field)</Text>
            </View>
            <Ionicons name="checkmark-circle" size={18} color="#059669" />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingIconWrap}>
              <Ionicons name="people-outline" size={18} color="#7C3AED" />
            </View>
            <View style={styles.settingTextWrap}>
              <Text style={styles.settingTitle}>Speaker Diarization Engine</Text>
              <Text style={styles.settingSub}>Real-Time & Post-Consultation Clinical Pass</Text>
            </View>
            <Ionicons name="checkmark-circle" size={18} color="#059669" />
          </View>
        </CardContainer>

        {/* Security & Regulatory */}
        <CardContainer style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Compliance & Privacy</Text>
          <View style={styles.complianceRow}>
            <Ionicons name="shield-checkmark" size={16} color="#059669" />
            <Text style={styles.complianceText}>
              HIPAA & NMC Compliant · Audio encrypted in-transit (TLS 1.3)
            </Text>
          </View>
        </CardContainer>

        {/* Sign Out Button */}
        <ActionButton
          title="Sign Out of Account"
          icon="log-out-outline"
          variant="danger"
          onPress={() => {
            Alert.alert('Sign Out', 'Are you sure you want to log out?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Log Out', style: 'destructive', onPress: logout },
            ]);
          }}
          style={styles.logoutBtn}
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
    paddingBottom: 36,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#3B82F6',
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  roleTitle: {
    fontSize: 12,
    color: '#475569',
    marginTop: 1,
  },
  regNumber: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '700',
    marginTop: 2,
  },
  email: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  sectionCard: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  itemSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  settingTextWrap: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  settingSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  complianceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  complianceText: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
  },
  logoutBtn: {
    marginTop: 8,
    borderRadius: 14,
  },
});

