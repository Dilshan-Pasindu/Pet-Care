/**
 * screens/auth/LoginScreen.tsx
 * Premium Login Screen — PetCare Medical Theme
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
  Dimensions,
  Image,
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
  ShieldCheck,
  Lock,
  Mail,
  Stethoscope,
  Sparkles,
} from 'lucide-react-native';

type NavProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const LoginScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      await login({ email: email.trim(), password });
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Invalid email or password. Please try again.');
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
        {/* ── Gradient Hero Header ── */}
        <View style={[styles.heroSection, { paddingTop: Math.max(insets.top + 20, 40) }]}>
          {/* Background decorative circles */}
          <View style={styles.circleDecor1} />
          <View style={styles.circleDecor2} />
          <View style={styles.circleDecor3} />

          {/* Brand Mark */}
          <View style={styles.brandLockup}>
            <View style={styles.logoRing}>
              <View style={styles.logoInner}>
                <PawPrint size={28} color="#FFFFFF" strokeWidth={2.5} />
              </View>
              <View style={styles.logoHeartBadge}>
                <HeartPulse size={11} color={colors.primary} strokeWidth={2.5} />
              </View>
            </View>

            <View style={styles.brandTextGroup}>
              <Text style={styles.eyebrow}>PET HEALTH PLATFORM</Text>
              <Text style={styles.brandTitle}>PetCare</Text>
            </View>
          </View>

          <Text style={styles.heroHeadline}>Your pet's health,{'\n'}always within reach.</Text>

          {/* Trust Pills */}
          <View style={styles.trustRow}>
            <View style={styles.trustPill}>
              <ShieldCheck size={12} color="rgba(255,255,255,0.9)" strokeWidth={2.5} />
              <Text style={styles.trustPillText}>Verified Vets</Text>
            </View>
            <View style={styles.trustPill}>
              <Sparkles size={12} color="rgba(255,255,255,0.9)" strokeWidth={2.5} />
              <Text style={styles.trustPillText}>10k+ Pets Cared</Text>
            </View>
            <View style={styles.trustPill}>
              <Stethoscope size={12} color="rgba(255,255,255,0.9)" strokeWidth={2.5} />
              <Text style={styles.trustPillText}>24/7 Records</Text>
            </View>
          </View>
        </View>

        {/* ── Glass Form Card ── */}
        <View style={[styles.formCard, { paddingBottom: Math.max(insets.bottom + 16, 32) }]}>
          {/* Form Header */}
          <View style={styles.formHeader}>
            <View>
              <Text style={styles.welcomeBack}>Welcome back</Text>
              <Text style={styles.signInInstruction}>Sign in to your care portal</Text>
            </View>
            <View style={styles.secureChip}>
              <ShieldCheck size={15} color={colors.secondary} strokeWidth={2.5} />
              <Text style={styles.secureChipText}>Secure</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.formDivider} />

          <Input
            label="Email Address"
            placeholder="your.email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            leftIcon={<Mail size={17} color={colors.textMuted} strokeWidth={2} />}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            leftIcon={<Lock size={17} color={colors.textMuted} strokeWidth={2} />}
          />

          <Button
            title="Sign In to PetCare"
            onPress={handleLogin}
            loading={loading}
            style={styles.signInBtn}
          />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.createAccountLink}>Create One</Text>
            </TouchableOpacity>
          </View>

          {/* Portal hint */}
          <View style={styles.portalsHint}>
            <Text style={styles.portalsHintText}>
              One account, four portals: Owner · Vet · Service Center · Admin
            </Text>
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

  // ── Hero Section ──
  heroSection: {
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingBottom: 36,
    overflow: 'hidden',
  },
  circleDecor1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -60,
    right: -60,
  },
  circleDecor2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: 10,
    left: -50,
  },
  circleDecor3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: 60,
    left: 30,
  },
  brandLockup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 14,
  },
  logoRing: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  logoInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoHeartBadge: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    width: 22,
    height: 22,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  brandTextGroup: {},
  eyebrow: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.8,
  },
  heroHeadline: {
    fontSize: isSmallDevice ? 26 : 30,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: isSmallDevice ? 33 : 38,
    letterSpacing: -0.6,
    marginBottom: 22,
  },
  trustRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  trustPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  trustPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.92)',
  },

  // ── Form Card ──
  formCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: isSmallDevice ? 20 : 26,
    paddingTop: 28,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 16,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  welcomeBack: {
    fontSize: isSmallDevice ? 22 : 25,
    fontWeight: '800',
    color: colors.navy,
    letterSpacing: -0.5,
  },
  signInInstruction: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 3,
    fontWeight: '500',
  },
  secureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${colors.secondary}30`,
  },
  secureChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondaryDark,
  },
  formDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginBottom: 22,
  },
  signInBtn: {
    marginTop: 4,
    marginBottom: 18,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  createAccountLink: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  portalsHint: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.navyLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  portalsHintText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});

export default LoginScreen;
