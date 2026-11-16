import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';
import { DEMO_AUTH_USERS } from '../../services/mockData';
import { CardContainer } from '../../components/common/CardContainer';
import { AuthUser } from '../../types';

export const AuthScreen: React.FC = () => {
  const { loginAsUser } = useMobileApp();

  // Mobile application is strictly for doctors - hide all non-doctor roles
  const doctorUsers = DEMO_AUTH_USERS.filter((user: AuthUser) => user.role === 'doctor');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.brandHeader}>
        <View style={styles.logoIcon}>
          <FontAwesome5 name="stethoscope" size={30} color="#2563EB" />
        </View>
        <Text style={styles.appName}>MediScribe</Text>
        <Text style={styles.clinicianBadge}>CLINICIAN WORKSTATION</Text>
        <Text style={styles.tagline}>Ambient AI Medical Scribe & Consultation System</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Select Clinician Profile</Text>
        <Text style={styles.sectionSubtitle}>Tap your attending doctor account to launch consultation suite</Text>
      </View>

      {doctorUsers.map((user: AuthUser) => {
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
                    <View style={styles.roleBadge}>
                      <Text style={styles.roleText}>Doctor</Text>
                    </View>
                  </View>
                  <Text style={styles.roleTitle}>{user.roleTitle}</Text>
                  <Text style={styles.departmentText}>
                    {user.specialty || user.department || user.hospital}
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
          HIPAA & SOC-2 Compliant · Dedicated Clinician Portal
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
  },
  appName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  clinicianBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 1.2,
    marginTop: 2,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  userCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 14,
    backgroundColor: '#E2E8F0',
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginRight: 8,
  },
  roleBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    textTransform: 'capitalize',
  },
  roleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 2,
  },
  departmentText: {
    fontSize: 12,
    color: '#64748B',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
});
