import api from './api';
import type { Paiement } from '../types/index';

export const paiementService = {
  getAll: async (): Promise<Paiement[]> => {
    const response = await api.get('/paiements');
    return response.data;
  },

  getById: async (id: number): Promise<Paiement> => {
    const response = await api.get(`/paiements/${id}`);
    return response.data;
  },

  create: async (data: Partial<Paiement>): Promise<Paiement> => {
    const response = await api.post('/paiements', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Paiement>): Promise<Paiement> => {
    const response = await api.put(`/paiements/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/paiements/${id}`);
  },

  getQuittance: async (id: number): Promise<Blob> => {
    const response = await api.get(`/paiements/${id}/quittance`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getLocataireQuittance: async (id: number): Promise<Blob> => {
    const response = await api.get(`/mon-espace/quittance/${id}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
