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
} from 'react-native';
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

type NavProp = StackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { user } = useAuth();

  const [pets, setPets] = useState<IPet[]>([]);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [refreshing, setRefreshing] = useState(false);

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
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome Back,</Text>
          <Text style={styles.userName}>{user?.name || 'Pet Parent'} 👋</Text>
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
            <Text style={styles.bannerLabel}>Upcoming Veterinary Visit</Text>
            <Badge label="Confirmed" variant="success" />
          </View>
          <Text style={styles.bannerPet}>
            🐾 {typeof nextAppointment.petId === 'object' ? nextAppointment.petId.name : 'Your Pet'}
          </Text>
          <Text style={styles.bannerTime}>
            📅 {formatDate(nextAppointment.date)} at ⏰ {nextAppointment.time}
          </Text>
        </Card>
      ) : null}

      {/* Quick Action Hub for 6 Functions */}
      <Text style={styles.sectionTitle}>Quick Management</Text>
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={styles.actionTile}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.actionIcon}>🐾</Text>
          <Text style={styles.actionLabel}>My Pets</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionTile}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.actionIcon}>👨‍⚕️</Text>
          <Text style={styles.actionLabel}>Find Vets</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionTile}
          onPress={() => navigation.navigate('BookAppointment', {})}
        >
          <Text style={styles.actionIcon}>📅</Text>
          <Text style={styles.actionLabel}>Book Vet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionTile}
          onPress={() => navigation.navigate('MedicalRecordList', {})}
        >
          <Text style={styles.actionIcon}>📋</Text>
          <Text style={styles.actionLabel}>Medical</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionTile}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.actionIcon}>✂️</Text>
          <Text style={styles.actionLabel}>Services</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionTile}
          onPress={() => navigation.navigate('MyBookings')}
        >
          <Text style={styles.actionIcon}>⭐</Text>
          <Text style={styles.actionLabel}>Bookings</Text>
        </TouchableOpacity>
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
                size={56}
                borderRadius={12}
                style={styles.petMiniImage}
              />
              <Text style={styles.petMiniName}>{pet.name}</Text>
              <Text style={styles.petMiniSpecies}>{pet.species}</Text>
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
  content: { padding: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  welcome: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  userName: { fontSize: 24, fontWeight: '800', color: colors.text },
  profileAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.borderLight },
  appointmentBanner: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    padding: 16,
    marginBottom: 16,
  },
  bannerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bannerLabel: { fontSize: 12, fontWeight: '700', color: colors.primary, textTransform: 'uppercase' },
  bannerPet: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 8 },
  bannerTime: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 12 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 10 },
  linkText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  actionTile: {
    width: '31%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: { fontSize: 28, marginBottom: 6 },
  actionLabel: { fontSize: 12, fontWeight: '600', color: colors.text },
  petsScroll: { flexDirection: 'row', marginBottom: 12 },
  petMiniCard: { width: 110, padding: 10, alignItems: 'center', marginRight: 10 },
  petMiniImage: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.borderLight, marginBottom: 8 },
  petMiniName: { fontSize: 13, fontWeight: '700', color: colors.text },
  petMiniSpecies: { fontSize: 11, color: colors.textSecondary, marginTop: 2 },
  emptyCard: { padding: 20, alignItems: 'center' },
  emptyCardTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  emptyCardSub: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  serviceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  serviceRowLeft: { flex: 1 },
  serviceRowName: { fontSize: 15, fontWeight: '700', color: colors.text },
  serviceRowCategory: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  serviceRowPrice: { fontSize: 16, fontWeight: '800', color: colors.secondary },
});

export default HomeScreen;
