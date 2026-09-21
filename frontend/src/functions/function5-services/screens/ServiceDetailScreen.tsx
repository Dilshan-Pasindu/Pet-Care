/**
 * functions/function5-services/screens/ServiceDetailScreen.tsx
 * Owner: Function 5 — Pet Service Management
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
import { IService } from '../../../types/models';
import serviceService from '../services/serviceService';
import colors from '../../../constants/colors';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Loading from '../../../components/common/Loading';
import Badge from '../../../components/common/Badge';

type RouteProps = RouteProp<RootStackParamList, 'ServiceDetail'>;
type NavProp = StackNavigationProp<RootStackParamList>;

export const ServiceDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { serviceId } = route.params;

  const [service, setService] = useState<IService | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await serviceService.getServiceById(serviceId);
        setService(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load service details.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceId]);

  if (loading) return <Loading fullScreen message="Loading service details..." />;
  if (!service) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image
        source={
          service.image
            ? { uri: service.image }
            : { uri: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600' }
        }
        style={styles.heroImage}
      />

      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{service.name}</Text>
          <Badge label={service.category} variant="secondary" />
        </View>
        <Text style={styles.price}>${service.price.toFixed(2)}</Text>
      </View>

      <Card style={styles.infoCard}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Duration</Text>
          <Text style={styles.infoVal}>⏱ {service.duration} mins</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Availability</Text>
          <Text style={[styles.infoVal, { color: service.availability ? colors.success : colors.danger }]}>
            {service.availability ? '● Open' : '● Closed'}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Provider</Text>
          <Text style={styles.infoVal}>{service.provider || 'PetCare Team'}</Text>
        </View>
      </Card>

      {service.description ? (
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Description</Text>
          <Text style={styles.body}>{service.description}</Text>
        </Card>
      ) : null}

      <View style={styles.actionBlock}>
        <Button
          title="Book This Service"
          disabled={!service.availability}
          onPress={() => navigation.navigate('BookService', { serviceId: service._id })}
          style={styles.bookBtn}
        />
        <Button
          title="Write a Review"
          variant="outline"
          onPress={() => navigation.navigate('AddReview', { serviceId: service._id, title: service.name })}
          style={styles.reviewBtn}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 40 },
  heroImage: { width: '100%', height: 240, backgroundColor: colors.borderLight },
  header: {
    backgroundColor: colors.surface,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 22, fontWeight: '800', color: colors.text, flex: 1, marginRight: 8 },
  price: { fontSize: 24, fontWeight: '800', color: colors.secondary, marginTop: 10 },
  infoCard: {
    marginHorizontal: 16,
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  infoItem: { alignItems: 'center' },
  infoLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  infoVal: { fontSize: 14, fontWeight: '700', color: colors.text },
  divider: { width: 1, height: '70%', backgroundColor: colors.border },
  sectionCard: { marginHorizontal: 16, marginTop: 12, padding: 16 },
  sectionHeading: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 8 },
  body: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
  actionBlock: { marginHorizontal: 16, marginTop: 24, gap: 10 },
  bookBtn: { width: '100%' },
  reviewBtn: { width: '100%' },
});

export default ServiceDetailScreen;
