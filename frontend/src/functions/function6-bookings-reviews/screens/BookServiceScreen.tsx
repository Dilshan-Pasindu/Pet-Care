/**
 * functions/function6-bookings-reviews/screens/BookServiceScreen.tsx
 * Owner: Function 6 — Service Bookings & Reviews
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigation';
import { IPet, IService } from '../../../types/models';
import petService from '../../function1-pets/services/petService';
import serviceService from '../../function5-services/services/serviceService';
import bookingService from '../services/bookingService';
import colors from '../../../constants/colors';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import Card from '../../../components/common/Card';
import PetAvatar from '../../../components/common/PetAvatar';

type RouteProps = RouteProp<RootStackParamList, 'BookService'>;
type NavProp = StackNavigationProp<RootStackParamList>;

const TIME_SLOTS = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'];

export const BookServiceScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { serviceId } = route.params;

  const [service, setService] = useState<IService | null>(null);
  const [pets, setPets] = useState<IPet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [time, setTime] = useState<string>('11:00 AM');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [serv, petList] = await Promise.all([
          serviceService.getServiceById(serviceId),
          petService.getMyPets(),
        ]);
        setService(serv);
        setPets(petList);
        if (petList.length > 0) setSelectedPetId(petList[0]._id);
      } catch (error) {
        Alert.alert('Error', 'Failed to load booking requirements');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceId]);

  const handleBooking = async () => {
    if (!selectedPetId) {
      Alert.alert('Missing Pet', 'Please choose a pet for this service.');
      return;
    }

    try {
      setSubmitting(true);
      await bookingService.createBooking({
        petId: selectedPetId,
        serviceId,
        date,
        time,
        notes: notes.trim() || undefined,
      });

      Alert.alert('Success', 'Service booking confirmed!', [
        { text: 'View Bookings', onPress: () => navigation.navigate('MyBookings') },
      ]);
    } catch (err: any) {
      Alert.alert('Booking Failed', err.message || 'Could not complete booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading fullScreen message="Setting up your service..." />;
  if (!service) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.serviceSummary}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.servicePrice}>${service.price.toFixed(2)} • {service.duration} mins</Text>
      </Card>

      <Text style={styles.heading}>Select Pet</Text>
      {pets.length === 0 ? (
        <View style={styles.noPetBox}>
          <Text style={styles.noPetText}>You need to register a pet first.</Text>
          <Button title="+ Add Pet" size="small" onPress={() => navigation.navigate('AddPet')} />
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
          {pets.map((p) => (
            <TouchableOpacity
              key={p._id}
              style={[styles.petChip, selectedPetId === p._id && styles.petChipActive]}
              onPress={() => setSelectedPetId(p._id)}
            >
              <PetAvatar
                imageUrl={p.imageUrl}
                image={p.image}
                name={p.name}
                species={p.species}
                size={38}
                borderRadius={19}
                style={{ marginBottom: 6 }}
              />
              <Text style={[styles.petName, selectedPetId === p._id && styles.petNameActive]}>
                {p.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <Text style={styles.heading}>Date & Time</Text>
      <Input label="Booking Date (YYYY-MM-DD)" value={date} onChangeText={setDate} />

      <Text style={styles.sublabel}>Select Preferred Time</Text>
      <View style={styles.timesContainer}>
        {TIME_SLOTS.map((slot) => (
          <TouchableOpacity
            key={slot}
            style={[styles.timeChip, time === slot && styles.timeChipActive]}
            onPress={() => setTime(slot)}
          >
            <Text style={[styles.timeText, time === slot && styles.timeTextActive]}>{slot}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.heading}>Special Requests / Notes</Text>
      <Input
        placeholder="Grooming style, sensitive skin, or handling notes"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={3}
      />

      <Button
        title="Confirm Service Booking"
        onPress={handleBooking}
        loading={submitting}
        style={styles.confirmBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  serviceSummary: { padding: 16, marginBottom: 16 },
  serviceName: { fontSize: 18, fontWeight: '700', color: colors.text },
  servicePrice: { fontSize: 15, fontWeight: '700', color: colors.secondary, marginTop: 4 },
  heading: { fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 12, marginBottom: 8 },
  sublabel: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 8 },
  scrollRow: { flexDirection: 'row', marginBottom: 16 },
  petChip: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: 10,
    minWidth: 90,
  },
  petChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  petIcon: { fontSize: 20, marginBottom: 4 },
  petName: { fontSize: 13, fontWeight: '700', color: colors.text },
  petNameActive: { color: colors.primary },
  noPetBox: { padding: 16, backgroundColor: colors.surface, borderRadius: 12, alignItems: 'center' },
  noPetText: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  timesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  timeChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  timeText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  timeTextActive: { color: '#FFFFFF' },
  confirmBtn: { marginTop: 16 },
});

export default BookServiceScreen;
