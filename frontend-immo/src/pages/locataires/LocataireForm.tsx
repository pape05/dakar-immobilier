import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, FloppyDisk } from '@phosphor-icons/react';
import type { Locataire } from '../../types';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

interface LocataireFormProps {
  initialData?: Locataire;
  onSubmit: (data: Partial<Locataire>) => Promise<void>;
  isEdit?: boolean;
  navigateOnSuccess?: boolean;
}

const LocataireForm = ({ initialData, onSubmit, isEdit = false, navigateOnSuccess = true }: LocataireFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nom: initialData?.nom || '',
    prenom: initialData?.prenom || '',
    telephone: initialData?.telephone || '',
    email: initialData?.email || '',
    piece_identite: initialData?.piece_identite || '',
    numero_piece: initialData?.numero_piece || '',
    adresse_actuelle: initialData?.adresse_actuelle || '',
    date_naissance: initialData?.date_naissance || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await onSubmit(formData as Partial<Locataire>);
      toast.success(isEdit ? 'Locataire modifié avec succès' : 'Locataire créé avec succès');
      if (navigateOnSuccess) {
        navigate('/locataires');
      }
    } catch (err: any) {
      if (err?._handled) return;
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <Button variant="secondary" onClick={() => navigate('/locataires')} className="mb-6">
          <ArrowLeft size={18} weight="bold" />
          Retour à la liste
        </Button>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          {isEdit ? 'Modifier le locataire' : 'Nouveau locataire'}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          {isEdit ? 'Modifiez les informations ci-dessous' : 'Renseignez les informations du locataire'}
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_18px_35px_-28px_rgba(24,24,27,0.42)]">
        <div className="grid gap-6 md:grid-cols-2">
          <Input label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Ex: Moussa" required />
          <Input label="Nom" name="nom" value={formData.nom} onChange={handleChange} placeholder="Ex: Diallo" required />
          <Input label="Téléphone" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Ex: +221 77 123 45 67" required />
          <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Ex: moussa@email.com" />

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">Type de pièce d'identité</label>
            <select
              name="piece_identite"
              value={formData.piece_identite}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">Sélectionner</option>
              <option value="CNI">Carte nationale d'identité</option>
              <option value="Passeport">Passeport</option>
              <option value="Permis de conduire">Permis de conduire</option>
              <option value="Carte de sejour">Carte de séjour</option>
            </select>
          </div>

          <Input label="Numéro de la pièce" name="numero_piece" value={formData.numero_piece} onChange={handleChange} placeholder="Ex: SN-123456789" required />
          <Input label="Date de naissance" name="date_naissance" type="date" value={formData.date_naissance} onChange={handleChange} />

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-700">Adresse actuelle</label>
            <textarea
              name="adresse_actuelle"
              value={formData.adresse_actuelle}
              onChange={handleChange}
              placeholder="Adresse de résidence actuelle..."
              rows={3}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button type="submit" variant="primary" isLoading={isLoading}>
            <FloppyDisk size={18} weight="bold" />
            {isEdit ? 'Enregistrer' : 'Créer le locataire'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/locataires')}>
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LocataireForm;
