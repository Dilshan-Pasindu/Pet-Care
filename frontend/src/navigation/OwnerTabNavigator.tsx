/**
 * navigation/OwnerTabNavigator.tsx
 * Dedicated Tab Navigator for Pet Owners
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, PawPrint, Stethoscope, Calendar, Sparkles, User } from 'lucide-react-native';
import colors from '../constants/colors';

import HomeScreen from '../screens/home/HomeScreen';
import PetListScreen from '../functions/function1-pets/screens/PetListScreen';
import VetListScreen from '../functions/function2-veterinarians/screens/VetListScreen';
import AppointmentListScreen from '../functions/function3-appointments/screens/AppointmentListScreen';
import ServiceListScreen from '../functions/function5-services/screens/ServiceListScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

export type OwnerTabParamList = {
  HomeTab: undefined;
  PetsTab: undefined;
  VetsTab: undefined;
  AppointmentsTab: undefined;
  ServicesTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<OwnerTabParamList>();

export const OwnerTabNavigator: React.FC = () => {
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
          tabBarIcon: ({ color }) => <Home size={22} color={color} strokeWidth={2.2} />,
        }}
      />
      <Tab.Screen
        name="PetsTab"
        component={PetListScreen}
        options={{
          tabBarLabel: 'My Pets',
          tabBarIcon: ({ color }) => <PawPrint size={22} color={color} strokeWidth={2.2} />,
        }}
      />
      <Tab.Screen
        name="VetsTab"
        component={VetListScreen}
        options={{
          tabBarLabel: 'Vets',
          tabBarIcon: ({ color }) => <Stethoscope size={22} color={color} strokeWidth={2.2} />,
        }}
      />
      <Tab.Screen
        name="AppointmentsTab"
        component={AppointmentListScreen}
        options={{
          tabBarLabel: 'Visits',
          tabBarIcon: ({ color }) => <Calendar size={22} color={color} strokeWidth={2.2} />,
        }}
      />
      <Tab.Screen
        name="ServicesTab"
        component={ServiceListScreen}
        options={{
          tabBarLabel: 'Services',
          tabBarIcon: ({ color }) => <Sparkles size={22} color={color} strokeWidth={2.2} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <User size={22} color={color} strokeWidth={2.2} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default OwnerTabNavigator;
