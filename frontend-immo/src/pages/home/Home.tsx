import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Bathtub,
  Bed,
  Buildings,
  CheckCircle,
  CurrencyCircleDollar,
  FacebookLogo,
  FileText,
  Globe,
  Headset,
  HouseLine,
  InstagramLogo,
  LinkedinLogo,
  List,
  Lock,
  MapPin,
  Quotes,
  Ruler,
  ShieldCheck,
  Timer,
  TwitterLogo,
  UsersThree,
  X,
} from '@phosphor-icons/react';
import heroImage from '../../assets/hero-landing.png';
import dashboardImage from '../../assets/dashboard-preview.png';
import propertyImg1 from '../../assets/deborah-cortelazzi-gREquCUXQLI-unsplash.jpg';
import propertyImg2 from '../../assets/francesca-tosolini-tHkJAMcO3QE-unsplash.jpg';
import propertyImg3 from '../../assets/patrick-perkins-3wylDrjxH-E-unsplash.jpg';
import propertyImg4 from '../../assets/clay-banks-y8j0gmhtS-4-unsplash.jpg';
import DakarLogo from '../../components/common/DakarLogo';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const navLinks = [
  { label: 'Accueil', href: '#' },
  { label: 'Fonctionnalités', href: '#fonctionnalites' },
  { label: 'Biens', href: '#biens' },
  { label: 'À propos', href: '#apropos' },
];

const features = [
  {
    title: 'Gestion des biens',
    description: 'Centralisez vos biens, appartements et locaux dans une interface unique.',
    icon: HouseLine,
  },
  {
    title: 'Suivi des locataires',
    description: 'Gardez une vue complète sur vos locataires et leurs contrats.',
    icon: UsersThree,
  },
  {
    title: 'Gestion des loyers',
    description: 'Suivez les paiements, détectez les impayés et automatisez vos rappels.',
    icon: CurrencyCircleDollar,
  },
  {
    title: 'Contrats & documents',
    description: 'Stockez et gérez tous vos contrats en toute sécurité.',
    icon: FileText,
  },
];

const properties = [
  {
    image: propertyImg1,
    badge: 'À louer',
    badgeVariant: 'brand' as const,
    price: '1 200 000 FCFA / mois',
    location: 'Almadies, Dakar',
    beds: 3,
    baths: 3,
    area: 150,
  },
  {
    image: propertyImg2,
    badge: 'À vendre',
    badgeVariant: 'gold' as const,
    price: '550 000 000 FCFA',
    location: 'Ngor, Dakar',
    beds: 4,
    baths: 4,
    area: 300,
  },
  {
    image: propertyImg3,
    badge: 'À louer',
    badgeVariant: 'brand' as const,
    price: '850 000 FCFA / mois',
    location: 'Mermoz, Dakar',
    beds: 2,
    baths: 2,
    area: 100,
  },
  {
    image: propertyImg4,
    badge: 'À vendre',
    badgeVariant: 'gold' as const,
    price: '45 000 000 FCFA',
    location: 'Saly, Mbour',
    area: 500,
    terrain: true,
  },
];

const steps = [
  {
    number: '01',
    title: 'Ajoutez vos biens',
    description: 'Créez et paramétrez vos appartements, villas ou locaux.',
    icon: HouseLine,
  },
  {
    number: '02',
    title: 'Enregistrez vos locataires',
    description: 'Conservez leurs informations et leurs contrats.',
    icon: UsersThree,
  },
  {
    number: '03',
    title: 'Suivez les loyers',
    description: 'Encaissez, suivez les paiements et gérez les impayés.',
    icon: CurrencyCircleDollar,
  },
  {
    number: '04',
    title: 'Gérez vos documents',
    description: 'Stockez vos contrats et pièces en toute sécurité.',
    icon: FileText,
  },
];

