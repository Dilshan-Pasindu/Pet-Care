/**
 * functions/function1-pets/screens/PetListScreen.tsx
 * Owner: Function 1 — Pet Management
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
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
import { calculateAge } from '../../../utils/formatDate';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const PetListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [pets, setPets] = useState<IPet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchPets = async () => {
    try {
      const data = await petService.getMyPets();
      setPets(data);
    } catch (error) {
      console.error('Failed to fetch pets:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPets();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchPets();
  };

  if (loading && !refreshing) {
    return <Loading fullScreen message="Loading your pets..." />;
  }

  const renderPetItem = ({ item }: { item: IPet }) => (
    <Card
      onPress={() => navigation.navigate('PetDetail', { petId: item._id })}
      style={styles.petCard}
    >
      <PetAvatar
        imageUrl={item.imageUrl}
        image={item.image}
        name={item.name}
        species={item.species}
        size={76}
        borderRadius={16}
        style={styles.petAvatar}
      />
      <View style={styles.petInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.petName}>{item.name}</Text>
          <Badge
            label={item.gender}
            variant={item.gender === 'male' ? 'primary' : 'warning'}
          />
        </View>
        <Text style={styles.petBreed}>
          {item.species} {item.breed ? `• ${item.breed}` : ''}
        </Text>
        <Text style={styles.petAge}>{calculateAge(item.dateOfBirth)}</Text>
        {item.weight ? (
          <Text style={styles.petWeight}>{item.weight} kg</Text>
        ) : null}
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Pets</Text>
          <Text style={styles.subtitle}>Manage healthcare profiles for your companions</Text>
        </View>
        <Button
          title="+ Add"
          size="small"
          onPress={() => navigation.navigate('AddPet')}
        />
      </View>

      <FlatList
        data={pets}
        keyExtractor={(item) => item._id}
        renderItem={renderPetItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Pets Added Yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the button below to create your pet's health profile.
            </Text>
            <Button
              title="Add Your First Pet"
              onPress={() => navigation.navigate('AddPet')}
              style={styles.emptyButton}
            />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  petAvatar: {
    width: 76,
    height: 76,
    borderRadius: 16,
    backgroundColor: colors.borderLight,
  },
  petInfo: {
    flex: 1,
    marginLeft: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  petName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  petBreed: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  petAge: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  petWeight: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    minWidth: 180,
  },
});

export default PetListScreen;
