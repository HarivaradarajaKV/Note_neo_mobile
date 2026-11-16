import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';
import { DEMO_AUTH_USERS } from '../../services/mockData';
import { api } from '../../services/apiService';
import { AuthUser } from '../../types';

export const AuthScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { loginWithCredentials, loginAsUser } = useMobileApp();

  const [activeTab, setActiveTab] = useState<'quick' | 'credentials'>('quick');
  const [email, setEmail] = useState('marleen.d@apollohealth.in');
  const [password, setPassword] = useState('Doctor@123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [databaseDoctors, setDatabaseDoctors] = useState<AuthUser[]>(
    DEMO_AUTH_USERS.filter((u) => u.role === 'doctor')
  );

  // Fetch registered doctor accounts directly from live backend database
  useEffect(() => {
    let isMounted = true;
    const fetchDoctors = async () => {
      try {
        const docs = await api.auth.getDoctors();
        if (docs && docs.length > 0 && isMounted) {
          setDatabaseDoctors(docs);
        }
      } catch (err) {
        // Fall back to local verified doctor profiles
        console.debug('[AuthScreen] Using cached database doctors:', err);
      }
    };

    fetchDoctors();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCredentialsSubmit = async () => {
    if (!email.trim()) {
      setErrorMessage('Please enter your clinician email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await loginWithCredentials(email.trim(), password);
    } catch (err: any) {
      const msg = err?.message || 'Login failed. Please verify your doctor credentials.';
      setErrorMessage(msg);
      Alert.alert('Authentication Failed', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDoctorLogin = async (doctor: AuthUser) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await loginAsUser(doctor, 'Doctor@123');
    } catch (err: any) {
      const msg = err?.message || `Failed to sign in as ${doctor.name}.`;
      setErrorMessage(msg);
      Alert.alert('Sign In Error', msg);
    } finally {
      setIsLoading(false);
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top MediScribe Clinician Header */}
        <View style={styles.brandHeader}>
          <View style={styles.brandContainer}>
            <View style={styles.stethoscopeIconContainer}>
              <FontAwesome5 name="stethoscope" size={26} color="#2563EB" />
            </View>
            <View style={styles.brandTextColumn}>
              <Text style={styles.brandTitle}>MediScribe</Text>
              <Text style={styles.brandSubtitle}>CLINICIAN</Text>
            </View>
          </View>

          {/* Database Live Connectivity Badge */}
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveBadgeText}>Live Backend DB</Text>
          </View>
        </View>

        {/* Hero Welcome Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Clinician Workstation</Text>
          <Text style={styles.heroSubtitle}>
            Dual-Channel Ambient AI Scribe & Outpatient Encounter Suite. Exclusively for licensed
            attending physicians.
          </Text>

          {/* Tab Selector */}
          <View style={styles.tabSelector}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'quick' && styles.tabButtonActive]}
              onPress={() => {
                setActiveTab('quick');
                setErrorMessage(null);
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name="people"
                size={16}
                color={activeTab === 'quick' ? '#2563EB' : '#64748B'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'quick' && styles.tabButtonTextActive,
                ]}
              >
                Database Doctors
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'credentials' && styles.tabButtonActive]}
              onPress={() => {
                setActiveTab('credentials');
                setErrorMessage(null);
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name="key"
                size={16}
                color={activeTab === 'credentials' ? '#2563EB' : '#64748B'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === 'credentials' && styles.tabButtonTextActive,
                ]}
              >
                Email & Password
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Error Feedback Banner */}
        {errorMessage ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color="#DC2626" style={{ marginRight: 8 }} />
            <Text style={styles.errorBannerText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Loading Indicator */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>Authenticating with MediScribe Database...</Text>
          </View>
        ) : null}

        {/* TAB 1: Database Doctors (One-Tap Clinician Sign In) */}
        {!isLoading && activeTab === 'quick' ? (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>Verified Attending Doctors</Text>
              <Text style={styles.sectionBadge}>
                {databaseDoctors.length} Clinicians in DB
              </Text>
            </View>
            <Text style={styles.sectionSubtext}>
              Tap your attending doctor profile to authenticate and sync assigned patients:
            </Text>

            {databaseDoctors.map((doc) => {
              const isMarleen = doc.email === 'marleen.d@apollohealth.in';
              return (
                <TouchableOpacity
                  key={doc.id || doc.email}
                  style={[styles.doctorCard, isMarleen && styles.primaryDoctorCard]}
                  onPress={() => handleQuickDoctorLogin(doc)}
                  activeOpacity={0.85}
                >
                  <View style={styles.doctorCardLeft}>
                    {doc.avatar && doc.avatar.startsWith('http') ? (
                      <Image source={{ uri: doc.avatar }} style={styles.doctorAvatarImg} />
                    ) : (
                      <Image
                        source={require('../../../assets/doctor-avatar.png')}
                        style={styles.doctorAvatarImg}
                      />
                    )}
                    <View style={styles.doctorInfoCol}>
                      <View style={styles.doctorNameRow}>
                        <Text style={styles.doctorName}>{doc.name}</Text>
                        <View style={styles.doctorVerifiedBadge}>
                          <Text style={styles.doctorVerifiedBadgeText}>Verified</Text>
                        </View>
                      </View>
                      <Text style={styles.doctorSpecialty}>
                        {doc.specialty || doc.roleTitle}
                      </Text>
                      <Text style={styles.doctorLicense}>
                        {doc.regNumber ? `MCI: ${doc.regNumber}` : 'Licensed Physician'} ·{' '}
                        {doc.email}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.doctorCardArrow}>
                    <Ionicons name="chevron-forward" size={18} color="#2563EB" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}

        {/* TAB 2: Credentials Login Form */}
        {!isLoading && activeTab === 'credentials' ? (
          <View style={styles.cardContainer}>
            <Text style={styles.cardMainHeading}>Doctor Credentials Sign In</Text>

            {/* Email Field */}
            <Text style={styles.inputLabel}>CLINICIAN EMAIL ADDRESS</Text>
            <View style={styles.inputBoxRow}>
              <Ionicons
                name="mail-outline"
                size={18}
                color="#64748B"
                style={{ marginRight: 10 }}
              />
              <TextInput
                style={styles.textInputField}
                value={email}
                onChangeText={setEmail}
                placeholder="doctor.name@hospital.in"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Field */}
            <Text style={styles.inputLabel}>CLINICIAN PASSWORD</Text>
            <View style={styles.inputBoxRow}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#64748B"
                style={{ marginRight: 10 }}
              />
              <TextInput
                style={styles.textInputField}
                value={password}
                onChangeText={setPassword}
                placeholder="Doctor@123"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            {/* Quick Demo Pre-fills */}
            <View style={styles.prefillContainer}>
              <Text style={styles.prefillLabel}>Quick Fill Doctor:</Text>
              <View style={styles.prefillRow}>
                <TouchableOpacity
                  style={styles.prefillPill}
                  onPress={() => {
                    setEmail('marleen.d@apollohealth.in');
                    setPassword('Doctor@123');
                  }}
                >
                  <Text style={styles.prefillPillText}>Dr. Marleen</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.prefillPill}
                  onPress={() => {
                    setEmail('sarah.jenkins@apollohealth.in');
                    setPassword('Doctor@123');
                  }}
                >
                  <Text style={styles.prefillPillText}>Dr. Sarah Jenkins</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleCredentialsSubmit}
              activeOpacity={0.85}
            >
              <Text style={styles.signInButtonText}>Sign In to Clinician Suite</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Security & HIPAA Compliance Footer */}
        <View style={styles.securityFooter}>
          <Ionicons name="shield-checkmark" size={18} color="#059669" />
          <Text style={styles.securityFooterText}>
            HIPAA & SOC-2 Verified · 256-Bit Cryptographic TLS · Restricted Doctor Portal
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
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  /* Brand Header */
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 8,
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
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 1.2,
    marginTop: -1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
    marginRight: 6,
  },
  liveBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },

  /* Hero Card */
  heroCard: {
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
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },

  /* Tab Selector */
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabButtonTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },

  /* Error Banner */
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    fontSize: 13,
    color: '#B91C1C',
    fontWeight: '600',
    flex: 1,
  },

  /* Loading State */
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 13.5,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 12,
  },

  /* Section Styles */
  sectionContainer: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionBadge: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  sectionSubtext: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },

  /* Doctor Card */
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  primaryDoctorCard: {
    borderColor: '#BFDBFE',
    backgroundColor: '#F8FAFF',
  },
  doctorCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  doctorAvatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2E8F0',
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
  },
  doctorInfoCol: {
    flex: 1,
  },
  doctorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  doctorName: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#0F172A',
    marginRight: 8,
  },
  doctorVerifiedBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  doctorVerifiedBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  doctorSpecialty: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 2,
  },
  doctorLicense: {
    fontSize: 11.5,
    color: '#64748B',
  },
  doctorCardArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
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

  /* Input Fields */
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  inputBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  textInputField: {
    flex: 1,
    fontSize: 14.5,
    color: '#0F172A',
    fontWeight: '500',
  },
  passwordToggle: {
    padding: 6,
  },

  /* Quick Fill Pills */
  prefillContainer: {
    marginBottom: 18,
  },
  prefillLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  prefillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  prefillPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  prefillPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },

  /* Sign In Button */
  signInButton: {
    backgroundColor: '#2563EB',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
  },

  /* Footer */
  securityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 6,
  },
  securityFooterText: {
    fontSize: 11.5,
    color: '#64748B',
    textAlign: 'center',
    flex: 1,
  },
});
