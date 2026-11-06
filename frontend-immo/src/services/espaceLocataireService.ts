import api from './api';
import type { Locataire, Location, Paiement } from '../types/index';

export interface NotificationData {
  id: number;
  locataire_id: number;
  paiement_id: number | null;
  titre: string;
  message: string;
  type: string;
  lu: boolean;
  created_at: string;
}

export interface EspaceLocataireData {
  locataire: Locataire;
  location_active: Location | null;
  paiements: Paiement[];
  notifications: NotificationData[];
}

export const espaceLocataireService = {
  getMonEspace: async (): Promise<EspaceLocataireData> => {
    const response = await api.get('/mon-espace');
    return response.data;
  },

  markNotificationRead: async (id: number): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },
};
