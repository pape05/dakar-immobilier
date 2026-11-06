import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FloppyDisk } from '@phosphor-icons/react';

interface AgenceFormData {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
}

interface AgenceFormProps {
  initialData?: Partial<AgenceFormData>;
  onSubmit: (data: AgenceFormData) => Promise<void>;
  isEdit?: boolean;
}

const AgenceForm = ({ initialData, onSubmit, isEdit = false }: AgenceFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<AgenceFormData>({
    nom: initialData?.nom || '',
    adresse: initialData?.adresse || '',
    telephone: initialData?.telephone || '',
    email: initialData?.email || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <button
          onClick={() => navigate('/agences')}
          className="mb-6 inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200 active:scale-[0.98]"
        >
          <ArrowLeft size={18} weight="bold" />
          Retour à la liste
        </button>
        <h1 className="text-3xl font-semibold tracking-tight text-[#3b2418]">
          {isEdit ? "Modifier l'agence" : 'Nouvelle agence'}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          {isEdit
            ? "Modifiez les informations de l'agence ci-dessous"
            : 'Renseignez les informations de la nouvelle agence'}
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#dfd1c2] bg-white p-6"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="nom" className="mb-2 block text-sm font-medium text-zinc-700">
              Nom de l'agence <span className="text-red-500">*</span>
            </label>
            <input
              id="nom"
              name="nom"
              type="text"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Ex: Agence Dakar Centre"
              required
              className="w-full rounded-xl border border-[#dfd1c2] bg-white px-4 py-3 text-sm text-zinc-900 transition focus:border-[#c79457] focus:outline-none focus:ring-2 focus:ring-[#c79457]/20"
            />
          </div>

          <div>
            <label htmlFor="adresse" className="mb-2 block text-sm font-medium text-zinc-700">
              Adresse <span className="text-red-500">*</span>
            </label>
            <input
              id="adresse"
              name="adresse"
              type="text"
              value={formData.adresse}
              onChange={handleChange}
              placeholder="Ex: Avenue Cheikh Anta Diop, Dakar"
              required
              className="w-full rounded-xl border border-[#dfd1c2] bg-white px-4 py-3 text-sm text-zinc-900 transition focus:border-[#c79457] focus:outline-none focus:ring-2 focus:ring-[#c79457]/20"
            />
          </div>

          <div>
            <label htmlFor="telephone" className="mb-2 block text-sm font-medium text-zinc-700">
              Téléphone
            </label>
            <input
              id="telephone"
              name="telephone"
              type="tel"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="Ex: +221 33 800 00 00"
              className="w-full rounded-xl border border-[#dfd1c2] bg-white px-4 py-3 text-sm text-zinc-900 transition focus:border-[#c79457] focus:outline-none focus:ring-2 focus:ring-[#c79457]/20"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ex: contact@agence.sn"
              className="w-full rounded-xl border border-[#dfd1c2] bg-white px-4 py-3 text-sm text-zinc-900 transition focus:border-[#c79457] focus:outline-none focus:ring-2 focus:ring-[#c79457]/20"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#c79457] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#9a6638] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FloppyDisk size={18} weight="bold" />
            {isLoading
              ? 'Enregistrement...'
              : isEdit
                ? 'Enregistrer les modifications'
                : "Créer l'agence"}
          </button>
          <button
            type="button"
            onClick={() => navigate('/agences')}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200 active:scale-[0.98]"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgenceForm;
