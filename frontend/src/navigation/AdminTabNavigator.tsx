/**
 * navigation/AdminTabNavigator.tsx
 * Premium Tab Navigator for Administrators — Authority Red/Navy Theme
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Users, Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../constants/colors';

import AdminManagementScreen from '../screens/admin/AdminManagementScreen';
import AdminSettingsScreen from '../screens/admin/AdminSettingsScreen';

export type AdminTabParamList = {
  UsersTab: undefined;
  SettingsTab: undefined;
};

const Tab = createBottomTabNavigator<AdminTabParamList>();

const ADMIN_ACCENT = '#DC2626';
const ADMIN_ACCENT_BG = '#FEF2F2';

const TAB_ITEMS = [
  { name: 'UsersTab', label: 'User Management', Icon: Users },
  { name: 'SettingsTab', label: 'System & Profile', Icon: Settings },
];

const AdminTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.tabBarContainer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const tabItem = TAB_ITEMS.find((t) => t.name === route.name);
        if (!tabItem) return null;
        const { label, Icon } = tabItem;
        const iconColor = isFocused ? ADMIN_ACCENT : colors.textMuted;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name as any);
        };
        return (
          <TouchableOpacity key={route.key} style={styles.tabItem} onPress={onPress} activeOpacity={0.7}>
            <View style={[styles.iconWrapper, isFocused && { backgroundColor: ADMIN_ACCENT_BG }]}>
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

export const AdminTabNavigator: React.FC = () => (
  <Tab.Navigator tabBar={(props) => <AdminTabBar {...props} />} screenOptions={{ headerShown: false }}>
    <Tab.Screen name="UsersTab" component={AdminManagementScreen} />
    <Tab.Screen name="SettingsTab" component={AdminSettingsScreen} />
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

export default AdminTabNavigator;
