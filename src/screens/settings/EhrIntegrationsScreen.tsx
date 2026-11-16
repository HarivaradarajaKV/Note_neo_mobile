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

export const EhrIntegrationsScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  // Sync settings toggles
  const [syncDemographics, setSyncDemographics] = useState(true);
  const [syncSoapNotes, setSyncSoapNotes] = useState(true);
  const [syncLabOrders, setSyncLabOrders] = useState(true);
  const [syncPrescriptions, setSyncPrescriptions] = useState(true);

  const handleAddNewIntegration = () => {
    Alert.alert(
      'Add New EHR Integration',
      'Select your hospital or health network EHR provider:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Epic Systems (FHIR R4)',
          onPress: () =>
            Alert.alert('Epic Integration', 'Redirecting to Epic OAuth2 Authorization Gateway.'),
        },
        {
          text: 'Oracle Cerner (Millennium)',
          onPress: () =>
            Alert.alert('Cerner Integration', 'Redirecting to Cerner Ignite API Gateway.'),
        },
        {
          text: 'AthenaHealth',
          onPress: () =>
            Alert.alert('AthenaHealth Integration', 'Connecting via Athena Practice Partner ID.'),
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
          <Text style={styles.mainTitle}>EHR integrations</Text>
          <Text style={styles.subtitle}>Account settings · All settings synced</Text>
        </View>

        {/* Action Button: + Add New Integration matching screenshot 1 */}
        <TouchableOpacity
          style={styles.addIntegrationBtn}
          onPress={handleAddNewIntegration}
          activeOpacity={0.85}
        >
          <Text style={styles.addIntegrationBtnText}>+ Add New Integration</Text>
        </TouchableOpacity>

        {/* Card 1: Real-Time Sync Settings matching screenshots 1 & 2 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>Real-Time Sync Settings</Text>

          {/* AUTO-SYNC FREQUENCY */}
          <Text style={styles.fieldLabel}>AUTO-SYNC FREQUENCY</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>Every 15 min</Text>
          </View>

          {/* SYNC DIRECTION */}
          <Text style={styles.fieldLabel}>SYNC DIRECTION</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>Bidirectional (Read & Write)</Text>
          </View>

          {/* Toggle 1: Patient Demographics & Vitals */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Patient Demographics & Vitals</Text>
            <Switch
              value={syncDemographics}
              onValueChange={setSyncDemographics}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Toggle 2: SOAP Clinical Notes (Auto-Export) */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>SOAP Clinical Notes (Auto-Export)</Text>
            <Switch
              value={syncSoapNotes}
              onValueChange={setSyncSoapNotes}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Toggle 3: Lab Orders & Diagnostics */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>Lab Orders & Diagnostics</Text>
            <Switch
              value={syncLabOrders}
              onValueChange={setSyncLabOrders}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Toggle 4: Discovered Prescriptions */}
          <View style={[styles.toggleRow, { marginBottom: 0, paddingBottom: 0, borderBottomWidth: 0 }]}>
            <Text style={styles.toggleText}>Discovered Prescriptions</Text>
            <Switch
              value={syncPrescriptions}
              onValueChange={setSyncPrescriptions}
              trackColor={{ true: '#2563EB', false: '#CBD5E1' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Card 2: Clinical API Health matching screenshot 2 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>Clinical API Health</Text>

          {/* Online status badge */}
          <View style={styles.onlineBadge}>
            <Text style={styles.onlineBadgeText}>ONLINE</Text>
          </View>

          {/* GATEWAY ENDPOINT */}
          <Text style={styles.fieldLabel}>GATEWAY ENDPOINT</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>fhir-gateway.mediscribe.private/v1</Text>
          </View>

          {/* API UPTIME */}
          <Text style={styles.fieldLabel}>API UPTIME</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>99.98%</Text>
          </View>

          {/* LAST SYNC RESPONSE */}
          <Text style={styles.fieldLabel}>LAST SYNC RESPONSE</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>200 OK</Text>
          </View>

          {/* LAST SUCCESSFUL EHR WRITE */}
          <Text style={styles.fieldLabel}>LAST SUCCESSFUL EHR WRITE</Text>
          <View style={[styles.fieldBox, { marginBottom: 0 }]}>
            <Text style={styles.fieldValue}>Haylie Saris record written at 10:28 AM today</Text>
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

  /* + Add New Integration Button */
  addIntegrationBtn: {
    backgroundColor: '#0F172A',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  addIntegrationBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
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

  /* API Health Status Badge */
  onlineBadge: {
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignSelf: 'stretch',
  },
  onlineBadgeText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#059669',
    letterSpacing: 0.5,
  },
});
