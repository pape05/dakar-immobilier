import { type FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, FloppyDisk, Camera, X } from '@phosphor-icons/react';
import type { Batiment, Agence } from '../../types';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import api from '../../services/api';

export type BatimentPayload = Omit<Partial<Batiment>, 'photo'> & { photo?: File };

interface BatimentFormProps {
  initialData?: Batiment;
  onSubmit: (data: BatimentPayload) => Promise<void>;
  isEdit?: boolean;
}

const BatimentForm = ({ initialData, onSubmit, isEdit = false }: BatimentFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agences, setAgences] = useState<Agence[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialData?.photo ? `http://localhost:8000/storage/${initialData.photo}` : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userAgenceId = user?.agence_id?.toString() || '';

  const [formData, setFormData] = useState({
    agence_id: initialData?.agence_id?.toString() || userAgenceId || '',
    nom: initialData?.nom || '',
    adresse: initialData?.adresse || '',
    nombre_appartements: initialData?.nombre_appartements || 0,
    proprietaire: initialData?.proprietaire || '',
    description: initialData?.description || '',
  });

  useEffect(() => {
    api.get('/agences').then((res) => {
      setAgences(res.data);
      if (!formData.agence_id && userAgenceId) {
        setFormData((prev) => ({ ...prev, agence_id: userAgenceId }));
      }
    }).catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'nombre_appartements' ? Number(value) : value,
    }));
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
        agence_id: Number(formData.agence_id),
      };
      if (photo) payload.photo = photo;
      await onSubmit(payload);
      toast.success(isEdit ? 'Bâtiment modifié avec succès' : 'Bâtiment créé avec succès');
      navigate('/batiments');
    } catch (err: any) {
      const msg = err.response?.data?.message
        || (err.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(', ')
          : 'Une erreur est survenue');
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <Button
          variant="secondary"
          onClick={() => navigate('/batiments')}
          className="mb-6"
        >
          <ArrowLeft size={18} weight="bold" />
          Retour à la liste
        </Button>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          {isEdit ? 'Modifier le bâtiment' : 'Nouveau bâtiment'}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          {isEdit
            ? 'Modifiez les informations du bâtiment ci-dessous'
            : 'Renseignez les informations du nouveau bâtiment'}
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-[#dfd1c2] bg-white p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Agence */}
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Agence <span className="text-red-500">*</span>
            </label>
            <select
              name="agence_id"
              value={formData.agence_id}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-[#dfd1c2] bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition duration-300 focus:border-[#c79457] focus:ring-4 focus:ring-[#c79457]/20"
            >
              <option value="">Sélectionner une agence</option>
              {agences.map((agence) => (
                <option key={agence.id} value={agence.id}>
                  {agence.nom}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Nom du bâtiment"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Ex: Résidence Les Palmiers"
            required
          />

          <Input
            label="Nombre d'appartements"
            name="nombre_appartements"
            type="number"
            value={formData.nombre_appartements}
            onChange={handleChange}
            placeholder="Ex: 12"
            required
            min="1"
          />

          <Input
            label="Propriétaire"
            name="proprietaire"
            value={formData.proprietaire}
            onChange={handleChange}
            placeholder="Ex: Société ABC"
          />

          <div className="md:col-span-2">
            <Input
              label="Adresse complète"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              placeholder="Ex: Avenue Cheikh Anta Diop, Dakar"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Informations complémentaires sur le bâtiment..."
              rows={4}
              className="w-full rounded-xl border border-[#dfd1c2] bg-white px-4 py-3 text-sm text-zinc-900 transition focus:border-[#c79457] focus:outline-none focus:ring-2 focus:ring-[#c79457]/20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Photo du bâtiment
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
                  className="h-48 w-full rounded-xl border border-[#dfd1c2] object-cover"
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
                className="flex h-48 w-full max-w-xs flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#dfd1c2] bg-[#f7f0e8]/50 text-sm text-zinc-500 transition hover:border-[#c79457] hover:text-[#c79457]"
              >
                <Camera size={32} weight="duotone" />
                <span>Cliquer pour ajouter une photo</span>
                <span className="text-xs text-zinc-400">JPG, PNG — max 5 Mo</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button type="submit" variant="brown" isLoading={isLoading}>
            <FloppyDisk size={18} weight="bold" />
            {isEdit ? 'Enregistrer' : 'Créer le bâtiment'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/batiments')}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BatimentForm;
