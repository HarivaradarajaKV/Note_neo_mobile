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
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

interface Props {
  navigation?: any;
}

export const ClinicalSecurityScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [ipadRevoked, setIpadRevoked] = useState(false);

  const handleToggle2FA = (val: boolean) => {
    setIs2FAEnabled(val);
    Alert.alert(
      val ? '2FA Enabled' : '2FA Disabled',
      val
        ? 'Two-Factor Authentication is active via Authenticator App.'
        : 'Warning: Disabling 2FA decreases account security and may violate institutional compliance.'
    );
  };

  const handleRevokeiPad = () => {
    Alert.alert(
      'Revoke Session',
      'Are you sure you want to terminate the remote iPad Pro session in Room 4?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke',
          style: 'destructive',
          onPress: () => {
            setIpadRevoked(true);
            Alert.alert('Session Terminated', 'Remote iPad Pro 11" session has been logged out.');
          },
        },
      ]
    );
  };

  const handleUpdatePassword = () => {
    Alert.alert(
      'Update Password',
      'A secure reset link and one-time verification token have been sent to dr.marleen@metroheart.org.'
    );
  };

  const handleExportHIPAALog = async () => {
    const logData = `MEDISCRIBE CLINICAL SECURITY & HIPAA AUDIT LOG\nClinician: Dr. Marleen (NPI #194829140)\nClinic: Metro Heart & Vascular Institute\nAudit Hash: SHA-256 4b9a9d...2dfa\nEncryption: AES-256 GCM End-to-End\n\nEVENTS:\n- 10:28 AM: NPI Verification Check (Successful · 192.168.1.142)\n- 09:15 AM: User Authentication (2FA Verified · 192.168.1.142)\n- Yesterday: Patient EHR Sync Event (Synced Haylie S. · 10.0.4.89)\n- 23 Jan 2026: Password Updated (Secure Change · 192.168.1.142)\n- 22 Jan 2026: EHR Auth Key Roll (Key Rotated · 192.168.1.1)`;
    try {
      await Share.share({
        title: 'HIPAA Security Audit Trail',
        message: logData,
      });
    } catch (err: any) {
      Alert.alert('Export Log', 'HIPAA encrypted audit log generated successfully.');
    }
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
          <Text style={styles.mainTitle}>Clinical security</Text>
          <Text style={styles.subtitle}>Account settings · All settings synced</Text>
        </View>

        {/* Card 1: Two-Factor Authentication matching screenshot 1 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>Two-Factor Authentication</Text>

          {/* Toggle Row */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Two-factor authentication (2FA)</Text>
            <Switch
              value={is2FAEnabled}
              onValueChange={handleToggle2FA}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <Text style={styles.toggleSubtitle}>
            Secure your account using a secondary verification factor
          </Text>

          {/* Status Badge: Active · Authenticator App */}
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedBadgeText}>
              Active · Authenticator App (Recommended)
            </Text>
          </View>

          {/* Item 1: Authenticator app */}
          <Text style={styles.fieldLabel}>Authenticator app</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>Use Google Auth or Duo</Text>
          </View>

          {/* Item 2: SMS Text Messaging */}
          <Text style={styles.fieldLabel}>SMS Text Messaging</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>Backup via +1 (312) ***-**43</Text>
          </View>

          {/* Item 3: Backup Email Codes */}
          <Text style={styles.fieldLabel}>Backup Email Codes</Text>
          <View style={[styles.fieldBox, { marginBottom: 0 }]}>
            <Text style={styles.fieldValue}>dr.marleen@metroheart.org</Text>
          </View>
        </View>

        {/* Card 2: Active Sessions matching screenshots 1 & 2 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>Active Sessions</Text>

          {/* Session 1: MacBook Pro 16" */}
          <Text style={styles.fieldLabel}>MacBook Pro 16" · Active Now</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>Chicago, IL • 192.168.1.142</Text>
          </View>

          {/* Session 2: iPad Pro 11" */}
          <Text style={styles.fieldLabel}>iPad Pro 11" · 2 mins ago</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>
              {ipadRevoked ? 'Revoked · Session Terminated' : 'Metro Clinic (Room 4) • 10.0.4.89'}
            </Text>
          </View>

          {/* Action Button: Revoke iPad session */}
          {!ipadRevoked ? (
            <TouchableOpacity
              style={styles.darkActionBtn}
              onPress={handleRevokeiPad}
              activeOpacity={0.85}
            >
              <Text style={styles.darkActionBtnText}>Revoke iPad session</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.revokedPill}>
              <Text style={styles.revokedPillText}>iPad Session Successfully Revoked</Text>
            </View>
          )}
        </View>

        {/* Card 3: Password Security matching screenshots 2 & 3 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>Password Security</Text>

          <Text style={styles.fieldLabel}>Password</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.passwordDots}>••••••••••••••</Text>
          </View>

          <View style={styles.passwordHintsCol}>
            <Text style={styles.passwordHintText}>At least 12 characters long</Text>
            <Text style={styles.passwordHintText}>Includes a capital letter and a symbol</Text>
            <Text style={styles.passwordHintText}>Not used in previous 3 resets</Text>
          </View>

          {/* Update Password Button */}
          <TouchableOpacity
            style={styles.blueActionBtn}
            onPress={handleUpdatePassword}
            activeOpacity={0.85}
          >
            <Text style={styles.blueActionBtnText}>Update Password</Text>
          </TouchableOpacity>
        </View>

        {/* Card 4: Recent Security Actions matching screenshots 3, 4 & 5 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>Recent Security Actions</Text>

          {/* Action 1 */}
          <Text style={styles.fieldLabel}>10:28 AM · NPI Verification Check</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>Successful · 192.168.1.142</Text>
          </View>

          {/* Action 2 */}
          <Text style={styles.fieldLabel}>09:15 AM · User Authentication</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>2FA Verified · 192.168.1.142</Text>
          </View>

          {/* Action 3 */}
          <Text style={styles.fieldLabel}>Yesterday · Patient EHR Sync Event</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>Synced (Haylie S.) · 10.0.4.89</Text>
          </View>

          {/* Action 4 */}
          <Text style={styles.fieldLabel}>23 Jan 2026 · Password Updated</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>Secure Change · 192.168.1.142</Text>
          </View>

          {/* Action 5 */}
          <Text style={styles.fieldLabel}>22 Jan 2026 · EHR Auth Key Roll</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>Key Rotated · 192.168.1.1</Text>
          </View>

          {/* Export Full HIPAA Log Button matching screenshots 4 & 5 */}
          <TouchableOpacity
            style={styles.darkActionBtn}
            onPress={handleExportHIPAALog}
            activeOpacity={0.85}
          >
            <Text style={styles.darkActionBtnText}>Export Full HIPAA Log</Text>
          </TouchableOpacity>
        </View>

        {/* AES-256 Encryption Pill Banner matching screenshot 5 */}
        <View style={styles.encryptionPill}>
          <Text style={styles.encryptionPillText}>
            AES-256 End-to-End Encryption Active
          </Text>
        </View>
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

  /* Two-Factor Toggle Row */
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  toggleSubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    marginTop: 6,
    marginBottom: 14,
  },
  verifiedBadge: {
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
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

  /* Form & Data Boxes */
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
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

  /* Action Buttons */
  darkActionBtn: {
    backgroundColor: '#0F172A',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkActionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  blueActionBtn: {
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
  blueActionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  /* Password Security */
  passwordDots: {
    fontSize: 16,
    color: '#0F172A',
    letterSpacing: 2,
  },
  passwordHintsCol: {
    marginBottom: 16,
    gap: 3,
  },
  passwordHintText: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },

  /* Revoked Pill */
  revokedPill: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  revokedPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },

  /* AES-256 Encryption Pill */
  encryptionPill: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  encryptionPillText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#059669',
  },
});
