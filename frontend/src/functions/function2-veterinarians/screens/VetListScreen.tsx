/**
 * functions/function2-veterinarians/screens/VetListScreen.tsx
 * Owner: Function 2 — Veterinarian Management
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigation';
import { IVeterinarian } from '../../../types/models';
import vetService from '../services/vetService';
import colors from '../../../constants/colors';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import Badge from '../../../components/common/Badge';

type NavProp = StackNavigationProp<RootStackParamList>;

const SPECIALIZATIONS = ['All', 'General Practice', 'Surgery', 'Dermatology', 'Dentistry', 'Cardiology'];

export const VetListScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [vets, setVets] = useState<IVeterinarian[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [selectedSpec, setSelectedSpec] = useState<string>('All');

  const fetchVets = useCallback(async () => {
    try {
      const params: { search?: string; specialization?: string } = {};
      if (search.trim()) params.search = search.trim();
      if (selectedSpec !== 'All') params.specialization = selectedSpec;
      const data = await vetService.getVeterinarians(params);
      setVets(data);
    } catch (error) {
      console.error('Failed to load vets:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, selectedSpec]);

  useEffect(() => {
    fetchVets();
  }, [fetchVets]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVets();
  };

  const renderVetItem = ({ item }: { item: IVeterinarian }) => (
    <Card
      onPress={() => navigation.navigate('VetDetail', { vetId: item._id })}
      style={styles.vetCard}
    >
      <Image
        source={
          item.profileImage
            ? { uri: item.profileImage }
            : { uri: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300' }
        }
        style={styles.vetImage}
      />
      <View style={styles.vetInfo}>
        <View style={styles.titleRow}>
          <Text style={styles.vetName}>{item.name}</Text>
          <Badge label={`${item.experience} yrs exp`} variant="neutral" />
        </View>
        <Text style={styles.specialization}>{item.specialization}</Text>
        <Text style={styles.clinicName}>🏥 {item.clinicName}</Text>
        <Text style={styles.location}>📍 {item.location}</Text>

        <View style={styles.footerRow}>
          <Text style={styles.fee}>${item.consultationFee} <Text style={styles.feeLabel}>/ visit</Text></Text>
          <Button
            title="Book"
            size="small"
            onPress={() => navigation.navigate('BookAppointment', { vetId: item._id })}
            style={styles.bookBtn}
          />
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Veterinarians</Text>
        <Text style={styles.headerSubtitle}>Book certified vets for examinations & consultations</Text>
        <Input
          placeholder="Search by doctor or clinic name..."
          value={search}
          onChangeText={setSearch}
          containerStyle={styles.searchContainer}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {SPECIALIZATIONS.map((spec) => (
            <TouchableOpacity
              key={spec}
              style={[
                styles.chip,
                selectedSpec === spec && styles.chipActive,
              ]}
              onPress={() => setSelectedSpec(spec)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedSpec === spec && styles.chipTextActive,
                ]}
              >
                {spec}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading && !refreshing ? (
        <Loading fullScreen message="Finding specialists..." />
      ) : (
        <FlatList
          data={vets}
          keyExtractor={(item) => item._id}
          renderItem={renderVetItem}
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
              <Text style={styles.emptyTitle}>No Veterinarians Found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your search criteria or specialization.</Text>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.text },
  headerSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2, marginBottom: 12 },
  searchContainer: { marginBottom: 10 },
  chipsScroll: { paddingBottom: 12, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.borderLight,
  },
  chipActive: { backgroundColor: colors.primary },
  chipText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: '#FFFFFF', fontWeight: '600' },
  listContent: { padding: 16 },
  vetCard: { flexDirection: 'row', padding: 14 },
  vetImage: {
    width: 84,
    height: 84,
    borderRadius: 16,
    backgroundColor: colors.borderLight,
  },
  vetInfo: { flex: 1, marginLeft: 14 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  vetName: { fontSize: 16, fontWeight: '700', color: colors.text },
  specialization: { fontSize: 14, fontWeight: '600', color: colors.primary, marginTop: 2 },
  clinicName: { fontSize: 13, color: colors.text, marginTop: 4 },
  location: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  fee: { fontSize: 16, fontWeight: '700', color: colors.text },
  feeLabel: { fontSize: 12, fontWeight: '400', color: colors.textSecondary },
  bookBtn: { minWidth: 80 },
  emptyContainer: { alignItems: 'center', paddingVertical: 50 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 4 },
  emptySubtitle: { fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
});

export default VetListScreen;
