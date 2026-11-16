import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';

interface Props {
  navigation?: any;
}

const ACCOUNT_SETTINGS_OPTIONS = [
  { id: 'security', label: 'Clinical Security ›', description: 'Two-Factor Authentication, biometric access, and active sessions.' },
  { id: 'notifications', label: 'Notifications ›', description: 'Urgent consult alerts, appointment updates, and scribe reminders.' },
  { id: 'ehr', label: 'EHR Integrations ›', description: 'Epic, Cerner, AthenaHealth, HL7/FHIR connection status.' },
  { id: 'model_preset', label: 'AI Scribe Model Preset ›', description: 'Clinical specialty fine-tuning and vocabulary expansions.' },
  { id: 'billing', label: 'Billing & Licenses ›', description: 'Institutional practice subscription, active clinician seats, NPI verification.' },
  { id: 'preferences', label: 'System Preferences ›', description: 'Appearance, microphone input boost, and audio diagnostics.' },
];

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { logout } = useMobileApp();

  // Practice Information Form State
  const [clinicName, setClinicName] = useState('Metro Heart & Vascular Institute');
  const [primaryAddress, setPrimaryAddress] = useState('100 Medical Plaza, Suite 400, Chicago IL');
  const [clinicPhone, setClinicPhone] = useState('+1 (312) 555-0143');
  const [workEmail, setWorkEmail] = useState('dr.marleen@metroheart.org');

  const handleUploadPhoto = () => {
    Alert.alert(
      'Profile Photo',
      'Upload a new high-resolution photo for clinician profile verification.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Choose from Library',
          onPress: () =>
            Alert.alert('Photo Updated', 'Your clinician profile picture has been updated.'),
        },
      ]
    );
  };

  const handleSaveProfile = () => {
    Alert.alert(
      'Settings Saved',
      'Practice details and clinical contact information have been updated successfully across all devices.'
    );
  };

  const handleAddTimeBlock = () => {
    Alert.alert(
      'Add Time Block',
      'Select a day and enter clinic working hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add Saturday (09:00 AM - 01:00 PM)',
          onPress: () =>
            Alert.alert('Working Hours Added', 'Weekend morning clinic block added to schedule.'),
        },
      ]
    );
  };

  const handleSettingClick = (item: typeof ACCOUNT_SETTINGS_OPTIONS[0]) => {
    if (item.id === 'preferences') {
      navigation?.navigate('SystemPreferences');
      return;
    }
    if (item.id === 'billing') {
      navigation?.navigate('BillingLicenses');
      return;
    }
    if (item.id === 'model_preset') {
      navigation?.navigate('AiScribePreset');
      return;
    }
    if (item.id === 'ehr') {
      navigation?.navigate('EhrIntegrations');
      return;
    }
    if (item.id === 'notifications') {
      navigation?.navigate('Notifications');
      return;
    }
    if (item.id === 'security') {
      navigation?.navigate('ClinicalSecurity');
      return;
    }
    Alert.alert(
      item.label.replace(' ›', ''),
      item.description,
      [
        { text: 'Close', style: 'cancel' },
        {
          text: 'Configure',
          onPress: () =>
            Alert.alert('Updated', `${item.label.replace(' ›', '')} preferences synced.`),
        },
      ]
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

            <TouchableOpacity activeOpacity={0.8}>
              <Image
                source={require('../../../assets/doctor-avatar.png')}
                style={styles.doctorAvatar}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title Section matching screenshot */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Profile & settings</Text>
          <Text style={styles.subtitle}>Account settings · All settings synced</Text>
        </View>

        {/* Doctor Profile Card matching screenshot 1 */}
        <View style={styles.cardContainer}>
          <View style={styles.doctorRow}>
            <Image
              source={require('../../../assets/doctor-avatar.png')}
              style={styles.profileAvatar}
            />
            <View style={styles.doctorMetaCol}>
              <Text style={styles.doctorName}>Dr. Marleen</Text>
              <Text style={styles.doctorSub}>
                General Physician · Cardiology Subspecialist
              </Text>
            </View>
          </View>

          {/* Status Badge: Verified & Active */}
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedBadgeText}>Verified & Active</Text>
          </View>

          {/* NPI License */}
          <Text style={styles.npiText}>NPI License: #194829140</Text>

          {/* Upload New Photo Button */}
          <TouchableOpacity
            style={styles.uploadPhotoBtn}
            onPress={handleUploadPhoto}
            activeOpacity={0.85}
          >
            <Text style={styles.uploadPhotoBtnText}>Upload New Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Practice Information Card matching screenshots 1 & 2 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>Practice Information</Text>

          {/* Clinic Name */}
          <Text style={styles.inputLabel}>Clinic name</Text>
          <TextInput
            style={styles.inputField}
            value={clinicName}
            onChangeText={setClinicName}
            placeholder="Clinic name"
            placeholderTextColor="#94A3B8"
          />

          {/* Primary Address */}
          <Text style={styles.inputLabel}>Primary address</Text>
          <TextInput
            style={styles.inputField}
            value={primaryAddress}
            onChangeText={setPrimaryAddress}
            placeholder="Primary address"
            placeholderTextColor="#94A3B8"
          />

          {/* Clinic Phone */}
          <Text style={styles.inputLabel}>Clinic phone</Text>
          <TextInput
            style={styles.inputField}
            value={clinicPhone}
            onChangeText={setClinicPhone}
            placeholder="Clinic phone"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
          />

          {/* Clinical Work Email */}
          <Text style={styles.inputLabel}>Clinical work email</Text>
          <TextInput
            style={[styles.inputField, { marginBottom: 0 }]}
            value={workEmail}
            onChangeText={setWorkEmail}
            placeholder="Clinical work email"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Save Profile Settings Button matching screenshot 2 */}
        <TouchableOpacity
          style={styles.saveProfileBtn}
          onPress={handleSaveProfile}
          activeOpacity={0.85}
        >
          <Text style={styles.saveProfileBtnText}>Save Profile Settings</Text>
        </TouchableOpacity>

        {/* Account Settings Card matching screenshots 2 & 3 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>Account settings</Text>

          {ACCOUNT_SETTINGS_OPTIONS.map((item, index) => {
            const isLast = index === ACCOUNT_SETTINGS_OPTIONS.length - 1;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.accountOptionBox, isLast && { marginBottom: 0 }]}
                onPress={() => handleSettingClick(item)}
                activeOpacity={0.75}
              >
                <Text style={styles.accountOptionText}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Clinical Working Hours Card matching screenshots 3 & 4 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>Clinical Working Hours</Text>

          {/* Monday */}
          <Text style={styles.dayLabel}>Monday</Text>
          <View style={styles.hoursBox}>
            <Text style={styles.hoursText}>08:00 AM - 05:00 PM</Text>
          </View>

          {/* Tuesday */}
          <Text style={styles.dayLabel}>Tuesday</Text>
          <View style={styles.hoursBox}>
            <Text style={styles.hoursText}>08:00 AM - 05:00 PM</Text>
          </View>

          {/* Wednesday */}
          <Text style={styles.dayLabel}>Wednesday</Text>
          <View style={styles.hoursBox}>
            <Text style={styles.hoursText}>08:00 AM - 05:00 PM</Text>
          </View>

          {/* Thursday */}
          <Text style={styles.dayLabel}>Thursday</Text>
          <View style={styles.hoursBox}>
            <Text style={styles.hoursText}>08:00 AM - 05:00 PM</Text>
          </View>

          {/* Friday */}
          <Text style={styles.dayLabel}>Friday</Text>
          <View style={styles.hoursBox}>
            <Text style={styles.hoursText}>08:00 AM - 05:00 PM</Text>
          </View>

          {/* + Add Time Block Button matching screenshot 4 */}
          <TouchableOpacity
            style={styles.addTimeBlockBtn}
            onPress={handleAddTimeBlock}
            activeOpacity={0.85}
          >
            <Text style={styles.addTimeBlockBtnText}>+ Add Time Block</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Option */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={() => {
            Alert.alert('Sign Out', 'Are you sure you want to log out of MediScribe?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign Out', style: 'destructive', onPress: logout },
            ]);
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={16} color="#94A3B8" style={{ marginRight: 6 }} />
          <Text style={styles.signOutBtnText}>Sign Out of Clinician Account</Text>
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

  /* Doctor Profile Card Elements */
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  doctorMetaCol: {
    flex: 1,
  },
  doctorName: {
    fontSize: 17.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  doctorSub: {
    fontSize: 13.5,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '400',
  },
  verifiedBadge: {
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginTop: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignSelf: 'stretch',
  },
  verifiedBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
  },
  npiText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    fontWeight: '400',
  },
  uploadPhotoBtn: {
    backgroundColor: '#2563EB',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  uploadPhotoBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  /* Practice Information Elements */
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  inputField: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    fontSize: 14.5,
    color: '#0F172A',
    fontWeight: '500',
    marginBottom: 14,
  },

  /* Save Profile Settings Button */
  saveProfileBtn: {
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
  saveProfileBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  /* Account Settings Items */
  accountOptionBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  accountOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2563EB',
  },

  /* Clinical Working Hours Elements */
  dayLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  hoursBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 14,
  },
  hoursText: {
    fontSize: 14.5,
    color: '#0F172A',
    fontWeight: '500',
  },
  addTimeBlockBtn: {
    backgroundColor: '#2563EB',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
  },
  addTimeBlockBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  /* Sign Out Button */
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  signOutBtnText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
