import api from './api';
import type { Appartement } from '../types/index';

export const appartementService = {
  getAll: async (): Promise<Appartement[]> => {
    const response = await api.get('/appartements');
    return response.data;
  },

  getById: async (id: number): Promise<Appartement> => {
    const response = await api.get(`/appartements/${id}`);
    return response.data;
  },

  create: async (data: Partial<Appartement> & { photo?: File }): Promise<Appartement> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });
    const response = await api.post('/appartements', formData);
    return response.data;
  },

  update: async (id: number, data: Partial<Appartement> & { photo?: File }): Promise<Appartement> => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });
    const response = await api.post(`/appartements/${id}`, formData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/appartements/${id}`);
  },
};
