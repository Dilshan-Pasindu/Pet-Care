/**
 * screens/admin/AdminManagementScreen.tsx
 * Admin Console for User & Role Management and Deactivation
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ShieldCheck,
  UserX,
  UserCheck,
  Search,
  Users,
  Shield,
  Stethoscope,
  PawPrint,
  ChevronRight,
} from 'lucide-react-native';
import authService from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { IUser, UserRole } from '../../types/models';
import colors from '../../constants/colors';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import { isSmallDevice } from '../../utils/responsive';

type FilterTab = 'all' | 'owner' | 'veterinarian' | 'admin' | 'deactivated';

export const AdminManagementScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await authService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to load user accounts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleToggleStatus = (targetUser: IUser) => {
    const isCurrentlyActive = targetUser.isActive !== false;
    const actionName = isCurrentlyActive ? 'Deactivate' : 'Activate';

    if (targetUser._id === currentUser?._id) {
      Alert.alert('Action Prohibited', 'You cannot deactivate your own administrative account.');
      return;
    }

    Alert.alert(
      `${actionName} Account`,
      `Are you sure you want to ${actionName.toLowerCase()} the account for "${targetUser.name}" (${targetUser.email})? ${
        isCurrentlyActive ? 'They will not be able to log in or use the app.' : 'They will regain access immediately.'
      }`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: actionName,
          style: isCurrentlyActive ? 'destructive' : 'default',
          onPress: async () => {
            try {
              setUpdatingId(targetUser._id);
              await authService.setUserStatus(targetUser._id, !isCurrentlyActive);
              setUsers((prev) =>
                prev.map((u) =>
                  u._id === targetUser._id ? { ...u, isActive: !isCurrentlyActive } : u
                )
              );
              Alert.alert('Success', `Account for "${targetUser.name}" is now ${!isCurrentlyActive ? 'active' : 'deactivated'}.`);
            } catch (err: any) {
              Alert.alert('Update Failed', err.message || 'Could not update user status');
            } finally {
              setUpdatingId(null);
            }
          },
        },
      ]
    );
  };

  const handleChangeRole = (targetUser: IUser) => {
    if (targetUser._id === currentUser?._id) {
      Alert.alert('Action Prohibited', 'You cannot alter your own administrative role.');
      return;
    }

    const availableRoles: Array<{ label: string; role: UserRole }> = [
      { label: '🐶 Pet Owner', role: 'owner' },
      { label: '👨‍⚕️ Veterinarian', role: 'veterinarian' },
      { label: '🛡️ Administrator', role: 'admin' },
    ];

    Alert.alert(
      'Assign New Role',
      `Select a new system role for "${targetUser.name}":`,
      [
        ...availableRoles.map(({ label, role }) => ({
          text: `${label} ${targetUser.role === role ? '(Current)' : ''}`,
          onPress: async () => {
            if (targetUser.role === role) return;
            try {
              setUpdatingId(targetUser._id);
              await authService.setUserRole(targetUser._id, role);
              setUsers((prev) =>
                prev.map((u) => (u._id === targetUser._id ? { ...u, role } : u))
              );
              Alert.alert('Success', `Role updated to ${role}.`);
            } catch (err: any) {
              Alert.alert('Role Update Failed', err.message || 'Could not change role');
            } finally {
              setUpdatingId(null);
            }
          },
        })),
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Compute stats
  const totalCount = users.length;
  const vetCount = users.filter((u) => u.role === 'veterinarian').length;
  const ownerCount = users.filter((u) => u.role === 'owner').length;
  const deactivatedCount = users.filter((u) => u.isActive === false).length;

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'deactivated') return u.isActive === false;
    if (activeTab === 'owner') return u.role === 'owner';
    if (activeTab === 'veterinarian') return u.role === 'veterinarian';
    if (activeTab === 'admin') return u.role === 'admin';
    return true;
  });

  const renderUserCard = ({ item }: { item: IUser }) => {
    const isActive = item.isActive !== false;
    const isSelf = item._id === currentUser?._id;
    const isProcessing = updatingId === item._id;

    const roleVariant =
      item.role === 'admin'
        ? 'warning'
        : item.role === 'veterinarian'
        ? 'secondary'
        : 'primary';

    return (
      <Card style={[styles.userCard, !isActive && styles.userCardDeactivated]}>
        <View style={styles.cardHeader}>
          <View style={styles.userInfoLeft}>
            <View style={[styles.avatarBox, !isActive && styles.avatarBoxDeactivated]}>
              {item.role === 'admin' ? (
                <Shield size={20} color={colors.warning} />
              ) : item.role === 'veterinarian' ? (
                <Stethoscope size={20} color={colors.secondary} />
              ) : (
                <PawPrint size={20} color={colors.primary} />
              )}
            </View>
            <View style={styles.nameContainer}>
              <View style={styles.nameRow}>
                <Text style={styles.userName} numberOfLines={1}>
                  {item.name} {isSelf ? ' (You)' : ''}
                </Text>
              </View>
              <Text style={styles.userEmail} numberOfLines={1}>{item.email}</Text>
              {item.phone ? <Text style={styles.userPhone}>📞 {item.phone}</Text> : null}
            </View>
          </View>
        </View>

        <View style={styles.badgeRow}>
          <Badge label={item.role.toUpperCase()} variant={roleVariant} />
          <Badge
            label={isActive ? 'Active' : 'Deactivated'}
            variant={isActive ? 'success' : 'danger'}
          />
        </View>

        {/* Action Controls */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.roleBtn]}
            onPress={() => handleChangeRole(item)}
            disabled={isProcessing || isSelf}
          >
            <Shield size={14} color={colors.primary} />
            <Text style={styles.roleBtnText}>Change Role</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionBtn,
              isActive ? styles.deactivateBtn : styles.activateBtn,
              isSelf && styles.disabledBtn,
            ]}
            onPress={() => handleToggleStatus(item)}
            disabled={isProcessing || isSelf}
          >
            {isActive ? (
              <>
                <UserX size={14} color={isSelf ? colors.textPlaceholder : colors.danger} />
                <Text style={[styles.actionBtnText, styles.deactivateBtnText, isSelf && styles.disabledText]}>
                  Deactivate
                </Text>
              </>
            ) : (
              <>
                <UserCheck size={14} color={colors.success} />
                <Text style={[styles.actionBtnText, styles.activateBtnText]}>
                  Activate
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  const horizontalPad = isSmallDevice ? 14 : 16;

  return (
    <View style={styles.container}>
      {/* Top Banner with Subtle Paw Accent */}
      <View
        style={[
          styles.header,
          {
            paddingHorizontal: horizontalPad,
            paddingTop: Math.max(insets.top + 8, 16),
          },
        ]}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerTitleRow}>
            <View style={styles.iconCircle}>
              <ShieldCheck size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Admin Console</Text>
              <Text style={styles.headerSubtitle}>User & Role Management</Text>
            </View>
          </View>
          <PawPrint size={28} color={colors.border} style={{ opacity: 0.6 }} />
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statNumber}>{totalCount}</Text>
            <Text style={styles.statLabel}>Users</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statNumber}>{ownerCount}</Text>
            <Text style={styles.statLabel}>Owners</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statNumber}>{vetCount}</Text>
            <Text style={styles.statLabel}>Vets</Text>
          </View>
          <View style={[styles.statPill, deactivatedCount > 0 && styles.statPillAlert]}>
            <Text style={[styles.statNumber, deactivatedCount > 0 && styles.statNumberAlert]}>
              {deactivatedCount}
            </Text>
            <Text style={styles.statLabel}>Deactivated</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={18} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            placeholder="Search by user name or email..."
            placeholderTextColor={colors.textPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            autoCapitalize="none"
          />
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabScroll}>
          {(['all', 'owner', 'veterinarian', 'admin', 'deactivated'] as FilterTab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.filterChip, activeTab === tab && styles.filterChipActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.filterChipText, activeTab === tab && styles.filterChipTextActive]}>
                {tab === 'all'
                  ? 'All'
                  : tab === 'owner'
                  ? 'Owners'
                  : tab === 'veterinarian'
                  ? 'Vets'
                  : tab === 'admin'
                  ? 'Admins'
                  : 'Deactivated'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading && !refreshing ? (
        <Loading fullScreen message="Loading user directory..." />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id}
          renderItem={renderUserCard}
          contentContainerStyle={[
            styles.listContent,
            {
              paddingHorizontal: horizontalPad,
              paddingBottom: Math.max(insets.bottom + 20, 32),
            },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <PawPrint size={40} color={colors.border} />
              <Text style={styles.emptyTitle}>No matching accounts</Text>
              <Text style={styles.emptySub}>
                Try adjusting your search or tab filter criteria.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: isSmallDevice ? 20 : 22, fontWeight: '800', color: colors.text },
  headerSubtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  statPill: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statPillAlert: { borderColor: '#FECACA', backgroundColor: '#FEF2F2' },
  statNumber: { fontSize: 16, fontWeight: '800', color: colors.text },
  statNumberAlert: { color: colors.danger },
  statLabel: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: colors.text,
  },
  tabScroll: {
    flexDirection: 'row',
    gap: 6,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  filterChipTextActive: { color: '#FFFFFF' },
  listContent: { paddingTop: 12 },
  userCard: {
    padding: isSmallDevice ? 12 : 16,
    marginBottom: 10,
    backgroundColor: colors.surface,
  },
  userCardDeactivated: {
    opacity: 0.75,
    backgroundColor: '#FAF9F9',
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfoLeft: { flexDirection: 'row', flex: 1, gap: 12 },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBoxDeactivated: { backgroundColor: colors.borderLight },
  nameContainer: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  userName: { fontSize: 15, fontWeight: '700', color: colors.text, flexShrink: 1 },
  userEmail: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  userPhone: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  badgeRow: { flexDirection: 'row', gap: 8, marginTop: 12, alignItems: 'center' },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  roleBtn: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  roleBtnText: { fontSize: 12, fontWeight: '600', color: colors.text },
  deactivateBtn: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  deactivateBtnText: { color: colors.danger },
  activateBtn: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  activateBtnText: { color: colors.success },
  actionBtnText: { fontSize: 12, fontWeight: '600' },
  disabledBtn: { opacity: 0.4 },
  disabledText: { color: colors.textPlaceholder },
  emptyBox: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 10 },
  emptySub: { fontSize: 13, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
});

export default AdminManagementScreen;
