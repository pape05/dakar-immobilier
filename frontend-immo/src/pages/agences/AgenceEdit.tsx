import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Buildings } from '@phosphor-icons/react';
import api from '../../services/api';
import AgenceForm from './AgenceForm';

const SkeletonForm = () => (
  <div className="space-y-6 animate-pulse">
    <div>
      <div className="mb-6 h-10 w-36 rounded-xl bg-[#f7f0e8]" />
      <div className="h-8 w-64 rounded-lg bg-[#f7f0e8]" />
      <div className="mt-2 h-4 w-80 rounded-lg bg-[#f7f0e8]" />
    </div>
    <div className="rounded-2xl border border-[#dfd1c2] bg-white p-6">
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 rounded bg-[#f7f0e8]" />
            <div className="h-11 w-full rounded-xl bg-[#f7f0e8]" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AgenceEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [agence, setAgence] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAgence = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/agences/${id}`);
        setAgence(response.data);
      } catch (err) {
        setError("Impossible de charger les données de l'agence");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgence();
  }, [id]);

  const handleSubmit = async (data: { nom: string; adresse: string; telephone: string; email: string }) => {
    await api.put(`/agences/${id}`, data);
    toast.success('Agence modifiée avec succès');
    navigate('/agences');
  };

  if (isLoading) {
    return <SkeletonForm />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[#dfd1c2] bg-white py-16">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-red-50 text-red-500">
          <Buildings size={32} weight="duotone" />
        </span>
        <h3 className="mt-4 text-lg font-semibold text-[#3b2418]">Erreur</h3>
        <p className="mt-1 text-sm text-zinc-500">{error}</p>
        <button
          onClick={() => navigate('/agences')}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-200 active:scale-[0.98]"
        >
          Retour aux agences
        </button>
      </div>
    );
  }

  return (
    <AgenceForm
      initialData={{
        nom: agence.nom,
        adresse: agence.adresse,
        telephone: agence.telephone || '',
        email: agence.email || '',
      }}
      onSubmit={handleSubmit}
      isEdit
    />
  );
};

export default AgenceEdit;
