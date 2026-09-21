/**
 * components/common/Badge.tsx
 * Reusable Status Badge Component
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import colors from '../../constants/colors';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary' | 'neutral';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', style }) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: colors.secondaryLight, text: colors.secondary };
      case 'warning':
        return { bg: colors.warningLight, text: colors.warning };
      case 'danger':
        return { bg: colors.dangerLight, text: colors.danger };
      case 'secondary':
        return { bg: colors.accentLight, text: colors.accent };
      case 'neutral':
        return { bg: colors.borderLight, text: colors.textSecondary };
      default:
        return { bg: colors.primaryLight, text: colors.primary };
    }
  };

  const { bg, text } = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

export default Badge;
