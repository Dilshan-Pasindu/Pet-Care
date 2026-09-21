/**
 * functions/function5-services/service.service.ts
 * Owner: Function 5 — Pet Service Management
 */

import Service from './service.model';
import { IService, ServiceCategory } from '../../types/models';

interface CreateServiceInput {
  name: string;
  description?: string;
  category: ServiceCategory;
  price: number;
  duration?: number;
  provider?: string;
  availability?: boolean;
}

interface ServiceQuery {
  search?: string;
  category?: string;
  available?: string;
}

export const createService = async (data: CreateServiceInput, imageUrl: string | null = null): Promise<IService> => {
  return Service.create({ ...data, image: imageUrl });
};

export const getAllServices = async (query: ServiceQuery = {}): Promise<IService[]> => {
  const filter: Record<string, unknown> = {};

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
    ];
  }
  if (query.category) filter.category = query.category;
  if (query.available !== undefined) filter.availability = query.available === 'true';

  return Service.find(filter).sort({ createdAt: -1 });
};

export const getServiceById = async (serviceId: string): Promise<IService> => {
  const service = await Service.findById(serviceId);
  if (!service) throw Object.assign(new Error('Service not found.'), { statusCode: 404 });
  return service;
};

export const updateService = async (
  serviceId: string,
  updateData: Partial<CreateServiceInput>,
  imageUrl: string | null = null
): Promise<IService> => {
  const service = await Service.findById(serviceId);
  if (!service) throw Object.assign(new Error('Service not found.'), { statusCode: 404 });

  const updates: Record<string, unknown> = { ...updateData };
  if (imageUrl) updates.image = imageUrl;

  const updated = await Service.findByIdAndUpdate(serviceId, updates, { new: true, runValidators: true });
  return updated as IService;
};

export const deleteService = async (serviceId: string): Promise<void> => {
  const service = await Service.findById(serviceId);
  if (!service) throw Object.assign(new Error('Service not found.'), { statusCode: 404 });
  await Service.findByIdAndDelete(serviceId);
};
