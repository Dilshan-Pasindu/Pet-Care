/**
 * screens/home/HomeScreen.tsx
 * PetCare Unified Dashboard
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
} from 'lucide-react-native';

type NavProp = StackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const navigation = useNavigation<NavProp>();
  const { user } = useAuth();

  const [pets, setPets] = useState<IPet[]>([]);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Dynamic 3-column tile calculation: screen width - horizontal padding (32) - 2 gaps (20)
  const contentPadding = isSmallDevice ? 14 : 16;
  const gap = 10;
  const tileWidth = Math.floor((screenWidth - (contentPadding * 2) - (gap * 2)) / 3);

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

  useEffect(() => {
    loadDashboard();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  const nextAppointment = appointments.length > 0 ? appointments[0] : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingHorizontal: contentPadding,
          paddingTop: Math.max(insets.top + 8, 16),
          paddingBottom: Math.max(insets.bottom + 20, 32),
        },
      ]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
      }
    >
      {/* Header with Pet Accent */}
      <View style={styles.header}>
        <View style={styles.headerGreeting}>
          <View style={styles.badgeRow}>
            <Text style={styles.welcome}>Welcome Back</Text>
            <View style={styles.pawBadge}>
              <PawPrint size={13} color={colors.primary} />
            </View>
          </View>
          <Text style={styles.userName} numberOfLines={1}>
            {user?.name || 'Pet Parent'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <Image
            source={
              user?.profileImage
                ? { uri: user.profileImage }
                : { uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' }
            }
            style={styles.profileAvatar}
          />
        </TouchableOpacity>
      </View>

      {/* Next Appointment Alert Banner */}
      {nextAppointment ? (
        <Card
          onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: nextAppointment._id })}
          style={styles.appointmentBanner}
        >
          <View style={styles.bannerHeader}>
            <View style={styles.bannerTitleGroup}>
              <Stethoscope size={15} color={colors.primary} />
              <Text style={styles.bannerLabel}>Upcoming Veterinary Visit</Text>
            </View>
            <Badge label="Confirmed" variant="success" />
          </View>
          <Text style={styles.bannerPet}>
            {typeof nextAppointment.petId === 'object' ? nextAppointment.petId.name : 'Your Pet'}
          </Text>
          <View style={styles.bannerDetailsRow}>
            <View style={styles.bannerDetailItem}>
              <Calendar size={13} color={colors.textSecondary} />
              <Text style={styles.bannerTimeText}>{formatDate(nextAppointment.date)}</Text>
            </View>
            <View style={styles.bannerDetailItem}>
              <Clock size={13} color={colors.textSecondary} />
              <Text style={styles.bannerTimeText}>{nextAppointment.time}</Text>
            </View>
          </View>
        </Card>
      ) : null}

      {/* Quick Action Hub for 6 Functions + Admin Console */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Quick Management</Text>
        {user?.role === 'admin' && (
          <Badge label="Admin Mode" variant="danger" />
        )}
      </View>

      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={[styles.actionTile, { width: tileWidth }]}
          onPress={() => navigation.navigate('Main')}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#ECFDF5' }]}>
            <PawPrint size={22} color="#059669" />
          </View>
          <Text style={styles.actionLabel}>My Pets</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionTile, { width: tileWidth }]}
          onPress={() => navigation.navigate('Main')}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#EFF6FF' }]}>
            <Stethoscope size={22} color="#2563EB" />
          </View>
          <Text style={styles.actionLabel}>Find Vets</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionTile, { width: tileWidth }]}
          onPress={() => navigation.navigate('BookAppointment', {})}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#F5F3FF' }]}>
            <CalendarPlus size={22} color="#7C3AED" />
          </View>
          <Text style={styles.actionLabel}>Book Vet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionTile, { width: tileWidth }]}
          onPress={() => navigation.navigate('MedicalRecordList', {})}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#FFFBEB' }]}>
            <FileText size={22} color="#D97706" />
          </View>
          <Text style={styles.actionLabel}>Medical</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionTile, { width: tileWidth }]}
          onPress={() => navigation.navigate('Main')}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#FDF2F8' }]}>
            <Sparkles size={22} color="#DB2777" />
          </View>
          <Text style={styles.actionLabel}>Services</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionTile, { width: tileWidth }]}
          onPress={() => navigation.navigate('MyBookings')}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#ECFEFF' }]}>
            <BookmarkCheck size={22} color="#0891B2" />
          </View>
          <Text style={styles.actionLabel}>Bookings</Text>
        </TouchableOpacity>

        {user?.role === 'admin' && (
          <TouchableOpacity
            style={[styles.actionTile, { width: tileWidth }]}
            onPress={() => navigation.navigate('AdminManagement')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#FEF2F2' }]}>
              <ShieldCheck size={22} color="#DC2626" />
            </View>
            <Text style={styles.actionLabel}>Admin Portal</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* My Pets Horizontal Preview */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>My Companions ({pets.length})</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddPet')}>
          <Text style={styles.linkText}>+ Add Pet</Text>
        </TouchableOpacity>
      </View>

      {pets.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyCardTitle}>No Pets Registered</Text>
          <Text style={styles.emptyCardSub}>Create a profile to start tracking health records.</Text>
        </Card>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petsScroll}>
          {pets.map((pet) => (
            <Card
              key={pet._id}
              style={styles.petMiniCard}
              onPress={() => navigation.navigate('PetDetail', { petId: pet._id })}
            >
              <PetAvatar
                imageUrl={pet.imageUrl}
                image={pet.image}
                name={pet.name}
                species={pet.species}
                size={isSmallDevice ? 50 : 56}
                borderRadius={12}
                style={styles.petMiniImage}
              />
              <Text style={styles.petMiniName} numberOfLines={1}>{pet.name}</Text>
              <Text style={styles.petMiniSpecies} numberOfLines={1}>{pet.species}</Text>
            </Card>
          ))}
        </ScrollView>
      )}

      {/* Featured Services Preview */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Popular Services</Text>
      </View>

      {services.map((service) => (
        <Card
          key={service._id}
          style={styles.serviceRow}
          onPress={() => navigation.navigate('ServiceDetail', { serviceId: service._id })}
        >
          <View style={styles.serviceRowLeft}>
            <Text style={styles.serviceRowName}>{service.name}</Text>
            <Text style={styles.serviceRowCategory}>{service.category} • {service.duration} mins</Text>
          </View>
          <Text style={styles.serviceRowPrice}>${service.price}</Text>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {},
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerGreeting: { flex: 1, marginRight: 12 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  welcome: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  pawBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  userName: { fontSize: isSmallDevice ? 20 : 24, fontWeight: '800', color: colors.text, marginTop: 2 },
  profileAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.borderLight },
  appointmentBanner: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    padding: 16,
    marginBottom: 16,
  },
  bannerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bannerTitleGroup: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bannerLabel: { fontSize: 11, fontWeight: '700', color: colors.primary, textTransform: 'uppercase' },
  bannerPet: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 8 },
  bannerDetailsRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 4 },
  bannerDetailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bannerTimeText: { fontSize: 13, color: colors.textSecondary },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 12 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 10 },
  linkText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  actionTile: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: isSmallDevice ? 12 : 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionLabel: { fontSize: isSmallDevice ? 11 : 12, fontWeight: '600', color: colors.text, textAlign: 'center' },
  petsScroll: { flexDirection: 'row', marginBottom: 12 },
  petMiniCard: { width: isSmallDevice ? 100 : 110, padding: 10, alignItems: 'center', marginRight: 10 },
  petMiniImage: { backgroundColor: colors.borderLight, marginBottom: 8 },
  petMiniName: { fontSize: 13, fontWeight: '700', color: colors.text, textAlign: 'center' },
  petMiniSpecies: { fontSize: 11, color: colors.textSecondary, marginTop: 2, textAlign: 'center' },
  emptyCard: { padding: 20, alignItems: 'center' },
  emptyCardTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  emptyCardSub: { fontSize: 12, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
  serviceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  serviceRowLeft: { flex: 1, paddingRight: 8 },
  serviceRowName: { fontSize: 15, fontWeight: '700', color: colors.text },
  serviceRowCategory: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  serviceRowPrice: { fontSize: 16, fontWeight: '800', color: colors.secondary },
});

export default HomeScreen;
