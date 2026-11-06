import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, FloppyDisk } from '@phosphor-icons/react';
import type { Location, Appartement, Locataire } from '../../types';
import { appartementService } from '../../services/appartementService';
import { locataireService } from '../../services/locataireService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

interface LocationFormProps {
  initialData?: Location;
  onSubmit: (data: Partial<Location>) => Promise<void>;
  isEdit?: boolean;
}

const LocationForm = ({ initialData, onSubmit, isEdit = false }: LocationFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [appartements, setAppartements] = useState<Appartement[]>([]);
  const [locataires, setLocataires] = useState<Locataire[]>([]);

  const [formData, setFormData] = useState({
    appartement_id: initialData?.appartement_id || '',
    locataire_id: initialData?.locataire_id || '',
    date_debut: initialData?.date_debut || '',
    date_fin: initialData?.date_fin || '',
    duree_mois: initialData?.duree_mois || '',
    montant_loyer: initialData?.montant_loyer || '',
    caution: initialData?.caution || '',
    conditions_contrat: initialData?.conditions_contrat || '',
    statut: initialData?.statut || 'active',
  });

  useEffect(() => {
    appartementService.getAll().then(setAppartements).catch(console.error);
    locataireService.getAll().then(setLocataires).catch(console.error);
  }, []);

  const appartementsLibres = isEdit
    ? appartements
    : appartements.filter((a) => a.etat === 'libre');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await onSubmit({
        ...formData,
        appartement_id: Number(formData.appartement_id),
        locataire_id: Number(formData.locataire_id),
        duree_mois: Number(formData.duree_mois),
        montant_loyer: Number(formData.montant_loyer),
        caution: formData.caution ? Number(formData.caution) : undefined,
        date_fin: formData.date_fin || undefined,
      } as Partial<Location>);
      toast.success(isEdit ? 'Location modifiée avec succès' : 'Location créée avec succès');
      navigate('/locations');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <Button variant="secondary" onClick={() => navigate('/locations')} className="mb-6">
          <ArrowLeft size={18} weight="bold" />
          Retour à la liste
        </Button>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          {isEdit ? 'Modifier la location' : 'Nouvelle location'}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          {isEdit ? 'Modifiez les informations du contrat' : 'Associez un locataire à un appartement'}
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_18px_35px_-28px_rgba(24,24,27,0.42)]">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">Appartement</label>
            <select
              name="appartement_id"
              value={formData.appartement_id}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">Sélectionner un appartement</option>
              {appartementsLibres.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.numero} — {a.batiment?.nom} ({Number(a.loyer_mensuel).toLocaleString('fr-FR')} FCFA)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">Locataire</label>
            <select
              name="locataire_id"
              value={formData.locataire_id}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">Sélectionner un locataire</option>
              {locataires.map((l) => (
                <option key={l.id} value={l.id}>{l.prenom} {l.nom}</option>
              ))}
            </select>
          </div>

          <Input label="Date de début" name="date_debut" type="date" value={formData.date_debut} onChange={handleChange} required />
          <Input label="Date de fin (optionnel)" name="date_fin" type="date" value={formData.date_fin} onChange={handleChange} />
          <Input label="Durée (mois)" name="duree_mois" type="number" value={formData.duree_mois} onChange={handleChange} placeholder="Ex: 12" required />
          <Input label="Montant loyer (FCFA)" name="montant_loyer" type="number" value={formData.montant_loyer} onChange={handleChange} placeholder="Ex: 350000" required />
          <Input label="Caution (FCFA)" name="caution" type="number" value={formData.caution} onChange={handleChange} placeholder="Ex: 700000" />

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">Statut</label>
            <select
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="active">Active</option>
              <option value="terminee">Terminée</option>
              <option value="resiliee">Résiliée</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-700">Conditions du contrat</label>
            <textarea
              name="conditions_contrat"
              value={formData.conditions_contrat}
              onChange={handleChange}
              placeholder="Clauses particulières..."
              rows={3}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button type="submit" variant="primary" isLoading={isLoading}>
            <FloppyDisk size={18} weight="bold" />
            {isEdit ? 'Enregistrer' : 'Créer la location'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/locations')}>
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LocationForm;
