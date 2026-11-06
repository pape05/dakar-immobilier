import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  Buildings,
  CalendarBlank,
  CaretRight,
  ChartBar,
  CurrencyCircleDollar,
  Export,
  HouseLine,
  TrendUp,
  Warning,
} from '@phosphor-icons/react';
import api from '../../services/api';

interface RevenuMensuel {
  mois: string;
  mois_court: string;
  annee: number;
  montant: number;
}

interface RevenusData {
  revenus: RevenuMensuel[];
  total_encaisse: number;
  total_attendu: number;
  taux_recouvrement: number;
}

interface BatimentOccupation {
  id: number;
  nom: string;
  total: number;
  occupes: number;
  libres: number;
  taux: number;
}

interface OccupationData {
  batiments: BatimentOccupation[];
  total_appartements: number;
  total_occupes: number;
  taux_global: number;
}

interface Impaye {
  locataire_nom: string;
  locataire_telephone: string;
  appartement: string;
  batiment: string;
  montant: number;
  jours_retard: number;
  mois_concerne: string;
}

interface ImpayesData {
  impayes: Impaye[];
  total_impayes: number;
  nombre_impayes: number;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } },
};

const PERIODES = [
  { label: '3 mois', value: 3 },
  { label: '6 mois', value: 6 },
  { label: '12 mois', value: 12 },
];

const formatFCFA = (value: number) =>
  new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';

const formatShort = (value: number) => {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
  if (value >= 1_000) return (value / 1_000).toFixed(0) + 'K';
  return value.toString();
};

