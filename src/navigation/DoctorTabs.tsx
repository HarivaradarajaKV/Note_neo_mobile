import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LiveConsultationScreen } from '../screens/consultation/LiveConsultationScreen';
import { PatientsScreen } from '../screens/patients/PatientsScreen';
import { ScheduleScreen } from '../screens/schedule/ScheduleScreen';
import { NotesListScreen } from '../screens/notes/NotesListScreen';
import { ClinicalNoteReviewScreen } from '../screens/review/ClinicalNoteReviewScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { ClinicalSecurityScreen } from '../screens/settings/ClinicalSecurityScreen';
import { NotificationsScreen } from '../screens/settings/NotificationsScreen';

const Tab = createBottomTabNavigator();
const NotesStack = createNativeStackNavigator();
const SettingsStack = createNativeStackNavigator();

const NotesNavigator: React.FC = () => {
  return (
    <NotesStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="ClinicalNoteReview">
      <NotesStack.Screen name="ClinicalNoteReview" component={ClinicalNoteReviewScreen} />
      <NotesStack.Screen name="NotesList" component={NotesListScreen} />
    </NotesStack.Navigator>
  );
};

const SettingsNavigator: React.FC = () => {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Notifications">
      <SettingsStack.Screen name="Notifications" component={NotificationsScreen} />
      <SettingsStack.Screen name="ClinicalSecurity" component={ClinicalSecurityScreen} />
      <SettingsStack.Screen name="SettingsMain" component={SettingsScreen} />
    </SettingsStack.Navigator>
  );
};

export const DoctorTabs: React.FC = () => {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'ios' ? 14 : 8);

  return (
    <Tab.Navigator
      initialRouteName="Patients"
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
        tabBarIcon: ({ focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'chatbubble-ellipses';

          if (route.name === 'Consult') {
            iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
          } else if (route.name === 'Patients') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Schedule') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Notes') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return (
            <View style={[styles.tabIconWrap, focused && styles.tabIconWrapFocused]}>
              <Ionicons
                name={iconName}
                size={21}
                color={focused ? '#2563EB' : '#64748B'}
              />
            </View>
          );
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
        component={NotesNavigator}
        options={{ tabBarLabel: 'Notes' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIconWrap: {
    width: 44,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconWrapFocused: {
    backgroundColor: '#EFF6FF',
  },
});
