import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Buildings,
  EnvelopeSimple,
  Eye,
  EyeSlash,
  Lock,
  MapPin,
  ShieldCheck,
} from '@phosphor-icons/react';
import { isAxiosError } from 'axios';
import { useAuth } from '../../hooks/useAuth';
import DakarLogo from '../../components/common/DakarLogo';
import residenceImage from '../../assets/pierre-chatel-innocenti-gxyeia7Syuk-unsplash.jpg';

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 };

const trustIndicators = [
  {
    icon: ShieldCheck,
    title: 'Sécurisé',
    sub: 'Vos données protégées',
  },
  {
    icon: Buildings,
    title: 'Fiable',
    sub: 'Des milliers de biens gérés',
  },
  {
    icon: MapPin,
    title: 'Basé à Dakar',
    sub: 'Au service de notre communauté',
  },
];

const formStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const formItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } },
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await login({ email, password });
      if (response?.must_change_password) {
        navigate('/changer-mot-de-passe');
      } else {
        const userRole = response?.role || 'agent';
        navigate(userRole === 'locataire' ? '/mon-espace' : '/dashboard');
      }
    } catch (err: unknown) {
      console.error('Erreur de connexion:', err);
      const message =
        isAxiosError<{ message?: string }>(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Identifiants incorrects. Veuillez réessayer.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="grid min-h-[100dvh] font-sans antialiased lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px]">
      {/* ────── Left: Visual ────── */}
      <section className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between">
        <motion.img
          src={residenceImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-bottom"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(59,36,24,0.85)_0%,rgba(59,36,24,0.45)_50%,rgba(20,40,65,0.3)_100%)]" />

        <div className="relative px-10 pt-8 flex justify-start">
          <DakarLogo variant="light" size="2xl" />
        </div>

        <motion.div
          className="relative px-10 pb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="h-[1.5px] w-8 bg-gold" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
              Gestion immobilière au Sénégal
            </p>
          </div>

          <h1 className="max-w-lg text-[2.5rem] font-bold leading-[1.08] tracking-[-0.025em] text-white">
            Simplifiez la gestion
            <br />
            de vos biens{' '}
            <span className="italic text-gold">immobiliers</span>
          </h1>

          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-zinc-300/80">
            Dakar Immobilier vous accompagne dans la gestion de vos bâtiments,
            appartements, locataires et locations. Une solution complète, moderne
            et sécurisée, pensée pour vous.
          </p>
        </motion.div>

        <motion.div
          className="relative flex items-center gap-0 border-t border-white/[0.08] px-10 py-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {trustIndicators.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-center">
                {i > 0 && <span className="mx-4 h-8 w-[1px] bg-white/[0.12] xl:mx-6" />}
                <div className="flex items-center gap-2.5">
                  <Icon size={18} className="shrink-0 text-gold" weight="duotone" />
                  <div>
                    <p className="text-[13px] font-semibold text-white">{item.title}</p>
                    <p className="text-[11px] text-zinc-400">{item.sub}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </section>

      {/* ────── Right: Form ────── */}
      <section className="flex items-center justify-center bg-sand px-4 py-8 sm:px-6">
        <motion.div
          className="w-full max-w-[400px]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.1 }}
        >
          <div className="rounded-[1.5rem] border border-sand-border bg-white p-7 shadow-[0_24px_60px_-24px_rgba(59,36,24,0.12)] sm:p-8">
            {/* Mobile logo */}
            <div className="mb-6 lg:hidden">
              <DakarLogo variant="dark" size="md" />
            </div>

            <div className="mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                Connexion
              </p>
              <h2 className="mt-3 text-[1.65rem] font-bold tracking-[-0.025em] text-brand">
                Accéder à votre espace
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                Connectez-vous pour gérer vos biens, consulter vos dossiers et suivre
                vos activités.
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-5"
              variants={formStagger}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={formItem}>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <EnvelopeSimple size={18} />
                  </span>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm text-zinc-950 outline-none transition-all duration-300 placeholder:text-zinc-400 focus:border-gold focus:ring-4 focus:ring-gold/10"
                  />
                </div>
              </motion.div>

              <motion.div variants={formItem}>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Mot de passe
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-11 text-sm text-zinc-950 outline-none transition-all duration-300 placeholder:text-zinc-400 focus:border-gold focus:ring-4 focus:ring-gold/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-700"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-end">
                  <span
                    className="cursor-pointer text-xs font-medium text-gold transition-colors hover:text-sienna"
                    onClick={() => setError('Veuillez contacter votre administrateur pour réinitialiser votre mot de passe.')}
                  >
                    Mot de passe oublié ?
                  </span>
                </div>
              </motion.div>

              <motion.button
                variants={formItem}
                type="submit"
                disabled={isLoading}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-sm font-semibold text-brand shadow-[0_8px_20px_-8px_rgba(199,148,87,0.35)] transition-all duration-300 hover:bg-gold-light hover:-translate-y-[1px] hover:shadow-[0_12px_28px_-8px_rgba(199,148,87,0.5)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Connexion en cours...
                  </div>
                ) : (
                  <>
                    Se connecter
                    <ArrowRight
                      size={16}
                      weight="bold"
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </motion.button>
            </motion.form>

            <div className="mt-6 border-t border-sand-border pt-5 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-brand"
              >
                <ArrowLeft size={14} weight="bold" />
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
};

export default Login;
