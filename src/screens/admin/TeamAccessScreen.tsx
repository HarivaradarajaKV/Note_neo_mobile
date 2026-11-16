import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { MobileHeader } from '../../components/common/MobileHeader';
import { CardContainer } from '../../components/common/CardContainer';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DEMO_AUTH_USERS } from '../../services/mockData';

interface Props {
  navigation: any;
}

export const TeamAccessScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <MobileHeader title="Team & Access Control" subtitle="Role-based clinical permissions" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {DEMO_AUTH_USERS.map((user) => (
          <CardContainer key={user.id} style={styles.card}>
            <View style={styles.header}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.roleTitle}>{user.roleTitle}</Text>
                <Text style={styles.dept}>{user.department || user.specialty || user.email}</Text>
              </View>
              <StatusBadge status={user.role} />
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
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    marginRight: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  roleTitle: {
    fontSize: 12,
    color: '#475569',
    marginTop: 1,
  },
  dept: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});

