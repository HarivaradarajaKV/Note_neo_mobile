import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';
import { MobileHeader } from '../../components/common/MobileHeader';
import { CardContainer } from '../../components/common/CardContainer';
import { StatusBadge } from '../../components/common/StatusBadge';

interface Props {
  navigation: any;
}

export const AdminDashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { currentUser, patients, consultations } = useMobileApp();

  return (
    <View style={styles.container}>
      <MobileHeader
        title="Clinic Governance"
        subtitle="Administrator & Compliance Console"
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Clinic Overview Banner */}
        <CardContainer style={styles.bannerCard}>
          <View style={styles.bannerHeader}>
            <View style={styles.bannerIcon}>
              <Ionicons name="business" size={20} color="#2563EB" />
            </View>
            <View>
              <Text style={styles.clinicName}>Apex Multi-Specialty Clinic</Text>
              <Text style={styles.clinicBranch}>Bangalore Hub · NMC License: KA-2024-8891</Text>
            </View>
          </View>
        </CardContainer>

        {/* Admin Navigation Tiles */}
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.gridTile}
            onPress={() => navigation.navigate('TeamAccess')}
          >
            <View style={[styles.tileIcon, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="people" size={22} color="#2563EB" />
            </View>
            <Text style={styles.tileTitle}>Team Access</Text>
            <Text style={styles.tileSub}>Manage doctors & staff</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridTile}
            onPress={() => navigation.navigate('ClinicManagement')}
          >
            <View style={[styles.tileIcon, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="medkit" size={22} color="#059669" />
            </View>
            <Text style={styles.tileTitle}>OPD & Rooms</Text>
            <Text style={styles.tileSub}>Consultation rooms</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridTile}
            onPress={() => navigation.navigate('AuditLog')}
          >
            <View style={[styles.tileIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="shield-checkmark" size={22} color="#D97706" />
            </View>
            <Text style={styles.tileTitle}>Audit Trail</Text>
            <Text style={styles.tileSub}>HIPAA activity logs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridTile}
            onPress={() => navigation.navigate('TerminologyTraining')}
          >
            <View style={[styles.tileIcon, { backgroundColor: '#F5F3FF' }]}>
              <Ionicons name="library" size={22} color="#7C3AED" />
            </View>
            <Text style={styles.tileTitle}>Terminology</Text>
            <Text style={styles.tileSub}>Medical dictionary & CSV</Text>
          </TouchableOpacity>
        </View>

        {/* Live System Status Card */}
        <CardContainer style={styles.statusCard}>
          <Text style={styles.sectionTitle}>System Status & Health</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Ambient ASR Voice Gateway</Text>
            <StatusBadge status="Online" variant="success" />
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Clinical Diarization Engine</Text>
            <StatusBadge status="Active" variant="success" />
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>PostgreSQL / Supabase Sync</Text>
            <StatusBadge status="Connected" variant="success" />
          </View>
        </CardContainer>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF4FA',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  bannerCard: {
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clinicName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  clinicBranch: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  gridTile: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tileIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tileTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  tileSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  statusCard: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  statusLabel: {
    fontSize: 13,
    color: '#334155',
  },
});

