import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';
import { MobileHeader } from '../../components/common/MobileHeader';
import { CardContainer } from '../../components/common/CardContainer';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { Patient } from '../../types';

interface Props {
  navigation: any;
}

export const PatientsScreen: React.FC<Props> = ({ navigation }) => {
  const { patients, addPatient, selectPatient, startConsultation } = useMobileApp();
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New patient form fields
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
      (p.condition && p.condition.toLowerCase().includes(s))
    );
  });

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
      phone: phone.trim() || '+91 98450 00000',
      email: `${firstName.toLowerCase()}@example.com`,
      address: 'Bangalore, Karnataka',
      allergies: [],
      existingMedications: [],
      medicalHistory: [],
      lastVisit: 'Today',
      condition: condition.trim() || 'New Patient OPD Evaluation',
      statusRisk: 'Normal',
      dateAdded: 'Today',
    };
    addPatient(newPat);
    setIsAddModalOpen(false);
    setFirstName('');
    setLastName('');
    setAge('');
    setCondition('');
    Alert.alert('Patient Added', `${newPat.firstName} ${newPat.lastName} registered as ${newPat.patientCode}.`);
  };

  return (
    <View style={styles.container}>
      <MobileHeader
        title="Patients Directory"
        subtitle={`${patients.length} registered clinical records`}
        rightAction={
          <TouchableOpacity
            style={styles.addIconBtn}
            onPress={() => setIsAddModalOpen(true)}
          >
            <Ionicons name="person-add" size={18} color="#2563EB" />
          </TouchableOpacity>
        }
      />

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search patient by name, #code, symptoms..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {filteredPatients.map((pat) => (
          <TouchableOpacity
            key={pat.id}
            activeOpacity={0.8}
            onPress={() => {
              selectPatient(pat);
              navigation.navigate('PatientDetail', { patient: pat });
            }}
          >
            <CardContainer style={styles.patientCard}>
              <View style={styles.cardHeader}>
                <View style={styles.patientInfo}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarInitial}>{pat.firstName.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={styles.patientName}>{pat.firstName} {pat.lastName}</Text>
                    <Text style={styles.patientCode}>{pat.patientCode} · {pat.age}y {pat.gender}</Text>
                  </View>
                </View>
                <StatusBadge status={pat.statusRisk || 'Normal'} />
              </View>

              <Text style={styles.conditionText}>
                Condition: {pat.condition || 'General health evaluation'}
              </Text>

              {pat.allergies.length > 0 && (
                <View style={styles.allergyRow}>
                  <Ionicons name="warning-outline" size={12} color="#DC2626" />
                  <Text style={styles.allergyText}>
                    Allergies: {pat.allergies.join(', ')}
                  </Text>
                </View>
              )}

              <View style={styles.cardFooter}>
                <Text style={styles.lastVisitText}>Last Visit: {pat.lastVisit}</Text>
                <TouchableOpacity
                  style={styles.startConsBtn}
                  onPress={() => {
                    selectPatient(pat);
                    startConsultation(pat);
                    navigation.navigate('LiveConsultation');
                  }}
                >
                  <Ionicons name="mic" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.startConsText}>Consult</Text>
                </TouchableOpacity>
              </View>
            </CardContainer>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add New Patient Modal */}
      <Modal
        visible={isAddModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddModalOpen(false)}
      >
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
                placeholder="e.g. Ramesh"
                placeholderTextColor="#94A3B8"
                value={firstName}
                onChangeText={setFirstName}
              />

              <Text style={styles.formLabel}>Last Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Raj"
                placeholderTextColor="#94A3B8"
                value={lastName}
                onChangeText={setLastName}
              />

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Age</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="30"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={age}
                    onChangeText={setAge}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.formLabel}>Gender</Text>
                  <View style={styles.genderRow}>
                    {(['Male', 'Female'] as const).map((g) => (
                      <TouchableOpacity
                        key={g}
                        style={[styles.genderChip, gender === g && styles.genderChipActive]}
                        onPress={() => setGender(g)}
                      >
                        <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
                          {g}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <Text style={styles.formLabel}>Primary Complaint / Condition</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Fever, persistent cough"
                placeholderTextColor="#94A3B8"
                value={condition}
                onChangeText={setCondition}
              />

              <ActionButton
                title="Save & Register Patient"
                variant="primary"
                onPress={handleCreatePatient}
                style={{ marginTop: 16, marginBottom: 24 }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF4FA',
  },
  addIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 96,
  },
  patientCard: {
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  avatarInitial: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563EB',
  },
  patientName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  patientCode: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  conditionText: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 6,
  },
  allergyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
    gap: 4,
  },
  allergyText: {
    fontSize: 11,
    color: '#B91C1C',
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  lastVisitText: {
    fontSize: 11,
    color: '#64748B',
  },
  startConsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  startConsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
    marginTop: 8,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  genderChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
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
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  genderTextActive: {
    color: '#2563EB',
    fontWeight: '800',
  },
});

