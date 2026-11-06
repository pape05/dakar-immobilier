import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { batimentService } from '../../services/batimentService';
import type { Batiment } from '../../types';
import BatimentForm, { type BatimentPayload } from './BatimentForm';

const BatimentEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [batiment, setBatiment] = useState<Batiment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBatiment = async () => {
      if (!id) return;
      try {
        const data = await batimentService.getById(Number(id));
        setBatiment(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBatiment();
  }, [id]);

  const handleSubmit = async (data: BatimentPayload) => {
    if (!id) return;
    await batimentService.update(Number(id), data);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="mt-4 text-sm text-zinc-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!batiment) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Bâtiment introuvable
      </div>
    );
  }

  return <BatimentForm initialData={batiment} onSubmit={handleSubmit} isEdit />;
};

export default BatimentEdit;