const benefits = [
  {
    title: 'Gain de temps',
    description: 'Automatisez vos tâches administratives.',
    icon: Timer,
  },
  {
    title: 'Sécurité des données',
    description: 'Vos informations sont protégées et toujours accessibles.',
    icon: Lock,
  },
  {
    title: 'Accès partout',
    description: 'Utilisez la plateforme sur tous vos appareils.',
    icon: Globe,
  },
  {
    title: 'Support dédié',
    description: 'Une équipe à votre écoute au Sénégal et à l\'international.',
    icon: Headset,
  },
];

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 };

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: spring },
};

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) =>
    suffix === '%' ? v.toFixed(0) : Math.round(v).toString(),
  );
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2.4,
      ease: [0.16, 1, 0.3, 1],
    });
    const unsubscribe = rounded.on('change', (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, count, rounded]);

  return (
    <span className="font-mono text-3xl font-bold tracking-tight text-brand">
      {display}
      {suffix}
    </span>
  );
}

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { ref: featuresRef, inView: featuresInView } = useScrollReveal();
  const { ref: dashRef, inView: dashInView } = useScrollReveal();
  const { ref: propertiesRef, inView: propertiesInView } = useScrollReveal();
  const { ref: stepsRef, inView: stepsInView } = useScrollReveal();
  const { ref: benefitsRef, inView: benefitsInView } = useScrollReveal();
  const { ref: testimonialRef, inView: testimonialInView } = useScrollReveal();
  const { ref: ctaRef, inView: ctaInView } = useScrollReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="min-h-[100dvh] bg-white text-zinc-950 font-sans antialiased">
      {/* ────── Navbar ────── */}
      <nav
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-700 ${
          scrolled
            ? 'bg-brand/[0.97] shadow-[0_4px_30px_rgba(59,36,24,0.18)] backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <DakarLogo variant="light" size="xl" />

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative text-sm font-medium text-white/70 transition-colors duration-300 hover:text-white after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden text-sm font-medium text-white/80 transition-colors duration-300 hover:text-white sm:inline"
            >
              Se connecter
            </Link>
            <Link
              to="/login"
              className="hidden items-center gap-2 rounded-xl bg-gold px-4 py-2.5 text-sm font-semibold text-brand shadow-[0_8px_20px_-8px_rgba(199,148,87,0.4)] transition-all duration-300 hover:bg-gold-light hover:-translate-y-[1px] hover:shadow-[0_12px_28px_-8px_rgba(199,148,87,0.55)] active:scale-[0.98] sm:inline-flex"
            >
              Commencer
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid h-10 w-10 place-items-center rounded-xl text-white transition-transform duration-200 active:scale-[0.92] md:hidden"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-white/10 bg-brand/[0.97] px-4 pb-6 pt-4 backdrop-blur-xl md:hidden"
          >
            <div className="grid gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="mt-4 grid gap-2">
              <Link
                to="/login"
                className="rounded-xl bg-gold px-4 py-3 text-center text-sm font-semibold text-brand transition-all active:scale-[0.98]"
              >
                Commencer
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-white/15 px-4 py-3 text-center text-sm font-medium text-white transition-all active:scale-[0.98]"
              >
                Se connecter
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ────── Hero ────── */}
      <section className="relative isolate overflow-hidden min-h-[100dvh]">
        <motion.img
          src={heroImage}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[58%_center]"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(59,36,24,0.97)_0%,rgba(59,36,24,0.92)_35%,rgba(59,36,24,0.30)_100%)]" />

        <div className="mx-auto flex min-h-[100dvh] max-w-7xl flex-col justify-center px-4 pt-28 pb-16 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.15 }}
          >
            <motion.div
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/[0.08] px-4 py-2 text-[13px] font-medium text-cream shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ShieldCheck size={15} weight="fill" className="text-gold" />
              Solution complète pour agences et administrateurs immobiliers
            </motion.div>

            <h1 className="text-[2.5rem] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.5rem]">
              Gérez votre patrimoine
              <br />
              immobilier en toute
              <br />
              <span className="text-gold italic">sérénité.</span>
            </h1>

            <motion.p
              className="mt-7 max-w-[52ch] text-[15px] leading-relaxed text-zinc-300/85"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.35 }}
            >
              Dakar Immobilier est la solution SaaS qui simplifie la gestion de vos biens,
              de vos locataires et de vos revenus, pensée pour les professionnels
              de l'immobilier au Sénégal.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-col gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.5 }}
            >
              <Link
                to="/login"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3.5 text-sm font-semibold text-brand shadow-[0_14px_32px_-10px_rgba(199,148,87,0.45)] transition-all duration-300 hover:bg-gold-light hover:-translate-y-[2px] hover:shadow-[0_18px_40px_-8px_rgba(199,148,87,0.6)] active:scale-[0.97]"
              >
                Découvrir la plateforme
                <ArrowRight
                  size={18}
                  weight="bold"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <a
                href="#fonctionnalites"
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.1] hover:border-white/25 hover:-translate-y-[1px] active:scale-[0.98]"
              >
                Nos fonctionnalités
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-auto flex flex-wrap gap-8 pt-14"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.65 }}
          >
            {[
              {
                icon: Buildings,
                title: 'Plus de 200 biens gérés',
                sub: 'par nos clients au Sénégal',
              },
              {
                icon: MapPin,
                title: 'Dakar & alentours',
                sub: 'toutes les zones',
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.title} className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                    <Icon size={20} className="text-gold" weight="duotone" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{stat.title}</p>
                    <p className="text-xs text-zinc-400">{stat.sub}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ────── Features ────── */}
      <section id="fonctionnalites" className="bg-sand px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sienna">
              Nos fonctionnalités
            </p>
            <h2 className="mt-4 text-[1.85rem] font-bold tracking-[-0.025em] text-brand sm:text-3xl md:text-4xl">
              Tout ce dont vous avez besoin,
              <br />
              <span className="text-sienna italic">au même endroit.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-[55ch] text-[15px] leading-relaxed text-zinc-600">
              Une gestion centralisée et intuitive pour gagner du temps, réduire les erreurs
              et mieux piloter votre activité.
            </p>
          </div>

          <motion.div
            ref={featuresRef}
            className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            animate={featuresInView ? 'visible' : 'hidden'}
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.article
                  key={feature.title}
                  variants={staggerItem}
                  className="group rounded-[1.25rem] border border-sand-border bg-white p-6 transition-all duration-400 hover:border-gold/30 hover:shadow-[0_20px_40px_-16px_rgba(59,36,24,0.15)] hover:-translate-y-[4px]"
                >
                  <span className="inline-flex rounded-xl bg-sand-mid p-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-gold/15">
                    <Icon size={26} className="text-gold transition-colors duration-300" weight="duotone" />
                  </span>
                  <h3 className="mt-5 font-semibold tracking-tight text-brand">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                    {feature.description}
                  </p>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ────── Dashboard preview ────── */}
      <section className="bg-sand-mid px-4 py-24 sm:px-6 lg:px-8">
        <div
          ref={dashRef}
          className={`reveal-container${dashInView ? ' in-view' : ''} mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center`}
        >
          <div className="scroll-reveal" style={{ transitionDelay: '0ms' }}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sienna">
              Aperçu du logiciel
            </p>
            <h2 className="mt-4 text-[1.85rem] font-bold tracking-[-0.025em] text-brand sm:text-3xl md:text-4xl">
              Un tableau de bord complet{' '}
              <span className="text-sienna italic">
                pour une vision claire de votre activité.
              </span>
            </h2>
            <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-zinc-600">
              Suivez en temps réel vos biens, vos revenus, vos locataires et vos paiements.
              Des indicateurs simples et pertinents pour prendre les bonnes décisions.
            </p>
            <div className="mt-7 grid gap-3">
              {[
                'Statistiques en temps réel',
                'Suivi des loyers et impayés',
                'Gestion des biens et locataires',
                'Rapports et exportation',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <CheckCircle size={18} className="shrink-0 text-gold" weight="fill" />
                  <span className="text-sm text-zinc-700">{item}</span>
                </div>
              ))}
            </div>
            <Link
              to="/login"
              className="group mt-9 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(59,36,24,0.3)] transition-all duration-300 hover:bg-brand-light hover:-translate-y-[1px] hover:shadow-[0_12px_28px_-8px_rgba(59,36,24,0.4)] active:scale-[0.98]"
            >
              Voir plus de fonctionnalités
              <ArrowRight
                size={16}
                weight="bold"
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="scroll-reveal" style={{ transitionDelay: '180ms' }}>
            <div className="group rounded-2xl border border-sand-strong bg-white p-2 shadow-[0_30px_60px_-20px_rgba(59,36,24,0.2)] transition-all duration-500 hover:shadow-[0_36px_70px_-20px_rgba(59,36,24,0.28)] hover:-translate-y-1">
              <img
                src={dashboardImage}
                alt="Tableau de bord Dakar Immobilier"
                className="w-full rounded-xl"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ────── Properties ────── */}
      <section id="biens" className="bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sienna">
                Nos biens
              </p>
              <h2 className="mt-4 text-[1.85rem] font-bold tracking-[-0.025em] text-brand sm:text-3xl md:text-4xl">
                Des biens d'exception,
                <br />
                <span className="text-sienna italic">sélectionnés pour vous.</span>
              </h2>
              <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-zinc-600">
                Découvrez une sélection de biens disponibles à la location ou à la vente
                à Dakar et dans ses environs.
              </p>
            </div>
            <Link
              to="/login"
              className="hidden items-center gap-1.5 text-sm font-semibold text-sienna transition-colors hover:text-brand sm:inline-flex"
            >
              Voir tous les biens
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>

          <motion.div
            ref={propertiesRef}
            className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            animate={propertiesInView ? 'visible' : 'hidden'}
          >
            {properties.map((property, i) => (
              <motion.article
                key={i}
                variants={staggerItem}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand">
                  {property.image ? (
                    <img
                      src={property.image}
                      alt={property.location}
                      className="h-full w-full object-cover transition-transform duration-600 group-hover:scale-[1.06]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sand-mid to-sand-strong transition-transform duration-600 group-hover:scale-[1.06]">
                      <HouseLine size={48} className="text-sienna/30" weight="duotone" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/20 via-transparent to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
                  <div className="absolute left-3 top-3">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold shadow-sm ${
                        property.badgeVariant === 'brand'
                          ? 'bg-brand text-white'
                          : 'bg-gold text-brand'
                      }`}
                    >
                      {property.badge}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="font-semibold tracking-tight text-brand">{property.price}</p>
                  <div className="mt-1.5 flex items-center gap-1 text-sm text-zinc-500">
                    <MapPin size={14} weight="bold" className="text-gold" />
                    {property.location}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                    {!property.terrain && property.beds !== undefined && (
                      <span className="flex items-center gap-1">
                        <Bed size={13} />
                        {property.beds} chambres
                      </span>
                    )}
                    {!property.terrain && property.baths !== undefined && (
                      <span className="flex items-center gap-1">
                        <Bathtub size={13} />
                        {property.baths} sdb
                      </span>
                    )}
                    {property.terrain && (
                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        Terrain
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Ruler size={13} />
                      {property.area} m²
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ────── How it works ────── */}
      <section className="bg-brand px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              Comment ça marche
            </p>
            <h2 className="mt-4 text-[1.85rem] font-bold tracking-[-0.025em] text-white sm:text-3xl md:text-4xl">
              En quelques étapes,
              <br />
              <span className="text-gold italic">votre gestion est simplifiée.</span>
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-zinc-300/75">
              Découvrez comment Dakar Immobilier rend votre gestion immobilière plus simple.
            </p>
          </div>

          <motion.div
            ref={stepsRef}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            animate={stepsInView ? 'visible' : 'hidden'}
          >
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.article
                  key={step.number}
                  variants={staggerItem}
                  className="group relative"
                >
                  {i < steps.length - 1 && (
                    <div className="absolute left-[calc(50%+44px)] top-8 hidden h-[1.5px] w-[calc(100%-88px)] bg-white/[0.08] lg:block">
                      <ArrowRight
                        size={14}
                        weight="bold"
                        className="absolute -right-2 -top-[5.5px] text-gold/40"
                      />
                    </div>
                  )}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <span className="grid h-16 w-16 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-400 group-hover:border-gold/25 group-hover:bg-gold/[0.12] group-hover:shadow-[0_8px_24px_-8px_rgba(199,148,87,0.2)]">
                        <Icon size={28} className="text-gold" weight="duotone" />
                      </span>
                      <span className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-gold text-[11px] font-bold text-brand shadow-[0_4px_12px_-4px_rgba(199,148,87,0.4)]">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="mt-6 font-semibold tracking-tight text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2.5 max-w-[26ch] text-sm leading-relaxed text-zinc-400">
                      {step.description}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ────── Why choose us ────── */}
      <section id="apropos" className="bg-sand px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sienna">
                Pourquoi choisir Dakar Immobilier
              </p>
              <h2 className="mt-4 text-[1.85rem] font-bold tracking-[-0.025em] text-brand sm:text-3xl md:text-4xl">
                Une solution pensée pour{' '}
                <span className="text-sienna italic">votre réussite.</span>
              </h2>
              <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-zinc-600">
                Plus qu'un simple outil, Dakar Immobilier est votre partenaire au quotidien
                pour une gestion immobilière plus efficace, plus organisée et plus rentable.
              </p>
            </div>

            <motion.div
              ref={benefitsRef}
              className="grid gap-7 sm:grid-cols-2"
              variants={staggerContainer}
              initial="hidden"
              animate={benefitsInView ? 'visible' : 'hidden'}
            >
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    variants={staggerItem}
                    className="group flex items-start gap-4"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold/[0.12] transition-all duration-300 group-hover:scale-110 group-hover:bg-gold/20 group-hover:shadow-[0_6px_16px_-6px_rgba(199,148,87,0.25)]">
                      <Icon size={24} className="text-gold" weight="duotone" />
                    </span>
                    <div>
                      <h3 className="font-semibold tracking-tight text-brand">
                        {benefit.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ────── Testimonials ────── */}
      <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div
          ref={testimonialRef}
          className={`reveal-container${testimonialInView ? ' in-view' : ''} mx-auto max-w-7xl`}
        >
          <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="scroll-reveal" style={{ transitionDelay: '0ms' }}>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sienna">
                Ils nous font confiance
              </p>
              <h2 className="mt-4 text-[1.85rem] font-bold tracking-[-0.025em] text-brand sm:text-3xl md:text-4xl">
                Ce que disent nos clients
              </h2>
              <blockquote className="mt-10 border-l-[3px] border-gold pl-6">
                <Quotes size={28} className="mb-4 text-gold/25" weight="fill" />
                <p className="text-lg leading-[1.75] text-zinc-700 italic">
                  "Dakar Immobilier nous a permis de mieux organiser notre parc immobilier.
                  L'interface est intuitive, le suivi des loyers est un vrai plus et le support
                  est toujours réactif."
                </p>
                <footer className="mt-7 flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-cream shadow-[0_4px_12px_-4px_rgba(59,36,24,0.25)]">
                    MF
                  </span>
                  <div>
                    <p className="font-semibold tracking-tight text-brand">Mamadou Fall</p>
                    <p className="text-sm text-zinc-500">Gérant d'agence immobilière</p>
                  </div>
                </footer>
              </blockquote>
            </div>

            <div
              className="scroll-reveal rounded-[1.25rem] border border-sand-border bg-sand p-8"
              style={{ transitionDelay: '180ms' }}
            >
              <p className="font-semibold tracking-tight text-sienna">
                Des agences et propriétaires
                <br />
                qui nous font confiance
              </p>
              <div className="mt-10 grid grid-cols-3 gap-6 text-center">
                {[
                  { value: 200, suffix: '+', label: 'Biens gérés' },
                  { value: 50, suffix: '+', label: 'Agences partenaires' },
                  { value: 98, suffix: '%', label: 'Satisfaction client' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    <p className="mt-2 text-xs text-zinc-500 leading-tight">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────── CTA ────── */}
      <section className="bg-brand px-4 py-16 sm:px-6 lg:px-8">
        <div
          ref={ctaRef}
          className={`reveal-container${ctaInView ? ' in-view' : ''} mx-auto flex max-w-7xl flex-col items-center gap-10 text-center md:flex-row md:justify-between md:text-left`}
        >
          <div className="scroll-reveal" style={{ transitionDelay: '0ms' }}>
            <DakarLogo variant="light" size="md" />
            <h2 className="mt-5 text-[1.65rem] font-bold tracking-[-0.025em] text-white md:text-3xl">
              Prêt à simplifier la gestion de votre patrimoine ?
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-zinc-300/80">
              Rejoignez les professionnels qui nous font déjà confiance.
            </p>
          </div>
          <div
            className="scroll-reveal flex shrink-0 flex-col gap-3 sm:flex-row"
            style={{ transitionDelay: '120ms' }}
          >
            <Link
              to="/login"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3.5 text-sm font-semibold text-brand shadow-[0_12px_28px_-8px_rgba(199,148,87,0.4)] transition-all duration-300 hover:bg-gold-light hover:-translate-y-[2px] hover:shadow-[0_16px_36px_-8px_rgba(199,148,87,0.55)] active:scale-[0.97]"
            >
              Commencer maintenant
              <ArrowRight
                size={16}
                weight="bold"
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href="mailto:contact@dakar-immobilier.sn"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/[0.1] hover:border-white/25 active:scale-[0.98]"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </section>

      {/* ────── Footer ────── */}
      <footer className="bg-zinc-950 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
          <div>
            <DakarLogo variant="light" size="md" />
            <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-400">
              La gestion immobilière, notre métier. Simplifiez le suivi de vos biens,
              locataires et paiements depuis une interface unique.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Navigation</h3>
            <div className="mt-5 grid gap-3 text-sm text-zinc-400">
              <a href="#" className="transition hover:text-white">Accueil</a>
              <a href="#fonctionnalites" className="transition hover:text-white">Fonctionnalités</a>
              <a href="#biens" className="transition hover:text-white">Biens</a>
              <a href="#apropos" className="transition hover:text-white">À propos</a>
              <Link to="/login" className="transition hover:text-white">Connexion</Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Contact</h3>
            <div className="mt-5 grid gap-3 text-sm text-zinc-400">
              <span>Dakar, Sénégal</span>
              <span>contact@dakar-immobilier.sn</span>
              <span>+221 33 842 17 90</span>
            </div>
            <div className="mt-7 flex gap-3">
              {[
                { Icon: LinkedinLogo, href: '#' },
                { Icon: FacebookLogo, href: '#' },
                { Icon: TwitterLogo, href: '#' },
                { Icon: InstagramLogo, href: '#' },
              ].map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.05] text-zinc-400 transition-all duration-300 hover:bg-gold/20 hover:text-gold hover:scale-110"
                  >
                    <Icon size={18} weight="bold" />
                  </a>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-3 border-t border-white/[0.07] pt-7 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Dakar Immobilier. Tous droits réservés.</p>
          <div className="flex gap-5">
            <Link to="/mentions-legales" className="transition hover:text-zinc-300">
              Mentions légales
            </Link>
            <Link to="/politique-confidentialite" className="transition hover:text-zinc-300">
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Home;
