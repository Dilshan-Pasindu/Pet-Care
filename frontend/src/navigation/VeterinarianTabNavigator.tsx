/**
 * navigation/VeterinarianTabNavigator.tsx
 * Premium Tab Navigator for Veterinarians — Clinical Blue Theme
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, CalendarClock, ClipboardList, Stethoscope } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

const VET_ACCENT = '#1558CC';
const VET_ACCENT_BG = '#E0ECFF';

const TAB_ITEMS = [
  { name: 'VetDashboardTab', label: 'Dashboard', Icon: LayoutDashboard },
  { name: 'VetAppointmentsTab', label: 'Schedule', Icon: CalendarClock },
  { name: 'VetPatientsTab', label: 'Patients', Icon: ClipboardList },
  { name: 'VetProfileTab', label: 'Practice', Icon: Stethoscope },
];

const VetTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.tabBarContainer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const tabItem = TAB_ITEMS.find((t) => t.name === route.name);
        if (!tabItem) return null;
        const { label, Icon } = tabItem;
        const iconColor = isFocused ? VET_ACCENT : colors.textMuted;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name as any);
        };
        return (
          <TouchableOpacity key={route.key} style={styles.tabItem} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.iconWrapper, isFocused && { backgroundColor: VET_ACCENT_BG }]}>
              <Icon size={22} color={iconColor} strokeWidth={isFocused ? 2.5 : 2} />
            </View>
            <Text style={[styles.tabLabel, { color: iconColor, fontWeight: isFocused ? '800' : '600' }]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export const VeterinarianTabNavigator: React.FC = () => (
  <Tab.Navigator tabBar={(props) => <VetTabBar {...props} />} screenOptions={{ headerShown: false }}>
    <Tab.Screen name="VetDashboardTab" component={VetDashboardScreen} />
    <Tab.Screen name="VetAppointmentsTab" component={VetAppointmentsScreen} />
    <Tab.Screen name="VetPatientsTab" component={VetPatientsScreen} />
    <Tab.Screen name="VetProfileTab" component={VetProfileScreen} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 16,
  },
  tabItem: { flex: 1, alignItems: 'center', gap: 3 },
  iconWrapper: {
    width: 52,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: { fontSize: 10, letterSpacing: 0.1 },
});

export default VeterinarianTabNavigator;
