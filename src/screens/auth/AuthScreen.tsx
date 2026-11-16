import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';
import { DEMO_AUTH_USERS } from '../../services/mockData';
import { CardContainer } from '../../components/common/CardContainer';
import { AuthUser } from '../../types';

export const AuthScreen: React.FC = () => {
  const { loginAsUser } = useMobileApp();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.brandHeader}>
        <View style={styles.logoIcon}>
          <Ionicons name="medical" size={32} color="#2563EB" />
        </View>
        <Text style={styles.appName}>Pivot Clinical AI</Text>
        <Text style={styles.tagline}>Ambient AI Medical Scribe & Consultation System</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Select Demo Role to Continue</Text>
        <Text style={styles.sectionSubtitle}>Tap any clinical profile to launch with pre-configured access</Text>
      </View>

      {DEMO_AUTH_USERS.map((user: AuthUser) => {
        const isDoctor = user.role === 'doctor';
        const isPatient = user.role === 'patient';
        const isReceptionist = user.role === 'receptionist';
        const isAdmin = user.role === 'admin';

        const roleBadgeColor = isDoctor
          ? '#2563EB'
          : isPatient
          ? '#059669'
          : isReceptionist
          ? '#D97706'
          : '#7C3AED';

        return (
          <TouchableOpacity
            key={user.id}
            activeOpacity={0.8}
            onPress={() => loginAsUser(user)}
          >
            <CardContainer style={styles.userCard}>
              <View style={styles.userRow}>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <View style={styles.userInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <View style={[styles.roleBadge, { backgroundColor: roleBadgeColor + '20' }]}>
                      <Text style={[styles.roleText, { color: roleBadgeColor }]}>
                        {user.role}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.roleTitle}>{user.roleTitle}</Text>
                  <Text style={styles.departmentText}>
                    {user.specialty || user.department || user.patientCode || user.hospital}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </View>
            </CardContainer>
          </TouchableOpacity>
        );
      })}

      <View style={styles.footer}>
        <Ionicons name="shield-checkmark" size={16} color="#10B981" />
        <Text style={styles.footerText}>
          HIPAA & MCI Compliant · Dual-Channel Ambient Scribe
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF4FA',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#93C5FD',
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  userCard: {
    marginBottom: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    marginRight: 14,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  roleTitle: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
    marginTop: 2,
  },
  departmentText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 6,
  },
  footerText: {
    fontSize: 11,
    color: '#64748B',
  },
});

