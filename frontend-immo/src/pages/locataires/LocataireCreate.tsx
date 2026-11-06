import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Copy, Key } from '@phosphor-icons/react';
import { locataireService } from '../../services/locataireService';
import type { Locataire } from '../../types';
import LocataireForm from './LocataireForm';

interface CreatedInfo {
  name: string;
  email: string;
  password: string;
}

const LocataireCreate = () => {
  const navigate = useNavigate();
  const [createdInfo, setCreatedInfo] = useState<CreatedInfo | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (data: Partial<Locataire>) => {
    const response = await locataireService.create(data);
    if (response.default_password && data.email) {
      setCreatedInfo({
        name: `${data.prenom} ${data.nom}`,
        email: data.email,
        password: response.default_password,
      });
      throw { _handled: true };
    }
  };

  const handleCopy = () => {
    if (createdInfo) {
      navigator.clipboard.writeText(
        `Email: ${createdInfo.email}\nMot de passe: ${createdInfo.password}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (createdInfo) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-[#dfd1c2] bg-white p-8">
          <div className="flex justify-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
              <CheckCircle size={28} weight="duotone" />
            </span>
          </div>
          <h2 className="mt-5 text-center text-xl font-bold tracking-tight text-zinc-900">
            Locataire créé avec succès
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-500">
            Un compte a été automatiquement créé pour <span className="font-medium text-zinc-700">{createdInfo.name}</span>.
          </p>

          <div className="mt-6 rounded-xl border border-[#dfd1c2] bg-[#f7f0e8] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700">
              <Key size={16} weight="duotone" className="text-[#c79457]" />
              Identifiants de connexion
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Email</span>
                <span className="font-mono text-sm font-medium text-zinc-900">{createdInfo.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Mot de passe</span>
                <span className="font-mono text-sm font-bold text-[#c79457]">{createdInfo.password}</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-zinc-400">
            Le locataire devra changer ce mot de passe lors de sa première connexion.
          </p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleCopy}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#dfd1c2] bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 active:scale-[0.98]"
            >
              <Copy size={16} weight="bold" />
              {copied ? 'Copie !' : 'Copier'}
            </button>
            <button
              onClick={() => navigate('/locataires')}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#c79457] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#9a6638] active:scale-[0.98]"
            >
              Terminer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <LocataireForm onSubmit={handleSubmit} navigateOnSuccess={false} />;
};

export default LocataireCreate;
