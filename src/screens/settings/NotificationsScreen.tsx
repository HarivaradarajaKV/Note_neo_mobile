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

export const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  // Notification Channels state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  // Patient Alerts state
  const [newPatientAssigned, setNewPatientAssigned] = useState(true);
  const [criticalLabResults, setCriticalLabResults] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);

  // System Notifications state
  const [softwareUpdates, setSoftwareUpdates] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  // Clinical Scribe Alerts state
  const [noteRequiresReview, setNoteRequiresReview] = useState(true);
  const [noteSignedLocked, setNoteSignedLocked] = useState(true);
  const [aiTranscriptionComplete, setAiTranscriptionComplete] = useState(true);

  // Quiet hours time state
  const [startTime, setStartTime] = useState({ time: '08:00', period: 'PM' });
  const [endTime, setEndTime] = useState({ time: '07:00', period: 'AM' });

  const handleSavePreferences = () => {
    Alert.alert(
      'Preferences Saved',
      'Clinical notification rules and quiet hours configuration have been synchronized successfully.'
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
          <Text style={styles.mainTitle}>Notifications</Text>
          <Text style={styles.subtitle}>Account settings · All settings synced</Text>
        </View>

        {/* Card 1: Notification Channels matching screenshot 1 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>Notification Channels</Text>

          {/* Email Notifications */}
          <View style={styles.channelRow}>
            <Text style={styles.channelLabel}>Email Notifications</Text>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* SMS Alerts */}
          <View style={styles.channelRow}>
            <Text style={styles.channelLabel}>SMS Alerts</Text>
            <Switch
              value={smsAlerts}
              onValueChange={setSmsAlerts}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* In-App Notifications */}
          <View style={styles.channelRow}>
            <Text style={styles.channelLabel}>In-App Notifications</Text>
            <Switch
              value={inAppNotifications}
              onValueChange={setInAppNotifications}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Push Notifications */}
          <View style={[styles.channelRow, { marginBottom: 0 }]}>
            <Text style={styles.channelLabel}>Push Notifications</Text>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Card 2: Patient Alerts matching screenshots 1 & 2 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>Patient Alerts</Text>

          {/* New patient assigned */}
          <View style={styles.alertRow}>
            <View style={styles.alertTextCol}>
              <Text style={styles.alertTitle}>New patient assigned</Text>
              <Text style={styles.alertSubtitle}>
                Get notified when a new patient registry file syncs
              </Text>
            </View>
            <Switch
              value={newPatientAssigned}
              onValueChange={setNewPatientAssigned}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Critical lab results */}
          <View style={styles.alertRow}>
            <View style={styles.alertTextCol}>
              <Text style={styles.alertTitle}>Critical lab results</Text>
              <Text style={styles.alertSubtitle}>
                Immediate override notification for high-risk flags
              </Text>
            </View>
            <Switch
              value={criticalLabResults}
              onValueChange={setCriticalLabResults}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Appointment reminders */}
          <View style={[styles.alertRow, { marginBottom: 0 }]}>
            <View style={styles.alertTextCol}>
              <Text style={styles.alertTitle}>Appointment reminders</Text>
              <Text style={styles.alertSubtitle}>
                Alerts 15 minutes prior to next schedule segment
              </Text>
            </View>
            <Switch
              value={appointmentReminders}
              onValueChange={setAppointmentReminders}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Card 3: System Notifications matching screenshot 2 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>System Notifications</Text>

          {/* Software updates */}
          <View style={styles.alertRow}>
            <View style={styles.alertTextCol}>
              <Text style={styles.alertTitle}>Software updates</Text>
              <Text style={styles.alertSubtitle}>
                Get notified of new clinical feature additions
              </Text>
            </View>
            <Switch
              value={softwareUpdates}
              onValueChange={setSoftwareUpdates}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Security alerts */}
          <View style={[styles.alertRow, { marginBottom: 0 }]}>
            <View style={styles.alertTextCol}>
              <Text style={styles.alertTitle}>Security alerts</Text>
              <Text style={styles.alertSubtitle}>
                HIPAA credential renewals and primary login notifications
              </Text>
            </View>
            <Switch
              value={securityAlerts}
              onValueChange={setSecurityAlerts}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Card 4: Clinical Scribe Alerts matching screenshots 2 & 3 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>Clinical Scribe Alerts</Text>

          {/* Note requires review */}
          <View style={styles.alertRow}>
            <View style={styles.alertTextCol}>
              <Text style={styles.alertTitle}>Note requires review</Text>
              <Text style={styles.alertSubtitle}>
                Draft warnings from AI clinical diagnostic companion
              </Text>
            </View>
            <Switch
              value={noteRequiresReview}
              onValueChange={setNoteRequiresReview}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Note signed & locked */}
          <View style={styles.alertRow}>
            <View style={styles.alertTextCol}>
              <Text style={styles.alertTitle}>Note signed & locked</Text>
              <Text style={styles.alertSubtitle}>
                Secure lock notification for legal record keeping
              </Text>
            </View>
            <Switch
              value={noteSignedLocked}
              onValueChange={setNoteSignedLocked}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* AI transcription complete */}
          <View style={[styles.alertRow, { marginBottom: 0 }]}>
            <View style={styles.alertTextCol}>
              <Text style={styles.alertTitle}>AI transcription complete</Text>
              <Text style={styles.alertSubtitle}>
                Scribe finished processing background live dictation
              </Text>
            </View>
            <Switch
              value={aiTranscriptionComplete}
              onValueChange={setAiTranscriptionComplete}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Card 5: Clinical Quiet Hours matching screenshot 3 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>Clinical Quiet Hours</Text>

          {/* Start Time & End Time row */}
          <View style={styles.quietHoursRow}>
            {/* Start Time Column */}
            <View style={styles.timeBlockCol}>
              <Text style={styles.timeFieldLabel}>START TIME</Text>
              <View style={styles.timeBox}>
                <Text style={styles.timeDigits}>{startTime.time}</Text>
                <Text style={styles.timePeriod}>{startTime.period}</Text>
              </View>
            </View>

            {/* End Time Column */}
            <View style={styles.timeBlockCol}>
              <Text style={styles.timeFieldLabel}>END TIME</Text>
              <View style={styles.timeBox}>
                <Text style={styles.timeDigits}>{endTime.time}</Text>
                <Text style={styles.timePeriod}>{endTime.period}</Text>
              </View>
            </View>
          </View>

          {/* Active on days */}
          <Text style={styles.activeDaysLabel}>ACTIVE ON DAYS</Text>
          <View style={styles.daysBox}>
            <Text style={styles.daysText}>M  T  W  T  F  S  S</Text>
          </View>
        </View>

        {/* Save Preferences Button matching screenshot 3 */}
        <TouchableOpacity
          style={styles.savePreferencesBtn}
          onPress={handleSavePreferences}
          activeOpacity={0.85}
        >
          <Text style={styles.savePreferencesBtnText}>Save Preferences</Text>
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
    marginBottom: 16,
  },

  /* Channel Rows (Simple Label + Switch) */
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  channelLabel: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },

  /* Alert Rows (Title + Subtitle + Switch) */
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 6,
  },
  alertTextCol: {
    flex: 1,
    marginRight: 14,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  alertSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 18,
  },

  /* Clinical Quiet Hours Elements */
  quietHoursRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 14,
  },
  timeBlockCol: {
    flex: 1,
  },
  timeFieldLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  timeBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  timeDigits: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 20,
  },
  timePeriod: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 2,
  },
  activeDaysLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  daysBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  daysText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 10,
  },

  /* Save Preferences Button */
  savePreferencesBtn: {
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
  savePreferencesBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
