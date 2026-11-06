import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HouseLine, Plus, Trash, PencilSimple, Eye } from '@phosphor-icons/react';
import { appartementService } from '../../services/appartementService';
import type { Appartement } from '../../types';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';

const etatStyles: Record<string, string> = {
  libre: 'bg-emerald-50 text-emerald-700',
  'occupé': 'bg-zinc-100 text-zinc-700',
  en_travaux: 'bg-amber-50 text-amber-700',
};

const AppartementsList = () => {
  const [appartements, setAppartements] = useState<Appartement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppartements();
  }, []);

  const fetchAppartements = async () => {
    try {
      setIsLoading(true);
      const data = await appartementService.getAll();
      setAppartements(data);
    } catch (err) {
      setError('Erreur lors du chargement des appartements');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer cet appartement ?')) return;
    try {
      await appartementService.delete(id);
      setAppartements(appartements.filter((a) => a.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
      console.error(err);
    }
  };

  const columns = [
    {
      key: 'numero',
      label: 'Numéro',
      render: (a: Appartement) => <span className="font-medium">{a.numero}</span>,
    },
    {
      key: 'batiment',
      label: 'Bâtiment',
      render: (a: Appartement) => a.batiment?.nom || '—',
    },
    {
      key: 'superficie',
      label: 'Superficie',
      render: (a: Appartement) => <span className="font-mono">{a.superficie} m²</span>,
    },
    {
      key: 'loyer_mensuel',
      label: 'Loyer',
      render: (a: Appartement) => (
        <span className="font-mono">{Number(a.loyer_mensuel).toLocaleString('fr-FR')} FCFA</span>
      ),
    },
    {
      key: 'etat',
      label: 'État',
      render: (a: Appartement) => (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${etatStyles[a.etat] || ''}`}>
          {a.etat === 'en_travaux' ? 'En travaux' : a.etat === 'occupé' ? 'Occupé' : 'Libre'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (a: Appartement) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/appartements/${a.id}`); }}
            className="grid h-9 w-9 place-items-center rounded-lg bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200"
            title="Voir"
          >
            <Eye size={18} weight="bold" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/appartements/${a.id}/edit`); }}
            className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-100 text-emerald-700 transition hover:bg-emerald-200"
            title="Modifier"
          >
            <PencilSimple size={18} weight="bold" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(a.id); }}
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
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <p className="mt-4 text-sm text-zinc-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
            <HouseLine size={24} weight="duotone" />
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Appartements</h1>
            <p className="mt-1 text-sm text-zinc-600">Liste des appartements du portefeuille</p>
          </div>
        </div>
        <Button variant="primary" onClick={() => navigate('/appartements/create')}>
          <Plus size={20} weight="bold" />
          Nouvel appartement
        </Button>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <Table
        data={appartements}
        columns={columns}
        onRowClick={(a) => navigate(`/appartements/${a.id}`)}
        emptyMessage="Aucun appartement enregistré. Commencez par en créer un."
        searchableKeys={['numero', 'batiment.nom', 'etat']}
      />
    </div>
  );
};

export default AppartementsList;
