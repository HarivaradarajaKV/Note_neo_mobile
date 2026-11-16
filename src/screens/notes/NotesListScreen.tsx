import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';
import { ConsultationSession } from '../../types';

interface Props {
  navigation: any;
}

export const NotesListScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { consultations } = useMobileApp();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'drafts' | 'finalized'>('all');

  const notesList = consultations.filter((c) => c.note || c.soapNote);

  const filtered = notesList.filter((c) => {
    const note = c.note || c.soapNote;
    const isApproved = c.status === 'approved' || note?.status === 'approved';

    if (activeTab === 'drafts' && isApproved) return false;
    if (activeTab === 'finalized' && !isApproved) return false;

    const s = search.toLowerCase();
    return (
      !s ||
      c.patient.firstName.toLowerCase().includes(s) ||
      c.patient.lastName.toLowerCase().includes(s) ||
      (note?.subjective?.chiefComplaint &&
        note.subjective.chiefComplaint.toLowerCase().includes(s)) ||
      (note?.conversationSummary && note.conversationSummary.toLowerCase().includes(s))
    );
  });

  const getNoteSubtitle = (c: ConsultationSession) => {
    const note = c.note || c.soapNote;
    const type = note?.templateType || 'SOAP Note';
    return `${type} · ${c.date}`;
  };

  const getNoteSnippet = (c: ConsultationSession) => {
    const note = c.note || c.soapNote;
    if (note?.conversationSummary) return note.conversationSummary;
    if (note?.subjective?.historyOfPresentIllness) return note.subjective.historyOfPresentIllness;
    return `Patient presents for ${c.reasonForVisit}. Clinical evaluation and management documented.`;
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

        {/* Clinical notes Title */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Clinical notes</Text>
          <Text style={styles.subtitle}>Your AI Clinical Assistant</Text>
        </View>

        {/* SOAP Auto-draft Enabled Green Pill Banner */}
        <View style={styles.autoDraftBanner}>
          <Text style={styles.autoDraftText}>SOAP Auto-draft Enabled</Text>
        </View>

        {/* Search Bar matching screenshot */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by patient, note text..."
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

        {/* Filter Segment Tabs: All Notes | Drafts | Finalized */}
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[styles.segmentTab, activeTab === 'all' && styles.segmentTabActive]}
            onPress={() => setActiveTab('all')}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.segmentTabText, activeTab === 'all' && styles.segmentTabTextActive]}
            >
              All Notes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentTab, activeTab === 'drafts' && styles.segmentTabActive]}
            onPress={() => setActiveTab('drafts')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentTabText,
                activeTab === 'drafts' && styles.segmentTabTextActive,
              ]}
            >
              Drafts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentTab, activeTab === 'finalized' && styles.segmentTabActive]}
            onPress={() => setActiveTab('finalized')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentTabText,
                activeTab === 'finalized' && styles.segmentTabTextActive,
              ]}
            >
              Finalized
            </Text>
          </TouchableOpacity>
        </View>

        {/* Clinical Note Cards matching screenshot exactly */}
        <View style={styles.cardsList}>
          {filtered.map((c) => {
            const note = c.note || c.soapNote;
            const isApproved = c.status === 'approved' || note?.status === 'approved';

            return (
              <TouchableOpacity
                key={c.id}
                style={styles.noteCard}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate('ClinicalNoteReview', { consultation: c })
                }
              >
                {/* Patient Name */}
                <Text style={styles.patientName}>
                  {c.patient.firstName} {c.patient.lastName}
                </Text>

                {/* Status Pill: Amber Draft vs Green Final */}
                <View
                  style={[
                    styles.statusPill,
                    isApproved ? styles.statusPillFinal : styles.statusPillDraft,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      isApproved ? styles.statusTextFinal : styles.statusTextDraft,
                    ]}
                  >
                    {isApproved ? 'Final' : 'Draft'}
                  </Text>
                </View>

                {/* Note Metadata: e.g. "SOAP Note · Today, 10:24 AM" */}
                <Text style={styles.noteMeta}>{getNoteSubtitle(c)}</Text>

                {/* Note Snippet / Verbatim Preview */}
                <Text style={styles.noteSnippet}>{getNoteSnippet(c)}</Text>
              </TouchableOpacity>
            );
          })}
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
    marginBottom: 12,
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
  /* SOAP Auto-draft Banner matching screenshot */
  autoDraftBanner: {
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  autoDraftText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#166534',
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
  /* Segment Tabs: All Notes | Drafts | Finalized */
  segmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  segmentTab: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 14,
  },
  segmentTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  segmentTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTabTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  /* Note Cards List */
  cardsList: {
    gap: 4,
  },
  noteCard: {
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
  patientName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  statusPill: {
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: 'stretch',
    marginBottom: 12,
  },
  statusPillDraft: {
    backgroundColor: '#FEF3C7',
  },
  statusPillFinal: {
    backgroundColor: '#ECFDF5',
  },
  statusPillText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  statusTextDraft: {
    color: '#B45309',
  },
  statusTextFinal: {
    color: '#166534',
  },
  noteMeta: {
    fontSize: 13.5,
    color: '#64748B',
    marginBottom: 8,
  },
  noteSnippet: {
    fontSize: 14.5,
    color: '#334155',
    lineHeight: 22,
  },
});
