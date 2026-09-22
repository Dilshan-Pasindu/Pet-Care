/**
 * screens/serviceCenter/ServiceCenterDashboardScreen.tsx
 * Dedicated Operations Dashboard for Pet-Care Service Centers
 */

import React, { useState, useEffect, useCallback } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Scissors,
  CalendarCheck2,
  Clock,
  Sparkles,
  Building2,
  PlusCircle,
  Phone,
  Globe,
  MapPin,
  ChevronRight,
} from 'lucide-react-native';
import { RootStackParamList } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import serviceService from '../../functions/function5-services/services/serviceService';
import bookingService from '../../functions/function6-bookings-reviews/services/bookingService';
import { IService, IServiceCenter, IServiceBooking } from '../../types/models';
import colors from '../../constants/colors';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import { isSmallDevice } from '../../utils/responsive';
import { openGoogleMapsDirections, makePhoneCall, openWebsite } from '../../utils/linking';

type NavProp = StackNavigationProp<RootStackParamList>;

export const ServiceCenterDashboardScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const { user } = useAuth();

  const [profile, setProfile] = useState<IServiceCenter | null>(null);
  const [services, setServices] = useState<IService[]>([]);
  const [bookings, setBookings] = useState<IServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = useCallback(async () => {
    try {
      const [centerData, servicesData, bookingsData] = await Promise.all([
        serviceService.getMyCenterProfile().catch(() => null),
        serviceService.getMyServices().catch(() => []),
        bookingService.getMyBookings().catch(() => []),
      ]);
      setProfile(centerData);
      setServices(servicesData);
      setBookings(bookingsData);
    } catch (e) {
      console.error('Failed to load dashboard:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  if (loading && !refreshing) {
    return <Loading fullScreen message="Loading Service Center portal..." />;
  }

  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(insets.top + 8, 16),
          paddingBottom: Math.max(insets.bottom + 24, 32),
        },
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
      }
    >
      {/* Header Banner */}
      <View style={styles.header}>
        <View style={styles.headerTextCol}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.businessName} numberOfLines={1}>
            {profile?.name || user?.name || 'Pet-Care Center'}
          </Text>
          <Badge label="🏢 Pet-Care Service Center" variant="primary" />
        </View>
      </View>

      {/* Business Snapshot Card */}
      <Card style={styles.bizCard}>
        <View style={styles.bizHeader}>
          <Building2 size={20} color={colors.primary} />
          <Text style={styles.bizTitle}>Business Location & Contact</Text>
        </View>

        <View style={styles.bizDetails}>
          <TouchableOpacity
            style={styles.bizRow}
            onPress={() =>
              openGoogleMapsDirections({
                latitude: profile?.latitude,
                longitude: profile?.longitude,
                address: profile?.address ? `${profile.address}, ${profile.city}` : undefined,
                name: profile?.name,
              })
            }
          >
            <MapPin size={16} color={colors.primary} />
            <Text style={styles.bizRowText} numberOfLines={1}>
              {profile?.address ? `${profile.address}, ${profile.city}` : 'Add location address'}
            </Text>
            <Text style={styles.linkAction}>Directions →</Text>
          </TouchableOpacity>

          {profile?.phone ? (
            <TouchableOpacity style={styles.bizRow} onPress={() => makePhoneCall(profile.phone)}>
              <Phone size={16} color="#059669" />
              <Text style={styles.bizRowText}>{profile.phone}</Text>
              <Text style={styles.linkAction}>Call</Text>
            </TouchableOpacity>
          ) : null}

          {profile?.website ? (
            <TouchableOpacity style={styles.bizRow} onPress={() => openWebsite(profile.website)}>
              <Globe size={16} color="#2563EB" />
              <Text style={styles.bizRowText} numberOfLines={1}>
                {profile.website}
              </Text>
              <Text style={styles.linkAction}>Visit</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </Card>

      {/* Operational Metrics */}
      <Text style={styles.sectionHeading}>Business Overview</Text>
      <View style={styles.metricsGrid}>
        <Card style={[styles.metricCard, { borderLeftColor: colors.primary, borderLeftWidth: 4 }]}>
          <Scissors size={24} color={colors.primary} />
          <Text style={styles.metricVal}>{services.length}</Text>
          <Text style={styles.metricLabel}>Services Listed</Text>
        </Card>

        <Card style={[styles.metricCard, { borderLeftColor: '#D97706', borderLeftWidth: 4 }]}>
          <Clock size={24} color="#D97706" />
          <Text style={styles.metricVal}>{pendingBookings.length}</Text>
          <Text style={styles.metricLabel}>Pending Requests</Text>
        </Card>

        <Card style={[styles.metricCard, { borderLeftColor: '#2563EB', borderLeftWidth: 4 }]}>
          <CalendarCheck2 size={24} color="#2563EB" />
          <Text style={styles.metricVal}>{confirmedBookings.length}</Text>
          <Text style={styles.metricLabel}>Confirmed Visits</Text>
        </Card>

        <Card style={[styles.metricCard, { borderLeftColor: '#059669', borderLeftWidth: 4 }]}>
          <Sparkles size={24} color="#059669" />
          <Text style={styles.metricVal}>{completedBookings.length}</Text>
          <Text style={styles.metricLabel}>Completed</Text>
        </Card>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionHeading}>Quick Actions</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionBtnPrimary}
          onPress={() => navigation.navigate('ServiceCenterAddEditService', {})}
        >
          <PlusCircle size={20} color="#FFFFFF" />
          <Text style={styles.actionBtnPrimaryText}>Add New Service</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Bookings Section */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeading}>Recent Bookings</Text>
      </View>

      {bookings.length === 0 ? (
        <Card style={styles.emptyCard}>
          <CalendarCheck2 size={36} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Bookings Yet</Text>
          <Text style={styles.emptySubtitle}>
            When customers book your pet-care services, they will appear here.
          </Text>
        </Card>
      ) : (
        bookings.slice(0, 4).map((booking) => {
          const serviceName =
            typeof booking.serviceId === 'object' && booking.serviceId !== null
              ? (booking.serviceId as IService).name
              : 'Pet Service';
          const petName =
            typeof booking.petId === 'object' && booking.petId !== null
              ? (booking.petId as { name?: string }).name
              : 'Pet';

          return (
            <Card key={booking._id} style={styles.bookingRowCard}>
              <View style={styles.bookingRowHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bookingServiceTitle}>{serviceName}</Text>
                  <Text style={styles.bookingPetSubtitle}>
                    🐾 Pet: {petName} • 🕒 {booking.time}
                  </Text>
                </View>
                <Badge
                  label={booking.status.toUpperCase()}
                  variant={
                    booking.status === 'confirmed'
                      ? 'primary'
                      : booking.status === 'completed'
                      ? 'success'
                      : booking.status === 'cancelled'
                      ? 'danger'
                      : 'warning'
                  }
                />
              </View>
            </Card>
          );
        })
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16 },
  header: { marginBottom: 16 },
  headerTextCol: { gap: 4 },
  welcomeText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  businessName: { fontSize: isSmallDevice ? 22 : 26, fontWeight: '800', color: colors.text },
  bizCard: { padding: 16, marginBottom: 20 },
  bizHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  bizTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  bizDetails: { gap: 10 },
  bizRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  bizRowText: { flex: 1, fontSize: 13, color: colors.textSecondary },
  linkAction: { fontSize: 12, fontWeight: '700', color: colors.primary },
  sectionHeading: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 12 },
  sectionHeaderRow: { marginTop: 12 },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    padding: 14,
    gap: 6,
  },
  metricVal: { fontSize: 24, fontWeight: '900', color: colors.text },
  metricLabel: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  actionsRow: { marginBottom: 20 },
  actionBtnPrimary: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  actionBtnPrimaryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  emptyCard: { alignItems: 'center', paddingVertical: 36, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  emptySubtitle: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: 20 },
  bookingRowCard: { marginBottom: 10, padding: 14 },
  bookingRowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bookingServiceTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  bookingPetSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 3 },
});

export default ServiceCenterDashboardScreen;
