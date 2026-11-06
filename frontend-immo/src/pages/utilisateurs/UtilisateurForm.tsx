import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, FloppyDisk, Plus, X } from '@phosphor-icons/react';
import api from '../../services/api';
import type { User, Agence } from '../../types';

interface UtilisateurFormProps {
  initialData?: User;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isEdit?: boolean;
}

const UtilisateurForm = ({ initialData, onSubmit, isEdit = false }: UtilisateurFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agences, setAgences] = useState<Agence[]>([]);
  const [showAgenceModal, setShowAgenceModal] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    password: '',
    role: initialData?.role || 'agent',
    agence_id: initialData?.agence_id?.toString() || '',
  });

  const fetchAgences = async () => {
    try {
      const { data } = await api.get('/agences');
      setAgences(data);
    } catch (err) {
      console.error('Erreur lors du chargement des agences', err);
    }
  };

  useEffect(() => {
    fetchAgences();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgenceCreated = (newAgence: Agence) => {
    setAgences((prev) => [...prev, newAgence]);
    setFormData((prev) => ({ ...prev, agence_id: newAgence.id.toString() }));
    setShowAgenceModal(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const payload: Record<string, unknown> = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (formData.role === 'agent' && formData.agence_id) {
        payload.agence_id = Number(formData.agence_id);
      }

      await onSubmit(payload);
      toast.success(isEdit ? 'Utilisateur modifié avec succès' : 'Utilisateur créé avec succès');
      navigate('/utilisateurs');
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        (err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(', ')
          : 'Une erreur est survenue');
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <button
          type="button"
          onClick={() => navigate('/utilisateurs')}
          className="mb-6 inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-800 transition duration-300 hover:bg-zinc-200 active:scale-[0.98]"
        >
          <ArrowLeft size={18} weight="bold" />
          Retour à la liste
        </button>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          {isEdit ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          {isEdit ? 'Modifiez les informations du compte' : 'Renseignez les informations du nouveau compte'}
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-[#dfd1c2] bg-white p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Nom complet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Moussa Diallo"
              required
              className="w-full rounded-xl border border-[#dfd1c2] bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition duration-300 placeholder:text-zinc-400 focus:border-[#c79457] focus:ring-4 focus:ring-[#c79457]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ex: moussa@email.com"
              required
              className="w-full rounded-xl border border-[#dfd1c2] bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition duration-300 placeholder:text-zinc-400 focus:border-[#c79457] focus:ring-4 focus:ring-[#c79457]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Mot de passe {!isEdit && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={isEdit ? 'Laisser vide pour ne pas changer' : 'Minimum 8 caractères'}
              required={!isEdit}
              className="w-full rounded-xl border border-[#dfd1c2] bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition duration-300 placeholder:text-zinc-400 focus:border-[#c79457] focus:ring-4 focus:ring-[#c79457]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Rôle <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-[#dfd1c2] bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition duration-300 focus:border-[#c79457] focus:ring-4 focus:ring-[#c79457]/20"
            >
              <option value="administrateur">Administrateur</option>
              <option value="agent">Agent</option>
            </select>
          </div>

          {formData.role === 'agent' && (
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Agence
              </label>
              <div className="flex gap-2">
                <select
                  name="agence_id"
                  value={formData.agence_id}
                  onChange={handleChange}
                  className="flex-1 rounded-xl border border-[#dfd1c2] bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition duration-300 focus:border-[#c79457] focus:ring-4 focus:ring-[#c79457]/20"
                >
                  <option value="">Sélectionner une agence</option>
                  {agences.map((agence) => (
                    <option key={agence.id} value={agence.id}>
                      {agence.nom}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAgenceModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#c79457]/10 px-3 py-3 text-sm font-semibold text-[#c79457] transition hover:bg-[#c79457]/20 active:scale-[0.96]"
                  title="Créer une nouvelle agence"
                >
                  <Plus size={16} weight="bold" />
                  Nouvelle
                </button>
              </div>
              <p className="mt-1.5 text-xs text-zinc-400">
                Agence introuvable ? Cliquez sur "Nouvelle" pour la créer rapidement.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#c79457] px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:bg-[#9a6638] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Enregistrement...
              </div>
            ) : (
              <>
                <FloppyDisk size={18} weight="bold" />
                {isEdit ? 'Enregistrer' : 'Créer l\'utilisateur'}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/utilisateurs')}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-800 transition duration-300 hover:bg-zinc-200 active:scale-[0.98]"
          >
            Annuler
          </button>
        </div>
      </form>

      {/* Modal creation agence */}
      {showAgenceModal && (
        <AgenceModal
          onClose={() => setShowAgenceModal(false)}
          onCreated={handleAgenceCreated}
        />
      )}
    </div>
  );
};

/* Mini modal pour créer une agence rapidement */
interface AgenceModalProps {
  onClose: () => void;
  onCreated: (agence: Agence) => void;
}

const AgenceModal = ({ onClose, onCreated }: AgenceModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    nom: '',
    adresse: '',
    telephone: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { data } = await api.post('/agences', form);
      onCreated(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la creation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#dfd1c2] bg-white p-6 shadow-[0_20px_40px_-15px_rgba(59,36,24,0.15)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Nouvelle agence</h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 active:scale-[0.95]"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {error && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Nom de l'agence <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              placeholder="Ex: Agence Dakar Plateau"
              required
              className="w-full rounded-xl border border-[#dfd1c2] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#c79457] focus:ring-2 focus:ring-[#c79457]/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
              Adresse <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="adresse"
              value={form.adresse}
              onChange={handleChange}
              placeholder="Ex: Rue Carnot, Dakar"
              required
              className="w-full rounded-xl border border-[#dfd1c2] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#c79457] focus:ring-2 focus:ring-[#c79457]/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">Téléphone</label>
              <input
                type="text"
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                placeholder="+221 33 ..."
                className="w-full rounded-xl border border-[#dfd1c2] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#c79457] focus:ring-2 focus:ring-[#c79457]/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="contact@agence.sn"
                className="w-full rounded-xl border border-[#dfd1c2] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#c79457] focus:ring-2 focus:ring-[#c79457]/20"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-200 active:scale-[0.98]"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-xl bg-[#c79457] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9a6638] active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? 'Création...' : 'Créer l\'agence'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UtilisateurForm;
