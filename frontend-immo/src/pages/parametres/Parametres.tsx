import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Buildings,
  CheckCircle,
  EnvelopeSimple,
  Eye,
  EyeSlash,
  FloppyDisk,
  Lock,
  MapPin,
  Phone,
  User,
} from '@phosphor-icons/react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

interface ProfilData {
  name: string;
  email: string;
}

interface AgenceData {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
}

interface PasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 20 } },
};

const inputClass =
  'w-full rounded-xl border border-[#dfd1c2] bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 outline-none transition-all duration-300 placeholder:text-zinc-400 focus:border-[#c79457] focus:ring-4 focus:ring-[#c79457]/10';

const Parametres = () => {
  const { user: authUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'profil' | 'agence' | 'securite'>('profil');

  const [profil, setProfil] = useState<ProfilData>({ name: '', email: '' });
  const [agence, setAgence] = useState<AgenceData>({ nom: '', adresse: '', telephone: '', email: '' });
  const [hasAgence, setHasAgence] = useState(false);
  const [passwords, setPasswords] = useState<PasswordData>({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [savingProfil, setSavingProfil] = useState(false);
  const [savingAgence, setSavingAgence] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    api.get('/parametres/profil')
      .then((res) => {
        setProfil({ name: res.data.user.name, email: res.data.user.email });
        if (res.data.agence) {
          setAgence({
            nom: res.data.agence.nom,
            adresse: res.data.agence.adresse,
            telephone: res.data.agence.telephone,
            email: res.data.agence.email,
          });
          setHasAgence(true);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const handleSaveProfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfil(true);
    setErrors({});
    try {
      await api.put('/parametres/profil', profil);
      toast.success('Profil mis à jour');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]> } } };
      if (axiosErr.response?.data?.errors) setErrors(axiosErr.response.data.errors);
      else toast.error('Erreur lors de la mise à jour');
    } finally {
      setSavingProfil(false);
    }
  };

  const handleSaveAgence = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAgence(true);
    setErrors({});
    try {
      await api.put('/parametres/agence', agence);
      toast.success('Informations de l\'agence mises à jour');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]> } } };
      if (axiosErr.response?.data?.errors) setErrors(axiosErr.response.data.errors);
      else toast.error('Erreur lors de la mise à jour');
    } finally {
      setSavingAgence(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPassword(true);
    setErrors({});
    try {
      await api.put('/parametres/mot-de-passe', passwords);
      toast.success('Mot de passe modifié avec succès');
      setPasswords({ current_password: '', password: '', password_confirmation: '' });
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]> } } };
      if (axiosErr.response?.data?.errors) setErrors(axiosErr.response.data.errors);
      else toast.error('Erreur lors du changement');
    } finally {
      setSavingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-[#dfd1c2]" />
        <div className="h-6 w-72 animate-pulse rounded-lg bg-[#dfd1c2]" />
        <div className="h-96 animate-pulse rounded-2xl border border-[#dfd1c2] bg-white/60" />
      </div>
    );
  }

  const sections = [
    { key: 'profil' as const, label: 'Mon profil', icon: User },
    { key: 'agence' as const, label: 'Mon agence', icon: Buildings },
    { key: 'securite' as const, label: 'Sécurité', icon: Lock },
  ];

  const initials = authUser?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '';

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.header variants={item}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c79457]">
          Paramètres
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
          Paramètres de la plateforme
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Gérez votre profil, les informations de votre agence et la sécurité de votre compte.
        </p>
      </motion.header>

      <motion.div variants={item} className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <div className="space-y-2">
          {/* User card */}
          <div className="rounded-2xl border border-[#dfd1c2] bg-white p-5 mb-4">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#c79457] text-sm font-bold text-white">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-900">{authUser?.name}</p>
                <p className="truncate text-xs text-zinc-500">{authUser?.email}</p>
                <span className="mt-1 inline-flex rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                  {authUser?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Nav */}
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.key}
                onClick={() => { setActiveSection(s.key); setErrors({}); }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  activeSection === s.key
                    ? 'bg-[#3b2418] text-white'
                    : 'text-zinc-500 hover:bg-[#f7f0e8] hover:text-zinc-900'
                }`}
              >
                <Icon size={18} weight="duotone" />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div>
          {/* Profil */}
          {activeSection === 'profil' && (
            <motion.form
              onSubmit={handleSaveProfil}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              className="rounded-2xl border border-[#dfd1c2] bg-white p-6 sm:p-8"
            >
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Mon profil</h2>
              <p className="mt-1 text-sm text-zinc-500">Modifiez vos informations personnelles.</p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">Nom complet</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      value={profil.name}
                      onChange={(e) => setProfil({ ...profil, name: e.target.value })}
                      className={inputClass}
                      required
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name[0]}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">Adresse e-mail</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                      <EnvelopeSimple size={16} />
                    </span>
                    <input
                      type="email"
                      value={profil.email}
                      onChange={(e) => setProfil({ ...profil, email: e.target.value })}
                      className={inputClass}
                      required
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email[0]}</p>}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfil}
                  className="flex items-center gap-2 rounded-xl bg-[#c79457] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(199,148,87,0.35)] transition-all duration-300 hover:bg-[#b8843e] hover:-translate-y-[1px] active:scale-[0.98] disabled:opacity-50"
                >
                  {savingProfil ? (
                    'Enregistrement...'
                  ) : (
                    <>
                      <FloppyDisk size={16} weight="bold" />
                      Enregistrer
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}

          {/* Agence */}
          {activeSection === 'agence' && (
            <motion.form
              onSubmit={handleSaveAgence}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              className="rounded-2xl border border-[#dfd1c2] bg-white p-6 sm:p-8"
            >
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Mon agence</h2>
              <p className="mt-1 text-sm text-zinc-500">
                {hasAgence
                  ? 'Modifiez les informations de votre agence.'
                  : 'Aucune agence associée à votre compte.'}
              </p>

              {hasAgence ? (
                <>
                  <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700">Nom de l'agence</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                          <Buildings size={16} />
                        </span>
                        <input
                          type="text"
                          value={agence.nom}
                          onChange={(e) => setAgence({ ...agence, nom: e.target.value })}
                          className={inputClass}
                          required
                        />
                      </div>
                      {errors.nom && <p className="mt-1 text-xs text-red-500">{errors.nom[0]}</p>}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700">E-mail de l'agence</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                          <EnvelopeSimple size={16} />
                        </span>
                        <input
                          type="email"
                          value={agence.email}
                          onChange={(e) => setAgence({ ...agence, email: e.target.value })}
                          className={inputClass}
                          required
                        />
                      </div>
                      {errors['email'] && <p className="mt-1 text-xs text-red-500">{errors['email'][0]}</p>}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700">Adresse</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                          <MapPin size={16} />
                        </span>
                        <input
                          type="text"
                          value={agence.adresse}
                          onChange={(e) => setAgence({ ...agence, adresse: e.target.value })}
                          className={inputClass}
                          required
                        />
                      </div>
                      {errors.adresse && <p className="mt-1 text-xs text-red-500">{errors.adresse[0]}</p>}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-zinc-700">Téléphone</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                          <Phone size={16} />
                        </span>
                        <input
                          type="text"
                          value={agence.telephone}
                          onChange={(e) => setAgence({ ...agence, telephone: e.target.value })}
                          className={inputClass}
                          required
                        />
                      </div>
                      {errors.telephone && <p className="mt-1 text-xs text-red-500">{errors.telephone[0]}</p>}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingAgence}
                      className="flex items-center gap-2 rounded-xl bg-[#c79457] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(199,148,87,0.35)] transition-all duration-300 hover:bg-[#b8843e] hover:-translate-y-[1px] active:scale-[0.98] disabled:opacity-50"
                    >
                      {savingAgence ? (
                        'Enregistrement...'
                      ) : (
                        <>
                          <FloppyDisk size={16} weight="bold" />
                          Enregistrer
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="mt-8 rounded-xl border border-[#dfd1c2] bg-[#f7f0e8] p-8 text-center">
                  <Buildings size={32} weight="duotone" className="mx-auto text-zinc-400" />
                  <p className="mt-3 text-sm text-zinc-500">
                    Votre compte n'est pas associé à une agence.
                  </p>
                </div>
              )}
            </motion.form>
          )}

          {/* Sécurité */}
          {activeSection === 'securite' && (
            <motion.form
              onSubmit={handleSavePassword}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              className="rounded-2xl border border-[#dfd1c2] bg-white p-6 sm:p-8"
            >
              <h2 className="text-lg font-semibold tracking-tight text-zinc-900">Sécurité</h2>
              <p className="mt-1 text-sm text-zinc-500">Changez votre mot de passe.</p>

              <div className="mt-8 grid gap-5 max-w-md">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">Mot de passe actuel</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showCurrentPwd ? 'text' : 'password'}
                      value={passwords.current_password}
                      onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                      className={inputClass + ' pr-10'}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-700"
                      tabIndex={-1}
                    >
                      {showCurrentPwd ? <EyeSlash size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.current_password && (
                    <p className="mt-1 text-xs text-red-500">{errors.current_password[0]}</p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">Nouveau mot de passe</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                      <Lock size={16} />
                    </span>
                    <input
                      type={showNewPwd ? 'text' : 'password'}
                      value={passwords.password}
                      onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                      className={inputClass + ' pr-10'}
                      placeholder="Minimum 8 caractères"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPwd(!showNewPwd)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-700"
                      tabIndex={-1}
                    >
                      {showNewPwd ? <EyeSlash size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password[0]}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">Confirmer le nouveau mot de passe</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                      <Lock size={16} />
                    </span>
                    <input
                      type="password"
                      value={passwords.password_confirmation}
                      onChange={(e) => setPasswords({ ...passwords, password_confirmation: e.target.value })}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="flex items-center gap-2 rounded-xl bg-[#3b2418] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(59,36,24,0.3)] transition-all duration-300 hover:bg-[#4d3020] hover:-translate-y-[1px] active:scale-[0.98] disabled:opacity-50"
                >
                  {savingPassword ? (
                    'Modification...'
                  ) : (
                    <>
                      <CheckCircle size={16} weight="bold" />
                      Modifier le mot de passe
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Parametres;
