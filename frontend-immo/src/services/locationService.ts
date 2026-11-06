import api from './api';
import type { Location } from '../types/index';

export const locationService = {
  getAll: async (): Promise<Location[]> => {
    const response = await api.get('/locations');
    return response.data;
  },

  getById: async (id: number): Promise<Location> => {
    const response = await api.get(`/locations/${id}`);
    return response.data;
  },

  create: async (data: Partial<Location>): Promise<Location> => {
    const response = await api.post('/locations', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Location>): Promise<Location> => {
    const response = await api.put(`/locations/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/locations/${id}`);
  },
};
