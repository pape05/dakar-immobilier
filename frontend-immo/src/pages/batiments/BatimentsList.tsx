import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Buildings, Plus, Trash, PencilSimple, Eye } from '@phosphor-icons/react';
import { batimentService } from '../../services/batimentService';
import type { Batiment } from '../../types';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';

const BatimentsList = () => {
  const [batiments, setBatiments] = useState<Batiment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBatiments();
  }, []);

  const fetchBatiments = async () => {
    try {
      setIsLoading(true);
      const data = await batimentService.getAll();
      setBatiments(data);
    } catch (err) {
      setError('Erreur lors du chargement des bâtiments');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce bâtiment ?')) {
      return;
    }

    try {
      await batimentService.delete(id);
      setBatiments(batiments.filter((b) => b.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
      console.error(err);
    }
  };

  const columns = [
    {
      key: 'nom',
      label: 'Nom',
    },
    {
      key: 'adresse',
      label: 'Adresse',
    },
    {
      key: 'nombre_appartements',
      label: 'Appartements',
      render: (batiment: Batiment) => (
        <span className="font-mono font-semibold">{batiment.nombre_appartements}</span>
      ),
    },
    {
      key: 'proprietaire',
      label: 'Propriétaire',
      render: (batiment: Batiment) => batiment.proprietaire || '—',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (batiment: Batiment) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/batiments/${batiment.id}`);
            }}
            className="grid h-9 w-9 place-items-center rounded-lg bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200"
            title="Voir les détails"
          >
            <Eye size={18} weight="bold" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/batiments/${batiment.id}/edit`);
            }}
            className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-100 text-emerald-700 transition hover:bg-emerald-200"
            title="Modifier"
          >
            <PencilSimple size={18} weight="bold" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(batiment.id);
            }}
            className="grid h-9 w-9 place-items-center rounded-lg bg-red-100 text-red-700 transition hover:bg-red-200"
            title="Supprimer"
          >
            <Trash size={18} weight="bold" />
          </button>
        </div>
      ),
    },
  ];

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

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
              <Buildings size={24} weight="duotone" />
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
                Bâtiments
              </h1>
              <p className="mt-1 text-sm text-zinc-600">
                Gestion du portefeuille immobilier
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/batiments/create')}
        >
          <Plus size={20} weight="bold" />
          Nouveau bâtiment
        </Button>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Table
        data={batiments}
        columns={columns}
        onRowClick={(batiment) => navigate(`/batiments/${batiment.id}`)}
        emptyMessage="Aucun bâtiment enregistré. Commencez par créer un nouveau bâtiment."
        searchableKeys={['nom', 'adresse', 'proprietaire']}
      />
    </div>
  );
};

export default BatimentsList;
