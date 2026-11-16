import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  status: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

export const StatusBadge: React.FC<Props> = ({ status, variant }) => {
  const getColors = () => {
    const s = status.toLowerCase();
    if (variant === 'success' || s.includes('approved') || s.includes('completed') || s.includes('normal')) {
      return { bg: '#DCFCE7', text: '#15803D', border: '#86EFAC' };
    }
    if (variant === 'warning' || s.includes('review') || s.includes('moderate') || s.includes('scheduled')) {
      return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' };
    }
    if (variant === 'danger' || s.includes('risk') || s.includes('critical') || s.includes('error')) {
      return { bg: '#FEE2E2', text: '#B91C1C', border: '#FCA5A5' };
    }
    if (variant === 'info' || s.includes('progress') || s.includes('telehealth')) {
      return { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' };
    }
    return { bg: '#F1F5F9', text: '#475569', border: '#CBD5E1' };
  };

  const colors = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      <Text style={[styles.text, { color: colors.text }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
});

