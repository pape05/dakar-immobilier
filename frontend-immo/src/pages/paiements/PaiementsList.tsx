import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrencyCircleDollar, Plus, Trash, PencilSimple, Eye } from '@phosphor-icons/react';
import { paiementService } from '../../services/paiementService';
import type { Paiement } from '../../types';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';

const modeLabels: Record<string, string> = {
  especes: 'Espèces',
  cheque: 'Chèque',
  virement: 'Virement',
  mobile_money: 'Mobile Money',
};

const statutStyles: Record<string, { bg: string; text: string; label: string }> = {
  paye: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Payé' },
  en_attente: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'En attente' },
  echoue: { bg: 'bg-red-50', text: 'text-red-700', label: 'Échoué' },
};

const PaiementsList = () => {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPaiements();
  }, []);

  const fetchPaiements = async () => {
    try {
      setIsLoading(true);
      const data = await paiementService.getAll();
      setPaiements(data);
    } catch (err) {
      setError('Erreur lors du chargement des paiements');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer ce paiement ?')) return;
    try {
      await paiementService.delete(id);
      setPaiements(paiements.filter((p) => p.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
      console.error(err);
    }
  };

  const columns = [
    {
      key: 'locataire',
      label: 'Locataire',
      render: (p: Paiement) => {
        const loc = p.location?.locataire;
        return <span className="font-medium">{loc ? `${loc.prenom} ${loc.nom}` : '—'}</span>;
      },
    },
    {
      key: 'appartement',
      label: 'Appartement',
      render: (p: Paiement) => p.location?.appartement?.numero || '—',
    },
    {
      key: 'mois_concerne',
      label: 'Mois',
      render: (p: Paiement) => p.mois_concerne,
    },
    {
      key: 'montant',
      label: 'Montant',
      render: (p: Paiement) => <span className="font-mono">{Number(p.montant).toLocaleString('fr-FR')} FCFA</span>,
    },
    {
      key: 'mode_paiement',
      label: 'Mode',
      render: (p: Paiement) => (
        <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
          {modeLabels[p.mode_paiement] || p.mode_paiement}
        </span>
      ),
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (p: Paiement) => {
        const s = statutStyles[p.statut || 'paye'] || statutStyles.paye;
        return (
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.bg} ${s.text}`}>
            {s.label}
          </span>
        );
      },
    },
    {
      key: 'date_paiement',
      label: 'Date',
      render: (p: Paiement) => new Date(p.date_paiement).toLocaleDateString('fr-FR'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (p: Paiement) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/paiements/${p.id}`); }}
            className="grid h-9 w-9 place-items-center rounded-lg bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200"
            title="Voir"
          >
            <Eye size={18} weight="bold" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigate(`/paiements/${p.id}/edit`); }}
            className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-100 text-emerald-700 transition hover:bg-emerald-200"
            title="Modifier"
          >
            <PencilSimple size={18} weight="bold" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
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
            <CurrencyCircleDollar size={24} weight="duotone" />
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Paiements</h1>
            <p className="mt-1 text-sm text-zinc-600">Suivi des règlements mensuels</p>
          </div>
        </div>
        <Button variant="primary" onClick={() => navigate('/paiements/create')}>
          <Plus size={20} weight="bold" />
          Nouveau paiement
        </Button>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <Table
        data={paiements}
        columns={columns}
        onRowClick={(p) => navigate(`/paiements/${p.id}`)}
        emptyMessage="Aucun paiement enregistré."
        searchableKeys={['location.locataire.nom', 'location.locataire.prenom', 'mois_concerne', 'mode_paiement', 'statut']}
      />
    </div>
  );
};

export default PaiementsList;
