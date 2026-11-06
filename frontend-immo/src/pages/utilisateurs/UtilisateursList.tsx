import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Trash, PencilSimple, MagnifyingGlass } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import type { User } from '../../types';

const roleBadge = (role: User['role']) => {
  const map = {
    administrateur: 'bg-indigo-100 text-indigo-700',
    agent: 'bg-emerald-100 text-emerald-700',
    locataire: 'bg-zinc-100 text-zinc-600',
  };
  const labels = {
    administrateur: 'Administrateur',
    agent: 'Agent',
    locataire: 'Locataire',
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[role]}`}>
      {labels[role]}
    </span>
  );
};

const SkeletonRow = () => (
  <tr>
    <td className="px-5 py-4"><div className="h-4 w-32 animate-pulse rounded-lg bg-zinc-200" /></td>
    <td className="px-5 py-4"><div className="h-4 w-44 animate-pulse rounded-lg bg-zinc-200" /></td>
    <td className="px-5 py-4"><div className="h-5 w-20 animate-pulse rounded-full bg-zinc-200" /></td>
    <td className="px-5 py-4"><div className="h-4 w-28 animate-pulse rounded-lg bg-zinc-200" /></td>
    <td className="px-5 py-4"><div className="h-8 w-20 animate-pulse rounded-lg bg-zinc-200" /></td>
  </tr>
);

const UtilisateursList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression');
      console.error(err);
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-100 text-indigo-700">
            <Users size={24} weight="duotone" />
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Utilisateurs</h1>
            <p className="mt-1 text-sm text-zinc-600">Gestion des comptes utilisateurs</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/utilisateurs/create')}
          className="inline-flex items-center gap-2 rounded-xl bg-[#c79457] px-4 py-2 text-sm font-semibold text-white transition duration-300 hover:bg-[#9a6638] active:scale-[0.98]"
        >
          <Plus size={20} weight="bold" />
          Ajouter
        </button>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="relative">
        <MagnifyingGlass size={18} weight="duotone" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Rechercher par nom, email ou role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-[#dfd1c2] bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-950 outline-none transition duration-300 placeholder:text-zinc-400 focus:border-[#c79457] focus:ring-4 focus:ring-[#c79457]/20"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#dfd1c2] bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#dfd1c2] bg-[#f7f0e8]/60">
              <th className="px-5 py-3 font-medium text-zinc-700">Nom</th>
              <th className="px-5 py-3 font-medium text-zinc-700">Email</th>
              <th className="px-5 py-3 font-medium text-zinc-700">Role</th>
              <th className="px-5 py-3 font-medium text-zinc-700">Agence</th>
              <th className="px-5 py-3 font-medium text-zinc-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center text-zinc-500">
                  <Users size={40} weight="duotone" className="mx-auto mb-3 text-zinc-300" />
                  <p className="font-medium">Aucun utilisateur trouve</p>
                  <p className="mt-1 text-xs text-zinc-400">
                    {search ? 'Essayez un autre terme de recherche' : 'Ajoutez votre premier utilisateur'}
                  </p>
                </td>
              </tr>
            ) : (
              <AnimatePresence>
                {filtered.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    className="border-b border-[#dfd1c2]/50 last:border-b-0 transition-colors hover:bg-[#f7f0e8]/40"
                  >
                    <td className="px-5 py-4 font-medium text-zinc-900">{user.name}</td>
                    <td className="px-5 py-4 text-zinc-600">{user.email}</td>
                    <td className="px-5 py-4">{roleBadge(user.role)}</td>
                    <td className="px-5 py-4 text-zinc-600">{user.agence?.nom || '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/utilisateurs/${user.id}/edit`)}
                          className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-100 text-emerald-700 transition hover:bg-emerald-200 active:scale-[0.98]"
                          title="Modifier"
                        >
                          <PencilSimple size={18} weight="bold" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="grid h-9 w-9 place-items-center rounded-lg bg-red-100 text-red-700 transition hover:bg-red-200 active:scale-[0.98]"
                          title="Supprimer"
                        >
                          <Trash size={18} weight="bold" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UtilisateursList;
