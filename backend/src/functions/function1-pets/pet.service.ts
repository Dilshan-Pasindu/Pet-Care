/**
 * functions/function1-pets/pet.service.ts
 * ─────────────────────────────────────────────────────────────
 * File: backend/src/functions/function1-pets/pet.service.ts
 * Owner: Function 1 — Pet Management
 * ─────────────────────────────────────────────────────────────
 */

import Pet from './pet.model';
import { IPet, UserRole } from '../../types/models';

interface CreatePetInput {
  name: string;
  species: string;
  breed?: string;
  gender?: 'male' | 'female' | 'unknown';
  dateOfBirth?: string;
  weight?: number;
  description?: string;
}

interface UpdatePetInput extends Partial<CreatePetInput> {
  image?: string;
}

export const createPet = async (
  petData: CreatePetInput,
  ownerId: string,
  imageUrl: string | null = null
): Promise<IPet> => {
  const pet = await Pet.create({ ...petData, ownerId, image: imageUrl });
  return pet;
};

export const getPetsByOwner = async (ownerId: string): Promise<IPet[]> => {
  return Pet.find({ ownerId }).sort({ createdAt: -1 });
};

export const getPetById = async (
  petId: string,
  userId: string,
  userRole: UserRole
): Promise<IPet> => {
  const pet = await Pet.findById(petId).populate('ownerId', 'name email phone');

  if (!pet) {
    throw Object.assign(new Error('Pet not found.'), { statusCode: 404 });
  }

  if (userRole === 'owner' && pet.ownerId.toString() !== userId) {
    throw Object.assign(new Error('You do not have permission to view this pet.'), { statusCode: 403 });
  }

  return pet;
};

export const updatePet = async (
  petId: string,
  updateData: UpdatePetInput,
  ownerId: string,
  imageUrl: string | null = null
): Promise<IPet> => {
  const pet = await Pet.findById(petId);

  if (!pet) {
    throw Object.assign(new Error('Pet not found.'), { statusCode: 404 });
  }

  if (pet.ownerId.toString() !== ownerId) {
    throw Object.assign(new Error('You do not have permission to update this pet.'), { statusCode: 403 });
  }

  const updates: Record<string, unknown> = { ...updateData };
  if (imageUrl) updates.image = imageUrl;

  const updated = await Pet.findByIdAndUpdate(petId, updates, { new: true, runValidators: true });
  return updated as IPet;
};

export const deletePet = async (petId: string, ownerId: string): Promise<void> => {
  const pet = await Pet.findById(petId);

  if (!pet) {
    throw Object.assign(new Error('Pet not found.'), { statusCode: 404 });
  }

  if (pet.ownerId.toString() !== ownerId) {
    throw Object.assign(new Error('You do not have permission to delete this pet.'), { statusCode: 403 });
  }

  await Pet.findByIdAndDelete(petId);
};
