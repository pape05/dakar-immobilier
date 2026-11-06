import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Trash, PencilSimple, Eye } from '@phosphor-icons/react';
import { locationService } from '../../services/locationService';
import type { Location } from '../../types';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';

const statutStyles: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  terminee: 'bg-zinc-100 text-zinc-700',
  resiliee: 'bg-red-50 text-red-700',
};

const LocationsList = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      const data = await locationService.getAll();
      setLocations(data);
    } catch (err) {
      setError('Erreur lors du chargement des locations');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer cette location ?')) return;
    try {
      await locationService.delete(id);
      setLocations(locations.filter((l) => l.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
      console.error(err);
    }
  };

  const columns = [
    {
      key: 'locataire',
      label: 'Locataire',
      render: (l: Location) => (
        <span className="font-medium">
          {l.locataire ? `${l.locataire.prenom} ${l.locataire.nom}` : '—'}
        </span>
      ),
    },
    {
      key: 'appartement',
      label: 'Appartement',
      render: (l: Location) => l.appartement ? `${l.appartement.numero} — ${l.appartement.batiment?.nom || ''}` : '—',
    },
    {
      key: 'montant_loyer',
      label: 'Loyer',
      render: (l: Location) => <span className="font-mono">{Number(l.montant_loyer).toLocaleString('fr-FR')} FCFA</span>,
    },
    {
      key: 'date_debut',
      label: 'Début',
      render: (l: Location) => new Date(l.date_debut).toLocaleDateString('fr-FR'),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (l: Location) => (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statutStyles[l.statut] || ''}`}>
          {l.statut}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (l: Location) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/locations/${l.id}`); }}
            className="grid h-9 w-9 place-items-center rounded-lg bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200"
            title="Voir"
          >
            <Eye size={18} weight="bold" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/locations/${l.id}/edit`); }}
            className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-100 text-emerald-700 transition hover:bg-emerald-200"
            title="Modifier"
          >
            <PencilSimple size={18} weight="bold" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(l.id); }}
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
            <FileText size={24} weight="duotone" />
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Locations</h1>
            <p className="mt-1 text-sm text-zinc-600">Contrats de location actifs et terminés</p>
          </div>
        </div>
        <Button variant="primary" onClick={() => navigate('/locations/create')}>
          <Plus size={20} weight="bold" />
          Nouvelle location
        </Button>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <Table
        data={locations}
        columns={columns}
        onRowClick={(l) => navigate(`/locations/${l.id}`)}
        emptyMessage="Aucune location enregistrée."
        searchableKeys={['locataire.nom', 'locataire.prenom', 'appartement.numero', 'statut']}
      />
    </div>
  );
};

export default LocationsList;
