/**
 * navigation/ServiceCenterTabNavigator.tsx
 * Dedicated Tab Navigator for Pet-Care Service Centers
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  LayoutDashboard,
  Scissors,
  CalendarCheck2,
  Building2,
} from 'lucide-react-native';
import colors from '../constants/colors';

import ServiceCenterDashboardScreen from '../screens/serviceCenter/ServiceCenterDashboardScreen';
import ServiceCenterServicesScreen from '../screens/serviceCenter/ServiceCenterServicesScreen';
import ServiceCenterBookingsScreen from '../screens/serviceCenter/ServiceCenterBookingsScreen';
import ServiceCenterProfileScreen from '../screens/serviceCenter/ServiceCenterProfileScreen';

export type ServiceCenterTabParamList = {
  CenterDashboardTab: undefined;
  CenterServicesTab: undefined;
  CenterBookingsTab: undefined;
  CenterProfileTab: undefined;
};

const Tab = createBottomTabNavigator<ServiceCenterTabParamList>();

export const ServiceCenterTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0D9488', // Distinct teal/emerald accent for Service Centers
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
        name="CenterDashboardTab"
        component={ServiceCenterDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <LayoutDashboard size={22} color={color} strokeWidth={2.2} />,
        }}
      />
      <Tab.Screen
        name="CenterServicesTab"
        component={ServiceCenterServicesScreen}
        options={{
          tabBarLabel: 'My Services',
          tabBarIcon: ({ color }) => <Scissors size={22} color={color} strokeWidth={2.2} />,
        }}
      />
      <Tab.Screen
        name="CenterBookingsTab"
        component={ServiceCenterBookingsScreen}
        options={{
          tabBarLabel: 'Bookings',
          tabBarIcon: ({ color }) => <CalendarCheck2 size={22} color={color} strokeWidth={2.2} />,
        }}
      />
      <Tab.Screen
        name="CenterProfileTab"
        component={ServiceCenterProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Building2 size={22} color={color} strokeWidth={2.2} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default ServiceCenterTabNavigator;
