/**
 * functions/function2-veterinarians/screens/VetDetailScreen.tsx
 * Owner: Function 2 — Veterinarian Management
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigation';
import { IVeterinarian } from '../../../types/models';
import vetService from '../services/vetService';
import colors from '../../../constants/colors';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import Badge from '../../../components/common/Badge';

type RouteProps = RouteProp<RootStackParamList, 'VetDetail'>;
type NavProp = StackNavigationProp<RootStackParamList>;

export const VetDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { vetId } = route.params;

  const [vet, setVet] = useState<IVeterinarian | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVet = async () => {
      try {
        const data = await vetService.getVeterinarianById(vetId);
        setVet(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load veterinarian profile.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    fetchVet();
  }, [vetId]);

  if (loading) return <Loading fullScreen message="Loading doctor profile..." />;
  if (!vet) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.profileCard}>
        <Image
          source={
            vet.profileImage
              ? { uri: vet.profileImage }
              : { uri: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400' }
          }
          style={styles.avatar}
        />
        <Text style={styles.name}>{vet.name}</Text>
        <Text style={styles.spec}>{vet.specialization}</Text>
        <Text style={styles.qual}>{vet.qualification}</Text>

        <View style={styles.badgeRow}>
          <Badge label={`${vet.experience} Years Experience`} variant="primary" />
          <Badge label={`Fee: $${vet.consultationFee}`} variant="success" />
        </View>
      </Card>

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Clinic Details</Text>
        <Text style={styles.clinicName}>🏥 {vet.clinicName}</Text>
        <Text style={styles.infoRow}>📍 {vet.location}</Text>
        <Text style={styles.infoRow}>📞 {vet.phone}</Text>
      </Card>

      {vet.description ? (
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.desc}>{vet.description}</Text>
        </Card>
      ) : null}

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Available Schedule</Text>
        {vet.availability && vet.availability.length > 0 ? (
          vet.availability.map((slot, index) => (
            <View key={index} style={styles.slotRow}>
              <Text style={styles.slotDay}>{slot.day}</Text>
              <Text style={styles.slotTime}>
                {slot.startTime} - {slot.endTime}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noSlot}>Contact clinic for direct scheduling.</Text>
        )}
      </Card>

      <View style={styles.actionContainer}>
        <Button
          title="Book Appointment"
          onPress={() => navigation.navigate('BookAppointment', { vetId: vet._id })}
          style={styles.bookBtn}
        />
        <Button
          title="Leave Review"
          variant="outline"
          onPress={() => navigation.navigate('AddReview', { vetId: vet._id, title: vet.name })}
          style={styles.reviewBtn}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  profileCard: { alignItems: 'center', paddingVertical: 24 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 14, backgroundColor: colors.borderLight },
  name: { fontSize: 22, fontWeight: '800', color: colors.text },
  spec: { fontSize: 16, fontWeight: '600', color: colors.primary, marginTop: 4 },
  qual: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  badgeRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  sectionCard: { marginTop: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 8 },
  clinicName: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 4 },
  infoRow: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  desc: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  slotDay: { fontSize: 14, fontWeight: '600', color: colors.text },
  slotTime: { fontSize: 14, color: colors.textSecondary },
  noSlot: { fontSize: 13, color: colors.textSecondary, fontStyle: 'italic' },
  actionContainer: { marginTop: 20, gap: 10 },
  bookBtn: { width: '100%' },
  reviewBtn: { width: '100%' },
});

export default VetDetailScreen;
