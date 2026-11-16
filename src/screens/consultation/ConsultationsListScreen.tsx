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

export const ConsultationsListScreen: React.FC<Props> = ({ navigation }) => {
  const { consultations } = useMobileApp();
  const [filter, setFilter] = useState<'all' | 'review' | 'approved'>('all');
  const [search, setSearch] = useState('');

  const filtered = consultations.filter((cons) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'review'
        ? cons.status === 'review_required'
        : cons.status === 'approved';

    const s = search.toLowerCase();
    const matchesSearch =
      !s ||
      cons.patient.firstName.toLowerCase().includes(s) ||
      cons.patient.lastName.toLowerCase().includes(s) ||
      cons.patient.patientCode.toLowerCase().includes(s) ||
      cons.reasonForVisit.toLowerCase().includes(s);

    return matchesFilter && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <MobileHeader title="Consultations History" showBack onBack={() => navigation.goBack()} />

      {/* Search Input */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search consultations by patient, diagnosis..."
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

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All ({consultations.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, filter === 'review' && styles.filterChipActive]}
          onPress={() => setFilter('review')}
        >
          <Text style={[styles.filterText, filter === 'review' && styles.filterTextActive]}>
            Needs Review
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, filter === 'approved' && styles.filterChipActive]}
          onPress={() => setFilter('approved')}
        >
          <Text style={[styles.filterText, filter === 'approved' && styles.filterTextActive]}>
            Approved
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContent}>
        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="file-tray-outline" size={40} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Consultations Found</Text>
            <Text style={styles.emptySubtitle}>
              {consultations.length === 0
                ? 'Complete your first live consultation session to populate records.'
                : 'No consultations match the selected search or filter.'}
            </Text>
          </View>
        ) : (
          filtered.map((cons) => (
            <TouchableOpacity
              key={cons.id}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ClinicalNoteReview', { consultation: cons })}
            >
              <CardContainer style={styles.card}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.patientName}>
                      {cons.patient.firstName} {cons.patient.lastName}
                    </Text>
                    <Text style={styles.patientMeta}>
                      {cons.patient.patientCode} · {cons.patient.age}y {cons.patient.gender}
                    </Text>
                  </View>
                  <StatusBadge status={cons.status} />
                </View>

                <Text style={styles.reasonText}>{cons.reasonForVisit}</Text>

                <View style={styles.cardFooter}>
                  <View style={styles.metaRow}>
                    <Ionicons name="time-outline" size={13} color="#64748B" />
                    <Text style={styles.metaText}>
                      {cons.date} {cons.time} · {cons.transcript.length} turns
                    </Text>
                  </View>

                  <View style={styles.openReviewBtn}>
                    <Text style={styles.openReviewText}>Review</Text>
                    <Ionicons name="chevron-forward" size={14} color="#2563EB" />
                  </View>
                </View>
              </CardContainer>
            </TouchableOpacity>
          ))
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
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#1D4ED8',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 32,
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
  patientMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  reasonText: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 10,
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#64748B',
  },
  openReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  openReviewText: {
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

