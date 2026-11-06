export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'administrateur' | 'agent' | 'locataire';
  agence_id?: number;
  locataire_id?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'administrateur' | 'agent' | 'locataire';
  must_change_password?: boolean;
  agence_id?: number;
  locataire_id?: number;
  agence?: {
    id: number;
    nom: string;
    adresse: string;
  };
  locataire?: Locataire;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Agence {
  id: number;
  nom: string;
  adresse: string;
  telephone?: string;
  email?: string;
}

export interface Batiment {
  id: number;
  agence_id: number;
  nom: string;
  adresse: string;
  nombre_appartements: number;
  proprietaire?: string;
  description?: string;
  photo?: string;
  agence?: Agence;
}

export interface Appartement {
  id: number;
  batiment_id: number;
  numero: string;
  superficie: number;
  loyer_mensuel: number;
  etat: 'libre' | 'occupé' | 'en_travaux';
  nombre_pieces?: number;
  description?: string;
  photo?: string;
  batiment?: Batiment;
}

export interface Locataire {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  piece_identite: string;
  numero_piece: string;
  adresse_actuelle?: string;
  date_naissance?: string;
}

export interface Location {
  id: number;
  appartement_id: number;
  locataire_id: number;
  date_debut: string;
  date_fin?: string;
  duree_mois: number;
  montant_loyer: number;
  caution?: number;
  conditions_contrat?: string;
  statut: 'active' | 'terminee' | 'resiliee';
  appartement?: Appartement;
  locataire?: Locataire;
}

export interface Paiement {
  id: number;
  location_id: number;
  date_paiement: string;
  mois_concerne: string;
  montant: number;
  mode_paiement: 'especes' | 'cheque' | 'virement' | 'mobile_money';
  reference_paiement?: string;
  remarques?: string;
  statut?: 'paye' | 'en_attente' | 'echoue';
  location?: Location;
}

// Interfaces are exported above; no additional re-export needed.
