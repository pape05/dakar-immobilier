import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { locataireService } from '../../services/locataireService';
import type { Locataire } from '../../types';
import LocataireForm from './LocataireForm';

const LocataireEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [locataire, setLocataire] = useState<Locataire | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await locataireService.getById(Number(id));
        setLocataire(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!locataire) return <p className="text-red-600">Locataire introuvable.</p>;

  const handleSubmit = async (data: Partial<Locataire>) => {
    await locataireService.update(locataire.id, data);
  };

  return <LocataireForm initialData={locataire} onSubmit={handleSubmit} isEdit />;
};

export default LocataireEdit;
