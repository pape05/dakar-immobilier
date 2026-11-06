import { Link } from 'react-router-dom';
import { HouseLine, ArrowLeft } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 };

const NotFound = () => {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-sand px-4 font-sans antialiased">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
      >
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-gold/15">
          <HouseLine size={40} className="text-gold" weight="duotone" />
        </span>

        <h1 className="mt-8 text-6xl font-bold tracking-tight text-brand">404</h1>
        <p className="mt-3 text-lg font-semibold text-brand">Page introuvable</p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-3 text-sm font-semibold text-brand shadow-[0_8px_20px_-8px_rgba(199,148,87,0.35)] transition-all duration-300 hover:bg-gold-light hover:-translate-y-[1px] active:scale-[0.98]"
          >
            <ArrowLeft size={16} weight="bold" />
            Retour à l'accueil
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-sand-border bg-white px-5 py-3 text-sm font-semibold text-brand transition-all duration-300 hover:border-gold/30 hover:-translate-y-[1px] active:scale-[0.98]"
          >
            Se connecter
          </Link>
        </div>
      </motion.div>
    </main>
  );
};

export default NotFound;
