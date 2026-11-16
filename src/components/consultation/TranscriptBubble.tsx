import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TranscriptMessage } from '../../types';

interface Props {
  message: TranscriptMessage;
  onPress?: () => void;
}

export const TranscriptBubble: React.FC<Props> = ({ message, onPress }) => {
  const isDoctor = message.speaker === 'Doctor';

  return (
    <View
      style={[
        styles.container,
        isDoctor ? styles.doctorContainer : styles.patientContainer,
      ]}
    >
      <View style={styles.headerRow}>
        <View style={[styles.speakerBadge, isDoctor ? styles.docBadge : styles.patBadge]}>
          <Text style={[styles.speakerText, isDoctor ? styles.docText : styles.patText]}>
            {message.speaker}
          </Text>
        </View>
        <Text style={styles.timestamp}>{message.timestamp}</Text>
      </View>

      <Text style={styles.messageText}>{message.text || message.originalText}</Text>
      {message.englishText && message.englishText !== message.text && (
        <View style={styles.translationBox}>
          <Text style={styles.translationLabel}>English Translation:</Text>
          <Text style={styles.translationText}>{message.englishText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    maxWidth: '92%',
  },
  doctorContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F7FF',
    borderColor: '#BAE6FD',
  },
  patientContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  speakerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  docBadge: {
    backgroundColor: '#DBEAFE',
  },
  patBadge: {
    backgroundColor: '#DCFCE7',
  },
  speakerText: {
    fontSize: 11,
    fontWeight: '700',
  },
  docText: {
    color: '#1D4ED8',
  },
  patText: {
    color: '#15803D',
  },
  timestamp: {
    fontSize: 10,
    color: '#64748B',
    marginLeft: 8,
  },
  messageText: {
    fontSize: 14,
    color: '#0F172A',
    lineHeight: 20,
  },
  translationBox: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  translationLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 2,
  },
  translationText: {
    fontSize: 13,
    color: '#334155',
    fontStyle: 'italic',
  },
});

