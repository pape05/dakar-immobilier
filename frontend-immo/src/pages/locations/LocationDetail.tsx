import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, PencilSimple, Trash } from '@phosphor-icons/react';
import { locationService } from '../../services/locationService';
import type { Location } from '../../types';
import Button from '../../components/common/Button';

const LocationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await locationService.getById(Number(id));
        setLocation(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Supprimer cette location ?')) return;
    try {
      await locationService.delete(Number(id));
      navigate('/locations');
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

  if (!location) return <p className="text-red-600">Location introuvable.</p>;

  return (
    <div className="space-y-6">
      <header>
        <Button variant="secondary" onClick={() => navigate('/locations')} className="mb-6">
          <ArrowLeft size={18} weight="bold" />
          Retour à la liste
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
              <FileText size={24} weight="duotone" />
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
                Location #{location.id}
              </h1>
              <p className="mt-1 text-sm text-zinc-600">
                {location.locataire ? `${location.locataire.prenom} ${location.locataire.nom}` : ''} — {location.appartement?.numero}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={() => navigate(`/locations/${id}/edit`)}>
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
              {location.locataire ? `${location.locataire.prenom} ${location.locataire.nom}` : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Appartement</p>
            <p className="mt-1 text-lg font-semibold">{location.appartement?.numero} — {location.appartement?.batiment?.nom}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Loyer mensuel</p>
            <p className="mt-1 font-mono text-lg font-semibold">{Number(location.montant_loyer).toLocaleString('fr-FR')} FCFA</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Date debut</p>
            <p className="mt-1 text-lg font-semibold">{new Date(location.date_debut).toLocaleDateString('fr-FR')}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Durée</p>
            <p className="mt-1 text-lg font-semibold">{location.duree_mois} mois</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Statut</p>
            <p className="mt-1 text-lg font-semibold capitalize">{location.statut}</p>
          </div>
          {location.caution && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Caution</p>
              <p className="mt-1 font-mono text-lg font-semibold">{Number(location.caution).toLocaleString('fr-FR')} FCFA</p>
            </div>
          )}
          {location.date_fin && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Date fin</p>
              <p className="mt-1 text-lg font-semibold">{new Date(location.date_fin).toLocaleDateString('fr-FR')}</p>
            </div>
          )}
          {location.conditions_contrat && (
            <div className="md:col-span-2 lg:col-span-3">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Conditions</p>
              <p className="mt-1 text-sm text-zinc-700">{location.conditions_contrat}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationDetail;
