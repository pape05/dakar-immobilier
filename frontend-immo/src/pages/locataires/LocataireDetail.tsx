import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UsersThree, PencilSimple, Trash } from '@phosphor-icons/react';
import { locataireService } from '../../services/locataireService';
import type { Locataire } from '../../types';
import Button from '../../components/common/Button';

const LocataireDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [locataire, setLocataire] = useState<Locataire | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await locataireService.getById(Number(id));
        setLocataire(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Supprimer ce locataire ?')) return;
    try {
      await locataireService.delete(Number(id));
      navigate('/locataires');
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

  if (!locataire) return <p className="text-red-600">Locataire introuvable.</p>;

  return (
    <div className="space-y-6">
      <header>
        <Button variant="secondary" onClick={() => navigate('/locataires')} className="mb-6">
          <ArrowLeft size={18} weight="bold" />
          Retour à la liste
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
              <UsersThree size={24} weight="duotone" />
            </span>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
                {locataire.prenom} {locataire.nom}
              </h1>
              <p className="mt-1 text-sm text-zinc-600">Locataire</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={() => navigate(`/locataires/${id}/edit`)}>
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
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Prénom</p>
            <p className="mt-1 text-lg font-semibold">{locataire.prenom}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Nom</p>
            <p className="mt-1 text-lg font-semibold">{locataire.nom}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Téléphone</p>
            <p className="mt-1 font-mono text-lg font-semibold">{locataire.telephone}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Email</p>
            <p className="mt-1 text-lg font-semibold">{locataire.email || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Pièce d'identité</p>
            <p className="mt-1 text-lg font-semibold">{locataire.piece_identite}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Numéro pièce</p>
            <p className="mt-1 font-mono text-lg font-semibold">{locataire.numero_piece}</p>
          </div>
          {locataire.date_naissance && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Date de naissance</p>
              <p className="mt-1 text-lg font-semibold">{new Date(locataire.date_naissance).toLocaleDateString('fr-FR')}</p>
            </div>
          )}
          {locataire.adresse_actuelle && (
            <div className="md:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Adresse actuelle</p>
              <p className="mt-1 text-sm text-zinc-700">{locataire.adresse_actuelle}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocataireDetail;
