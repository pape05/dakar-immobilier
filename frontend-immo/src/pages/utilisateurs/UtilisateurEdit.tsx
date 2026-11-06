import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import type { User } from '../../types';
import UtilisateurForm from './UtilisateurForm';

const SkeletonBlock = () => (
  <div className="space-y-6">
    <div>
      <div className="mb-6 h-9 w-36 animate-pulse rounded-xl bg-zinc-200" />
      <div className="h-8 w-56 animate-pulse rounded-lg bg-zinc-200" />
      <div className="mt-2 h-4 w-72 animate-pulse rounded-lg bg-zinc-100" />
    </div>
    <div className="rounded-2xl border border-[#dfd1c2] bg-white p-6">
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <div className="mb-2 h-4 w-24 animate-pulse rounded bg-zinc-200" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-zinc-100" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const UtilisateurEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get(`/users/${id}`);
        setUser(data);
      } catch (err) {
        setError('Utilisateur introuvable');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (isLoading) return <SkeletonBlock />;

  if (error || !user) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error || 'Utilisateur introuvable'}
      </div>
    );
  }

  const handleSubmit = async (data: Record<string, unknown>) => {
    await api.put(`/users/${user.id}`, data);
  };

  return <UtilisateurForm initialData={user} onSubmit={handleSubmit} isEdit />;
};

export default UtilisateurEdit;
