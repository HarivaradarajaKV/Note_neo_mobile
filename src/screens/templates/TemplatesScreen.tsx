import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MobileHeader } from '../../components/common/MobileHeader';
import { CardContainer } from '../../components/common/CardContainer';
import { INITIAL_TEMPLATES } from '../../services/mockData';

export const TemplatesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <MobileHeader title="Clinical Note Templates" subtitle="Specialty documentation schemas" />

      <ScrollView contentContainerStyle={styles.content}>
        {INITIAL_TEMPLATES.map((tpl) => (
          <CardContainer key={tpl.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.titleRow}>
                <Ionicons name="folder-outline" size={18} color="#2563EB" />
                <Text style={styles.templateName}>{tpl.name}</Text>
              </View>
              {tpl.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>Default</Text>
                </View>
              )}
            </View>

            <Text style={styles.specialtyText}>{tpl.specialty}</Text>
            <Text style={styles.descText}>{tpl.description}</Text>

            <Text style={styles.sectionsLabel}>Structured Headings:</Text>
            <View style={styles.sectionsList}>
              {tpl.sections.map((sec, idx) => (
                <View key={idx} style={styles.sectionPill}>
                  <Text style={styles.sectionPillText}>• {sec}</Text>
                </View>
              ))}
            </View>
          </CardContainer>
        ))}
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
  card: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  defaultBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  specialtyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 6,
  },
  descText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 10,
  },
  sectionsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  sectionsList: {
    gap: 4,
  },
  sectionPill: {
    paddingVertical: 3,
  },
  sectionPillText: {
    fontSize: 12,
    color: '#334155',
  },
});

