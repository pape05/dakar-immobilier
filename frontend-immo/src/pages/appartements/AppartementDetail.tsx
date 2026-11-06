import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, HouseLine, PencilSimple, Trash } from '@phosphor-icons/react';
import { appartementService } from '../../services/appartementService';
import type { Appartement } from '../../types';
import Button from '../../components/common/Button';

const AppartementDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  const handleDelete = async () => {
    if (!window.confirm('Supprimer cet appartement ?')) return;
    try {
      await appartementService.delete(Number(id));
      navigate('/appartements');
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!appartement) return <p className="text-red-600">Appartement introuvable.</p>;

  return (
    <div className="space-y-6">
      <header>
        <Button variant="secondary" onClick={() => navigate('/appartements')} className="mb-6">
          <ArrowLeft size={18} weight="bold" />
          Retour à la liste
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
              <HouseLine size={24} weight="duotone" />
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
                Appartement {appartement.numero}
              </h1>
              <p className="mt-1 text-sm text-zinc-600">{appartement.batiment?.nom}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={() => navigate(`/appartements/${id}/edit`)}>
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
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Numéro</p>
            <p className="mt-1 text-lg font-semibold">{appartement.numero}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Bâtiment</p>
            <p className="mt-1 text-lg font-semibold">{appartement.batiment?.nom || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Superficie</p>
            <p className="mt-1 font-mono text-lg font-semibold">{appartement.superficie} m²</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Loyer mensuel</p>
            <p className="mt-1 font-mono text-lg font-semibold">{Number(appartement.loyer_mensuel).toLocaleString('fr-FR')} FCFA</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">État</p>
            <p className="mt-1 text-lg font-semibold capitalize">{appartement.etat === 'en_travaux' ? 'En travaux' : appartement.etat}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Pièces</p>
            <p className="mt-1 text-lg font-semibold">{appartement.nombre_pieces || '—'}</p>
          </div>
          {appartement.description && (
            <div className="md:col-span-2 lg:col-span-3">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Description</p>
              <p className="mt-1 text-sm text-zinc-700">{appartement.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppartementDetail;
