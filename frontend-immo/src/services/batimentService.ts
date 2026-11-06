import api from './api';
import type { Batiment } from '../types/index';

type BatimentInput = Omit<Partial<Batiment>, 'photo'> & { photo?: File };

export const batimentService = {
  getAll: async (): Promise<Batiment[]> => {
    const response = await api.get('/batiments');
    return response.data;
  },

  getById: async (id: number): Promise<Batiment> => {
    const response = await api.get(`/batiments/${id}`);
    return response.data;
  },

  create: async (data: BatimentInput): Promise<Batiment> => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });
    const response = await api.post('/batiments', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: number, data: BatimentInput): Promise<Batiment> => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value instanceof File ? value : String(value));
      }
    });
    const response = await api.post(`/batiments/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/batiments/${id}`);
  },
};
