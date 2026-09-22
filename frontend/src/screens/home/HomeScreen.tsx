/**
 * screens/home/HomeScreen.tsx
 * Premium Owner Dashboard — PetCare Medical Theme
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import { IPet, IAppointment, IService } from '../../types/models';
import petService from '../../functions/function1-pets/services/petService';
import appointmentService from '../../functions/function3-appointments/services/appointmentService';
import serviceService from '../../functions/function5-services/services/serviceService';
import colors from '../../constants/colors';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import PetAvatar from '../../components/common/PetAvatar';
import { formatDate } from '../../utils/formatDate';
import { isSmallDevice } from '../../utils/responsive';
import {
  PawPrint,
  Stethoscope,
  CalendarPlus,
  FileText,
  Sparkles,
  BookmarkCheck,
  ShieldCheck,
  Calendar,
  Clock,
  ChevronRight,
  Plus,
  Bell,
  TrendingUp,
} from 'lucide-react-native';

type NavProp = StackNavigationProp<RootStackParamList>;

const ACTION_TILES = [
  { key: 'pets', label: 'My Pets', icon: PawPrint, color: '#059669', bg: '#ECFDF5', nav: 'Main' as const },
  { key: 'vets', label: 'Find Vets', icon: Stethoscope, color: '#2563EB', bg: '#EFF6FF', nav: 'Main' as const },
  { key: 'book', label: 'Book Vet', icon: CalendarPlus, color: '#7C3AED', bg: '#F5F3FF', nav: 'BookAppointment' as const },
  { key: 'medical', label: 'Medical', icon: FileText, color: '#D97706', bg: '#FFFBEB', nav: 'MedicalRecordList' as const },
  { key: 'services', label: 'Services', icon: Sparkles, color: '#DB2777', bg: '#FDF2F8', nav: 'Main' as const },
  { key: 'bookings', label: 'Bookings', icon: BookmarkCheck, color: '#0891B2', bg: '#ECFEFF', nav: 'MyBookings' as const },
];

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const navigation = useNavigation<NavProp>();
  const { user } = useAuth();

  const [pets, setPets] = useState<IPet[]>([]);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const contentPadding = isSmallDevice ? 14 : 16;
  const gap = 10;
  const tileWidth = Math.floor((screenWidth - contentPadding * 2 - gap * 2) / 3);

  const loadDashboard = async () => {
    try {
      const [petsData, apptsData, servicesData] = await Promise.all([
        petService.getMyPets().catch(() => []),
        appointmentService.getAppointments('confirmed').catch(() => []),
        serviceService.getServices().catch(() => []),
      ]);
      setPets(petsData);
      setAppointments(apptsData);
      setServices(servicesData.slice(0, 3));
    } catch (e) {
      console.error('Failed to load dashboard:', e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  const onRefresh = () => { setRefreshing(true); loadDashboard(); };
  const nextAppointment = appointments.length > 0 ? appointments[0] : null;
  const firstName = user?.name?.split(' ')[0] || 'Pet Parent';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 24, 40) }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Gradient Hero Header ── */}
      <View style={[styles.heroHeader, { paddingTop: Math.max(insets.top + 10, 20) }]}>
        <View style={styles.heroDecor1} />
        <View style={styles.heroDecor2} />

        <View style={styles.heroTopRow}>
          <View style={styles.heroGreeting}>
            <View style={styles.portalPill}>
              <View style={styles.portalDot} />
              <Text style={styles.portalLabel}>OWNER PORTAL</Text>
            </View>
            <Text style={styles.heroName} numberOfLines={1}>
              Hello, {firstName} 👋
            </Text>
            <Text style={styles.heroSub}>
              {pets.length > 0
                ? `${pets.length} companion${pets.length > 1 ? 's' : ''} in your care`
                : 'Add a pet to get started'}
            </Text>
          </View>

          <View style={styles.heroPetStats}>
            <TouchableOpacity style={styles.heroAvatar} onPress={() => navigation.navigate('Main' as any)}>
              <Image
                source={user?.profileImage ? { uri: user.profileImage } : { uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' }}
                style={styles.heroAvatarImg}
              />
              <View style={styles.heroAvatarStatus} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Care Plan Summary */}
        <View style={styles.careSummaryCard}>
          <View style={styles.careSummaryIcon}>
            <ShieldCheck size={18} color={colors.secondary} strokeWidth={2.5} />
          </View>
          <View style={styles.careSummaryText}>
            <Text style={styles.careSummaryTitle}>Your Care Plan</Text>
            <Text style={styles.careSummaryDesc}>
              {pets.length > 0
                ? `${pets.length} pet${pets.length > 1 ? 's' : ''} tracked • ${appointments.length} upcoming visit${appointments.length !== 1 ? 's' : ''}`
                : 'Begin by adding your first pet companion'}
            </Text>
          </View>
          <View style={styles.carePawBadge}>
            <PawPrint size={16} color={colors.primary} strokeWidth={2.2} />
          </View>
        </View>
      </View>

      {/* ── Content ── */}
      <View style={[styles.content, { paddingHorizontal: contentPadding }]}>

        {/* Appointment Alert Banner */}
        {nextAppointment && (
          <TouchableOpacity
            style={styles.apptBanner}
            onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: nextAppointment._id })}
            activeOpacity={0.85}
          >
            <View style={styles.apptBannerLeft}>
              <View style={styles.apptBannerIcon}>
                <Stethoscope size={16} color="#FFFFFF" strokeWidth={2.5} />
              </View>
              <View style={styles.apptBannerText}>
                <Text style={styles.apptBannerLabel}>Upcoming Vet Visit</Text>
                <Text style={styles.apptBannerPet}>
                  {typeof nextAppointment.petId === 'object' ? nextAppointment.petId.name : 'Your Pet'}
                </Text>
                <View style={styles.apptBannerMeta}>
                  <Calendar size={11} color={colors.textSecondary} />
                  <Text style={styles.apptBannerMetaText}>{formatDate(nextAppointment.date)}</Text>
                  <Clock size={11} color={colors.textSecondary} />
                  <Text style={styles.apptBannerMetaText}>{nextAppointment.time}</Text>
                </View>
              </View>
            </View>
            <View style={styles.apptBannerRight}>
              <Badge label="Confirmed" variant="success" dot />
              <ChevronRight size={16} color={colors.textSecondary} style={{ marginTop: 8 }} />
            </View>
          </TouchableOpacity>
        )}

        {/* Quick Actions Grid */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
        </View>
        <View style={styles.actionsGrid}>
          {ACTION_TILES.map(({ key, label, icon: Icon, color, bg, nav }) => (
            <TouchableOpacity
              key={key}
              style={[styles.actionTile, { width: tileWidth }]}
              onPress={() => navigation.navigate(nav as any, {} as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.actionIconBox, { backgroundColor: bg }]}>
                <Icon size={22} color={color} strokeWidth={2.2} />
              </View>
              <Text style={styles.actionLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* My Pets Section */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>My Companions ({pets.length})</Text>
          <TouchableOpacity style={styles.sectionAction} onPress={() => navigation.navigate('AddPet' as any)}>
            <Plus size={14} color={colors.primary} strokeWidth={2.5} />
            <Text style={styles.sectionActionText}>Add Pet</Text>
          </TouchableOpacity>
        </View>

        {pets.length === 0 ? (
          <View style={styles.emptyBlock}>
            <View style={styles.emptyIconBox}>
              <PawPrint size={28} color={colors.textMuted} strokeWidth={2} />
            </View>
            <Text style={styles.emptyTitle}>No Pets Registered</Text>
            <Text style={styles.emptyDesc}>Create a profile to start tracking their health records.</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petsScrollRow}>
            {pets.map((pet) => (
              <TouchableOpacity
                key={pet._id}
                style={styles.petCard}
                onPress={() => navigation.navigate('PetDetail', { petId: pet._id })}
                activeOpacity={0.85}
              >
                <PetAvatar
                  imageUrl={pet.imageUrl}
                  image={pet.image}
                  name={pet.name}
                  species={pet.species}
                  size={isSmallDevice ? 52 : 58}
                  borderRadius={14}
                />
                <Text style={styles.petCardName} numberOfLines={1}>{pet.name}</Text>
                <Text style={styles.petCardSpecies} numberOfLines={1}>{pet.species}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Popular Services */}
        {services.length > 0 && (
          <>
            <View style={[styles.sectionRow, { marginTop: 8 }]}>
              <Text style={styles.sectionTitle}>Popular Services</Text>
              <TouchableOpacity style={styles.sectionAction} onPress={() => navigation.navigate('Main' as any)}>
                <Text style={styles.sectionActionText}>See All</Text>
                <ChevronRight size={14} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {services.map((service) => (
              <TouchableOpacity
                key={service._id}
                style={styles.serviceCard}
                onPress={() => navigation.navigate('ServiceDetail', { serviceId: service._id })}
                activeOpacity={0.86}
              >
                <View style={styles.serviceCardLeft}>
                  <View style={styles.serviceIconBox}>
                    <Sparkles size={16} color={colors.secondary} strokeWidth={2} />
                  </View>
                  <View style={styles.serviceCardText}>
                    <Text style={styles.serviceCardName}>{service.name}</Text>
                    <Text style={styles.serviceCardMeta}>{service.category} · {service.duration} min</Text>
                  </View>
                </View>
                <View style={styles.serviceCardRight}>
                  <Text style={styles.serviceCardPrice}>${service.price}</Text>
                  <ChevronRight size={15} color={colors.textMuted} />
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // ── Hero ──
  heroHeader: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingBottom: 28,
    overflow: 'hidden',
  },
  heroDecor1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -60,
    right: -50,
  },
  heroDecor2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: 0,
    left: -30,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  heroGreeting: { flex: 1, paddingRight: 12 },
  portalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  portalDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.tealMid,
  },
  portalLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.5,
  },
  heroName: {
    fontSize: isSmallDevice ? 22 : 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 3,
  },
  heroSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.72)',
    fontWeight: '500',
  },
  heroPetStats: {},
  heroAvatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
  },
  heroAvatarImg: { width: '100%', height: '100%' },
  heroAvatarStatus: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.primary,
    right: 0,
    bottom: 0,
  },
  careSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    gap: 10,
  },
  careSummaryIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  careSummaryText: { flex: 1 },
  careSummaryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.1,
  },
  careSummaryDesc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.72)',
    marginTop: 2,
    fontWeight: '500',
  },
  carePawBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Content ──
  content: { paddingTop: 18 },

  // ── Appointment Banner ──
  apptBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 14,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  apptBannerLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1, gap: 12 },
  apptBannerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  apptBannerText: { flex: 1 },
  apptBannerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  apptBannerPet: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.navy,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  apptBannerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  apptBannerMetaText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginRight: 4,
  },
  apptBannerRight: { alignItems: 'flex-end' },

  // ── Section Headers ──
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.navy,
    letterSpacing: -0.3,
  },
  sectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  sectionActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },

  // ── Actions Grid ──
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  actionTile: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    fontSize: isSmallDevice ? 11 : 12,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },

  // ── Pets Section ──
  petsScrollRow: { marginBottom: 16 },
  petCard: {
    width: isSmallDevice ? 100 : 110,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 10,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    gap: 6,
  },
  petCardName: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  petCardSpecies: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },

  // ── Empty State ──
  emptyBlock: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 18,
    gap: 8,
  },
  emptyIconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.navy,
    letterSpacing: -0.2,
  },
  emptyDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 24,
    fontWeight: '500',
    lineHeight: 18,
  },

  // ── Services ──
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  serviceCardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  serviceIconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceCardText: { flex: 1 },
  serviceCardName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.1,
  },
  serviceCardMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  serviceCardRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  serviceCardPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.secondary,
    letterSpacing: -0.3,
  },
});

export default HomeScreen;
