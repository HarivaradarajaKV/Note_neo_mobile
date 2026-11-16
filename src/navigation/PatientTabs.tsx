import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { PatientDashboardScreen } from '../screens/patient/PatientDashboardScreen';
import { PatientVisitsScreen } from '../screens/patient/PatientVisitsScreen';
import { PatientPrescriptionsScreen } from '../screens/patient/PatientPrescriptionsScreen';
import { PatientHealthRecordsScreen } from '../screens/patient/PatientHealthRecordsScreen';
import { PatientMessagesScreen } from '../screens/patient/PatientMessagesScreen';

const Tab = createBottomTabNavigator();

export const PatientTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'heart';
          if (route.name === 'My Health') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Visits') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Medicines') {
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === 'Records') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          }
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="My Health" component={PatientDashboardScreen} />
      <Tab.Screen name="Visits" component={PatientVisitsScreen} />
      <Tab.Screen name="Medicines" component={PatientPrescriptionsScreen} />
      <Tab.Screen name="Records" component={PatientHealthRecordsScreen} />
      <Tab.Screen name="Messages" component={PatientMessagesScreen} />
    </Tab.Navigator>
  );
};

