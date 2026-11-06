import api from './api';
import type { Locataire } from '../types/index';

export const locataireService = {
  getAll: async (): Promise<Locataire[]> => {
    const response = await api.get('/locataires');
    return response.data;
  },

  getById: async (id: number): Promise<Locataire> => {
    const response = await api.get(`/locataires/${id}`);
    return response.data;
  },

  create: async (data: Partial<Locataire>): Promise<Locataire & { default_password?: string }> => {
    const response = await api.post('/locataires', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Locataire>): Promise<Locataire> => {
    const response = await api.put(`/locataires/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/locataires/${id}`);
  },
};
