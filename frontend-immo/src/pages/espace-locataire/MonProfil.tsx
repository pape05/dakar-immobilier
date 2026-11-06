import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Phone,
  EnvelopeSimple,
  IdentificationCard,
  MapPin,
  CalendarBlank,
  LockKey,
  Warning,
  ShieldCheck,
  CaretRight,
} from '@phosphor-icons/react';
import { useAuth } from '../../hooks/useAuth';
import { espaceLocataireService } from '../../services/espaceLocataireService';
import type { Locataire } from '../../types';

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 };

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: spring },
};

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-2xl bg-[#ede4da] ${className}`} />
);

const MonProfil = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [locataire, setLocataire] = useState<Locataire | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [residenceName, setResidenceName] = useState('');

  useEffect(() => {
    espaceLocataireService
      .getMonEspace()
      .then((data) => {
        setLocataire(data.locataire);
        if (data.location_active?.appartement?.batiment?.nom) {
          setResidenceName(data.location_active.appartement.batiment.nom);
        }
      })
      .catch(() => setError('Impossible de charger votre profil'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28" />
        <Skeleton className="h-64" />
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

  const initials = `${locataire?.prenom?.[0] || ''}${locataire?.nom?.[0] || ''}`.toUpperCase();

  const fields: { icon: React.ElementType; label: string; value: string; iconBg: string; iconColor: string }[] = [
    { icon: Phone, label: 'Téléphone', value: locataire?.telephone || '-', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { icon: EnvelopeSimple, label: 'Email', value: locataire?.email || user?.email || '-', iconBg: 'bg-sky-50', iconColor: 'text-sky-600' },
    { icon: IdentificationCard, label: "Pièce d'identité", value: locataire?.piece_identite ? `${locataire.piece_identite} ${locataire.numero_piece}` : '-', iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
    {
      icon: CalendarBlank,
      label: 'Date de naissance',
      value: locataire?.date_naissance
        ? new Date(locataire.date_naissance).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
        : '-',
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
    { icon: MapPin, label: 'Adresse', value: locataire?.adresse_actuelle || '-', iconBg: 'bg-rose-50', iconColor: 'text-rose-600' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* ── Profile Header ── */}
      <motion.div
        variants={item}
        className="flex items-center gap-5 rounded-2xl bg-white p-6 shadow-[0_1px_4px_rgba(59,36,24,0.06)] sm:p-8"
      >
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-[#c79457] text-xl font-bold tracking-wide text-white sm:h-20 sm:w-20 sm:text-2xl">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
            {locataire?.prenom} {locataire?.nom}
          </h1>
          <p className="mt-0.5 text-[13px] text-zinc-500">
            Locataire{residenceName ? ` • Résidence ${residenceName}` : ''}
          </p>
        </div>
      </motion.div>

      {/* ── Personal Info ── */}
      <motion.div
        variants={item}
        className="rounded-2xl bg-white p-6 shadow-[0_1px_4px_rgba(59,36,24,0.06)] sm:p-8"
      >
        <h2 className="text-[15px] font-bold text-zinc-900">Informations personnelles</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {fields.map((field, i) => (
            <motion.div
              key={field.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: i * 0.04 }}
              className="flex items-start gap-3 rounded-xl bg-[#faf6f1] p-4"
            >
              <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg ${field.iconBg} ${field.iconColor}`}>
                <field.icon size={16} weight="duotone" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">{field.label}</p>
                <p className="mt-0.5 truncate text-[13px] font-semibold text-zinc-900">{field.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Change Password ── */}
      <motion.div variants={item}>
        <motion.button
          whileHover={{ scale: 1.003 }}
          whileTap={{ scale: 0.997 }}
          onClick={() => navigate('/changer-mot-de-passe')}
          className="flex w-full items-center gap-4 rounded-2xl bg-[#3b2418] px-6 py-5 text-left transition hover:bg-[#52342a]"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-white">
            <LockKey size={18} weight="duotone" />
          </span>
          <div className="flex-1">
            <p className="text-[13px] font-bold text-white">Changer le mot de passe</p>
            <p className="mt-0.5 text-[11px] text-white/60">Mettre à jour votre mot de passe de connexion</p>
          </div>
          <CaretRight size={16} weight="bold" className="text-white/40" />
        </motion.button>
      </motion.div>

      {/* ── Security Note ── */}
      <motion.div
        variants={item}
        className="flex items-start gap-3 rounded-2xl border border-zinc-100 bg-white p-5"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
          <ShieldCheck size={16} weight="duotone" />
        </span>
        <div>
          <p className="text-[13px] font-semibold text-zinc-900">Vos informations sont sécurisées</p>
          <p className="mt-0.5 text-[12px] leading-relaxed text-zinc-500">
            Nous protégeons vos données personnelles avec les plus hauts standards de sécurité.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MonProfil;
