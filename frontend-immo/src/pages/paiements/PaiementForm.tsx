import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, FloppyDisk } from '@phosphor-icons/react';
import type { Paiement, Location } from '../../types';
import { locationService } from '../../services/locationService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

interface PaiementFormProps {
  initialData?: Paiement;
  onSubmit: (data: Partial<Paiement>) => Promise<void>;
  isEdit?: boolean;
}

const PaiementForm = ({ initialData, onSubmit, isEdit = false }: PaiementFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);

  const [formData, setFormData] = useState({
    location_id: initialData?.location_id || '',
    date_paiement: initialData?.date_paiement || '',
    mois_concerne: initialData?.mois_concerne || '',
    montant: initialData?.montant || '',
    mode_paiement: initialData?.mode_paiement || 'especes',
    statut: initialData?.statut || 'en_attente',
    reference_paiement: initialData?.reference_paiement || '',
    remarques: initialData?.remarques || '',
  });

  useEffect(() => {
    locationService.getAll().then((data) => {
      setLocations(data.filter((l) => l.statut === 'active'));
    }).catch(console.error);
  }, []);

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
        location_id: Number(formData.location_id),
        montant: Number(formData.montant),
        statut: formData.statut,
        reference_paiement: formData.reference_paiement || undefined,
        remarques: formData.remarques || undefined,
      } as Partial<Paiement>);
      toast.success(isEdit ? 'Paiement modifié avec succès' : 'Paiement enregistré avec succès');
      navigate('/paiements');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <Button variant="secondary" onClick={() => navigate('/paiements')} className="mb-6">
          <ArrowLeft size={18} weight="bold" />
          Retour à la liste
        </Button>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          {isEdit ? 'Modifier le paiement' : 'Nouveau paiement'}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          {isEdit ? 'Modifiez les informations du paiement' : 'Enregistrez un règlement de loyer'}
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_18px_35px_-28px_rgba(24,24,27,0.42)]">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-700">Location (locataire — appartement)</label>
            <select
              name="location_id"
              value={formData.location_id}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">Sélectionner une location active</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.locataire ? `${l.locataire.prenom} ${l.locataire.nom}` : `Location #${l.id}`} — {l.appartement?.numero} ({Number(l.montant_loyer).toLocaleString('fr-FR')} FCFA)
                </option>
              ))}
            </select>
          </div>

          <Input label="Date du paiement" name="date_paiement" type="date" value={formData.date_paiement} onChange={handleChange} required />
          <Input label="Mois concerné" name="mois_concerne" value={formData.mois_concerne} onChange={handleChange} placeholder="Ex: Juillet 2026" required />
          <Input label="Montant (FCFA)" name="montant" type="number" value={formData.montant} onChange={handleChange} placeholder="Ex: 350000" required />

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">Mode de paiement</label>
            <select
              name="mode_paiement"
              value={formData.mode_paiement}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="especes">Espèces</option>
              <option value="cheque">Chèque</option>
              <option value="virement">Virement</option>
              <option value="mobile_money">Mobile Money</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">Statut</label>
            <select
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="en_attente">En attente</option>
              <option value="paye">Paye</option>
              <option value="echoue">Échoué</option>
            </select>
          </div>

          <Input label="Reference (optionnel)" name="reference_paiement" value={formData.reference_paiement} onChange={handleChange} placeholder="Ex: TX-20260719-001" />

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-700">Remarques</label>
            <textarea
              name="remarques"
              value={formData.remarques}
              onChange={handleChange}
              placeholder="Notes supplementaires..."
              rows={3}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button type="submit" variant="primary" isLoading={isLoading}>
            <FloppyDisk size={18} weight="bold" />
            {isEdit ? 'Enregistrer' : 'Enregistrer le paiement'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/paiements')}>
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaiementForm;
