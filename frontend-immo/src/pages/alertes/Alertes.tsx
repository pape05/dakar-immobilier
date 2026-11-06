import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Buildings,
  CalendarBlank,
  CheckCircle,
  CurrencyCircleDollar,
  Funnel,
  HouseLine,
  Warning,
  WarningCircle,
} from '@phosphor-icons/react';
import api from '../../services/api';

interface Alerte {
  id: string;
  type: 'loyer_retard' | 'contrat_expiration' | 'occupation_basse' | 'nouveau_paiement';
  priorite: 'haute' | 'moyenne' | 'basse' | 'info';
  titre: string;
  message: string;
  detail: string;
  date: string;
}

interface Compteurs {
  total: number;
  haute: number;
  moyenne: number;
  basse: number;
  info: number;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } },
};

const TYPE_CONFIG = {
  loyer_retard: {
    icon: CurrencyCircleDollar,
    label: 'Loyer impayé',
    color: 'text-red-600',
    bg: 'bg-red-100',
  },
  contrat_expiration: {
    icon: CalendarBlank,
    label: 'Contrat expirant',
    color: 'text-amber-600',
    bg: 'bg-amber-100',
  },
  occupation_basse: {
    icon: HouseLine,
    label: 'Occupation basse',
    color: 'text-orange-600',
    bg: 'bg-orange-100',
  },
  nouveau_paiement: {
    icon: CheckCircle,
    label: 'Paiement reçu',
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
  },
};

const PRIORITE_CONFIG = {
  haute: { label: 'Haute', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  moyenne: { label: 'Moyenne', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  basse: { label: 'Basse', bg: 'bg-zinc-100', text: 'text-zinc-600', dot: 'bg-zinc-400' },
  info: { label: 'Info', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

type Filtre = 'tous' | 'loyer_retard' | 'contrat_expiration' | 'occupation_basse' | 'nouveau_paiement';

const FILTRES: { key: Filtre; label: string }[] = [
  { key: 'tous', label: 'Toutes' },
  { key: 'loyer_retard', label: 'Impayés' },
  { key: 'contrat_expiration', label: 'Contrats' },
  { key: 'occupation_basse', label: 'Occupation' },
  { key: 'nouveau_paiement', label: 'Paiements' },
];

const Alertes = () => {
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [compteurs, setCompteurs] = useState<Compteurs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filtre, setFiltre] = useState<Filtre>('tous');

  useEffect(() => {
    api.get('/alertes')
      .then((res) => {
        setAlertes(res.data.alertes);
        setCompteurs(res.data.compteurs);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const alertesFiltrees = filtre === 'tous'
    ? alertes
    : alertes.filter((a) => a.type === filtre);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-[#dfd1c2]" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl border border-[#dfd1c2] bg-white/60" />
          ))}
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl border border-[#dfd1c2] bg-white/60" />
        ))}
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.header variants={item} className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c79457]">
            Alertes
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
            Notifications & Alertes
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Surveillez les impayés, contrats expirants et taux d'occupation.
          </p>
        </div>
      </motion.header>

      {/* Compteurs */}
      <motion.section variants={item} className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {[
          { label: 'Priorité haute', count: compteurs?.haute ?? 0, config: PRIORITE_CONFIG.haute, icon: WarningCircle },
          { label: 'Priorité moyenne', count: compteurs?.moyenne ?? 0, config: PRIORITE_CONFIG.moyenne, icon: Warning },
          { label: 'Priorité basse', count: compteurs?.basse ?? 0, config: PRIORITE_CONFIG.basse, icon: Bell },
          { label: 'Informations', count: compteurs?.info ?? 0, config: PRIORITE_CONFIG.info, icon: CheckCircle },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="rounded-2xl border border-[#dfd1c2] bg-white p-5 transition duration-300 hover:border-[#c79457]/30 hover:shadow-[0_8px_24px_-12px_rgba(199,148,87,0.15)]"
            >
              <div className="flex items-start justify-between">
                <p className="text-xs font-medium text-zinc-500">{c.label}</p>
                <span className={`grid h-9 w-9 place-items-center rounded-full ${c.config.bg} ${c.config.text}`}>
                  <Icon size={18} weight="duotone" />
                </span>
              </div>
              <p className="mt-3 font-mono text-2xl font-bold tracking-tight text-zinc-900">{c.count}</p>
            </div>
          );
        })}
      </motion.section>

      {/* Filtres */}
      <motion.div variants={item} className="flex flex-wrap items-center gap-3">
        <Funnel size={16} weight="duotone" className="text-zinc-400" />
        <div className="flex gap-1 rounded-xl border border-[#dfd1c2] bg-white p-1">
          {FILTRES.map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltre(f.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filtre === f.key
                  ? 'bg-[#3b2418] text-white'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-zinc-400">
          {alertesFiltrees.length} alerte{alertesFiltrees.length > 1 ? 's' : ''}
        </span>
      </motion.div>

      {/* Liste des alertes */}
      {alertesFiltrees.length === 0 ? (
        <motion.div
          variants={item}
          className="rounded-2xl border border-[#dfd1c2] bg-white p-12 text-center"
        >
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
            <CheckCircle size={28} weight="duotone" />
          </span>
          <h3 className="mt-4 font-semibold text-zinc-900">Aucune alerte</h3>
          <p className="mt-2 text-sm text-zinc-500">
            {filtre === 'tous'
              ? 'Tout est en ordre, aucune alerte à signaler.'
              : 'Aucune alerte dans cette catégorie.'}
          </p>
        </motion.div>
      ) : (
        <motion.section variants={container} initial="hidden" animate="show" className="space-y-3">
          {alertesFiltrees.map((alerte) => {
            const typeConfig = TYPE_CONFIG[alerte.type];
            const prioConfig = PRIORITE_CONFIG[alerte.priorite];
            const Icon = typeConfig.icon;

            return (
              <motion.div
                key={alerte.id}
                variants={item}
                className="group flex items-start gap-4 rounded-2xl border border-[#dfd1c2] bg-white p-5 transition duration-300 hover:border-[#c79457]/30 hover:shadow-[0_8px_24px_-12px_rgba(199,148,87,0.12)]"
              >
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${typeConfig.bg} ${typeConfig.color}`}>
                  <Icon size={20} weight="duotone" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-zinc-900">{alerte.titre}</h3>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${prioConfig.bg} ${prioConfig.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${prioConfig.dot}`} />
                      {prioConfig.label}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-700">{alerte.message}</p>
                  <p className="mt-1 text-xs text-zinc-400">{alerte.detail}</p>
                </div>

                <span className="shrink-0 text-xs text-zinc-400">
                  {new Date(alerte.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </span>
              </motion.div>
            );
          })}
        </motion.section>
      )}
    </motion.div>
  );
};

export default Alertes;
