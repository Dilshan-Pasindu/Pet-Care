/**
 * screens/admin/AdminDashboardScreen.tsx
 * Executive Dashboard & Metrics for Administrators
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import serviceService from '../../functions/function5-services/services/serviceService';
import appointmentService from '../../functions/function3-appointments/services/appointmentService';
import { IUser, IService, IAppointment } from '../../types/models';
import colors from '../../constants/colors';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { formatDate } from '../../utils/formatDate';
import {
  ShieldAlert,
  Users,
  Scissors,
  Calendar,
  CheckCircle,
  XCircle,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react-native';

export const AdminDashboardScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const [users, setUsers] = useState<IUser[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAdminMetrics = async () => {
    try {
      const [usersData, servicesData, apptsData] = await Promise.all([
        authService.getAllUsers().catch(() => []),
        serviceService.getServices().catch(() => []),
        appointmentService.getAppointments().catch(() => []),
      ]);
      setUsers(usersData);
      setServices(servicesData);
      setAppointments(apptsData);
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAdminMetrics();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadAdminMetrics();
  };

  const activeUsersCount = users.filter((u) => u.isActive !== false).length;
  const deactivatedUsersCount = users.filter((u) => u.isActive === false).length;
  const vetCount = users.filter((u) => u.role === 'veterinarian').length;
  const ownerCount = users.filter((u) => u.role === 'owner').length;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(insets.top + 8, 16),
          paddingBottom: Math.max(insets.bottom + 24, 36),
        },
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
      }
    >
      {/* Admin Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.badgeRow}>
            <View style={styles.adminBadge}>
              <ShieldCheck size={14} color="#DC2626" />
              <Text style={styles.adminBadgeText}>Super Administrator</Text>
            </View>
            <View style={styles.livePulse}>
              <View style={styles.pulseDot} />
              <Text style={styles.liveText}>Cluster Active</Text>
            </View>
          </View>
          <Text style={styles.headerTitle}>{user?.name || 'Administrator'}</Text>
          <Text style={styles.headerSub}>Control Center • Operations & Security</Text>
        </View>
      </View>

      {/* KPI Metrics Grid */}
      <View style={styles.kpiGrid}>
        <View style={[styles.kpiCard, { borderLeftColor: '#2563EB' }]}>
          <View style={[styles.kpiIconBox, { backgroundColor: '#EFF6FF' }]}>
            <Users size={18} color="#2563EB" />
          </View>
          <Text style={styles.kpiNumber}>{users.length}</Text>
          <Text style={styles.kpiLabel}>Total Accounts</Text>
        </View>

        <View style={[styles.kpiCard, { borderLeftColor: '#059669' }]}>
          <View style={[styles.kpiIconBox, { backgroundColor: '#ECFDF5' }]}>
            <CheckCircle size={18} color="#059669" />
          </View>
          <Text style={styles.kpiNumber}>{activeUsersCount}</Text>
          <Text style={styles.kpiLabel}>Active Users</Text>
        </View>

        <View style={[styles.kpiCard, { borderLeftColor: '#DC2626' }]}>
          <View style={[styles.kpiIconBox, { backgroundColor: '#FEF2F2' }]}>
            <XCircle size={18} color="#DC2626" />
          </View>
          <Text style={styles.kpiNumber}>{deactivatedUsersCount}</Text>
          <Text style={styles.kpiLabel}>Deactivated</Text>
        </View>

        <View style={[styles.kpiCard, { borderLeftColor: '#7C3AED' }]}>
          <View style={[styles.kpiIconBox, { backgroundColor: '#F5F3FF' }]}>
            <Stethoscope size={18} color="#7C3AED" />
          </View>
          <Text style={styles.kpiNumber}>{vetCount}</Text>
          <Text style={styles.kpiLabel}>Veterinarians</Text>
        </View>

        <View style={[styles.kpiCard, { borderLeftColor: '#DB2777' }]}>
          <View style={[styles.kpiIconBox, { backgroundColor: '#FDF2F8' }]}>
            <Scissors size={18} color="#DB2777" />
          </View>
          <Text style={styles.kpiNumber}>{services.length}</Text>
          <Text style={styles.kpiLabel}>Care Services</Text>
        </View>

        <View style={[styles.kpiCard, { borderLeftColor: '#D97706' }]}>
          <View style={[styles.kpiIconBox, { backgroundColor: '#FFFBEB' }]}>
            <Calendar size={18} color="#D97706" />
          </View>
          <Text style={styles.kpiNumber}>{appointments.length}</Text>
          <Text style={styles.kpiLabel}>Appointments</Text>
        </View>
      </View>

      {/* Quick Action Navigation Tiles */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Management Portals</Text>
      </View>

      <View style={styles.actionsList}>
        <TouchableOpacity
          style={styles.actionRowCard}
          onPress={() => navigation.navigate('UsersTab')}
        >
          <View style={[styles.actionRowIcon, { backgroundColor: '#EFF6FF' }]}>
            <Users size={20} color="#2563EB" />
          </View>
          <View style={styles.actionRowContent}>
            <Text style={styles.actionRowTitle}>User Accounts & Roles</Text>
            <Text style={styles.actionRowDesc}>
              Inspect credentials, toggle deactivation status, and manage roles ({ownerCount} owners, {vetCount} vets)
            </Text>
          </View>
          <ArrowUpRight size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionRowCard}
          onPress={() => navigation.navigate('ServicesTab')}
        >
          <View style={[styles.actionRowIcon, { backgroundColor: '#FDF2F8' }]}>
            <Scissors size={20} color="#DB2777" />
          </View>
          <View style={styles.actionRowContent}>
            <Text style={styles.actionRowTitle}>Service Catalog</Text>
            <Text style={styles.actionRowDesc}>
              Add, update pricing, duration, and manage available packages ({services.length} active offerings)
            </Text>
          </View>
          <ArrowUpRight size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionRowCard}
          onPress={() => navigation.navigate('SettingsTab')}
        >
          <View style={[styles.actionRowIcon, { backgroundColor: '#ECFDF5' }]}>
            <Activity size={20} color="#059669" />
          </View>
          <View style={styles.actionRowContent}>
            <Text style={styles.actionRowTitle}>System Health & Config</Text>
            <Text style={styles.actionRowDesc}>
              Inspect MongoDB Atlas status, JWT validation, and server runtime health
            </Text>
          </View>
          <ArrowUpRight size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Recent User Registrations */}
      <View style={[styles.sectionHeader, { marginTop: 14 }]}>
        <Text style={styles.sectionTitle}>Recent Account Registrations</Text>
      </View>

      <Card style={styles.recentUsersCard}>
        {users.slice(0, 5).map((u, i) => {
          const isActive = u.isActive !== false;
          return (
            <View key={u._id} style={[styles.userFeedRow, i > 0 && styles.userFeedBorder]}>
              <View style={styles.userFeedInfo}>
                <Text style={styles.userFeedName}>{u.name}</Text>
                <Text style={styles.userFeedEmail}>{u.email} • {u.role}</Text>
              </View>
              <Badge
                label={isActive ? 'Active' : 'Deactivated'}
                variant={isActive ? 'success' : 'danger'}
              />
            </View>
          );
        })}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16 },
  header: { marginBottom: 18 },
  headerLeft: {},
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderColor: '#FECACA',
    borderWidth: 1,
  },
  adminBadgeText: { fontSize: 11, fontWeight: '700', color: '#DC2626', textTransform: 'uppercase' },
  livePulse: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  pulseDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#059669' },
  liveText: { fontSize: 11, fontWeight: '600', color: '#059669' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  headerSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 },
  kpiCard: {
    width: '48%',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
  },
  kpiIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  kpiNumber: { fontSize: 22, fontWeight: '800', color: colors.text },
  kpiLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2, fontWeight: '500' },
  sectionHeader: { marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  actionsList: { gap: 10, marginBottom: 14 },
  actionRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  actionRowIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRowContent: { flex: 1 },
  actionRowTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  actionRowDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 2, lineHeight: 16 },
  recentUsersCard: { padding: 12 },
  userFeedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  userFeedBorder: { borderTopWidth: 1, borderTopColor: colors.borderLight },
  userFeedInfo: { flex: 1, paddingRight: 8 },
  userFeedName: { fontSize: 14, fontWeight: '700', color: colors.text },
  userFeedEmail: { fontSize: 12, color: colors.textSecondary, marginTop: 2, textTransform: 'capitalize' },
});

export default AdminDashboardScreen;
