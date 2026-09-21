/**
 * navigation/AdminTabNavigator.tsx
 * Dedicated Tab Navigator for System Administrators
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  BarChart3,
  Users,
  Scissors,
  Settings,
} from 'lucide-react-native';
import colors from '../constants/colors';

import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminManagementScreen from '../screens/admin/AdminManagementScreen';
import AdminServicesScreen from '../screens/admin/AdminServicesScreen';
import AdminSettingsScreen from '../screens/admin/AdminSettingsScreen';

export type AdminTabParamList = {
  DashboardTab: undefined;
  UsersTab: undefined;
  ServicesTab: undefined;
  SettingsTab: undefined;
};

const Tab = createBottomTabNavigator<AdminTabParamList>();

export const AdminTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#DC2626',
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
        name="DashboardTab"
        component={AdminDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <BarChart3 size={22} color={color} strokeWidth={2.2} />,
        }}
      />
      <Tab.Screen
        name="UsersTab"
        component={AdminManagementScreen}
        options={{
          tabBarLabel: 'Accounts',
          tabBarIcon: ({ color }) => <Users size={22} color={color} strokeWidth={2.2} />,
        }}
      />
      <Tab.Screen
        name="ServicesTab"
        component={AdminServicesScreen}
        options={{
          tabBarLabel: 'Services',
          tabBarIcon: ({ color }) => <Scissors size={22} color={color} strokeWidth={2.2} />,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={AdminSettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => <Settings size={22} color={color} strokeWidth={2.2} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminTabNavigator;
