/**
 * screens/veterinarian/VetDashboardScreen.tsx
 * Dedicated Clinical Dashboard for Veterinarians
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import { IAppointment } from '../../types/models';
import appointmentService from '../../functions/function3-appointments/services/appointmentService';
import vetService from '../../functions/function2-veterinarians/services/vetService';
import colors from '../../constants/colors';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import PetAvatar from '../../components/common/PetAvatar';
import { formatDate } from '../../utils/formatDate';
import {
  Stethoscope,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  FilePlus,
  Phone,
} from 'lucide-react-native';

type NavProp = StackNavigationProp<RootStackParamList>;

export const VetDashboardScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const { user } = useAuth();

  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [specialization, setSpecialization] = useState<string>('Veterinary Specialist');
  const [clinicName, setClinicName] = useState<string>('PetCare Clinical Center');
  const [refreshing, setRefreshing] = useState(false);

  const loadVetData = async () => {
    try {
      const [appts, profile] = await Promise.all([
        appointmentService.getAppointments().catch(() => []),
        vetService.getMyProfile().catch(() => null),
      ]);
      setAppointments(appts);
      if (profile) {
        if (profile.specialization) setSpecialization(profile.specialization);
        if (profile.clinicName) setClinicName(profile.clinicName);
      }
    } catch (e) {
      console.error('Failed to load vet dashboard data:', e);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadVetData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadVetData();
  };

  // Metrics
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter((a) => {
    const apptDate = new Date(a.date).toISOString().split('T')[0];
    return apptDate === todayStr;
  });

  const pendingAppts = appointments.filter((a) => a.status === 'pending');
  const completedAppts = appointments.filter((a) => a.status === 'completed');

  // Unique patients
  const uniquePatientIds = new Set(
    appointments
      .map((a) => (typeof a.petId === 'object' && a.petId ? a.petId._id : a.petId))
      .filter(Boolean)
  );

  const handleUpdateStatus = async (appointmentId: string, newStatus: 'confirmed' | 'completed' | 'cancelled') => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, newStatus);
      Alert.alert('Status Updated', `Appointment marked as ${newStatus}.`);
      loadVetData();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update status.');
    }
  };

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
      {/* Vet Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.badgeRow}>
            <View style={styles.doctorBadge}>
              <Stethoscope size={14} color="#2563EB" />
              <Text style={styles.doctorBadgeText}>Verified Practitioner</Text>
            </View>
          </View>
          <Text style={styles.doctorName}>
            {user?.name?.startsWith('Dr.') ? user.name : `Dr. ${user?.name || 'Veterinarian'}`}
          </Text>
          <Text style={styles.clinicSub}>{specialization} • {clinicName}</Text>
        </View>
      </View>

      {/* Clinical Metrics Grid */}
      <View style={styles.metricsGrid}>
        <View style={[styles.metricCard, { borderLeftColor: '#2563EB' }]}>
          <View style={[styles.metricIconBox, { backgroundColor: '#EFF6FF' }]}>
            <Calendar size={18} color="#2563EB" />
          </View>
          <Text style={styles.metricNumber}>{todayAppts.length}</Text>
          <Text style={styles.metricLabel}>Today's Visits</Text>
        </View>

        <View style={[styles.metricCard, { borderLeftColor: '#D97706' }]}>
          <View style={[styles.metricIconBox, { backgroundColor: '#FFFBEB' }]}>
            <AlertCircle size={18} color="#D97706" />
          </View>
          <Text style={styles.metricNumber}>{pendingAppts.length}</Text>
          <Text style={styles.metricLabel}>Pending Requests</Text>
        </View>

        <View style={[styles.metricCard, { borderLeftColor: '#059669' }]}>
          <View style={[styles.metricIconBox, { backgroundColor: '#ECFDF5' }]}>
            <CheckCircle2 size={18} color="#059669" />
          </View>
          <Text style={styles.metricNumber}>{completedAppts.length}</Text>
          <Text style={styles.metricLabel}>Completed</Text>
        </View>

        <View style={[styles.metricCard, { borderLeftColor: '#7C3AED' }]}>
          <View style={[styles.metricIconBox, { backgroundColor: '#F5F3FF' }]}>
            <Users size={18} color="#7C3AED" />
          </View>
          <Text style={styles.metricNumber}>{uniquePatientIds.size}</Text>
          <Text style={styles.metricLabel}>Total Patients</Text>
        </View>
      </View>

      {/* Quick Clinical Actions */}
      <View style={styles.quickActionsBar}>
        <TouchableOpacity
          style={styles.actionBtnPrimary}
          onPress={() => navigation.navigate('AddMedicalRecord', {})}
        >
          <FilePlus size={18} color="#FFFFFF" />
          <Text style={styles.actionBtnPrimaryText}>Add Clinical Record</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Schedule Agenda */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Consultations ({todayAppts.length})</Text>
      </View>

      {todayAppts.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No Consultations Scheduled Today</Text>
          <Text style={styles.emptySub}>Upcoming appointments will appear here automatically.</Text>
        </Card>
      ) : (
        todayAppts.map((appt) => {
          const pet = typeof appt.petId === 'object' && appt.petId ? appt.petId : null;
          const owner = typeof appt.ownerId === 'object' && appt.ownerId ? appt.ownerId : null;

          return (
            <Card key={appt._id} style={styles.apptCard}>
              <View style={styles.apptTopRow}>
                <View style={styles.petInfoRow}>
                  <PetAvatar
                    imageUrl={pet?.imageUrl}
                    image={pet?.image}
                    name={pet?.name}
                    species={pet?.species}
                    size={48}
                    borderRadius={12}
                  />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.petNameText}>{pet?.name || 'Pet Patient'}</Text>
                    <Text style={styles.speciesText}>{pet?.species || 'Species not specified'}</Text>
                  </View>
                </View>
                <Badge
                  label={appt.status.toUpperCase()}
                  variant={
                    appt.status === 'confirmed'
                      ? 'success'
                      : appt.status === 'pending'
                      ? 'warning'
                      : appt.status === 'completed'
                      ? 'primary'
                      : 'danger'
                  }
                />
              </View>

              <View style={styles.apptMetaBox}>
                <View style={styles.metaRow}>
                  <Clock size={13} color={colors.textSecondary} />
                  <Text style={styles.metaText}>{appt.time}</Text>
                </View>
                <Text style={styles.reasonText} numberOfLines={2}>
                  <Text style={{ fontWeight: '700' }}>Reason: </Text>{appt.reason}
                </Text>
                {owner && (
                  <View style={styles.ownerContactRow}>
                    <Text style={styles.ownerNameText}>Owner: {owner.name}</Text>
                    {owner.phone && (
                      <View style={styles.phoneTag}>
                        <Phone size={11} color="#059669" />
                        <Text style={styles.phoneText}>{owner.phone}</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* Action Buttons */}
              <View style={styles.cardActionsRow}>
                {appt.status === 'pending' && (
                  <TouchableOpacity
                    style={[styles.smallBtn, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}
                    onPress={() => handleUpdateStatus(appt._id, 'confirmed')}
                  >
                    <Text style={[styles.smallBtnText, { color: '#059669' }]}>Accept Visit</Text>
                  </TouchableOpacity>
                )}

                {appt.status === 'confirmed' && (
                  <TouchableOpacity
                    style={[styles.smallBtn, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}
                    onPress={() => handleUpdateStatus(appt._id, 'completed')}
                  >
                    <Text style={[styles.smallBtnText, { color: '#2563EB' }]}>Mark Completed</Text>
                  </TouchableOpacity>
                )}

                {pet && (
                  <TouchableOpacity
                    style={[styles.smallBtn, { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' }]}
                    onPress={() => navigation.navigate('AddMedicalRecord', { petId: pet._id })}
                  >
                    <Text style={[styles.smallBtnText, { color: colors.text }]}>Add Rx / Notes</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.smallBtn, { backgroundColor: '#FFFFFF', borderColor: colors.border }]}
                  onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: appt._id })}
                >
                  <Text style={[styles.smallBtnText, { color: colors.textSecondary }]}>Details</Text>
                </TouchableOpacity>
              </View>
            </Card>
          );
        })
      )}

      {/* Pending Action Requests */}
      {pendingAppts.length > 0 && (
        <>
          <View style={[styles.sectionHeader, { marginTop: 20 }]}>
            <Text style={styles.sectionTitle}>Requires Confirmation ({pendingAppts.length})</Text>
          </View>
          {pendingAppts.slice(0, 3).map((appt) => {
            const pet = typeof appt.petId === 'object' && appt.petId ? appt.petId : null;
            return (
              <Card key={appt._id} style={styles.pendingCard}>
                <View style={styles.pendingHeader}>
                  <Text style={styles.pendingDate}>{formatDate(appt.date)} at {appt.time}</Text>
                  <Badge label="Needs Review" variant="warning" />
                </View>
                <Text style={styles.pendingPetName}>Patient: {pet?.name || 'Pet'}</Text>
                <Text style={styles.pendingReason}>"{appt.reason}"</Text>
                <View style={styles.pendingActions}>
                  <TouchableOpacity
                    style={styles.confirmBtn}
                    onPress={() => handleUpdateStatus(appt._id, 'confirmed')}
                  >
                    <Text style={styles.confirmBtnText}>Confirm Appointment</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.declineBtn}
                    onPress={() => handleUpdateStatus(appt._id, 'cancelled')}
                  >
                    <Text style={styles.declineBtnText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            );
          })}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16 },
  header: { marginBottom: 18 },
  headerLeft: {},
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  doctorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderColor: '#DBEAFE',
    borderWidth: 1,
  },
  doctorBadgeText: { fontSize: 11, fontWeight: '700', color: '#2563EB', textTransform: 'uppercase' },
  doctorName: { fontSize: 22, fontWeight: '800', color: colors.text },
  clinicSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  metricCard: {
    width: '48%',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
  },
  metricIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricNumber: { fontSize: 22, fontWeight: '800', color: colors.text },
  metricLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2, fontWeight: '500' },
  quickActionsBar: { marginBottom: 18 },
  actionBtnPrimary: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  actionBtnPrimaryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  emptyCard: { padding: 24, alignItems: 'center' },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  emptySub: { fontSize: 12, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
  apptCard: { padding: 14, marginBottom: 12 },
  apptTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  petInfoRow: { flexDirection: 'row', alignItems: 'center' },
  petNameText: { fontSize: 15, fontWeight: '700', color: colors.text },
  speciesText: { fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  apptMetaBox: {
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    gap: 4,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, fontWeight: '600', color: colors.text },
  reasonText: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  ownerContactRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  ownerNameText: { fontSize: 12, fontWeight: '600', color: colors.text },
  phoneTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ECFDF5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  phoneText: { fontSize: 11, fontWeight: '600', color: '#059669' },
  cardActionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  smallBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  smallBtnText: { fontSize: 12, fontWeight: '700' },
  pendingCard: { padding: 14, marginBottom: 10, backgroundColor: '#FFFBEB', borderColor: '#FDE68A' },
  pendingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pendingDate: { fontSize: 13, fontWeight: '700', color: '#92400E' },
  pendingPetName: { fontSize: 14, fontWeight: '700', color: colors.text, marginTop: 6 },
  pendingReason: { fontSize: 12, color: colors.textSecondary, fontStyle: 'italic', marginTop: 2 },
  pendingActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  confirmBtn: { flex: 1, backgroundColor: '#059669', paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  confirmBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  declineBtn: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DC2626', paddingVertical: 9, borderRadius: 8, alignItems: 'center' },
  declineBtnText: { color: '#DC2626', fontSize: 13, fontWeight: '700' },
});

export default VetDashboardScreen;
