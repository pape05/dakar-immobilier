import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Buildings,
  PencilSimple,
  HouseLine,
  MapPin,
  User,
  Note,
} from '@phosphor-icons/react';
import { batimentService } from '../../services/batimentService';
import type { Batiment } from '../../types';
import Button from '../../components/common/Button';

const BatimentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [batiment, setBatiment] = useState<Batiment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBatiment = async () => {
      if (!id) return;
      try {
        const data = await batimentService.getById(Number(id));
        setBatiment(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBatiment();
  }, [id]);

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

  if (!batiment) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Bâtiment introuvable
        </div>
        <Button variant="secondary" onClick={() => navigate('/batiments')}>
          <ArrowLeft size={18} weight="bold" />
          Retour à la liste
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button
            variant="secondary"
            onClick={() => navigate('/batiments')}
            className="mb-4"
          >
            <ArrowLeft size={18} weight="bold" />
            Retour à la liste
          </Button>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
              <Buildings size={24} weight="duotone" />
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
                {batiment.nom}
              </h1>
              <p className="mt-1 text-sm text-zinc-600">Détails du bâtiment</p>
            </div>
          </div>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate(`/batiments/${id}/edit`)}
        >
          <PencilSimple size={18} weight="bold" />
          Modifier
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_18px_35px_-28px_rgba(24,24,27,0.42)] lg:col-span-2">
          <h2 className="mb-6 text-xl font-semibold tracking-tight">Informations générales</h2>
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-zinc-100 text-zinc-700">
                <Buildings size={20} weight="duotone" />
              </span>
              <div>
                <p className="text-sm text-zinc-500">Nom du bâtiment</p>
                <p className="mt-1 text-base font-medium text-zinc-950">{batiment.nom}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-zinc-100 text-zinc-700">
                <MapPin size={20} weight="duotone" />
              </span>
              <div>
                <p className="text-sm text-zinc-500">Adresse</p>
                <p className="mt-1 text-base font-medium text-zinc-950">{batiment.adresse}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-zinc-100 text-zinc-700">
                <HouseLine size={20} weight="duotone" />
              </span>
              <div>
                <p className="text-sm text-zinc-500">Nombre d'appartements</p>
                <p className="mt-1 font-mono text-base font-semibold text-zinc-950">
                  {batiment.nombre_appartements}
                </p>
              </div>
            </div>

            {batiment.proprietaire && (
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-zinc-100 text-zinc-700">
                  <User size={20} weight="duotone" />
                </span>
                <div>
                  <p className="text-sm text-zinc-500">Propriétaire</p>
                  <p className="mt-1 text-base font-medium text-zinc-950">
                    {batiment.proprietaire}
                  </p>
                </div>
              </div>
            )}

            {batiment.description && (
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-zinc-100 text-zinc-700">
                  <Note size={20} weight="duotone" />
                </span>
                <div>
                  <p className="text-sm text-zinc-500">Description</p>
                  <p className="mt-1 text-base leading-relaxed text-zinc-950">
                    {batiment.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_18px_35px_-28px_rgba(24,24,27,0.42)]">
            <h3 className="mb-4 text-lg font-semibold tracking-tight">Statistiques</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-zinc-500">Appartements totaux</p>
                <p className="mt-1 font-mono text-2xl font-semibold text-zinc-950">
                  {batiment.nombre_appartements}
                </p>
              </div>
              <div className="border-t border-zinc-100 pt-4">
                <p className="text-sm text-zinc-500">Taux d'occupation</p>
                <p className="mt-1 font-mono text-2xl font-semibold text-emerald-600">0%</p>
                <p className="mt-1 text-xs text-zinc-500">Connecté bientôt à l'API</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <h3 className="text-base font-semibold text-emerald-950">Prochaine étape</h3>
            <p className="mt-2 text-sm leading-relaxed text-emerald-900">
              Ajoutez les appartements de ce bâtiment via le module Appartements.
            </p>
            <Button
              variant="primary"
              className="mt-4 w-full justify-center"
              onClick={() => navigate('/appartements/create')}
            >
              <HouseLine size={18} weight="bold" />
              Ajouter un appartement
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatimentDetail;
