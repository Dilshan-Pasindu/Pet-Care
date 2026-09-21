/**
 * screens/auth/LoginScreen.tsx
 * User Login Screen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import colors from '../../constants/colors';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

type NavProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
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
      Alert.alert('Login Failed', err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroSection}>
        <Text style={styles.appIcon}>🐾</Text>
        <Text style={styles.brandTitle}>PetCare</Text>
        <Text style={styles.brandSubtitle}>Healthcare & Services for your companions</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.instructionText}>Sign in to your PetCare account</Text>

        <Input
          label="Email Address"
          placeholder="your.email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
        />

        <Input
          label="Password"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          error={errors.password}
        />

        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={loading}
          style={styles.loginBtn}
        />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signupText}>Create One</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, justifyContent: 'center', minHeight: '100%' },
  heroSection: { alignItems: 'center', marginBottom: 32 },
  appIcon: { fontSize: 56, marginBottom: 8 },
  brandTitle: { fontSize: 32, fontWeight: '900', color: colors.primary, letterSpacing: -0.5 },
  brandSubtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  formCard: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  welcomeText: { fontSize: 22, fontWeight: '800', color: colors.text },
  instructionText: { fontSize: 14, color: colors.textSecondary, marginTop: 4, marginBottom: 20 },
  loginBtn: { marginTop: 8 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { fontSize: 14, color: colors.textSecondary },
  signupText: { fontSize: 14, fontWeight: '700', color: colors.primary },
});

export default LoginScreen;
