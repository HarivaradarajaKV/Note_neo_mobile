import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useMobileApp } from '../context/MobileAppContext';
import { AuthScreen } from '../screens/auth/AuthScreen';
import { DoctorTabs } from './DoctorTabs';
import { PatientTabs } from './PatientTabs';

import { LiveConsultationScreen } from '../screens/consultation/LiveConsultationScreen';
import { NewConsultationScreen } from '../screens/consultation/NewConsultationScreen';
import { ConsultationsListScreen } from '../screens/consultation/ConsultationsListScreen';
import { ClinicalNoteReviewScreen } from '../screens/review/ClinicalNoteReviewScreen';
import { PatientDetailScreen } from '../screens/patients/PatientDetailScreen';
import { TemplatesScreen } from '../screens/templates/TemplatesScreen';
import { AnalyticsScreen } from '../screens/analytics/AnalyticsScreen';
import { TeamAccessScreen } from '../screens/admin/TeamAccessScreen';
import { ClinicManagementScreen } from '../screens/admin/ClinicManagementScreen';
import { AuditLogScreen } from '../screens/admin/AuditLogScreen';
import { TerminologyTrainingScreen } from '../screens/admin/TerminologyTrainingScreen';
import { PatientScheduleScreen } from '../screens/patient/PatientScheduleScreen';
import { ClinicalSecurityScreen } from '../screens/settings/ClinicalSecurityScreen';
import { NotificationsScreen } from '../screens/settings/NotificationsScreen';
import { EhrIntegrationsScreen } from '../screens/settings/EhrIntegrationsScreen';
import { AiScribePresetScreen } from '../screens/settings/AiScribePresetScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, userRole } = useMobileApp();

  if (!isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userRole === 'patient' ? (
        <Stack.Screen name="PatientHome" component={PatientTabs} />
      ) : (
        <Stack.Screen name="DoctorHome" component={DoctorTabs} />
      )}

      {/* Shared Stacks */}
      <Stack.Screen name="LiveConsultation" component={LiveConsultationScreen} />
      <Stack.Screen name="NewConsultation" component={NewConsultationScreen} />
      <Stack.Screen name="ConsultationsList" component={ConsultationsListScreen} />
      <Stack.Screen name="ClinicalNoteReview" component={ClinicalNoteReviewScreen} />
      <Stack.Screen name="PatientDetail" component={PatientDetailScreen} />
      <Stack.Screen name="Templates" component={TemplatesScreen} />
      <Stack.Screen name="Analytics" component={AnalyticsScreen} />
      <Stack.Screen name="TeamAccess" component={TeamAccessScreen} />
      <Stack.Screen name="ClinicManagement" component={ClinicManagementScreen} />
      <Stack.Screen name="AuditLog" component={AuditLogScreen} />
      <Stack.Screen name="TerminologyTraining" component={TerminologyTrainingScreen} />
      <Stack.Screen name="PatientSchedule" component={PatientScheduleScreen} />
      <Stack.Screen name="ClinicalSecurity" component={ClinicalSecurityScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="EhrIntegrations" component={EhrIntegrationsScreen} />
      <Stack.Screen name="AiScribePreset" component={AiScribePresetScreen} />
    </Stack.Navigator>
  );
};

