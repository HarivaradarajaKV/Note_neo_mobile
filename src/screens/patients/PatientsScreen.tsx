import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';
import { Patient } from '../../types';

interface Props {
  navigation: any;
}

export const PatientsScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { patients, addPatient, selectPatient } = useMobileApp();
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New patient registration form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('');
  const [condition, setCondition] = useState('');

  const filteredPatients = patients.filter((p) => {
    const s = search.toLowerCase();
    return (
      !s ||
      p.firstName.toLowerCase().includes(s) ||
      p.lastName.toLowerCase().includes(s) ||
      p.patientCode.toLowerCase().includes(s) ||
      p.phone.toLowerCase().includes(s)
    );
  });

  const getPatientAvatarSource = (pat: Patient) => {
    const fName = pat.firstName.toLowerCase();
    if (pat.avatarKey === 'brooklyn' || fName.includes('brooklyn')) {
      return require('../../../assets/patient-brooklyn.png');
    }
    if (pat.avatarKey === 'eleanor' || fName.includes('eleanor')) {
      return require('../../../assets/patient-eleanor.png');
    }
    if (pat.avatarKey === 'guy' || fName.includes('guy')) {
      return require('../../../assets/patient-guy.png');
    }
    if (pat.avatarKey === 'haylie' || fName.includes('haylie')) {
      return require('../../../assets/patient-haylie.png');
    }
    return require('../../../assets/patient-avatar.png');
  };

  const handleCreatePatient = () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Required Fields', 'Please enter first and last name.');
      return;
    }
    const newCode = `#PK${Math.floor(10000 + Math.random() * 90000)}`;
    const newPat: Patient = {
      id: `pat-${Date.now()}`,
      patientCode: newCode,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      age: parseInt(age) || 30,
      gender,
      phone: phone.trim() || '+1 (555) 000-0000',
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`,
      address: 'Bengaluru, Karnataka',
      allergies: [],
      existingMedications: [],
      medicalHistory: [],
      lastVisit: 'Today',
      condition: condition.trim() || 'General OPD evaluation',
      statusRisk: 'Normal',
      dateAdded: 'Today',
      avatarKey: 'brooklyn',
    };
    addPatient(newPat);
    setIsAddModalOpen(false);
    setFirstName('');
    setLastName('');
    setAge('');
    setCondition('');
    Alert.alert('Patient Registered', `${newPat.firstName} ${newPat.lastName} added (${newPat.patientCode}).`);
  };

  return (
    <View style={[styles.rootContainer, { paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 12 : 24) }]}>
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
              <Ionicons name="notifications-outline" size={24} color="#334155" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Settings')}
            >
              <Image
                source={require('../../../assets/doctor-avatar.png')}
                style={styles.doctorAvatar}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Patients registry Title */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Patients registry</Text>
          <Text style={styles.subtitle}>Your AI Clinical Assistant</Text>
        </View>

        {/* Search Bar matching screenshot */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, ID, or phone..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} style={styles.searchClearBtn}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Section Header Row: "All Patients" + "148 Total" */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>All Patients</Text>
          <Text style={styles.totalBadge}>148 Total</Text>
        </View>

        {/* Patient Registry Cards matching screenshot exactly */}
        <View style={styles.cardsList}>
          {filteredPatients.map((pat) => (
            <View key={pat.id} style={styles.patientCard}>
              {/* Top Row: Avatar + Name + Meta */}
              <View style={styles.cardTopRow}>
                <Image
                  source={getPatientAvatarSource(pat)}
                  style={styles.patientAvatar}
                />
                <View style={styles.patientInfoColumn}>
                  <Text style={styles.patientName}>
                    {pat.firstName} {pat.lastName}
                  </Text>
                  <Text style={styles.patientMeta}>
                    {pat.patientCode} · {pat.age} yrs · {pat.gender}
                  </Text>
                </View>
              </View>

              {/* Middle details: Phone & Last visit */}
              <View style={styles.middleDetails}>
                <Text style={styles.detailText}>{pat.phone}</Text>
                <Text style={styles.detailText}>Last visit · {pat.lastVisit}</Text>
              </View>

              {/* Dark Navy "View patient" Action Button */}
              <TouchableOpacity
                style={styles.viewPatientBtn}
                activeOpacity={0.8}
                onPress={() => {
                  selectPatient(pat);
                  navigation.navigate('PatientDetail', { patient: pat });
                }}
              >
                <Text style={styles.viewPatientText}>View patient</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add New Patient Registration Modal */}
      <Modal visible={isAddModalOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Register New Patient</Text>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.formLabel}>First Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Brooklyn"
                placeholderTextColor="#94A3B8"
                value={firstName}
                onChangeText={setFirstName}
              />

              <Text style={styles.formLabel}>Last Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Simmons"
                placeholderTextColor="#94A3B8"
                value={lastName}
                onChangeText={setLastName}
              />

              <Text style={styles.formLabel}>Age & Gender</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TextInput
                  style={[styles.formInput, { flex: 1 }]}
                  placeholder="e.g. 31"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={age}
                  onChangeText={setAge}
                />
                <View style={styles.genderRow}>
                  {(['Male', 'Female', 'Other'] as const).map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[styles.genderChip, gender === g && styles.genderChipActive]}
                      onPress={() => setGender(g)}
                    >
                      <Text
                        style={[styles.genderText, gender === g && styles.genderTextActive]}
                      >
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Text style={styles.formLabel}>Phone Number</Text>
              <TextInput
                style={styles.formInput}
                placeholder="+1 (555) 234-5678"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />

              <Text style={styles.formLabel}>Presenting Condition / Notes</Text>
              <TextInput
                style={[styles.formInput, { height: 70, textAlignVertical: 'top' }]}
                placeholder="Reason for visit..."
                placeholderTextColor="#94A3B8"
                multiline
                value={condition}
                onChangeText={setCondition}
              />

              <TouchableOpacity
                style={styles.submitModalBtn}
                onPress={handleCreatePatient}
              >
                <Text style={styles.submitModalText}>Save Patient Record</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14.5,
    color: '#64748B',
    marginTop: 4,
  },
  /* Search Container matching screenshot */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 20,
    height: 54,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
  },
  searchClearBtn: {
    padding: 4,
  },
  /* Section Header Row: All Patients & 148 Total */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  totalBadge: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  /* Cards List */
  cardsList: {
    gap: 4,
  },
  patientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#E2E8F0',
  },
  patientInfoColumn: {
    marginLeft: 14,
    flex: 1,
    justifyContent: 'center',
  },
  patientName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  patientMeta: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  middleDetails: {
    marginTop: 12,
  },
  detailText: {
    fontSize: 14.5,
    color: '#64748B',
    marginBottom: 3,
  },
  /* Full Width View patient Button matching screenshot */
  viewPatientBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    alignSelf: 'stretch',
  },
  viewPatientText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  /* Modal Styles */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    maxHeight: '88%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  formLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
    marginTop: 10,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 6,
    flex: 2,
  },
  genderChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  genderChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  genderText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  genderTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  submitModalBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  submitModalText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
