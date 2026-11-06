import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bell,
  Buildings,
  CalendarBlank,
  CaretRight,
  CheckCircle,
  CurrencyCircleDollar,
  FileText,
  HouseLine,
  MapPin,
  TrendUp,
  UserPlus,
  UsersThree,
  WarningCircle,
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

interface PaiementEnAttente {
  locataire: string;
  appartement: string;
  montant: number;
  retard: number;
}

interface BatimentOccupation {
  name: string;
  occupied: number;
  total: number;
}

interface ActiviteRecente {
  type: string;
  text: string;
  date: string;
}

interface DashboardData {
  stats: DashboardStats;
  revenus_mensuels: RevenuMensuel[];
  paiements_en_attente: PaiementEnAttente[];
  batiments_occupation: BatimentOccupation[];
  activite_recente: ActiviteRecente[];
  paiements_recus_mois: number;
  echeances_proches: number;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 100, damping: 20 },
  },
};

const tableRow = {
  hidden: { opacity: 0, x: -8 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 120, damping: 20 },
  },
};

const ACTIVITY_ICONS: Record<
  string,
  { icon: typeof CheckCircle; bg: string; color: string }
> = {
  paiement: {
    icon: CheckCircle,
    bg: 'bg-emerald-100',
    color: 'text-emerald-600',
  },
  contrat: {
    icon: FileText,
    bg: 'bg-[#c79457]/15',
    color: 'text-[#c79457]',
  },
  locataire: {
    icon: UserPlus,
    bg: 'bg-indigo-100',
    color: 'text-indigo-600',
  },
};

const formatFCFA = (value: number) =>
  new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';

