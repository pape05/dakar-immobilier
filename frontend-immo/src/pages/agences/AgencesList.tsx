import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Buildings, Plus, Trash, PencilSimple, Users, MapPin } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import api from '../../services/api';

interface AgenceListItem {
  id: number;
  nom: string;
  adresse: string;
  telephone?: string;
  email?: string;
  batiments_count: number;
  users_count: number;
}

const SkeletonCard = () => (
  <div className="rounded-2xl border border-[#dfd1c2] bg-white p-5 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 rounded-xl bg-[#f7f0e8]" />
        <div className="space-y-2">
          <div className="h-5 w-40 rounded-lg bg-[#f7f0e8]" />
          <div className="h-4 w-56 rounded-lg bg-[#f7f0e8]" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-16 rounded-lg bg-[#f7f0e8]" />
        <div className="h-8 w-16 rounded-lg bg-[#f7f0e8]" />
      </div>
    </div>
  </div>
);

const AgencesList = () => {
  const [agences, setAgences] = useState<AgenceListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAgences();
  }, []);

  const fetchAgences = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/agences');
      setAgences(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des agences');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Êtes-vous sur de vouloir supprimer cette agence ?')) {
      return;
    }

    try {
      await api.delete(`/agences/${id}`);
      setAgences(agences.filter((a) => a.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#f7f0e8] text-[#c79457]">
              <Buildings size={24} weight="duotone" />
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#3b2418]">Agences</h1>
              <p className="mt-1 text-sm text-zinc-600">Gestion des agences immobilieres</p>
            </div>
          </div>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#f7f0e8] text-[#c79457]">
            <Buildings size={24} weight="duotone" />
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-[#3b2418]">Agences</h1>
            <p className="mt-1 text-sm text-zinc-600">Gestion des agences immobilieres</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/agences/create')}
          className="inline-flex items-center gap-2 rounded-xl bg-[#c79457] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#9a6638] active:scale-[0.98]"
        >
          <Plus size={18} weight="bold" />
          Ajouter
        </button>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {agences.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#dfd1c2] bg-white py-16">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#f7f0e8] text-[#c79457]">
            <Buildings size={32} weight="duotone" />
          </span>
          <h3 className="mt-4 text-lg font-semibold text-[#3b2418]">Aucune agence</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Commencez par créer votre première agence.
          </p>
          <button
            onClick={() => navigate('/agences/create')}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#c79457] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#9a6638] active:scale-[0.98]"
          >
            <Plus size={18} weight="bold" />
            Ajouter une agence
          </button>
        </div>
      ) : (
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
        >
          {agences.map((agence) => (
            <motion.div
              key={agence.id}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onClick={() => navigate(`/agences/${agence.id}/edit`)}
              className="group cursor-pointer rounded-2xl border border-[#dfd1c2] bg-white p-5 transition hover:shadow-md hover:border-[#c79457]/40"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f7f0e8] text-[#c79457]">
                    <Buildings size={22} weight="duotone" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-[#3b2418]">
                      {agence.nom}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-sm text-zinc-500">
                      <MapPin size={14} weight="duotone" className="shrink-0" />
                      {agence.adresse}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f7f0e8] px-2.5 py-1 text-xs font-medium text-[#3b2418]">
                    <Users size={14} weight="duotone" />
                    {agence.users_count} agent{agence.users_count !== 1 ? 's' : ''}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f7f0e8] px-2.5 py-1 text-xs font-medium text-[#3b2418]">
                    <Buildings size={14} weight="duotone" />
                    {agence.batiments_count} batiment{agence.batiments_count !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/agences/${agence.id}/edit`);
                    }}
                    className="grid h-8 w-8 place-items-center rounded-lg bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200"
                    title="Modifier"
                  >
                    <PencilSimple size={16} weight="bold" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(agence.id, e)}
                    className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                    title="Supprimer"
                  >
                    <Trash size={16} weight="bold" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default AgencesList;
