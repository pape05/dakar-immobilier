import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Buildings,
  CalendarBlank,
  CaretRight,
  ChartLineUp,
  DotsThreeVertical,
  HouseLine,
  MapPin,
  UserCircleGear,
  UsersThree,
  Bell,
} from '@phosphor-icons/react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

interface DashboardStats {
  total_batiments: number;
  total_appartements: number;
  appartements_occupes: number;
  appartements_libres: number;
  locations_actives: number;
  paiements_mois_encours: number;
}

interface RevenuMensuel {
  mois: string;
  montant: number;
}

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface AgenceRow {
  id: number;
  nom: string;
  adresse: string;
  users_count?: number;
  batiments_count?: number;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } },
};

const formatMontant = (val: number) => {
  if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + 'M';
  if (val >= 1_000) return (val / 1_000).toFixed(0) + 'K';
  return String(val);
};

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  administrateur: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  agent: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  locataire: { bg: 'bg-zinc-100', text: 'text-zinc-600' },
};

const formatFCFA = (value: number) => {
  return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
};

const DashboardAdmin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenusMensuels, setRevenusMensuels] = useState<RevenuMensuel[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [agences, setAgences] = useState<AgenceRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard'),
      api.get('/users').catch(() => ({ data: [] })),
      api.get('/agences').catch(() => ({ data: [] })),
    ]).then(([dashRes, usersRes, agencesRes]) => {
      setStats(dashRes.data.stats);
      setRevenusMensuels(dashRes.data.revenus_mensuels || []);
      setUsers(usersRes.data);
      setAgences(agencesRes.data);
    }).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-[#dfd1c2]" />
        <div className="h-6 w-72 animate-pulse rounded-lg bg-[#dfd1c2]" />
        <div className="grid gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl border border-[#dfd1c2] bg-white/60" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="h-80 animate-pulse rounded-2xl border border-[#dfd1c2] bg-white/60" />
          <div className="h-80 animate-pulse rounded-2xl border border-[#dfd1c2] bg-white/60" />
        </div>
      </div>
    );
  }

  const adminCount = users.filter((u) => u.role === 'administrateur').length;
  const agentCount = users.filter((u) => u.role === 'agent').length;
  const locataireCount = users.filter((u) => u.role === 'locataire').length;
  const totalUsers = users.length;

  const statCards = [
    {
      label: 'Utilisateurs',
      value: totalUsers,
      iconBg: 'bg-[#c79457]/15',
      iconColor: 'text-[#c79457]',
      icon: UsersThree,
    },
    {
      label: 'Agences',
      value: agences.length,
      iconBg: 'bg-[#c79457]/15',
      iconColor: 'text-[#c79457]',
      icon: Buildings,
    },
    {
      label: 'Bâtiments',
      value: stats?.total_batiments ?? 0,
      iconBg: 'bg-[#c79457]/15',
      iconColor: 'text-[#c79457]',
      icon: HouseLine,
    },
    {
      label: 'Appartements',
      value: stats?.total_appartements ?? 0,
      iconBg: 'bg-[#c79457]/15',
      iconColor: 'text-[#c79457]',
      icon: HouseLine,
    },
    {
      label: 'Encaissements du mois',
      value: formatFCFA(stats?.paiements_mois_encours ?? 0),
      iconBg: 'bg-[#c79457]/15',
      iconColor: 'text-[#c79457]',
      icon: ChartLineUp,
    },
  ];

  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.header variants={item} className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
            Bonjour, {user?.name?.split(' ')[0]}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Voici un aperçu de l'activité de votre plateforme.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/alertes')}
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-[#dfd1c2] bg-white transition hover:border-[#c79457]/40 active:scale-[0.96]"
          >
            <Bell size={18} weight="duotone" className="text-zinc-600" />
          </button>
          <div className="hidden items-end text-right sm:flex sm:flex-col">
            <div className="flex items-center gap-2">
              <CalendarBlank size={15} weight="duotone" className="text-zinc-400" />
              <span className="text-sm font-medium text-zinc-700">{capitalizedDate}</span>
            </div>
            <div className="mt-0.5 flex items-center gap-1">
              <MapPin size={12} weight="bold" className="text-[#c79457]" />
              <span className="text-xs text-zinc-400">Dakar, Sénégal</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Stat Cards */}
      <motion.section variants={item} className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-[#dfd1c2] bg-white p-5 transition duration-300 hover:border-[#c79457]/30 hover:shadow-[0_8px_24px_-12px_rgba(199,148,87,0.15)]"
            >
              <div className="flex items-start justify-between">
                <p className="text-xs font-medium text-zinc-500">{card.label}</p>
                <span className={`grid h-10 w-10 place-items-center rounded-full ${card.iconBg} ${card.iconColor}`}>
                  <Icon size={20} weight="duotone" />
                </span>
              </div>
              <div className="mt-3">
                <span className="font-mono text-2xl font-bold tracking-tight text-zinc-900">
                  {card.value}
                </span>
              </div>
            </div>
          );
        })}
      </motion.section>

      {/* Charts Row */}
      <motion.section variants={item} className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Bar Chart */}
        <div className="rounded-2xl border border-[#dfd1c2] bg-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-zinc-900">Revenus mensuels</h2>
              <p className="mt-1 text-xs text-zinc-400">
                Évolution des encaissements sur les 6 derniers mois
              </p>
            </div>
            <span className="flex items-center gap-1.5 rounded-lg border border-[#dfd1c2] px-3 py-1.5 text-xs font-medium text-zinc-600">
              6 derniers mois
              <CaretRight size={10} weight="bold" className="rotate-90 text-zinc-400" />
            </span>
          </div>
          {(() => {
            const maxRevenue = Math.max(...revenusMensuels.map((r) => Number(r.montant)), 1);
            const steps = 5;
            const yLabels = Array.from({ length: steps + 1 }, (_, i) =>
              maxRevenue - (maxRevenue / steps) * i
            );
            return (
              <div className="mt-8 flex items-end gap-1">
                <div className="flex h-52 flex-col justify-between pr-3 text-right">
                  {yLabels.map((v, i) => (
                    <span key={i} className="text-[10px] text-zinc-400">{formatMontant(v)}</span>
                  ))}
                </div>
                <div className="flex flex-1 items-end justify-between gap-3">
                  {revenusMensuels.map((rev, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(Number(rev.montant) / maxRevenue) * 200}px` }}
                        transition={{ type: 'spring', stiffness: 80, damping: 18, delay: i * 0.08 }}
                        className="w-full max-w-[44px] rounded-t-lg bg-[#c79457] transition-colors hover:bg-[#b8843e]"
                      />
                      <span className="text-[10px] text-zinc-500">{rev.mois}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Donut Chart */}
        <div className="rounded-2xl border border-[#dfd1c2] bg-white p-6">
          <h2 className="text-base font-semibold tracking-tight text-zinc-900">Répartition des utilisateurs</h2>
          <div className="mt-8 flex items-center gap-8">
            <DonutChart admin={adminCount} agents={agentCount} locataires={locataireCount} total={totalUsers} />
            <div className="flex flex-col gap-5">
              {[
                { label: 'Administrateurs', count: adminCount, color: 'bg-indigo-500', dotColor: '#6366f1' },
                { label: 'Agents', count: agentCount, color: 'bg-emerald-500', dotColor: '#10b981' },
                { label: 'Locataires', count: locataireCount, color: 'bg-zinc-400', dotColor: '#9ca3af' },
              ].map((r) => {
                const pct = totalUsers > 0 ? ((r.count / totalUsers) * 100).toFixed(1) : '0.0';
                return (
                  <div key={r.label} className="flex items-center gap-3">
                    <span className={`h-3 w-3 shrink-0 rounded-full ${r.color}`} />
                    <div className="flex items-baseline gap-3">
                      <span className="text-sm text-zinc-600">{r.label}</span>
                      <span className="font-mono text-sm font-semibold text-zinc-900">{r.count}</span>
                      <span className="text-xs text-zinc-400">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Tables Row */}
      <motion.section variants={item} className="grid gap-6 lg:grid-cols-2">
        {/* Users Table */}
        <div className="rounded-2xl border border-[#dfd1c2] bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-tight text-zinc-900">Utilisateurs récents</h2>
            <button
              onClick={() => navigate('/utilisateurs')}
              className="flex items-center gap-1 text-sm font-medium text-[#c79457] transition hover:text-[#9a6638]"
            >
              Voir tout <ArrowIcon />
            </button>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#dfd1c2]/60">
                  <th className="pb-3 pr-4 text-xs font-medium text-zinc-400">Nom</th>
                  <th className="pb-3 pr-4 text-xs font-medium text-zinc-400">Email</th>
                  <th className="pb-3 pr-4 text-xs font-medium text-zinc-400">Rôle</th>
                  <th className="pb-3 text-xs font-medium text-zinc-400">Date d'inscription</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dfd1c2]/40">
                {users.slice(0, 5).map((u) => {
                  const roleStyle = ROLE_COLORS[u.role] || ROLE_COLORS.locataire;
                  const initials = u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <tr key={u.id}>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#c79457]/15 text-[11px] font-bold text-[#c79457]">
                            {initials}
                          </span>
                          <span className="font-medium text-zinc-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 text-zinc-500">{u.email}</td>
                      <td className="py-3.5 pr-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${roleStyle.bg} ${roleStyle.text}`}>
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </span>
                      </td>
                      <td className="py-3.5 text-zinc-500">
                        {new Date(u.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {users.length === 0 && (
              <p className="py-8 text-center text-sm text-zinc-400">Aucun utilisateur enregistré</p>
            )}
          </div>
        </div>

        {/* Agences Table */}
        <div className="rounded-2xl border border-[#dfd1c2] bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-tight text-zinc-900">Agences</h2>
            <button
              onClick={() => navigate('/agences')}
              className="flex items-center gap-1 text-sm font-medium text-[#c79457] transition hover:text-[#9a6638]"
            >
              Voir tout <ArrowIcon />
            </button>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#dfd1c2]/60">
                  <th className="pb-3 pr-4 text-xs font-medium text-zinc-400">Nom</th>
                  <th className="pb-3 pr-4 text-xs font-medium text-zinc-400">Adresse</th>
                  <th className="pb-3 pr-4 text-xs font-medium text-zinc-400">Agents</th>
                  <th className="pb-3 pr-4 text-xs font-medium text-zinc-400">Bâtiments</th>
                  <th className="w-8 pb-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dfd1c2]/40">
                {agences.slice(0, 5).map((a) => (
                  <tr key={a.id}>
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#c79457]/10 text-[#c79457]">
                          <Buildings size={15} weight="duotone" />
                        </span>
                        <span className="font-medium text-zinc-900">{a.nom}</span>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 text-zinc-500 max-w-[180px] truncate">{a.adresse}</td>
                    <td className="py-3.5 pr-4 font-mono text-zinc-700">{a.users_count ?? '-'}</td>
                    <td className="py-3.5 pr-4 font-mono text-zinc-700">{a.batiments_count ?? '-'}</td>
                    <td className="py-3.5">
                      <button
                        onClick={() => navigate(`/agences/${a.id}/edit`)}
                        className="grid h-7 w-7 place-items-center rounded-lg text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
                      >
                        <DotsThreeVertical size={16} weight="bold" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {agences.length === 0 && (
              <p className="py-8 text-center text-sm text-zinc-400">Aucune agence enregistrée</p>
            )}
          </div>
        </div>
      </motion.section>

      {/* Actions rapides */}
      <motion.section variants={item}>
        <h2 className="mb-4 text-base font-semibold tracking-tight text-zinc-900">Actions rapides</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <button
            onClick={() => navigate('/utilisateurs')}
            className="group flex items-center gap-5 rounded-2xl border border-[#dfd1c2] bg-white p-5 text-left transition duration-300 hover:border-[#c79457]/40 hover:shadow-[0_12px_28px_-12px_rgba(199,148,87,0.2)] active:scale-[0.98]"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#c79457]/10 text-[#c79457] transition group-hover:scale-110">
              <UserCircleGear size={24} weight="duotone" />
            </span>
            <div className="flex-1">
              <h3 className="font-semibold tracking-tight text-zinc-900">Gérer les utilisateurs</h3>
              <p className="mt-0.5 text-sm text-zinc-500">Ajouter, modifier ou supprimer des utilisateurs</p>
            </div>
            <CaretRight size={18} weight="bold" className="text-zinc-300 transition group-hover:translate-x-1 group-hover:text-[#c79457]" />
          </button>

          <button
            onClick={() => navigate('/agences')}
            className="group flex items-center gap-5 rounded-2xl border border-[#dfd1c2] bg-white p-5 text-left transition duration-300 hover:border-[#c79457]/40 hover:shadow-[0_12px_28px_-12px_rgba(199,148,87,0.2)] active:scale-[0.98]"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#c79457]/10 text-[#c79457] transition group-hover:scale-110">
              <Buildings size={24} weight="duotone" />
            </span>
            <div className="flex-1">
              <h3 className="font-semibold tracking-tight text-zinc-900">Gérer les agences</h3>
              <p className="mt-0.5 text-sm text-zinc-500">Gérer les agences et leurs informations</p>
            </div>
            <CaretRight size={18} weight="bold" className="text-zinc-300 transition group-hover:translate-x-1 group-hover:text-[#c79457]" />
          </button>
        </div>
      </motion.section>
    </motion.div>
  );
};

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="ml-0.5">
    <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DonutChart = ({ admin, agents, locataires, total }: { admin: number; agents: number; locataires: number; total: number }) => {
  const radius = 70;
  const stroke = 24;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    { count: admin, color: '#6366f1' },
    { count: agents, color: '#10b981' },
    { count: locataires, color: '#9ca3af' },
  ];

  let offset = 0;

  return (
    <svg width="160" height="160" viewBox="0 0 200 200" className="shrink-0">
      <circle cx="100" cy="100" r={radius} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
      {segments.map((seg, i) => {
        const pct = total > 0 ? seg.count / total : 0;
        const dash = pct * circumference;
        const gap = circumference - dash;
        const rotation = total > 0 ? (offset / total) * 360 : 0;
        offset += seg.count;

        return (
          <motion.circle
            key={i}
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={circumference * 0.25}
            transform={`rotate(${rotation} 100 100)`}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${dash} ${gap}` }}
            transition={{ duration: 1, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
          />
        );
      })}
      <text x="100" y="92" textAnchor="middle" className="fill-zinc-400" fontSize="12" fontWeight="500">
        Total
      </text>
      <text x="100" y="118" textAnchor="middle" className="fill-zinc-900" fontSize="32" fontWeight="700" fontFamily="monospace">
        {total}
      </text>
    </svg>
  );
};

export default DashboardAdmin;
