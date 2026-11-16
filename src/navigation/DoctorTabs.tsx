import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LiveConsultationScreen } from '../screens/consultation/LiveConsultationScreen';
import { PatientsScreen } from '../screens/patients/PatientsScreen';
import { ScheduleScreen } from '../screens/schedule/ScheduleScreen';
import { NotesListScreen } from '../screens/notes/NotesListScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';

const Tab = createBottomTabNavigator();

export const DoctorTabs: React.FC = () => {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 14 : 8);

  return (
    <Tab.Navigator
      initialRouteName="Consult"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 1,
          height: 60 + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11.5,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color }) => {
          if (route.name === 'Consult') {
            return (
              <View style={[styles.consultIconWrap, focused && styles.consultIconWrapFocused]}>
                <Ionicons
                  name={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'}
                  size={20}
                  color={focused ? '#2563EB' : '#64748B'}
                />
              </View>
            );
          }

          let iconName: keyof typeof Ionicons.glyphMap = 'chatbubble-ellipses';
          if (route.name === 'Patients') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Schedule') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Notes') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Consult"
        component={LiveConsultationScreen}
        options={{ tabBarLabel: 'Consult' }}
      />
      <Tab.Screen
        name="Patients"
        component={PatientsScreen}
        options={{ tabBarLabel: 'Patients' }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{ tabBarLabel: 'Schedule' }}
      />
      <Tab.Screen
        name="Notes"
        component={NotesListScreen}
        options={{ tabBarLabel: 'Notes' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  consultIconWrap: {
    width: 38,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consultIconWrapFocused: {
    backgroundColor: '#EFF6FF',
  },
});
