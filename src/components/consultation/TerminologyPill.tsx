import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AIInsight } from '../../types';

interface Props {
  insight: AIInsight;
}

export const TerminologyPill: React.FC<Props> = ({ insight }) => {
  const isMed = insight.category === 'medication';
  const isNegative = insight.category === 'negative';

  return (
    <View style={[styles.pill, isMed ? styles.medPill : isNegative ? styles.negPill : styles.sympPill]}>
      <Ionicons
        name={isMed ? 'medical' : isNegative ? 'checkmark-circle' : 'pulse'}
        size={14}
        color={isMed ? '#7C3AED' : isNegative ? '#059669' : '#D97706'}
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>{insight.title}</Text>
        <Text style={styles.detail} numberOfLines={2}>{insight.detail}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
    maxWidth: 240,
  },
  medPill: {
    backgroundColor: '#F5F3FF',
    borderColor: '#DDD6FE',
  },
  sympPill: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  negPill: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  icon: {
    marginRight: 6,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
  },
  detail: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
});

