import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  HouseLine,
  CurrencyCircleDollar,
  CalendarBlank,
  Buildings,
  DownloadSimple,
  CheckCircle,
  CaretRight,
  Warning,
  Wallet,
  Receipt,
  Bell,
  Phone,
} from '@phosphor-icons/react';
import { espaceLocataireService } from '../../services/espaceLocataireService';
import { paiementService } from '../../services/paiementService';
import type { EspaceLocataireData } from '../../services/espaceLocataireService';
import DakarLogo from '../../components/common/DakarLogo';
import residenceImg from '../../assets/residence-dakar.png';

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 };

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
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

const EspaceLocataire = () => {
  const [data, setData] = useState<EspaceLocataireData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    espaceLocataireService
      .getMonEspace()
      .then(setData)
      .catch(() => setError('Impossible de charger vos informations'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDownloadQuittance = async (paiementId: number) => {
    try {
      const blob = await paiementService.getLocataireQuittance(paiementId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quittance-${paiementId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError('Impossible de télécharger la quittance. Veuillez réessayer.');
    }
  };

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-44" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-16" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  /* ── Error ── */
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

  const loc = data?.location_active;
  const loyer = loc ? Number(loc.montant_loyer) : 0;
  const paiements = data?.paiements || [];
  const paiementsEnAttente = paiements.filter((p) => p.statut === 'en_attente');
  const paiementsPayes = paiements.filter((p) => p.statut !== 'en_attente');
  const currentYear = new Date().getFullYear();
  const totalPaid = paiementsPayes
    .filter((p) => new Date(p.date_paiement).getFullYear() === currentYear)
    .reduce((sum, p) => sum + Number(p.montant), 0);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* ═══ Mobile Welcome Hero ═══ */}
      <motion.div
        variants={item}
        className="relative -mx-4 -mt-8 overflow-hidden rounded-b-3xl sm:-mx-8 md:hidden"
      >
        <img
          src={residenceImg}
          alt="Résidence Dakar"
          className="h-[60vh] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-10 text-center">
          <DakarLogo variant="light" size="lg" />
          <h2 className="mt-5 text-xl font-bold tracking-tight text-white">
            Bienvenue sur votre espace locataire
          </h2>
          <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-white/70">
            Gérez facilement vos paiements, suivez vos notifications et consultez les informations de votre contrat.
          </p>
          <span className="mt-4 h-[2px] w-10 rounded-full bg-white/30" />
        </div>
      </motion.div>

      {/* ═══ Welcome Card ═══ */}
      <motion.div
        variants={item}
        className="overflow-hidden rounded-2xl bg-white shadow-[0_1px_4px_rgba(59,36,24,0.06)]"
      >
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Bonjour, {data?.locataire?.prenom}
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            Voici un aperçu de votre situation locative.
          </p>

          {loc ? (
            <div className="mt-4 space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
                <CheckCircle size={13} weight="fill" />
                Contrat actif
              </span>
              <p className="text-[13px] font-medium text-zinc-600">
                {loc.appartement?.batiment?.nom} &bull; Appartement {loc.appartement?.numero}
              </p>
              <p className="text-[12px] text-zinc-400">
                Du {new Date(loc.date_debut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                {loc.date_fin && ` au ${new Date(loc.date_fin).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}`}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-400">Aucun contrat actif pour le moment.</p>
          )}
        </div>
      </motion.div>

      {/* ═══ Metric Tiles ═══ */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div
          variants={item}
          className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(59,36,24,0.06)]"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f7f0e8] text-[#c79457]">
            <Wallet size={20} weight="duotone" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Total payé</p>
            <p className="mt-0.5 font-mono text-xl font-bold tracking-tight text-zinc-900">
              {totalPaid.toLocaleString('fr-FR')} <span className="text-xs font-medium text-zinc-400">FCFA</span>
            </p>
            <p className="text-[11px] text-zinc-400">Depuis le début du contrat</p>
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="relative flex items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(59,36,24,0.06)]"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f7f0e8] text-[#c79457]">
            <Receipt size={20} weight="duotone" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Loyer dû</p>
            <p className="mt-0.5 font-mono text-xl font-bold tracking-tight text-zinc-900">
              {loyer.toLocaleString('fr-FR')} <span className="text-xs font-medium text-zinc-400">FCFA</span>
            </p>
            {paiementsEnAttente.length > 0 && (
              <p className="text-[11px] text-red-500">Échéance proche</p>
            )}
          </div>
          {paiementsEnAttente.length > 0 && (
            <span className="absolute right-4 top-4 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {paiementsEnAttente.length}
            </span>
          )}
        </motion.div>

        <motion.div
          variants={item}
          className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(59,36,24,0.06)]"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f7f0e8] text-[#c79457]">
            <CalendarBlank size={20} weight="duotone" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Nombre de paiements</p>
            <p className="mt-0.5 font-mono text-xl font-bold tracking-tight text-zinc-900">{paiements.length}</p>
            <p className="text-[11px] text-zinc-400">Sur 12 mois</p>
          </div>
        </motion.div>
      </div>

      {/* ═══ Factures en attente ═══ */}
      {paiementsEnAttente.length > 0 && (
        <motion.div
          variants={item}
          className="flex flex-wrap items-center gap-4 rounded-2xl border border-amber-200/60 bg-amber-50/50 px-5 py-4"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-600">
            <Bell size={17} weight="fill" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-zinc-900">Facture en attente</p>
            <p className="text-[12px] text-zinc-500">
              Loyer du mois — {loyer.toLocaleString('fr-FR')} FCFA
            </p>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-zinc-500">
            <Phone size={14} weight="bold" className="text-amber-600" />
            <span>Contactez votre agence pour effectuer le paiement</span>
          </div>
        </motion.div>
      )}

      {/* ═══ Two Columns: Contract + Recent Payments ═══ */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Contract Details ── */}
        <motion.div
          variants={item}
          className="rounded-2xl bg-white p-6 shadow-[0_1px_4px_rgba(59,36,24,0.06)]"
        >
          <h2 className="text-[15px] font-bold text-zinc-900">Détails du contrat</h2>

          {loc ? (
            <div className="mt-5 divide-y divide-zinc-100">
              <DetailRow label="Résidence" value={loc.appartement?.batiment?.nom || '-'} />
              <DetailRow label="Appartement" value={loc.appartement?.numero || '-'} />
              <DetailRow label="Type de contrat" value="Location classique" />
              <DetailRow
                label="Date de début"
                value={new Date(loc.date_debut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
              />
              <DetailRow
                label="Date de fin"
                value={loc.date_fin ? new Date(loc.date_fin).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
              />
              <DetailRow label="Loyer mensuel" value={`${loyer.toLocaleString('fr-FR')} FCFA`} />
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-center py-8 text-center">
              <HouseLine size={36} weight="duotone" className="text-zinc-200" />
              <p className="mt-4 text-sm text-zinc-400">Aucun contrat actif.</p>
            </div>
          )}
        </motion.div>

        {/* ── Recent Payments ── */}
        <motion.div
          variants={item}
          className="rounded-2xl bg-white p-6 shadow-[0_1px_4px_rgba(59,36,24,0.06)]"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-zinc-900">Derniers paiements</h2>
            {paiements.length > 4 && (
              <button
                onClick={() => navigate('/mon-espace/paiements')}
                className="flex items-center gap-1 text-[12px] font-semibold text-[#c79457] transition hover:text-[#8a552f]"
              >
                Voir tout <CaretRight size={11} weight="bold" />
              </button>
            )}
          </div>

          {paiementsPayes.length > 0 ? (
            <div className="mt-5 divide-y divide-zinc-100">
              {paiementsPayes.slice(0, 4).map((p, i) => {
                const mode = MODE_LABELS[p.mode_paiement] || MODE_LABELS.especes;
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: i * 0.04 }}
                    className="group flex items-center gap-3 py-3.5 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-zinc-900">{p.mois_concerne}</p>
                      <p className="text-[11px] text-zinc-400">
                        {new Date(p.date_paiement).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <span className="font-mono text-[13px] font-bold text-zinc-900">
                      {Number(p.montant).toLocaleString('fr-FR')} FCFA
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${mode.bg} ${mode.text}`}>
                      {mode.label}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.12 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDownloadQuittance(p.id)}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-zinc-300 transition hover:bg-[#f7f0e8] hover:text-[#c79457]"
                      title="Télécharger la quittance"
                    >
                      <DownloadSimple size={15} weight="bold" />
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-center py-8 text-center">
              <CurrencyCircleDollar size={36} weight="duotone" className="text-zinc-200" />
              <p className="mt-4 text-sm text-zinc-400">Aucun paiement enregistré.</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
    <span className="text-[13px] text-zinc-500">{label}</span>
    <span className="text-[13px] font-semibold text-zinc-900">{value}</span>
  </div>
);

export default EspaceLocataire;
