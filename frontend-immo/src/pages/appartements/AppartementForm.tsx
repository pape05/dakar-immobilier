import { type FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, FloppyDisk, Camera, X } from '@phosphor-icons/react';
import type { Appartement, Batiment } from '../../types';
import { batimentService } from '../../services/batimentService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

interface AppartementFormProps {
  initialData?: Appartement;
  onSubmit: (data: Partial<Appartement>) => Promise<void>;
  isEdit?: boolean;
}

const AppartementForm = ({ initialData, onSubmit, isEdit = false }: AppartementFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [batiments, setBatiments] = useState<Batiment[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialData?.photo ? `http://localhost:8000/storage/${initialData.photo}` : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    batiment_id: initialData?.batiment_id || '',
    numero: initialData?.numero || '',
    superficie: initialData?.superficie || '',
    loyer_mensuel: initialData?.loyer_mensuel || '',
    etat: initialData?.etat || 'libre',
    nombre_pieces: initialData?.nombre_pieces || '',
    description: initialData?.description || '',
  });

  useEffect(() => {
    batimentService.getAll().then((data) => {
      setBatiments(data);
    }).catch((err) => {
      console.error('Erreur chargement batiments:', err);
      setError('Impossible de charger la liste des bâtiments');
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const payload: any = {
        ...formData,
        batiment_id: Number(formData.batiment_id),
        superficie: Number(formData.superficie),
        loyer_mensuel: Number(formData.loyer_mensuel),
        nombre_pieces: formData.nombre_pieces ? Number(formData.nombre_pieces) : undefined,
      };
      if (photo) payload.photo = photo;
      await onSubmit(payload);
      toast.success(isEdit ? 'Appartement modifié avec succès' : 'Appartement créé avec succès');
      navigate('/appartements');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <Button variant="secondary" onClick={() => navigate('/appartements')} className="mb-6">
          <ArrowLeft size={18} weight="bold" />
          Retour à la liste
        </Button>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          {isEdit ? 'Modifier l\'appartement' : 'Nouvel appartement'}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          {isEdit ? 'Modifiez les informations ci-dessous' : 'Renseignez les informations du nouvel appartement'}
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_18px_35px_-28px_rgba(24,24,27,0.42)]">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">Bâtiment</label>
            <select
              name="batiment_id"
              value={formData.batiment_id}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">
                {batiments.length === 0 ? 'Aucun bâtiment disponible' : 'Sélectionner un bâtiment'}
              </option>
              {batiments.map((b) => (
                <option key={b.id} value={b.id}>{b.nom} — {b.adresse}</option>
              ))}
            </select>
            {batiments.length === 0 && !error && (
              <p className="mt-1 text-xs text-amber-600">
                Vous devez d'abord créer un bâtiment avant de pouvoir ajouter un appartement.
              </p>
            )}
          </div>

          <Input label="Numéro" name="numero" value={formData.numero} onChange={handleChange} placeholder="Ex: A-204" required />
          <Input label="Superficie (m²)" name="superficie" type="number" value={formData.superficie} onChange={handleChange} placeholder="Ex: 65" required />
          <Input label="Loyer mensuel (FCFA)" name="loyer_mensuel" type="number" value={formData.loyer_mensuel} onChange={handleChange} placeholder="Ex: 350000" required />
          <Input label="Nombre de pièces" name="nombre_pieces" type="number" value={formData.nombre_pieces} onChange={handleChange} placeholder="Ex: 3" />

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">État</label>
            <select
              name="etat"
              value={formData.etat}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="libre">Libre</option>
              <option value="occupé">Occupé</option>
              <option value="en_travaux">En travaux</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Informations complémentaires..."
              rows={3}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Photo de l'appartement
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            {photoPreview ? (
              <div className="relative w-full max-w-xs">
                <img
                  src={photoPreview}
                  alt="Aperçu"
                  className="h-48 w-full rounded-xl border border-zinc-200 object-cover"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-md transition hover:bg-red-600"
                >
                  <X size={14} weight="bold" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-48 w-full max-w-xs flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-500 transition hover:border-emerald-500 hover:text-emerald-600"
              >
                <Camera size={32} weight="duotone" />
                <span>Cliquer pour ajouter une photo</span>
                <span className="text-xs text-zinc-400">JPG, PNG — max 2 Mo</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button type="submit" variant="primary" isLoading={isLoading}>
            <FloppyDisk size={18} weight="bold" />
            {isEdit ? 'Enregistrer' : 'Créer l\'appartement'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/appartements')}>
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AppartementForm;
