/**
 * screens/auth/RegisterScreen.tsx
 * User Registration Screen
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

type NavProp = StackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'owner' | 'veterinarian'>('owner');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
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
      Alert.alert('Registration Failed', err.message || 'Could not complete registration');
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
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top + 16, 24),
            paddingBottom: Math.max(insets.bottom + 24, 32),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formCard}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join PetCare to manage your pet health & wellness</Text>

          <Input
            label="Full Name *"
            placeholder="Jane Doe"
            value={name}
            onChangeText={setName}
            error={errors.name}
          />

          <Input
            label="Email Address *"
            placeholder="jane@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
          />

          <Input
            label="Password *"
            placeholder="At least 6 characters"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            error={errors.password}
          />

          <Input
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>I am a:</Text>
            <View style={styles.roleRow}>
              <TouchableOpacity
                style={[styles.roleBtn, role === 'owner' && styles.roleBtnActive]}
                onPress={() => setRole('owner')}
              >
                <Text style={[styles.roleText, role === 'owner' && styles.roleTextActive]}>
                  🐶 Pet Owner
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleBtn, role === 'veterinarian' && styles.roleBtnActive]}
                onPress={() => setRole('veterinarian')}
              >
                <Text style={[styles.roleText, role === 'veterinarian' && styles.roleTextActive]}>
                  👨‍⚕️ Veterinarian
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={styles.submitBtn}
          />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signinText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: isSmallDevice ? 16 : 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  formCard: {
    backgroundColor: colors.surface,
    padding: isSmallDevice ? 18 : 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  title: { fontSize: isSmallDevice ? 22 : 24, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: isSmallDevice ? 12 : 13, color: colors.textSecondary, marginTop: 4, marginBottom: 20 },
  roleContainer: { marginBottom: 16 },
  roleLabel: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 },
  roleRow: { flexDirection: 'row', gap: 10 },
  roleBtn: {
    flex: 1,
    paddingVertical: isSmallDevice ? 10 : 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  roleBtnActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  roleText: { fontSize: isSmallDevice ? 12 : 13, fontWeight: '600', color: colors.textSecondary },
  roleTextActive: { color: colors.primary },
  submitBtn: { marginTop: 10 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { fontSize: 14, color: colors.textSecondary },
  signinText: { fontSize: 14, fontWeight: '700', color: colors.primary },
});

export default RegisterScreen;
