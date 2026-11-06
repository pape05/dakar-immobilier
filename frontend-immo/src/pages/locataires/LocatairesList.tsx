import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UsersThree, Plus, Trash, PencilSimple, Eye } from '@phosphor-icons/react';
import { locataireService } from '../../services/locataireService';
import type { Locataire } from '../../types';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';

const LocatairesList = () => {
  const [locataires, setLocataires] = useState<Locataire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLocataires();
  }, []);

  const fetchLocataires = async () => {
    try {
      setIsLoading(true);
      const data = await locataireService.getAll();
      setLocataires(data);
    } catch (err) {
      setError('Erreur lors du chargement des locataires');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer ce locataire ?')) return;
    try {
      await locataireService.delete(id);
      setLocataires(locataires.filter((l) => l.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
      console.error(err);
    }
  };

  const columns = [
    {
      key: 'nom',
      label: 'Nom complet',
      render: (l: Locataire) => <span className="font-medium">{l.prenom} {l.nom}</span>,
    },
    {
      key: 'telephone',
      label: 'Téléphone',
      render: (l: Locataire) => <span className="font-mono text-sm">{l.telephone}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      render: (l: Locataire) => l.email || '—',
    },
    {
      key: 'piece_identite',
      label: 'Pièce d\'identité',
      render: (l: Locataire) => <span className="text-sm">{l.piece_identite}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (l: Locataire) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/locataires/${l.id}`); }}
            className="grid h-9 w-9 place-items-center rounded-lg bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200"
            title="Voir"
          >
            <Eye size={18} weight="bold" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/locataires/${l.id}/edit`); }}
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
            <UsersThree size={24} weight="duotone" />
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Locataires</h1>
            <p className="mt-1 text-sm text-zinc-600">Gestion des occupants</p>
          </div>
        </div>
        <Button variant="primary" onClick={() => navigate('/locataires/create')}>
          <Plus size={20} weight="bold" />
          Nouveau locataire
        </Button>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <Table
        data={locataires}
        columns={columns}
        onRowClick={(l) => navigate(`/locataires/${l.id}`)}
        emptyMessage="Aucun locataire enregistré."
        searchableKeys={['nom', 'prenom', 'telephone', 'email']}
      />
    </div>
  );
};

export default LocatairesList;
