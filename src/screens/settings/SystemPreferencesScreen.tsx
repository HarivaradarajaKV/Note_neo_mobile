import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

interface Props {
  navigation?: any;
}

export const SystemPreferencesScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  // Appearance state matching screenshot 1
  const [lightMode, setLightMode] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [systemSync, setSystemSync] = useState(false);

  // Language & Region state matching screenshot 1
  const [systemLanguage, setSystemLanguage] = useState('English (United States)');
  const [timezonePreference, setTimezonePreference] = useState('CST - Central Standard Time');
  const [dateFormat, setDateFormat] = useState('MM / DD / YYYY');

  // Default Landing & Views state matching screenshot 2
  const [defaultLanding, setDefaultLanding] = useState('Patients Registry File');
  const [recordsShown, setRecordsShown] = useState('25 Rows (Default contrast)');
  const [autoRefreshInterval, setAutoRefreshInterval] = useState('30 seconds');

  // Local Cache & Backups state matching screenshot 2 & 3
  const [cacheSize, setCacheSize] = useState('142.4 MB allocated');
  const [autoSaveInterval, setAutoSaveInterval] = useState('Every 2 minutes (Encrypted)');
  const [preferSecurePdf, setPreferSecurePdf] = useState(true);
  const [preferCsvTables, setPreferCsvTables] = useState(false);

  const handleLightModeToggle = (value: boolean) => {
    setLightMode(value);
    if (value) {
      setDarkMode(false);
      setSystemSync(false);
    }
  };

  const handleDarkModeToggle = (value: boolean) => {
    setDarkMode(value);
    if (value) {
      setLightMode(false);
      setSystemSync(false);
    }
  };

  const handleSystemSyncToggle = (value: boolean) => {
    setSystemSync(value);
    if (value) {
      setLightMode(false);
      setDarkMode(false);
    }
  };

  const handleSelectLanguage = () => {
    Alert.alert(
      'System Language',
      'Select clinical operating language for MediScribe:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'English (United States) ✓',
          onPress: () => setSystemLanguage('English (United States)'),
        },
        {
          text: 'English (United Kingdom)',
          onPress: () => setSystemLanguage('English (United Kingdom)'),
        },
        {
          text: 'Spanish (Latin America)',
          onPress: () => setSystemLanguage('Spanish (Latin America)'),
        },
      ]
    );
  };

  const handleSelectTimezone = () => {
    Alert.alert(
      'Timezone Preference',
      'Select clinic local operating timezone:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'CST - Central Standard Time ✓',
          onPress: () => setTimezonePreference('CST - Central Standard Time'),
        },
        {
          text: 'EST - Eastern Standard Time',
          onPress: () => setTimezonePreference('EST - Eastern Standard Time'),
        },
        {
          text: 'PST - Pacific Standard Time',
          onPress: () => setTimezonePreference('PST - Pacific Standard Time'),
        },
      ]
    );
  };

  const handleSelectDateFormat = () => {
    Alert.alert(
      'Date Format',
      'Select clinical documentation date format:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'MM / DD / YYYY (US Standard) ✓',
          onPress: () => setDateFormat('MM / DD / YYYY'),
        },
        {
          text: 'DD / MM / YYYY (International)',
          onPress: () => setDateFormat('DD / MM / YYYY'),
        },
        {
          text: 'YYYY-MM-DD (ISO 8601)',
          onPress: () => setDateFormat('YYYY-MM-DD'),
        },
      ]
    );
  };

  const handleSelectLanding = () => {
    Alert.alert(
      'Default Landing Dashboard',
      'Select the primary screen displayed upon launch:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Patients Registry File ✓',
          onPress: () => setDefaultLanding('Patients Registry File'),
        },
        {
          text: 'Live Consultation Room',
          onPress: () => setDefaultLanding('Live Consultation Room'),
        },
        {
          text: 'Clinic Daily Schedule',
          onPress: () => setDefaultLanding('Clinic Daily Schedule'),
        },
      ]
    );
  };

  const handleSelectRecords = () => {
    Alert.alert(
      'Records Shown Per Page',
      'Select table pagination density:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '10 Rows',
          onPress: () => setRecordsShown('10 Rows'),
        },
        {
          text: '25 Rows (Default contrast) ✓',
          onPress: () => setRecordsShown('25 Rows (Default contrast)'),
        },
        {
          text: '50 Rows (High density)',
          onPress: () => setRecordsShown('50 Rows (High density)'),
        },
      ]
    );
  };

  const handleSelectRefreshInterval = () => {
    Alert.alert(
      'Auto-Refresh Interval',
      'Select background registry polling frequency:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '15 seconds',
          onPress: () => setAutoRefreshInterval('15 seconds'),
        },
        {
          text: '30 seconds ✓',
          onPress: () => setAutoRefreshInterval('30 seconds'),
        },
        {
          text: '60 seconds',
          onPress: () => setAutoRefreshInterval('60 seconds'),
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Local Cache',
      'Clear 142.4 MB of temporary diagnostic cache, wave samples, and local logs? Encounter clinical notes remain secure in cloud.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Cache',
          style: 'destructive',
          onPress: () => {
            setCacheSize('0.0 MB allocated');
            Alert.alert('Cache Cleared', 'Local diagnostic cache emptied successfully.');
          },
        },
      ]
    );
  };

  const handleSelectAutoSave = () => {
    Alert.alert(
      'Auto-Save Drafts Interval',
      'Select automatic SOAP note encryption interval:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Every 1 minute (Encrypted)',
          onPress: () => setAutoSaveInterval('Every 1 minute (Encrypted)'),
        },
        {
          text: 'Every 2 minutes (Encrypted) ✓',
          onPress: () => setAutoSaveInterval('Every 2 minutes (Encrypted)'),
        },
        {
          text: 'Every 5 minutes (Encrypted)',
          onPress: () => setAutoSaveInterval('Every 5 minutes (Encrypted)'),
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
          <Text style={styles.mainTitle}>System preferences</Text>
          <Text style={styles.subtitle}>Account settings · All settings synced</Text>
        </View>

        {/* Card 1: System Appearance matching screenshot 1 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>System Appearance</Text>

          {/* Light Mode */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Light Mode</Text>
              <Text style={styles.settingSubtitle}>Standard clinical view contrast</Text>
            </View>
            <Switch
              value={lightMode}
              onValueChange={handleLightModeToggle}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Dark Mode */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingSubtitle}>Reduced glare for low light wards</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={handleDarkModeToggle}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* System Sync */}
          <View style={[styles.settingRow, { marginBottom: 0 }]}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>System Sync</Text>
              <Text style={styles.settingSubtitle}>Matches client OS scheduler</Text>
            </View>
            <Switch
              value={systemSync}
              onValueChange={handleSystemSyncToggle}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Card 2: Language & Region matching screenshot 1 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>Language & Region</Text>

          {/* SYSTEM LANGUAGE */}
          <Text style={styles.fieldLabel}>SYSTEM LANGUAGE</Text>
          <TouchableOpacity
            style={styles.fieldBox}
            onPress={handleSelectLanguage}
            activeOpacity={0.8}
          >
            <Text style={styles.fieldValue}>{systemLanguage}</Text>
          </TouchableOpacity>

          {/* TIMEZONE PREFERENCE */}
          <Text style={styles.fieldLabel}>TIMEZONE PREFERENCE</Text>
          <TouchableOpacity
            style={styles.fieldBox}
            onPress={handleSelectTimezone}
            activeOpacity={0.8}
          >
            <Text style={styles.fieldValue}>{timezonePreference}</Text>
          </TouchableOpacity>

          {/* DATE FORMAT */}
          <Text style={styles.fieldLabel}>DATE FORMAT</Text>
          <TouchableOpacity
            style={[styles.fieldBox, { marginBottom: 0 }]}
            onPress={handleSelectDateFormat}
            activeOpacity={0.8}
          >
            <Text style={styles.fieldValue}>{dateFormat}</Text>
          </TouchableOpacity>
        </View>

        {/* Card 3: Default Landing & Views matching screenshot 2 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>Default Landing & Views</Text>

          {/* DEFAULT LANDING DASHBOARD */}
          <Text style={styles.fieldLabel}>DEFAULT LANDING DASHBOARD</Text>
          <TouchableOpacity
            style={styles.fieldBox}
            onPress={handleSelectLanding}
            activeOpacity={0.8}
          >
            <Text style={styles.fieldValue}>{defaultLanding}</Text>
          </TouchableOpacity>

          {/* RECORDS SHOWN PER PAGE */}
          <Text style={styles.fieldLabel}>RECORDS SHOWN PER PAGE</Text>
          <TouchableOpacity
            style={styles.fieldBox}
            onPress={handleSelectRecords}
            activeOpacity={0.8}
          >
            <Text style={styles.fieldValue}>{recordsShown}</Text>
          </TouchableOpacity>

          {/* AUTO-REFRESH INTERVAL */}
          <Text style={styles.fieldLabel}>AUTO-REFRESH INTERVAL</Text>
          <TouchableOpacity
            style={[styles.fieldBox, { marginBottom: 0 }]}
            onPress={handleSelectRefreshInterval}
            activeOpacity={0.8}
          >
            <Text style={styles.fieldValue}>{autoRefreshInterval}</Text>
          </TouchableOpacity>
        </View>

        {/* Card 4: Local Cache & Backups matching screenshots 2 & 3 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>Local Cache & Backups</Text>

          {/* LOCAL DIAGNOSTIC CACHE SIZE */}
          <Text style={styles.fieldLabel}>LOCAL DIAGNOSTIC CACHE SIZE</Text>
          <View style={[styles.fieldBox, { marginBottom: 12 }]}>
            <Text style={styles.fieldValue}>{cacheSize}</Text>
          </View>

          {/* Clear Cache Button */}
          <TouchableOpacity
            style={styles.clearCacheBtn}
            onPress={handleClearCache}
            activeOpacity={0.85}
          >
            <Text style={styles.clearCacheBtnText}>Clear Cache</Text>
          </TouchableOpacity>

          {/* AUTO-SAVE DRAFTS INTERVAL */}
          <Text style={styles.fieldLabel}>AUTO-SAVE DRAFTS INTERVAL</Text>
          <TouchableOpacity
            style={[styles.fieldBox, { marginBottom: 14 }]}
            onPress={handleSelectAutoSave}
            activeOpacity={0.8}
          >
            <Text style={styles.fieldValue}>{autoSaveInterval}</Text>
          </TouchableOpacity>

          {/* Prefer secure PDF */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Prefer secure PDF</Text>
            <Switch
              value={preferSecurePdf}
              onValueChange={setPreferSecurePdf}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Prefer CSV data tables */}
          <View style={[styles.toggleRow, { marginBottom: 0 }]}>
            <Text style={styles.toggleLabel}>Prefer CSV data tables</Text>
            <Switch
              value={preferCsvTables}
              onValueChange={setPreferCsvTables}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>
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
    marginBottom: 16,
  },

  /* Setting Rows (Title + Subtitle + Switch) */
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 8,
  },
  settingTextCol: {
    flex: 1,
    marginRight: 14,
  },
  settingTitle: {
    fontSize: 15.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },

  /* Field Labels & Input Boxes */
  fieldLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  fieldBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 16,
  },
  fieldValue: {
    fontSize: 14.5,
    color: '#0F172A',
    fontWeight: '500',
  },

  /* Clear Cache Button matching screenshot 2 & 3 */
  clearCacheBtn: {
    backgroundColor: '#64748B',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  clearCacheBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  /* Simple Toggle Row (Label + Switch) matching screenshot 3 */
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 8,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0F172A',
  },
});
