/**
 * navigation/VeterinarianTabNavigator.tsx
 * Dedicated Tab Navigator for Licensed Veterinarians
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  LayoutDashboard,
  CalendarClock,
  ClipboardList,
  Stethoscope,
} from 'lucide-react-native';
import colors from '../constants/colors';

import VetDashboardScreen from '../screens/veterinarian/VetDashboardScreen';
import VetAppointmentsScreen from '../screens/veterinarian/VetAppointmentsScreen';
import VetPatientsScreen from '../screens/veterinarian/VetPatientsScreen';
import VetProfileScreen from '../screens/veterinarian/VetProfileScreen';

export type VetTabParamList = {
  VetDashboardTab: undefined;
  VetAppointmentsTab: undefined;
  VetPatientsTab: undefined;
  VetProfileTab: undefined;
};

const Tab = createBottomTabNavigator<VetTabParamList>();

export const VeterinarianTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="VetDashboardTab"
        component={VetDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <LayoutDashboard size={22} color={color} strokeWidth={2.2} />,
        }}
      />
      <Tab.Screen
        name="VetAppointmentsTab"
        component={VetAppointmentsScreen}
        options={{
          tabBarLabel: 'Schedule',
          tabBarIcon: ({ color }) => <CalendarClock size={22} color={color} strokeWidth={2.2} />,
        }}
      />
      <Tab.Screen
        name="VetPatientsTab"
        component={VetPatientsScreen}
        options={{
          tabBarLabel: 'Patients',
          tabBarIcon: ({ color }) => <ClipboardList size={22} color={color} strokeWidth={2.2} />,
        }}
      />
      <Tab.Screen
        name="VetProfileTab"
        component={VetProfileScreen}
        options={{
          tabBarLabel: 'Practice',
          tabBarIcon: ({ color }) => <Stethoscope size={22} color={color} strokeWidth={2.2} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default VeterinarianTabNavigator;
