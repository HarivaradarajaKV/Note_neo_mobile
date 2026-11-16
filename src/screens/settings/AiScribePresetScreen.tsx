import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

interface Props {
  navigation?: any;
}

export const AiScribePresetScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  // Transcription Settings Toggles
  const [autoPunctuation, setAutoPunctuation] = useState(true);
  const [speakerDiarization, setSpeakerDiarization] = useState(true);

  // SOAP Note Preferences Toggles
  const [subjective, setSubjective] = useState(true);
  const [objective, setObjective] = useState(true);
  const [assessment, setAssessment] = useState(true);
  const [plan, setPlan] = useState(true);
  const [autoSuggestDiagnoses, setAutoSuggestDiagnoses] = useState(true);
  const [realtimeIcd10, setRealtimeIcd10] = useState(true);

  const handleSaveSettings = () => {
    Alert.alert(
      'Settings Saved',
      'AI Scribe model parameters, confidence thresholds, and SOAP formatting rules updated successfully.'
    );
  };

  return (
    <View
      style={[
        styles.rootContainer,
        { paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 12 : 24) },
      ]}
    >
      <StatusBar style="dark" />

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 60 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top MediScribe Header matching screenshot */}
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

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation?.navigate('SettingsMain')}
            >
              <Image
                source={require('../../../assets/doctor-avatar.png')}
                style={styles.doctorAvatar}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title Section matching screenshot */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>AI Scribe preset</Text>
          <Text style={styles.subtitle}>Account settings · All settings synced</Text>
        </View>

        {/* Card 1: Active AI Clinical Model matching screenshot 1 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>Active AI Clinical Model</Text>

          {/* Production Status Badge */}
          <View style={styles.productionBadge}>
            <Text style={styles.productionBadgeText}>Production</Text>
          </View>

          {/* Model Name */}
          <Text style={styles.modelNameText}>MediScribe AI v3.2</Text>
          <Text style={styles.modelSubText}>
            Currently running production scribe environment
          </Text>

          {/* Accuracy & Compliance Metrics */}
          <View style={styles.metricsRow}>
            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>Accuracy</Text>
              <Text style={styles.metricValue}>97.8% verified</Text>
            </View>
            <View style={styles.metricCol}>
              <Text style={styles.metricLabel}>Compliance</Text>
              <Text style={styles.metricValue}>HIPAA & SOC2</Text>
            </View>
          </View>
        </View>

        {/* Card 2: Transcription Settings matching screenshots 1 & 2 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>Transcription Settings</Text>

          {/* PRIMARY LANGUAGE */}
          <Text style={styles.fieldLabel}>PRIMARY LANGUAGE</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>English (US) - Primary Dialect</Text>
          </View>

          {/* MEDICAL SPECIALTY FOCUS */}
          <Text style={styles.fieldLabel}>MEDICAL SPECIALTY FOCUS</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>Cardiology Subspecialist Model</Text>
          </View>

          {/* Toggle: Auto-Punctuation & Syntactic Flow */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Auto-Punctuation & Syntactic Flow</Text>
            <Switch
              value={autoPunctuation}
              onValueChange={setAutoPunctuation}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Toggle: Multilingual Speaker Diarization */}
          <View style={[styles.toggleRow, { marginBottom: 0, paddingBottom: 0, borderBottomWidth: 0 }]}>
            <Text style={styles.toggleText}>Multilingual Speaker Diarization</Text>
            <Switch
              value={speakerDiarization}
              onValueChange={setSpeakerDiarization}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Card 3: SOAP Note Preferences matching screenshots 2 & 3 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>SOAP Note Preferences</Text>

          {/* DEFAULT TEMPLATE STYLE */}
          <Text style={styles.fieldLabel}>DEFAULT TEMPLATE STYLE</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>Comprehensive Cardiology SOAP Template</Text>
          </View>

          {/* Toggle: Subjective (Patient Story) */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Subjective (Patient Story)</Text>
            <Switch
              value={subjective}
              onValueChange={setSubjective}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Toggle: Objective (Vitals & Labs) */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Objective (Vitals & Labs)</Text>
            <Switch
              value={objective}
              onValueChange={setObjective}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Toggle: Assessment (AI Diagnostic) */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Assessment (AI Diagnostic)</Text>
            <Switch
              value={assessment}
              onValueChange={setAssessment}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Toggle: Plan (Treatment Flow) */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Plan (Treatment Flow)</Text>
            <Switch
              value={plan}
              onValueChange={setPlan}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Toggle: Auto-suggest primary diagnoses */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Auto-suggest primary diagnoses</Text>
            <Switch
              value={autoSuggestDiagnoses}
              onValueChange={setAutoSuggestDiagnoses}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Toggle: Real-time ICD-10 code mapping */}
          <View style={[styles.toggleRow, { marginBottom: 0, paddingBottom: 0, borderBottomWidth: 0 }]}>
            <Text style={styles.toggleText}>Real-time ICD-10 code mapping</Text>
            <Switch
              value={realtimeIcd10}
              onValueChange={setRealtimeIcd10}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Card 4: Confidence & Metrics matching screenshot 3 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>Confidence & Metrics</Text>

          {/* AI CONFIDENCE THRESHOLD */}
          <Text style={styles.fieldLabel}>AI CONFIDENCE THRESHOLD</Text>
          <View style={[styles.fieldBox, { marginBottom: 10 }]}>
            <Text style={styles.fieldValue}>85% minimum</Text>
          </View>

          {/* Progress / Slider Bar */}
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <Text style={styles.thresholdDesc}>
            Minimum confidence level required for auto-populating patient EHR fields.
          </Text>

          {/* LIVE PERFORMANCE STATS */}
          <Text style={styles.fieldLabel}>LIVE PERFORMANCE STATS</Text>
          <View style={[styles.fieldBox, { marginBottom: 0 }]}>
            <Text style={styles.statsLineOne}>Accuracy 97.8% · Latency 2.3s</Text>
            <Text style={styles.statsLineTwo}>Total notes 1,247</Text>
          </View>
        </View>

        {/* Save Settings Button matching screenshot 3 */}
        <TouchableOpacity
          style={styles.saveSettingsBtn}
          onPress={handleSaveSettings}
          activeOpacity={0.85}
        >
          <Text style={styles.saveSettingsBtnText}>Save Settings</Text>
        </TouchableOpacity>
      </ScrollView>
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
    backgroundColor: '#EFF4FA',
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
  mainTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14.5,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '400',
  },

  /* Standard Card Container */
  cardContainer: {
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
  cardMainHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },

  /* Production Status Badge */
  productionBadge: {
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignSelf: 'stretch',
  },
  productionBadgeText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#059669',
  },

  /* Model Text Info */
  modelNameText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  modelSubText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 16,
  },

  /* Metrics Row (Accuracy & Compliance) */
  metricsRow: {
    flexDirection: 'row',
  },
  metricCol: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
    fontWeight: '400',
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },

  /* Field Labels & Values */
  fieldLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  fieldBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 14,
  },
  fieldValue: {
    fontSize: 14.5,
    color: '#0F172A',
    fontWeight: '500',
  },

  /* Toggle Rows */
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  toggleText: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
    flex: 1,
    marginRight: 12,
  },

  /* Progress Bar */
  progressTrack: {
    height: 6,
    backgroundColor: '#EFF6FF',
    borderRadius: 3,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressFill: {
    width: '85%',
    height: 6,
    backgroundColor: '#2563EB',
    borderRadius: 3,
  },
  thresholdDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
  },

  /* Live Stats Text */
  statsLineOne: {
    fontSize: 14.5,
    color: '#0F172A',
    fontWeight: '500',
    lineHeight: 22,
  },
  statsLineTwo: {
    fontSize: 14.5,
    color: '#0F172A',
    fontWeight: '500',
    marginTop: 2,
  },

  /* Save Settings Button */
  saveSettingsBtn: {
    backgroundColor: '#2563EB',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  saveSettingsBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

