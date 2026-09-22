/**
 * navigation/AdminTabNavigator.tsx
 * Dedicated Navigator for System Administrators
 * Strictly focused on User Management & Account Administration
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Users, Settings } from 'lucide-react-native';
import colors from '../constants/colors';

import AdminManagementScreen from '../screens/admin/AdminManagementScreen';
import AdminSettingsScreen from '../screens/admin/AdminSettingsScreen';

export type AdminTabParamList = {
  UsersTab: undefined;
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
        name="UsersTab"
        component={AdminManagementScreen}
        options={{
          tabBarLabel: 'User Management',
          tabBarIcon: ({ color }) => <Users size={22} color={color} strokeWidth={2.2} />,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={AdminSettingsScreen}
        options={{
          tabBarLabel: 'System & Profile',
          tabBarIcon: ({ color }) => <Settings size={22} color={color} strokeWidth={2.2} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminTabNavigator;