const Rapports = () => {
  const [periode, setPeriode] = useState(6);
  const [revenus, setRevenus] = useState<RevenusData | null>(null);
  const [occupation, setOccupation] = useState<OccupationData | null>(null);
  const [impayes, setImpayes] = useState<ImpayesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'revenus' | 'occupation' | 'impayes'>('revenus');

  const fetchData = (mois: number) => {
    setIsLoading(true);
    Promise.all([
      api.get(`/rapports/revenus?mois=${mois}`),
      api.get('/rapports/occupation'),
      api.get('/rapports/impayes'),
    ])
      .then(([revRes, occRes, impRes]) => {
        setRevenus(revRes.data);
        setOccupation(occRes.data);
        setImpayes(impRes.data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData(periode);
  }, [periode]);

  const handleExport = async (type: string) => {
    try {
      const response = await api.get(`/rapports/export?type=${type}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rapport_${type}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur export:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-[#dfd1c2]" />
        <div className="h-6 w-72 animate-pulse rounded-lg bg-[#dfd1c2]" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl border border-[#dfd1c2] bg-white/60" />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-2xl border border-[#dfd1c2] bg-white/60" />
      </div>
    );
  }

  const maxRevenu = revenus
    ? Math.max(...revenus.revenus.map((r) => r.montant), 1)
    : 1;

  const tabs = [
    { key: 'revenus' as const, label: 'Revenus', icon: CurrencyCircleDollar },
    { key: 'occupation' as const, label: 'Occupation', icon: HouseLine },
    { key: 'impayes' as const, label: 'Impayés', icon: Warning },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.header variants={item} className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c79457]">
            Rapports
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
            Rapports & Statistiques
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Analysez vos revenus, votre taux d'occupation et les impayés.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-[#dfd1c2] bg-white p-1">
            {PERIODES.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriode(p.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  periode === p.value
                    ? 'bg-[#3b2418] text-white'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Summary Cards */}
      <motion.section variants={item} className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#dfd1c2] bg-white p-5">
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium text-zinc-500">Total encaissé</p>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-100 text-emerald-700">
              <CurrencyCircleDollar size={20} weight="duotone" />
            </span>
          </div>
          <p className="mt-3 font-mono text-2xl font-bold tracking-tight text-zinc-900">
            {formatFCFA(revenus?.total_encaisse ?? 0)}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
              <TrendUp size={13} weight="bold" />
              {revenus?.taux_recouvrement ?? 0}%
            </span>
            <span className="text-[11px] text-zinc-400">taux de recouvrement</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#dfd1c2] bg-white p-5">
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium text-zinc-500">Taux d'occupation</p>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#c79457]/15 text-[#c79457]">
              <Buildings size={20} weight="duotone" />
            </span>
          </div>
          <p className="mt-3 font-mono text-2xl font-bold tracking-tight text-zinc-900">
            {occupation?.taux_global ?? 0}%
          </p>
          <p className="mt-2 text-[11px] text-zinc-400">
            {occupation?.total_occupes ?? 0} occupés sur {occupation?.total_appartements ?? 0} appartements
          </p>
        </div>

        <div className="rounded-2xl border border-[#dfd1c2] bg-white p-5">
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium text-zinc-500">Impayés ce mois</p>
            <span className={`grid h-10 w-10 place-items-center rounded-full ${
              (impayes?.nombre_impayes ?? 0) > 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'
            }`}>
              <Warning size={20} weight="duotone" />
            </span>
          </div>
          <p className="mt-3 font-mono text-2xl font-bold tracking-tight text-zinc-900">
            {formatFCFA(impayes?.total_impayes ?? 0)}
          </p>
          <p className="mt-2 text-[11px] text-zinc-400">
            {impayes?.nombre_impayes ?? 0} locataire{(impayes?.nombre_impayes ?? 0) > 1 ? 's' : ''} en retard
          </p>
        </div>
      </motion.section>

      {/* Tabs */}
      <motion.div variants={item} className="flex gap-1 rounded-xl border border-[#dfd1c2] bg-white p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                activeTab === tab.key
                  ? 'bg-[#3b2418] text-white'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Icon size={16} weight="duotone" />
              {tab.label}
            </button>
          );
        })}
        <div className="ml-auto flex items-center">
          <button
            onClick={() => handleExport(activeTab)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-[#c79457] transition hover:bg-[#c79457]/10"
          >
            <Export size={15} weight="bold" />
            Exporter CSV
          </button>
        </div>
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'revenus' && revenus && (
        <motion.section variants={item} className="space-y-6">
          <div className="rounded-2xl border border-[#dfd1c2] bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-zinc-900">
                  Évolution des revenus
                </h2>
                <p className="mt-1 text-xs text-zinc-400">
                  Encaissements mensuels sur les {periode} derniers mois
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <CalendarBlank size={14} weight="duotone" />
                {periode} derniers mois
              </div>
            </div>
            <div className="mt-8 flex items-end gap-1">
              <div className="flex h-64 flex-col justify-between pr-3 text-right">
                {Array.from({ length: 6 }).map((_, i) => {
                  const val = maxRevenu - (i * maxRevenu) / 5;
                  return (
                    <span key={i} className="text-[10px] text-zinc-400">
                      {formatShort(Math.round(val))}
                    </span>
                  );
                })}
              </div>
              <div className="flex flex-1 items-end justify-between gap-2">
                {revenus.revenus.map((r, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-[9px] font-medium text-zinc-500">
                      {formatShort(r.montant)}
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(r.montant / maxRevenu) * 240}px` }}
                      transition={{ type: 'spring', stiffness: 80, damping: 18, delay: i * 0.05 }}
                      className="w-full max-w-[48px] rounded-t-lg bg-[#c79457] transition-colors hover:bg-[#b8843e]"
                    />
                    <span className="text-[9px] text-zinc-500">{r.mois_court}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#dfd1c2] bg-white p-6">
            <h2 className="text-base font-semibold tracking-tight text-zinc-900">
              Détail par mois
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#dfd1c2]/60">
                    <th className="pb-3 pr-4 text-xs font-medium text-zinc-400">Mois</th>
                    <th className="pb-3 pr-4 text-right text-xs font-medium text-zinc-400">Montant encaissé</th>
                    <th className="pb-3 text-xs font-medium text-zinc-400">Progression</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dfd1c2]/40">
                  {revenus.revenus.map((r, i) => {
                    const prev = i > 0 ? revenus.revenus[i - 1].montant : 0;
                    const progression = prev > 0 ? ((r.montant - prev) / prev) * 100 : 0;
                    return (
                      <tr key={i}>
                        <td className="py-3 pr-4 font-medium text-zinc-900">{r.mois}</td>
                        <td className="py-3 pr-4 text-right font-mono text-zinc-700">
                          {formatFCFA(r.montant)}
                        </td>
                        <td className="py-3">
                          {i > 0 && prev > 0 ? (
                            <span className={`text-xs font-semibold ${progression >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {progression >= 0 ? '+' : ''}{progression.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-xs text-zinc-300">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>
      )}

      {activeTab === 'occupation' && occupation && (
        <motion.section variants={item} className="space-y-6">
          <div className="rounded-2xl border border-[#dfd1c2] bg-white p-6">
            <h2 className="text-base font-semibold tracking-tight text-zinc-900">
              Occupation par bâtiment
            </h2>
            <p className="mt-1 text-xs text-zinc-400">
              Taux d'occupation de chaque bâtiment
            </p>
            <div className="mt-6 space-y-4">
              {occupation.batiments.map((bat) => (
                <div key={bat.id}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#c79457]/10 text-[#c79457]">
                        <Buildings size={15} weight="duotone" />
                      </span>
                      <span className="font-medium text-zinc-900">{bat.nom}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-zinc-500">
                        {bat.occupes}/{bat.total} occupés
                      </span>
                      <span className="font-mono font-semibold text-zinc-900">{bat.taux}%</span>
                    </div>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#f7f0e8]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bat.taux}%` }}
                      transition={{ type: 'spring', stiffness: 60, damping: 20, delay: 0.1 }}
                      className={`h-full rounded-full ${
                        bat.taux >= 80 ? 'bg-emerald-500' : bat.taux >= 50 ? 'bg-[#c79457]' : 'bg-red-400'
                      }`}
                    />
                  </div>
                </div>
              ))}
              {occupation.batiments.length === 0 && (
                <p className="py-8 text-center text-sm text-zinc-400">Aucun bâtiment enregistré</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#dfd1c2] bg-white p-6">
            <h2 className="text-base font-semibold tracking-tight text-zinc-900">
              Détail des bâtiments
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#dfd1c2]/60">
                    <th className="pb-3 pr-4 text-xs font-medium text-zinc-400">Bâtiment</th>
                    <th className="pb-3 pr-4 text-center text-xs font-medium text-zinc-400">Total</th>
                    <th className="pb-3 pr-4 text-center text-xs font-medium text-zinc-400">Occupés</th>
                    <th className="pb-3 pr-4 text-center text-xs font-medium text-zinc-400">Libres</th>
                    <th className="pb-3 text-right text-xs font-medium text-zinc-400">Taux</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dfd1c2]/40">
                  {occupation.batiments.map((bat) => (
                    <tr key={bat.id}>
                      <td className="py-3 pr-4 font-medium text-zinc-900">{bat.nom}</td>
                      <td className="py-3 pr-4 text-center font-mono text-zinc-700">{bat.total}</td>
                      <td className="py-3 pr-4 text-center font-mono text-emerald-600">{bat.occupes}</td>
                      <td className="py-3 pr-4 text-center font-mono text-red-500">{bat.libres}</td>
                      <td className="py-3 text-right">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          bat.taux >= 80 ? 'bg-emerald-100 text-emerald-700'
                            : bat.taux >= 50 ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {bat.taux}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>
      )}

      {activeTab === 'impayes' && impayes && (
        <motion.section variants={item} className="space-y-6">
          {impayes.impayes.length === 0 ? (
            <div className="rounded-2xl border border-[#dfd1c2] bg-white p-12 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-600">
                <ChartBar size={28} weight="duotone" />
              </span>
              <h3 className="mt-4 font-semibold text-zinc-900">Aucun impayé</h3>
              <p className="mt-2 text-sm text-zinc-500">
                Tous les loyers du mois en cours ont été réglés.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#dfd1c2] bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold tracking-tight text-zinc-900">
                    Loyers impayés — {impayes.impayes[0]?.mois_concerne}
                  </h2>
                  <p className="mt-1 text-xs text-zinc-400">
                    {impayes.nombre_impayes} impayé{impayes.nombre_impayes > 1 ? 's' : ''} pour un total de {formatFCFA(impayes.total_impayes)}
                  </p>
                </div>
                <button
                  onClick={() => handleExport('impayes')}
                  className="flex items-center gap-1.5 rounded-xl border border-[#dfd1c2] px-3 py-2 text-xs font-medium text-zinc-600 transition hover:border-[#c79457]/40 hover:text-[#c79457]"
                >
                  <ArrowDown size={14} weight="bold" />
                  Exporter
                </button>
              </div>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#dfd1c2]/60">
                      <th className="pb-3 pr-4 text-xs font-medium text-zinc-400">Locataire</th>
                      <th className="pb-3 pr-4 text-xs font-medium text-zinc-400">Téléphone</th>
                      <th className="pb-3 pr-4 text-xs font-medium text-zinc-400">Bien</th>
                      <th className="pb-3 pr-4 text-right text-xs font-medium text-zinc-400">Montant dû</th>
                      <th className="pb-3 text-right text-xs font-medium text-zinc-400">Retard</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#dfd1c2]/40">
                    {impayes.impayes.map((imp, i) => (
                      <tr key={i}>
                        <td className="py-3.5 pr-4 font-medium text-zinc-900">{imp.locataire_nom}</td>
                        <td className="py-3.5 pr-4 text-zinc-500">{imp.locataire_telephone || '—'}</td>
                        <td className="py-3.5 pr-4">
                          <span className="text-zinc-700">{imp.appartement}</span>
                          <span className="ml-1 text-zinc-400">· {imp.batiment}</span>
                        </td>
                        <td className="py-3.5 pr-4 text-right font-mono font-semibold text-zinc-900">
                          {formatFCFA(imp.montant)}
                        </td>
                        <td className="py-3.5 text-right">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            imp.jours_retard > 15 ? 'bg-red-100 text-red-700'
                              : imp.jours_retard > 5 ? 'bg-amber-100 text-amber-700'
                              : 'bg-zinc-100 text-zinc-600'
                          }`}>
                            {imp.jours_retard > 0 ? `${imp.jours_retard}j` : 'En cours'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.section>
      )}
    </motion.div>
  );
};

export default Rapports;