const DashboardAgent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get('/dashboard')
      .then((res) => {
        setData(res.data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-10">
        <div className="space-y-3">
          <div
            className="h-6 w-28 animate-pulse rounded-full bg-[#dfd1c2]/50"
            style={{ animationDelay: '0ms' }}
          />
          <div
            className="h-10 w-80 animate-pulse rounded-xl bg-[#dfd1c2]/50"
            style={{ animationDelay: '60ms' }}
          />
          <div
            className="h-4 w-96 animate-pulse rounded-lg bg-[#dfd1c2]/30"
            style={{ animationDelay: '120ms' }}
          />
        </div>
        <div className="grid gap-5 grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[156px] animate-pulse rounded-2xl border border-[#dfd1c2]/40 bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)]"
              style={{ animationDelay: `${180 + i * 80}ms` }}
            />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div
            className="h-[380px] animate-pulse rounded-2xl border border-[#dfd1c2]/40 bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)]"
            style={{ animationDelay: '500ms' }}
          />
          <div
            className="h-[380px] animate-pulse rounded-2xl border border-[#dfd1c2]/40 bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)]"
            style={{ animationDelay: '580ms' }}
          />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const {
    stats,
    revenus_mensuels,
    paiements_en_attente,
    batiments_occupation,
    activite_recente,
    echeances_proches,
  } = data as DashboardData;

  const occupancyRate =
    stats.total_appartements > 0
      ? Math.round(
          (stats.appartements_occupes / stats.total_appartements) * 100,
        )
      : 0;
  const freeRate = 100 - occupancyRate;

  const statCards = [
    {
      label: 'Bâtiments',
      value: stats.total_batiments,
      sub: `${stats.appartements_occupes} occupés · ${stats.appartements_libres} libres`,
      trend: '+0%',
      iconBg: 'bg-[#c79457]/12',
      iconColor: 'text-[#c79457]',
      icon: Buildings,
    },
    {
      label: 'Locations actives',
      value: stats.locations_actives,
      sub: 'en cours',
      trend: '+12%',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      icon: FileText,
    },
    {
      label: 'Paiements du mois',
      value: formatFCFA(stats.paiements_mois_encours),
      sub: 'reçus ce mois-ci',
      trend: '+18%',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      icon: CurrencyCircleDollar,
    },
    {
      label: 'Échéances proches',
      value: echeances_proches,
      sub: 'Contrats expirant sous 30j',
      trend: `+${echeances_proches > 0 ? echeances_proches : 0}`,
      trendWarn: true,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      icon: WarningCircle,
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

  const maxRevenu = Math.max(...revenus_mensuels.map((r) => r.montant), 1);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10"
    >
      {/* Header */}
      <motion.header
        variants={item}
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Espace Agent
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-[2.5rem] md:leading-tight">
            Bonjour, {user?.name?.split(' ')[0]}
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 max-w-[420px]">
            Voici un aper&ccedil;u de votre activit&eacute; immobili&egrave;re aujourd'hui.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative grid h-10 w-10 place-items-center rounded-xl border border-[#dfd1c2] bg-white transition-all duration-200 hover:border-[#c79457]/40 hover:shadow-[0_4px_12px_-4px_rgba(199,148,87,0.15)] active:scale-[0.96]">
            <Bell size={18} weight="duotone" className="text-zinc-600" />
            {paiements_en_attente.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 12,
                  delay: 0.4,
                }}
                className="absolute -right-0.5 -top-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-[#f7f0e8]"
              >
                {paiements_en_attente.length}
              </motion.span>
            )}
          </button>
          <div className="hidden items-end text-right sm:flex sm:flex-col">
            <div className="flex items-center gap-2">
              <CalendarBlank
                size={15}
                weight="duotone"
                className="text-zinc-400"
              />
              <span className="text-sm font-medium text-zinc-700">
                {capitalizedDate}
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-1">
              <MapPin
                size={12}
                weight="bold"
                className="text-[#c79457]"
              />
              <span className="text-xs text-zinc-400">
                Dakar, S&eacute;n&eacute;gal
              </span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Stat Cards */}
      <motion.section
        variants={item}
        className="grid gap-5 grid-cols-2 xl:grid-cols-4"
      >
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 18,
                delay: 0.15 + index * 0.07,
              }}
              className="group rounded-2xl border border-[#dfd1c2]/70 bg-white p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-[#c79457]/30 hover:shadow-[0_12px_32px_-12px_rgba(199,148,87,0.12)] active:scale-[0.98]"
            >
              <div className="flex items-start justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  {card.label}
                </p>
                <span
                  className={`grid h-11 w-11 place-items-center rounded-full ${card.iconBg} ${card.iconColor} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={22} weight="duotone" />
                </span>
              </div>
              <div className="mt-4">
                <span className="font-mono text-[1.75rem] font-bold leading-none tracking-tight text-zinc-900">
                  {card.value}
                </span>
              </div>
              {card.sub && (
                <p className="mt-1.5 text-[11px] text-zinc-400">
                  {card.sub}
                </p>
              )}
              <div className="mt-3 flex items-center gap-1.5">
                <span
                  className={`flex items-center gap-0.5 text-xs font-bold ${
                    card.trendWarn ? 'text-amber-600' : 'text-emerald-600'
                  }`}
                >
                  <TrendUp size={13} weight="bold" />
                  {card.trend}
                </span>
                <span className="text-[10px] text-zinc-400">
                  par rapport au mois dernier
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.section>

      {/* Charts Row */}
      <motion.section
        variants={item}
        className="grid gap-6 lg:grid-cols-[1.6fr_1fr]"
      >
        {/* Line Chart */}
        <div className="rounded-2xl border border-[#dfd1c2]/70 bg-white p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)]">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold tracking-tight text-zinc-900">
                Encaissements mensuels
              </h2>
              <p className="mt-1 text-xs text-zinc-400">
                Montant des paiements re&ccedil;us sur les 6 derniers mois
              </p>
            </div>
            <span className="flex items-center gap-1.5 rounded-lg border border-[#dfd1c2]/80 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-[#c79457]/30">
              6 derniers mois
              <CaretRight
                size={10}
                weight="bold"
                className="rotate-90 text-zinc-400"
              />
            </span>
          </div>
          {revenus_mensuels.length > 0 ? (
            <div className="mt-6">
              <SmoothChart data={revenus_mensuels} max={maxRevenu} />
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-center py-10 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#f7f0e8]">
                <CurrencyCircleDollar
                  size={28}
                  weight="duotone"
                  className="text-[#c79457]"
                />
              </div>
              <p className="mt-3 text-sm font-medium text-zinc-500">
                Aucune donn&eacute;e disponible
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                Les encaissements appara&icirc;tront ici d&egrave;s le premier paiement.
              </p>
            </div>
          )}
        </div>

        {/* Occupation */}
        <div className="rounded-2xl border border-[#dfd1c2]/70 bg-white p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)]">
          <h2 className="text-base font-bold tracking-tight text-zinc-900">
            Taux de recouvrement par statut
          </h2>

          {stats.total_appartements > 0 && (
            <>
              <div className="mt-5 flex h-9 overflow-hidden rounded-xl">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${occupancyRate}%` }}
                  transition={{
                    type: 'spring',
                    stiffness: 50,
                    damping: 20,
                    delay: 0.3,
                  }}
                  className="flex items-center justify-center bg-[#c79457] text-xs font-bold text-white"
                >
                  {occupancyRate}%
                </motion.div>
                {freeRate > 0 && (
                  <div
                    className="flex items-center justify-center bg-[#f7f0e8] text-xs font-semibold text-zinc-500"
                    style={{ width: `${freeRate}%` }}
                  >
                    {freeRate}%
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center gap-5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#c79457]" />
                  <span className="text-xs text-zinc-500">
                    Occup&eacute;s
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#dfd1c2]" />
                  <span className="text-xs text-zinc-500">Libres</span>
                </div>
              </div>
            </>
          )}

          {batiments_occupation.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between border-b border-[#dfd1c2]/50 pb-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  B&acirc;timents
                </span>
                <div className="flex items-center gap-8">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Total unit&eacute;s
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    Taux d'occupation
                  </span>
                </div>
              </div>
              <div className="mt-3.5 space-y-3">
                {batiments_occupation.slice(0, 5).map((b, i) => {
                  const pct =
                    b.total > 0
                      ? Math.round((b.occupied / b.total) * 100)
                      : 0;
                  return (
                    <motion.div
                      key={b.name}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 100,
                        damping: 18,
                        delay: 0.3 + i * 0.06,
                      }}
                      className="flex items-center gap-3"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#c79457]/10 text-[#c79457]">
                        <Buildings size={15} weight="duotone" />
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-800">
                        {b.name}
                      </span>
                      <span className="w-12 text-center font-mono text-sm font-semibold text-zinc-600">
                        {b.total}
                      </span>
                      <div className="flex w-[120px] items-center gap-2.5">
                        <div className="flex-1">
                          <div className="h-2.5 overflow-hidden rounded-full bg-[#f7f0e8]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{
                                type: 'spring',
                                stiffness: 50,
                                damping: 20,
                                delay: 0.4 + i * 0.08,
                              }}
                              className={`h-full rounded-full ${
                                pct >= 80
                                  ? 'bg-emerald-500'
                                  : pct >= 50
                                    ? 'bg-[#c79457]'
                                    : 'bg-red-400'
                              }`}
                            />
                          </div>
                        </div>
                        <span className="w-9 text-right font-mono text-xs font-bold text-zinc-700">
                          {pct}%
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {batiments_occupation.length === 0 && (
            <div className="mt-8 flex flex-col items-center py-6 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f7f0e8]">
                <Buildings
                  size={24}
                  weight="duotone"
                  className="text-[#c79457]"
                />
              </div>
              <p className="mt-3 text-sm font-medium text-zinc-500">
                Aucun b&acirc;timent enregistr&eacute;
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                Ajoutez votre premier b&acirc;timent pour voir les statistiques.
              </p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Tables Row */}
      <motion.section
        variants={item}
        className="grid gap-6 lg:grid-cols-2"
      >
        {/* Paiements en attente */}
        <div className="rounded-2xl border border-[#dfd1c2]/70 bg-white p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold tracking-tight text-zinc-900">
              Paiements en attente
            </h2>
            <button
              onClick={() => navigate('/paiements')}
              className="flex items-center gap-1 text-sm font-semibold text-[#c79457] transition-all duration-200 hover:text-[#9a6638] hover:gap-2 active:scale-[0.96]"
            >
              Voir tous <ArrowIcon />
            </button>
          </div>
          {paiements_en_attente.length > 0 ? (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#dfd1c2]/50">
                    <th className="pb-3 pr-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      Locataire
                    </th>
                    <th className="pb-3 pr-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      Appartement
                    </th>
                    <th className="pb-3 pr-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      Montant FCFA
                    </th>
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                      Retard en jours
                    </th>
                  </tr>
                </thead>
                <motion.tbody
                  variants={{
                    show: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
                  }}
                  initial="hidden"
                  animate="show"
                  className="divide-y divide-[#dfd1c2]/30"
                >
                  {paiements_en_attente.slice(0, 5).map((p, i) => {
                    const initials = p.locataire
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase();
                    return (
                      <motion.tr
                        key={i}
                        variants={tableRow}
                        className="group transition hover:bg-[#f7f0e8]/40"
                      >
                        <td className="py-3.5 pr-3">
                          <div className="flex items-center gap-2.5">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#c79457]/12 text-[10px] font-bold text-[#c79457]">
                              {initials}
                            </span>
                            <span className="font-medium text-zinc-800">
                              {p.locataire}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 pr-3 text-zinc-500">
                          {p.appartement}
                        </td>
                        <td className="py-3.5 pr-3 font-mono font-semibold text-zinc-700">
                          {Number(p.montant).toLocaleString('fr-FR')}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`inline-flex items-center justify-center rounded-lg px-2.5 py-0.5 font-mono text-xs font-bold ${
                              p.retard >= 10
                                ? 'bg-red-50 text-red-600'
                                : p.retard >= 5
                                  ? 'bg-amber-50 text-amber-600'
                                  : 'text-zinc-500'
                            }`}
                          >
                            {p.retard > 0 ? p.retard : '—'}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </motion.tbody>
              </table>
            </div>
          ) : (
            <div className="mt-8 rounded-xl bg-emerald-50/80 p-6 text-center">
              <CheckCircle
                size={28}
                weight="duotone"
                className="mx-auto text-emerald-600"
              />
              <p className="mt-2.5 text-sm font-semibold text-emerald-700">
                Tous les paiements sont &agrave; jour
              </p>
              <p className="mt-1 text-xs text-emerald-600/70">
                Aucun retard de paiement ce mois-ci.
              </p>
            </div>
          )}
        </div>

        {/* Activite recente */}
        <div className="rounded-2xl border border-[#dfd1c2]/70 bg-white p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)]">
          <h2 className="text-base font-bold tracking-tight text-zinc-900">
            Activit&eacute; r&eacute;cente
          </h2>
          {activite_recente.length > 0 ? (
            <div className="mt-5 space-y-1">
              {activite_recente.slice(0, 5).map((event, i) => {
                const config =
                  ACTIVITY_ICONS[event.type] || ACTIVITY_ICONS.paiement;
                const Icon = config.icon;
                const parts = event.text.split(' — ');
                const title =
                  event.type === 'paiement'
                    ? 'Paiement reçu'
                    : event.type === 'contrat'
                      ? 'Contrat signé'
                      : 'Nouveau locataire';
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      type: 'spring',
                      stiffness: 100,
                      damping: 18,
                      delay: 0.2 + i * 0.06,
                    }}
                    className="group flex items-start gap-3 rounded-xl px-2 py-3 transition hover:bg-[#f7f0e8]/40"
                  >
                    <span
                      className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full ${config.bg} ${config.color} transition-transform duration-200 group-hover:scale-105`}
                    >
                      <Icon size={17} weight="fill" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-zinc-800">
                        {title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-zinc-500">
                        {parts.length > 1
                          ? parts.slice(1).join(' — ')
                          : event.text}
                      </p>
                    </div>
                    <span className="shrink-0 pt-0.5 text-[11px] font-medium text-zinc-400">
                      {formatRelativeDate(event.date)}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center py-6 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f7f0e8]">
                <Bell
                  size={24}
                  weight="duotone"
                  className="text-[#c79457]"
                />
              </div>
              <p className="mt-3 text-sm font-medium text-zinc-500">
                Aucune activit&eacute; r&eacute;cente
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                Les nouvelles activit&eacute;s appara&icirc;tront ici.
              </p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Actions rapides */}
      <motion.section variants={item}>
        <h2 className="mb-5 text-base font-bold tracking-tight text-zinc-900">
          Actions rapides
        </h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: 'Enregistrer un paiement',
              sub: 'Encaissez un loyer ou un autre paiement',
              to: '/paiements/create',
              icon: CurrencyCircleDollar,
              iconBg: 'bg-emerald-50',
              iconColor: 'text-emerald-600',
            },
            {
              label: 'Ajouter un locataire',
              sub: 'Créer un nouveau dossier locataire',
              to: '/locataires/create',
              icon: UsersThree,
              iconBg: 'bg-emerald-50',
              iconColor: 'text-emerald-600',
            },
            {
              label: 'Créer un contrat',
              sub: 'Générer un contrat de location',
              to: '/locations/create',
              icon: FileText,
              iconBg: 'bg-[#c79457]/12',
              iconColor: 'text-[#c79457]',
            },
            {
              label: 'Gérer les appartements',
              sub: 'Voir et modifier les appartements',
              to: '/appartements',
              icon: HouseLine,
              iconBg: 'bg-[#c79457]/12',
              iconColor: 'text-[#c79457]',
            },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => navigate(action.to)}
                className="group flex items-center gap-4 rounded-2xl border border-[#dfd1c2]/70 bg-white p-5 text-left shadow-[0_2px_12px_-4px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-[#c79457]/30 hover:shadow-[0_12px_32px_-12px_rgba(199,148,87,0.12)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                <span
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${action.iconBg} ${action.iconColor} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon size={24} weight="duotone" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold tracking-tight text-zinc-800">
                    {action.label}
                  </h3>
                  <p className="mt-0.5 text-xs text-zinc-500 truncate">
                    {action.sub}
                  </p>
                </div>
                <CaretRight
                  size={16}
                  weight="bold"
                  className="shrink-0 text-zinc-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#c79457]"
                />
              </button>
            );
          })}
        </div>
      </motion.section>
    </motion.div>
  );
};

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="ml-0.5">
    <path
      d="M5.25 3.5L8.75 7L5.25 10.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function catmullRomSpline(
  points: { x: number; y: number }[],
  tension = 0.35,
): string {
  if (points.length < 2) return '';

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return path;
}

const SmoothChart = ({
  data,
  max,
}: {
  data: RevenuMensuel[];
  max: number;
}) => {
  const width = 620;
  const height = 220;
  const padX = 52;
  const padY = 20;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const adjustedMax = max * 1.2;

  const points = data.map((d, i) => ({
    x: padX + (i / Math.max(data.length - 1, 1)) * chartW,
    y: padY + chartH - (d.montant / adjustedMax) * chartH,
  }));

  const linePath = catmullRomSpline(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padY + chartH} L ${points[0].x} ${padY + chartH} Z`;

  const ySteps = 5;
  const yLabels = Array.from(
    { length: ySteps },
    (_, i) => adjustedMax - (i * adjustedMax) / (ySteps - 1),
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height + 30}`}
      className="w-full h-auto"
    >
      <defs>
        <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c79457" stopOpacity="0.20" />
          <stop offset="60%" stopColor="#c79457" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#c79457" stopOpacity="0.01" />
        </linearGradient>
        <filter id="dotShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="1"
            stdDeviation="2"
            floodColor="#c79457"
            floodOpacity="0.2"
          />
        </filter>
      </defs>

      {yLabels.map((v) => {
        const y = padY + chartH - (v / adjustedMax) * chartH;
        return (
          <g key={v}>
            <text
              x={padX - 10}
              y={y + 4}
              textAnchor="end"
              className="fill-zinc-400"
              fontSize="10"
              fontFamily="monospace"
            >
              {formatMontant(v)}
            </text>
            <line
              x1={padX}
              y1={y}
              x2={width - padX}
              y2={y}
              stroke="#dfd1c2"
              strokeWidth="0.6"
              strokeDasharray="3 3"
            />
          </g>
        );
      })}

      <path d={areaPath} fill="url(#chartAreaGrad)" />

      <motion.path
        d={linePath}
        fill="none"
        stroke="#c79457"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {points.map((p, i) => (
        <g key={i} filter="url(#dotShadow)">
          <circle
            cx={p.x}
            cy={p.y}
            r="5.5"
            fill="white"
            stroke="#c79457"
            strokeWidth="2.5"
          />
          <text
            x={p.x}
            y={p.y - 14}
            textAnchor="middle"
            className="fill-zinc-700"
            fontSize="10"
            fontWeight="600"
            fontFamily="monospace"
          >
            {formatMontant(data[i].montant)}
          </text>
        </g>
      ))}

      {data.map((d, i) => (
        <text
          key={i}
          x={padX + (i / Math.max(data.length - 1, 1)) * chartW}
          y={height + 22}
          textAnchor="middle"
          className="fill-zinc-500"
          fontSize="10"
        >
          {d.mois}
        </text>
      ))}
    </svg>
  );
};

function formatMontant(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
  return val.toString();
}

function formatRelativeDate(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffD = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffH < 1) return "a l'instant";
  if (diffH < 24) return `il y a ${diffH}h`;
  if (diffD === 1) return 'hier';
  if (diffD < 7) return `il y a ${diffD}j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default DashboardAgent;
