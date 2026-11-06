import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CurrencyCircleDollar, PencilSimple, Trash, DownloadSimple } from '@phosphor-icons/react';
import { paiementService } from '../../services/paiementService';
import type { Paiement } from '../../types';
import Button from '../../components/common/Button';

const modeLabels: Record<string, string> = {
  especes: 'Espèces',
  cheque: 'Chèque',
  virement: 'Virement',
  mobile_money: 'Mobile Money',
};

const PaiementDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  const handleDelete = async () => {
    if (!window.confirm('Supprimer ce paiement ?')) return;
    try {
      await paiementService.delete(Number(id));
      navigate('/paiements');
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleQuittance = async () => {
    try {
      const blob = await paiementService.getQuittance(Number(id));
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quittance-${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Erreur lors du telechargement de la quittance');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!paiement) return <p className="text-red-600">Paiement introuvable.</p>;

  return (
    <div className="space-y-6">
      <header>
        <Button variant="secondary" onClick={() => navigate('/paiements')} className="mb-6">
          <ArrowLeft size={18} weight="bold" />
          Retour à la liste
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
              <CurrencyCircleDollar size={24} weight="duotone" />
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
                Paiement #{paiement.id}
              </h1>
              <p className="mt-1 text-sm text-zinc-600">{paiement.mois_concerne}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleQuittance}>
              <DownloadSimple size={18} weight="bold" />
              Quittance
            </Button>
            <Button variant="primary" onClick={() => navigate(`/paiements/${id}/edit`)}>
              <PencilSimple size={18} weight="bold" />
              Modifier
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <Trash size={18} weight="bold" />
              Supprimer
            </Button>
          </div>
        </div>
      </header>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_18px_35px_-28px_rgba(24,24,27,0.42)]">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Locataire</p>
            <p className="mt-1 text-lg font-semibold">
              {paiement.location?.locataire ? `${paiement.location.locataire.prenom} ${paiement.location.locataire.nom}` : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Appartement</p>
            <p className="mt-1 text-lg font-semibold">{paiement.location?.appartement?.numero || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Montant</p>
            <p className="mt-1 font-mono text-lg font-semibold">{Number(paiement.montant).toLocaleString('fr-FR')} FCFA</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Date du paiement</p>
            <p className="mt-1 text-lg font-semibold">{new Date(paiement.date_paiement).toLocaleDateString('fr-FR')}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Mois concerné</p>
            <p className="mt-1 text-lg font-semibold">{paiement.mois_concerne}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Mode</p>
            <p className="mt-1 text-lg font-semibold">{modeLabels[paiement.mode_paiement] || paiement.mode_paiement}</p>
          </div>
          {paiement.reference_paiement && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Reference</p>
              <p className="mt-1 font-mono text-lg font-semibold">{paiement.reference_paiement}</p>
            </div>
          )}
          {paiement.remarques && (
            <div className="md:col-span-2 lg:col-span-3">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Remarques</p>
              <p className="mt-1 text-sm text-zinc-700">{paiement.remarques}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaiementDetail;
