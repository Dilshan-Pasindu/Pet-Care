/**
 * functions/function1-pets/screens/PetDetailScreen.tsx
 * Owner: Function 1 — Pet Management
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
import { IPet } from '../../../types/models';
import petService from '../services/petService';
import colors from '../../../constants/colors';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import Badge from '../../../components/common/Badge';
import PetAvatar from '../../../components/common/PetAvatar';
import { formatDate, calculateAge } from '../../../utils/formatDate';

type RouteProps = RouteProp<RootStackParamList, 'PetDetail'>;
type NavProp = StackNavigationProp<RootStackParamList>;

export const PetDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { petId } = route.params;

  const [pet, setPet] = useState<IPet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const data = await petService.getPetById(petId);
        setPet(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load pet details.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [petId]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Pet Profile',
      `Are you sure you want to delete ${pet?.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              await petService.deletePet(petId);
              Alert.alert('Success', 'Pet profile deleted.');
              navigation.goBack();
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to delete pet');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (loading) return <Loading fullScreen message="Loading pet profile..." />;
  if (!pet) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroContainer}>
        <PetAvatar
          imageUrl={pet.imageUrl}
          image={pet.image}
          name={pet.name}
          species={pet.species}
          size={130}
          borderRadius={65}
          style={styles.heroAvatar}
        />
      </View>

      <View style={styles.headerCard}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{pet.name}</Text>
          <Badge label={pet.gender} variant={pet.gender === 'male' ? 'primary' : 'warning'} />
        </View>
        <Text style={styles.species}>{pet.species} {pet.breed ? `(${pet.breed})` : ''}</Text>
      </View>

      <Card style={styles.statsCard}>
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Age</Text>
          <Text style={styles.statVal}>{calculateAge(pet.dateOfBirth)}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Weight</Text>
          <Text style={styles.statVal}>{pet.weight ? `${pet.weight} kg` : 'N/A'}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>Birthday</Text>
          <Text style={styles.statVal}>{formatDate(pet.dateOfBirth)}</Text>
        </View>
      </Card>

      {pet.description ? (
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>About {pet.name}</Text>
          <Text style={styles.sectionBody}>{pet.description}</Text>
        </Card>
      ) : null}

      <View style={styles.shortcutsRow}>
        <Button
          title="Medical Records"
          variant="outline"
          size="small"
          onPress={() => navigation.navigate('MedicalRecordList', { petId: pet._id })}
          style={styles.shortcutBtn}
        />
        <Button
          title="Book Vet"
          variant="secondary"
          size="small"
          onPress={() => navigation.navigate('BookAppointment', { petId: pet._id })}
          style={styles.shortcutBtn}
        />
      </View>

      <View style={styles.actionRow}>
        <Button
          title="Edit Profile"
          variant="outline"
          onPress={() => navigation.navigate('EditPet', { petId: pet._id })}
          style={styles.editBtn}
        />
        <Button
          title="Delete"
          variant="danger"
          loading={deleting}
          onPress={handleDelete}
          style={styles.deleteBtn}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 40 },
  heroContainer: {
    width: '100%',
    height: 180,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  heroAvatar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  headerCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 26, fontWeight: '800', color: colors.text },
  species: { fontSize: 16, color: colors.textSecondary, marginTop: 4 },
  statsCard: {
    marginHorizontal: 16,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 18,
  },
  statCol: { alignItems: 'center' },
  statLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  statVal: { fontSize: 15, fontWeight: '700', color: colors.text },
  statDivider: { width: 1, height: '80%', backgroundColor: colors.border },
  sectionCard: { marginHorizontal: 16, marginTop: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 8 },
  sectionBody: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
  shortcutsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    gap: 12,
  },
  shortcutBtn: { flex: 1 },
  actionRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    gap: 12,
  },
  editBtn: { flex: 2 },
  deleteBtn: { flex: 1 },
});

export default PetDetailScreen;
