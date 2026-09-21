/**
 * functions/function5-services/service.controller.ts
 * Owner: Function 5 — Pet Service Management
 */

import { Request, Response, NextFunction } from 'express';
import * as serviceService from './service.service';
import { sendSuccess } from '../../utils/response';

export const createService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const imageUrl = req.file?.path ?? null;
    const service = await serviceService.createService(req.body as Parameters<typeof serviceService.createService>[0], imageUrl);
    sendSuccess(res, 201, 'Service created successfully.', service);
  } catch (error) { next(error); }
};

export const getServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const services = await serviceService.getAllServices(req.query as { search?: string; category?: string; available?: string });
    sendSuccess(res, 200, 'Services retrieved successfully.', services, services.length);
  } catch (error) { next(error); }
};

export const getService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const service = await serviceService.getServiceById(req.params.id);
    sendSuccess(res, 200, 'Service retrieved successfully.', service);
  } catch (error) { next(error); }
};

export const updateService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const imageUrl = req.file?.path ?? null;
    const service = await serviceService.updateService(req.params.id, req.body as Partial<Parameters<typeof serviceService.createService>[0]>, imageUrl);
    sendSuccess(res, 200, 'Service updated successfully.', service);
  } catch (error) { next(error); }
};

export const deleteService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await serviceService.deleteService(req.params.id);
    sendSuccess(res, 200, 'Service deleted successfully.');
  } catch (error) { next(error); }
};
