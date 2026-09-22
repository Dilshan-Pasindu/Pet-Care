/**
 * screens/auth/RegisterScreen.tsx
 * Premium Registration Screen — PetCare Medical Theme
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import colors from '../../constants/colors';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { isSmallDevice } from '../../utils/responsive';
import {
  HeartPulse,
  PawPrint,
  Mail,
  Lock,
  User,
  Phone,
  ChevronLeft,
  Stethoscope,
  Building2,
} from 'lucide-react-native';

type NavProp = StackNavigationProp<AuthStackParamList, 'Register'>;

type UserRole = 'owner' | 'veterinarian' | 'service_center';

interface RoleConfig {
  key: UserRole;
  label: string;
  subtitle: string;
  emoji: string;
  accentColor: string;
  accentBg: string;
  icon: React.ReactNode;
}

const ROLES: RoleConfig[] = [
  {
    key: 'owner',
    label: 'Pet Owner',
    subtitle: 'Manage your companions',
    emoji: '🐾',
    accentColor: '#1A73E8',
    accentBg: '#E8F2FF',
    icon: <PawPrint size={20} color="#1A73E8" strokeWidth={2.2} />,
  },
  {
    key: 'veterinarian',
    label: 'Veterinarian',
    subtitle: 'Licensed practitioner',
    emoji: '🩺',
    accentColor: '#0D5DBD',
    accentBg: '#E0ECFF',
    icon: <Stethoscope size={20} color="#0D5DBD" strokeWidth={2.2} />,
  },
  {
    key: 'service_center',
    label: 'Service Center',
    subtitle: 'Pet grooming & care',
    emoji: '🏢',
    accentColor: '#00B5A3',
    accentBg: '#E0F8F5',
    icon: <Building2 size={20} color="#00B5A3" strokeWidth={2.2} />,
  },
];

export const RegisterScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('owner');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedRole = ROLES.find((r) => r.key === role)!;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim())
      errs.name = role === 'service_center' ? 'Business name is required' : 'Full name is required';
    if (!email.trim()) errs.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format';
    if (!password || password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
        role,
      });
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message || 'Could not complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Gradient Header ── */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top + 16, 32) }]}>
          <View style={styles.circleDecor1} />
          <View style={styles.circleDecor2} />

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.navigate('Login')}
          >
            <ChevronLeft size={20} color="rgba(255,255,255,0.9)" strokeWidth={2.5} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={styles.logoMark}>
              <PawPrint size={22} color="#FFFFFF" strokeWidth={2.5} />
              <View style={styles.logoHeart}>
                <HeartPulse size={10} color={colors.primary} strokeWidth={2.5} />
              </View>
            </View>
            <View>
              <Text style={styles.headerTitle}>Create Account</Text>
              <Text style={styles.headerSub}>Join the PetCare network</Text>
            </View>
          </View>
        </View>

        {/* ── Form Sheet ── */}
        <View style={[styles.formSheet, { paddingBottom: Math.max(insets.bottom + 20, 36) }]}>

          {/* Role Selector */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>I am a...</Text>
            <View style={styles.roleGrid}>
              {ROLES.map((r) => {
                const isActive = role === r.key;
                return (
                  <TouchableOpacity
                    key={r.key}
                    style={[
                      styles.roleCard,
                      isActive && {
                        borderColor: r.accentColor,
                        backgroundColor: r.accentBg,
                        shadowColor: r.accentColor,
                        shadowOpacity: 0.18,
                        shadowRadius: 10,
                        elevation: 4,
                      },
                    ]}
                    onPress={() => setRole(r.key)}
                    activeOpacity={0.8}
                  >
                    <View style={[
                      styles.roleIconBox,
                      { backgroundColor: isActive ? r.accentColor : colors.borderLight },
                    ]}>
                      {isActive ? (
                        React.cloneElement(r.icon as React.ReactElement<any>, { color: '#FFFFFF' })
                      ) : (
                        r.icon
                      )}
                    </View>
                    <View style={styles.roleTextBlock}>
                      <Text style={[styles.roleLabel, isActive && { color: r.accentColor }]}>
                        {r.label}
                      </Text>
                      <Text style={styles.roleSub}>{r.subtitle}</Text>
                    </View>
                    {isActive && (
                      <View style={[styles.roleActiveDot, { backgroundColor: r.accentColor }]} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.divider} />

          {/* Form Fields */}
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>Account Details</Text>

            <Input
              label={role === 'service_center' ? 'Business Name' : 'Full Name'}
              placeholder={role === 'service_center' ? 'Paws Spa & Grooming' : 'Jane Doe'}
              value={name}
              onChangeText={setName}
              error={errors.name}
              required
              leftIcon={<User size={17} color={colors.textMuted} strokeWidth={2} />}
            />

            <Input
              label="Email Address"
              placeholder="jane@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              required
              leftIcon={<Mail size={17} color={colors.textMuted} strokeWidth={2} />}
            />

            <Input
              label="Password"
              placeholder="Minimum 6 characters"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              required
              leftIcon={<Lock size={17} color={colors.textMuted} strokeWidth={2} />}
            />

            <Input
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              leftIcon={<Phone size={17} color={colors.textMuted} strokeWidth={2} />}
            />
          </View>

          <Button
            title="Create My Account"
            onPress={handleRegister}
            loading={loading}
            style={styles.submitBtn}
          />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },

  // ── Header ──
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingBottom: 28,
    overflow: 'hidden',
  },
  circleDecor1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -50,
    right: -40,
  },
  circleDecor2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -20,
    left: -20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  logoMark: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoHeart: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    width: 20,
    height: 20,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: isSmallDevice ? 22 : 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.6,
  },
  headerSub: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },

  // ── Form Sheet ──
  formSheet: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: isSmallDevice ? 18 : 24,
    paddingTop: 28,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 16,
  },
  sectionBlock: {
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 14,
  },

  // ── Role Selector ──
  roleGrid: {
    gap: 10,
    marginBottom: 10,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: 12,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  roleIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleTextBlock: {
    flex: 1,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.2,
  },
  roleSub: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  roleActiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 20,
  },
  submitBtn: {
    marginTop: 8,
    marginBottom: 18,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
});

export default RegisterScreen;
