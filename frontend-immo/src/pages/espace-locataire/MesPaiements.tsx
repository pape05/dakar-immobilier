import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyCircleDollar,
  DownloadSimple,
  CalendarBlank,
  Receipt,
  Warning,
  TrendUp,
  CaretDown,
} from '@phosphor-icons/react';
import { espaceLocataireService } from '../../services/espaceLocataireService';
import { paiementService } from '../../services/paiementService';
import type { EspaceLocataireData } from '../../services/espaceLocataireService';

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 };

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: spring },
};

const MODE_LABELS: Record<string, { bg: string; text: string; label: string }> = {
  mobile_money: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Mobile Money' },
  wave: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Wave' },
  orange_money: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Orange Money' },
  especes: { bg: 'bg-zinc-100', text: 'text-zinc-600', label: 'Espèces' },
  virement: { bg: 'bg-sky-50', text: 'text-sky-700', label: 'Virement' },
  cheque: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Chèque' },
};

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-2xl bg-[#ede4da] ${className}`} />
);

const MesPaiements = () => {
  const [data, setData] = useState<EspaceLocataireData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterYear, setFilterYear] = useState<number | null>(null);

  useEffect(() => {
    espaceLocataireService
      .getMonEspace()
      .then(setData)
      .catch(() => setError('Impossible de charger vos paiements'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 py-12"
      >
        <Warning size={36} weight="duotone" className="text-red-400" />
        <p className="mt-4 text-sm font-medium text-red-700">{error}</p>
      </motion.div>
    );
  }

  const paiements = data?.paiements || [];
  const currentYear = new Date().getFullYear();

  const getPaiementYear = (p: { date_paiement: string; created_at?: string; statut?: string }) => {
    if (p.date_paiement) {
      const y = new Date(p.date_paiement).getFullYear();
      if (!isNaN(y) && y > 2000) return y;
    }
    if (p.created_at) {
      const y = new Date(p.created_at).getFullYear();
      if (!isNaN(y) && y > 2000) return y;
    }
    return currentYear;
  };

  const years = [...new Set(paiements.map(getPaiementYear))].sort((a, b) => b - a);
  if (!years.includes(currentYear)) years.unshift(currentYear);
  const activeYear = filterYear || currentYear;

  const filteredPaiements = paiements.filter((p) => getPaiementYear(p) === activeYear);
  const paidPaiements = filteredPaiements.filter((p) => p.statut !== 'en_attente');
  const totalPaidThisYear = paidPaiements.reduce((sum, p) => sum + Number(p.montant), 0);
  const avgPayment = paidPaiements.length > 0 ? totalPaidThisYear / paidPaiements.length : 0;

  const handleDownloadQuittance = async (paiementId: number) => {
    try {
      const blob = await paiementService.getQuittance(paiementId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quittance-${paiementId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      /* silent */
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* ── Header ── */}
      <motion.div variants={item} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">Mes paiements</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Retrouvez l'historique de tous vos paiements et téléchargez vos quittances.
          </p>
        </div>
        {years.length > 0 && (
          <div className="relative">
            <select
              value={activeYear}
              onChange={(e) => setFilterYear(Number(e.target.value))}
              className="appearance-none rounded-xl border border-zinc-200 bg-white py-2 pl-4 pr-9 text-[13px] font-semibold text-zinc-700 shadow-sm transition focus:border-[#c79457] focus:outline-none focus:ring-2 focus:ring-[#c79457]/20"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <CaretDown size={13} weight="bold" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>
        )}
      </motion.div>

      {/* ── Stats ── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div variants={item} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(59,36,24,0.06)]">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <CurrencyCircleDollar size={20} weight="duotone" />
          </span>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Total payé</p>
            <p className="mt-0.5 font-mono text-lg font-bold tracking-tight text-zinc-900">
              {totalPaidThisYear.toLocaleString('fr-FR')} <span className="text-xs font-medium text-zinc-400">FCFA</span>
            </p>
            <p className="text-[11px] text-zinc-400">{filteredPaiements.length} paiements</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(59,36,24,0.06)]">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#f7f0e8] text-[#c79457]">
            <Receipt size={20} weight="duotone" />
          </span>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Nombre de paiements</p>
            <p className="mt-0.5 font-mono text-lg font-bold tracking-tight text-zinc-900">{filteredPaiements.length}</p>
            <p className="text-[11px] text-zinc-400">Sur 12 mois</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(59,36,24,0.06)]">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600">
            <TrendUp size={20} weight="duotone" />
          </span>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Moyenne mensuelle</p>
            <p className="mt-0.5 font-mono text-lg font-bold tracking-tight text-zinc-900">
              {Math.round(avgPayment).toLocaleString('fr-FR')} <span className="text-xs font-medium text-zinc-400">FCFA</span>
            </p>
            <p className="text-[11px] text-zinc-400">Montant moyen</p>
          </div>
        </motion.div>
      </div>

      {/* ── Table ── */}
      <motion.div variants={item} className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_4px_rgba(59,36,24,0.06)]">
        <div className="px-6 pt-6">
          <h2 className="text-[15px] font-bold text-zinc-900">Historique des paiements</h2>
        </div>

        {filteredPaiements.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-b border-zinc-100">
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Mois</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Date de paiement</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Montant</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Mode de paiement</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Quittance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredPaiements.map((p, i) => {
                  const mode = MODE_LABELS[p.mode_paiement] || MODE_LABELS.especes;
                  const isEnAttente = p.statut === 'en_attente';
                  return (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className={`transition hover:bg-[#faf6f1]/60 ${isEnAttente ? 'bg-amber-50/40' : ''}`}
                    >
                      <td className="px-6 py-3.5 text-[13px] font-semibold text-zinc-900">
                        {p.mois_concerne}
                        {isEnAttente && (
                          <span className="ml-2 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                            En attente
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-[13px] text-zinc-500">
                        {p.date_paiement
                          ? new Date(p.date_paiement).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
                          : '—'}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[13px] font-bold text-zinc-900">
                        {Number(p.montant).toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="px-6 py-3.5">
                        {isEnAttente ? (
                          <span className="inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-600">
                            Non payé
                          </span>
                        ) : (
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${mode.bg} ${mode.text}`}>
                            {mode.label}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5">
                        {isEnAttente ? (
                          <span className="text-[11px] text-zinc-400">—</span>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => handleDownloadQuittance(p.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-50 px-3 py-1.5 text-[11px] font-medium text-zinc-600 transition hover:bg-[#f7f0e8] hover:text-[#c79457]"
                          >
                            <DownloadSimple size={13} weight="bold" />
                            Télécharger
                          </motion.button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <CalendarBlank size={40} weight="duotone" className="text-zinc-200" />
            <p className="mt-5 text-sm font-semibold text-zinc-700">Aucun paiement en {activeYear}</p>
            <p className="mt-1.5 max-w-xs text-[12px] text-zinc-400">
              Vos paiements apparaîtront ici une fois effectués.
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MesPaiements;
