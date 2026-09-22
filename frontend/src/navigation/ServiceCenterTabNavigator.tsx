/**
 * navigation/ServiceCenterTabNavigator.tsx
 * Premium Tab Navigator for Service Centers — Healing Teal Theme
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, Scissors, CalendarCheck2, Building2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

const SC_ACCENT = '#00B5A3';
const SC_ACCENT_BG = '#E0F8F5';

const TAB_ITEMS = [
  { name: 'CenterDashboardTab', label: 'Dashboard', Icon: LayoutDashboard },
  { name: 'CenterServicesTab', label: 'My Services', Icon: Scissors },
  { name: 'CenterBookingsTab', label: 'Bookings', Icon: CalendarCheck2 },
  { name: 'CenterProfileTab', label: 'Profile', Icon: Building2 },
];

const ServiceCenterTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.tabBarContainer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const tabItem = TAB_ITEMS.find((t) => t.name === route.name);
        if (!tabItem) return null;
        const { label, Icon } = tabItem;
        const iconColor = isFocused ? SC_ACCENT : colors.textMuted;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name as any);
        };
        return (
          <TouchableOpacity key={route.key} style={styles.tabItem} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.iconWrapper, isFocused && { backgroundColor: SC_ACCENT_BG }]}>
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

export const ServiceCenterTabNavigator: React.FC = () => (
  <Tab.Navigator tabBar={(props) => <ServiceCenterTabBar {...props} />} screenOptions={{ headerShown: false }}>
    <Tab.Screen name="CenterDashboardTab" component={ServiceCenterDashboardScreen} />
    <Tab.Screen name="CenterServicesTab" component={ServiceCenterServicesScreen} />
    <Tab.Screen name="CenterBookingsTab" component={ServiceCenterBookingsScreen} />
    <Tab.Screen name="CenterProfileTab" component={ServiceCenterProfileScreen} />
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

export default ServiceCenterTabNavigator;
