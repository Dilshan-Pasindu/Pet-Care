/**
 * navigation/MainTabNavigator.tsx
 * Bottom Tab Navigator for authenticated users
 */

import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation';
import colors from '../constants/colors';

import HomeScreen from '../screens/home/HomeScreen';
import PetListScreen from '../functions/function1-pets/screens/PetListScreen';
import VetListScreen from '../functions/function2-veterinarians/screens/VetListScreen';
import AppointmentListScreen from '../functions/function3-appointments/screens/AppointmentListScreen';
import ServiceListScreen from '../functions/function5-services/screens/ServiceListScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
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
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="PetsTab"
        component={PetListScreen}
        options={{
          tabBarLabel: 'My Pets',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🐾</Text>,
        }}
      />
      <Tab.Screen
        name="VetsTab"
        component={VetListScreen}
        options={{
          tabBarLabel: 'Veterinarians',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👨‍⚕️</Text>,
        }}
      />
      <Tab.Screen
        name="AppointmentsTab"
        component={AppointmentListScreen}
        options={{
          tabBarLabel: 'Visits',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📅</Text>,
        }}
      />
      <Tab.Screen
        name="ServicesTab"
        component={ServiceListScreen}
        options={{
          tabBarLabel: 'Services',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>✂️</Text>,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
