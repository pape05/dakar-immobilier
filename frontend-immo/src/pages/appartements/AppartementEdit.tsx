import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { appartementService } from '../../services/appartementService';
import type { Appartement } from '../../types';
import AppartementForm from './AppartementForm';

const AppartementEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [appartement, setAppartement] = useState<Appartement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await appartementService.getById(Number(id));
        setAppartement(data);
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

  if (!appartement) return <p className="text-red-600">Appartement introuvable.</p>;

  const handleSubmit = async (data: Partial<Appartement>) => {
    await appartementService.update(appartement.id, data);
  };

  return <AppartementForm initialData={appartement} onSubmit={handleSubmit} isEdit />;
};

export default AppartementEdit;
