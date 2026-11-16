import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MobileHeader } from '../../components/common/MobileHeader';

export const PatientMessagesScreen: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'Dr. Marleen',
      text: 'Good morning Ramesh, please continue taking Paracetamol as prescribed if the fever recurs. Stay well hydrated.',
      time: '09:30 AM',
      isDoctor: true,
    },
    {
      id: '2',
      sender: 'Ramesh Raj',
      text: 'Thank you Doctor, the fever has reduced today. Cough is still dry at bedtime.',
      time: '09:45 AM',
      isDoctor: false,
    },
    {
      id: '3',
      sender: 'Dr. Marleen',
      text: 'Understood. Keep your head elevated with an extra pillow and avoid cold drinks. Come in for review on Friday.',
      time: '10:00 AM',
      isDoctor: true,
    },
  ]);

  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'Ramesh Raj',
        text: input.trim(),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isDoctor: false,
      },
    ]);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <MobileHeader title="Clinic Chat" subtitle="Direct message with Dr. Marleen" />

      <ScrollView contentContainerStyle={styles.content}>
        {messages.map((m) => (
          <View
            key={m.id}
            style={[
              styles.bubble,
              m.isDoctor ? styles.doctorBubble : styles.patientBubble,
            ]}
          >
            <Text style={[styles.senderName, m.isDoctor ? styles.docSender : styles.patSender]}>
              {m.sender}
            </Text>
            <Text style={styles.bubbleText}>{m.text}</Text>
            <Text style={styles.timeText}>{m.time}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask Dr. Marleen a question..."
          placeholderTextColor="#94A3B8"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Ionicons name="send" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
    paddingBottom: 24,
  },
  bubble: {
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    maxWidth: '85%',
    borderWidth: 1,
  },
  doctorBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  patientBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  senderName: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 4,
  },
  docSender: {
    color: '#2563EB',
  },
  patSender: {
    color: '#059669',
  },
  bubbleText: {
    fontSize: 13,
    color: '#0F172A',
    lineHeight: 18,
  },
  timeText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    fontSize: 14,
    color: '#0F172A',
  },
  sendBtn: {
    backgroundColor: '#2563EB',
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

