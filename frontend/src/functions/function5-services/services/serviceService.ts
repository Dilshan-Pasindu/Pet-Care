/**
 * functions/function5-services/services/serviceService.ts
 * Owner: Function 5 — Pet Service Management
 */

import api from '../../../services/api';
import { ApiResponse } from '../../../types/api';
import { IService, ServiceCategory } from '../../../types/models';

export interface ServiceQueryParams {
  search?: string;
  category?: ServiceCategory;
  available?: string;
}

export const serviceService = {
  async getServices(params?: ServiceQueryParams): Promise<IService[]> {
    const res = await api.get<ApiResponse<IService[]>>('/services', { params });
    return res.data.data || [];
  },

  async getServiceById(id: string): Promise<IService> {
    const res = await api.get<ApiResponse<IService>>(`/services/${id}`);
    return res.data.data!;
  },
};

export default serviceService;
