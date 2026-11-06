import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { paiementService } from '../../services/paiementService';
import type { Paiement } from '../../types';
import PaiementForm from './PaiementForm';

const PaiementEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [paiement, setPaiement] = useState<Paiement | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await paiementService.getById(Number(id));
        setPaiement(data);
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

  if (!paiement) return <p className="text-red-600">Paiement introuvable.</p>;

  const handleSubmit = async (data: Partial<Paiement>) => {
    await paiementService.update(paiement.id, data);
  };

  return <PaiementForm initialData={paiement} onSubmit={handleSubmit} isEdit />;
};

export default PaiementEdit;
