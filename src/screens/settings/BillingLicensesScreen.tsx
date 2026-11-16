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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

interface Props {
  navigation?: any;
}

export const BillingLicensesScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [copiedKey, setCopiedKey] = useState(false);

  const handleManageSubscription = () => {
    Alert.alert(
      'Manage Subscription',
      'MediScribe Professional plan is active. Renewal date is Feb 24, 2026 at $149.00/month.',
      [
        { text: 'Close', style: 'cancel' },
        {
          text: 'Cancel Auto-Renew',
          style: 'destructive',
          onPress: () => Alert.alert('Action Pending', 'Contact clinic admin to modify enterprise billing terms.'),
        },
      ]
    );
  };

  const handleUpgradePlan = () => {
    Alert.alert(
      'Upgrade Plan',
      'Choose an institutional license tier:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Enterprise Multi-Specialty ($299/mo)',
          onPress: () => Alert.alert('Plan Requested', 'Upgrade request submitted to Apollo/Apex Clinic Administrator.'),
        },
      ]
    );
  };

  const handleCopyKey = () => {
    setCopiedKey(true);
    Alert.alert('License Copied', 'License key MED-9482-XXXX-4910-PRO copied to clipboard.');
    setTimeout(() => setCopiedKey(false), 3000);
  };

  const handleUpdatePayment = () => {
    Alert.alert(
      'Update Payment Method',
      'Enter new clinical debit/credit card or hospital corporate invoice PO account.'
    );
  };

  const handleDownloadInvoice = (invoiceDate: string) => {
    Alert.alert(
      'Download Invoice',
      `Official receipt for ${invoiceDate} ($149.00 USD) downloaded with PDF tax invoice and tax breakdown.`
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
          <Text style={styles.mainTitle}>Billing & licenses</Text>
          <Text style={styles.subtitle}>Account settings · All settings synced</Text>
        </View>

        {/* Card 1: Subscription Details matching screenshot 1 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>Subscription Details</Text>

          {/* Status Badge: Active & Valid */}
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>Active & Valid</Text>
          </View>

          {/* Plan Name */}
          <Text style={styles.planNameText}>MediScribe Professional</Text>

          {/* Plan Price */}
          <Text style={styles.planPriceText}>$149.00 / month</Text>

          {/* NEXT RENEWAL DATE */}
          <Text style={styles.fieldLabel}>NEXT RENEWAL DATE</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>Feb 24, 2026</Text>
          </View>

          {/* Manage Subscription Button */}
          <TouchableOpacity
            style={styles.darkActionBtn}
            onPress={handleManageSubscription}
            activeOpacity={0.85}
          >
            <Text style={styles.darkActionBtnText}>Manage Subscription</Text>
          </TouchableOpacity>

          {/* Upgrade Plan Button */}
          <TouchableOpacity
            style={styles.blueActionBtn}
            onPress={handleUpgradePlan}
            activeOpacity={0.85}
          >
            <Text style={styles.blueActionBtnText}>Upgrade Plan</Text>
          </TouchableOpacity>
        </View>

        {/* Card 2: License Key & Seats matching screenshots 1 & 2 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>License Key & Seats</Text>

          {/* LICENSE KEY */}
          <Text style={styles.fieldLabel}>LICENSE KEY</Text>
          <View style={[styles.fieldBox, { marginBottom: 12 }]}>
            <Text style={styles.fieldValue}>MED-9482-XXXX-4910-PRO</Text>
          </View>

          {/* Copy Key Button */}
          <TouchableOpacity
            style={styles.copyKeyBtn}
            onPress={handleCopyKey}
            activeOpacity={0.85}
          >
            <Text style={styles.copyKeyBtnText}>
              {copiedKey ? '✓ Key Copied' : 'Copy Key'}
            </Text>
          </TouchableOpacity>

          {/* SEATS ASSIGNED */}
          <Text style={styles.fieldLabel}>SEATS ASSIGNED</Text>
          <View style={[styles.fieldBox, { marginBottom: 10 }]}>
            <Text style={styles.fieldValue}>3 of 5 active seats</Text>
          </View>

          {/* Progress Bar for Seats (60% filled) */}
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
        </View>

        {/* Card 3: Primary Payment Method matching screenshots 2 & 3 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>Primary Payment Method</Text>
          <Text style={styles.paymentSubText}>Visa ending in 4242</Text>

          {/* Expiration Box */}
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>Expires 08 / 2029</Text>
          </View>

          {/* Update Payment Button */}
          <TouchableOpacity
            style={styles.blueActionBtn}
            onPress={handleUpdatePayment}
            activeOpacity={0.85}
          >
            <Text style={styles.blueActionBtnText}>Update Payment</Text>
          </TouchableOpacity>
        </View>

        {/* Card 4: Current Month Usage Summary matching screenshots 3 & 4 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>Current Month Usage Summary</Text>

          {/* CLOUD HEALTH RECORD STORAGE */}
          <Text style={styles.fieldLabel}>CLOUD HEALTH RECORD STORAGE</Text>
          <View style={[styles.fieldBox, { marginBottom: 10 }]}>
            <Text style={styles.fieldValue}>2.3 GB of 10.0 GB Used (23%)</Text>
          </View>

          {/* Progress Bar for Storage (23% filled) */}
          <View style={[styles.progressTrack, { marginBottom: 14 }]}>
            <View style={[styles.progressFill, { width: '23%' }]} />
          </View>

          {/* CONSULTATIONS TRANSCRIPTIONS */}
          <Text style={styles.fieldLabel}>CONSULTATIONS TRANSCRIPTIONS</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>47 sessions</Text>
          </View>

          {/* AI NOTES GENERATED */}
          <Text style={styles.fieldLabel}>AI NOTES GENERATED</Text>
          <View style={[styles.fieldBox, { marginBottom: 0 }]}>
            <Text style={styles.fieldValue}>142 summaries</Text>
          </View>
        </View>

        {/* Card 5: Billing & Invoice History matching screenshots 4 & 5 */}
        <View style={styles.cardContainer}>
          <Text style={styles.cardMainHeading}>Billing & Invoice History</Text>

          {/* Invoice 1: Jan 24, 2026 */}
          <Text style={styles.invoiceDateText}>Jan 24, 2026</Text>
          <Text style={styles.invoicePlanText}>MediScribe Pro - Monthly Renewal</Text>
          <Text style={styles.invoiceAmountText}>$149.00 USD · Paid</Text>
          <TouchableOpacity
            style={styles.darkActionBtn}
            onPress={() => handleDownloadInvoice('Jan 24, 2026')}
            activeOpacity={0.85}
          >
            <Text style={styles.darkActionBtnText}>Download invoice</Text>
          </TouchableOpacity>

          {/* Invoice 2: Dec 24, 2025 */}
          <Text style={[styles.invoiceDateText, { marginTop: 24 }]}>Dec 24, 2025</Text>
          <Text style={styles.invoicePlanText}>MediScribe Pro - Monthly Renewal</Text>
          <Text style={styles.invoiceAmountText}>$149.00 USD · Paid</Text>
          <TouchableOpacity
            style={[styles.darkActionBtn, { marginBottom: 0 }]}
            onPress={() => handleDownloadInvoice('Dec 24, 2025')}
            activeOpacity={0.85}
          >
            <Text style={styles.darkActionBtnText}>Download invoice</Text>
          </TouchableOpacity>
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

  /* Status Badge: Active & Valid */
  activeBadge: {
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignSelf: 'stretch',
  },
  activeBadgeText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#059669',
  },

  /* Subscription Plan Titles */
  planNameText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  planPriceText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 16,
    letterSpacing: -0.3,
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

  /* Action Buttons */
  darkActionBtn: {
    backgroundColor: '#0F172A',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  blueActionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  copyKeyBtn: {
    backgroundColor: '#64748B',
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  copyKeyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  /* Progress Bars */
  progressTrack: {
    height: 6,
    backgroundColor: '#EFF6FF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: '#2563EB',
    borderRadius: 3,
  },

  /* Payment Method */
  paymentSubText: {
    fontSize: 13.5,
    color: '#64748B',
    marginBottom: 12,
    fontWeight: '400',
  },

  /* Invoice History */
  invoiceDateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  invoicePlanText: {
    fontSize: 13.5,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '400',
  },
  invoiceAmountText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 14,
  },
});
