import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeSlash } from '@phosphor-icons/react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const ChangePassword = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (form.password !== form.password_confirmation) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/change-password', form);
      if (user?.role === 'locataire') {
        navigate('/mon-espace');
      } else {
        navigate('/dashboard');
      }
      window.location.reload();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      if (axiosErr.response?.data?.errors?.current_password) {
        setError(axiosErr.response.data.errors.current_password[0]);
      } else if (axiosErr.response?.data?.message) {
        setError(axiosErr.response.data.message);
      } else {
        setError('Une erreur est survenue.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#f7f0e8] px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-[#dfd1c2] bg-white p-8 shadow-[0_20px_40px_-15px_rgba(59,36,24,0.08)]">
          {/* Icon */}
          <div className="flex justify-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#c79457]/15 text-[#c79457]">
              <ShieldCheck size={28} weight="duotone" />
            </span>
          </div>

          <h1 className="mt-5 text-center text-xl font-bold tracking-tight text-zinc-900">
            Changement de mot de passe requis
          </h1>
          <p className="mt-2 text-center text-sm text-zinc-500">
            Pour des raisons de sécurité, vous devez définir un nouveau mot de passe avant de continuer.
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-700">Mot de passe actuel</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={form.current_password}
                onChange={(e) => setForm({ ...form, current_password: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#dfd1c2] px-4 py-2.5 text-sm transition focus:border-[#c79457] focus:outline-none focus:ring-2 focus:ring-[#c79457]/20"
                placeholder="Mot de passe fourni par l'admin"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-700">Nouveau mot de passe</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#dfd1c2] px-4 py-2.5 text-sm transition focus:border-[#c79457] focus:outline-none focus:ring-2 focus:ring-[#c79457]/20"
                placeholder="Minimum 8 caractères"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-700">Confirmer le nouveau mot de passe</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={form.password_confirmation}
                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-[#dfd1c2] px-4 py-2.5 text-sm transition focus:border-[#c79457] focus:outline-none focus:ring-2 focus:ring-[#c79457]/20"
                placeholder="Retapez le nouveau mot de passe"
                required
              />
            </div>

            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition hover:text-zinc-700"
            >
              {showPasswords ? <EyeSlash size={14} /> : <Eye size={14} />}
              {showPasswords ? 'Masquer' : 'Afficher'} les mots de passe
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-xl bg-[#3b2418] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#563522] active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? 'Modification...' : 'Définir mon nouveau mot de passe'}
            </button>
          </form>

          {/* Security tips */}
          <div className="mt-6 rounded-xl bg-[#f7f0e8] p-4">
            <p className="text-xs font-semibold text-zinc-600">Conseils de sécurité :</p>
            <ul className="mt-2 space-y-1 text-xs text-zinc-500">
              <li>- Minimum 8 caractères</li>
              <li>- Mélangez lettres, chiffres et symboles</li>
              <li>- Ne réutilisez pas un ancien mot de passe</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
