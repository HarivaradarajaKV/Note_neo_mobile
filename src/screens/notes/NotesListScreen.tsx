import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';
import { MobileHeader } from '../../components/common/MobileHeader';
import { CardContainer } from '../../components/common/CardContainer';
import { StatusBadge } from '../../components/common/StatusBadge';

interface Props {
  navigation: any;
}

export const NotesListScreen: React.FC<Props> = ({ navigation }) => {
  const { consultations, patients } = useMobileApp();
  const [search, setSearch] = useState('');

  const notesList = consultations.filter((c) => c.note);

  const filtered = notesList.filter((c) => {
    const s = search.toLowerCase();
    return (
      !s ||
      c.patient.firstName.toLowerCase().includes(s) ||
      c.patient.lastName.toLowerCase().includes(s) ||
      c.patient.patientCode.toLowerCase().includes(s) ||
      (c.note?.subjective.chiefComplaint && c.note.subjective.chiefComplaint.toLowerCase().includes(s))
    );
  });

  return (
    <View style={styles.container}>
      <MobileHeader title="Clinical SOAP Notes" subtitle="EHR documentation & approvals" />

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes by patient, diagnosis, drug..."
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
        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={42} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Clinical Notes Found</Text>
            <Text style={styles.emptySubtitle}>
              Notes generated from live consultation scribing will appear here for review and digital signature.
            </Text>
          </View>
        ) : (
          filtered.map((c) => {
            const note = c.note!;
            return (
              <TouchableOpacity
                key={c.id}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('ClinicalNoteReview', { consultation: c })}
              >
                <CardContainer style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.patientName}>
                        {c.patient.firstName} {c.patient.lastName}
                      </Text>
                      <Text style={styles.metaLine}>{c.patient.patientCode} · {c.date}</Text>
                    </View>
                    <StatusBadge status={c.status} />
                  </View>

                  <Text style={styles.ccLabel}>Chief Complaint:</Text>
                  <Text style={styles.ccValue}>{note.subjective.chiefComplaint}</Text>

                  <Text style={styles.impLabel}>Impression:</Text>
                  <Text style={styles.impValue}>{note.assessment.clinicalImpression}</Text>

                  <View style={styles.cardFooter}>
                    <Text style={styles.templateTag}>{note.templateType}</Text>
                    <View style={styles.viewNoteRow}>
                      <Text style={styles.viewNoteText}>Open Note</Text>
                      <Ionicons name="chevron-forward" size={14} color="#2563EB" />
                    </View>
                  </View>
                </CardContainer>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF4FA',
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
  card: {
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  patientName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  metaLine: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  ccLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 4,
  },
  ccValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
    marginBottom: 6,
  },
  impLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  impValue: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 8,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  templateTag: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '700',
  },
  viewNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewNoteText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
});

