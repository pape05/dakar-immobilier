import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  BellRinging,
  Receipt,
  CheckCircle,
  Clock,
  Info,
  Warning,
  DotsThreeVertical,
  DownloadSimple,
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { espaceLocataireService } from '../../services/espaceLocataireService';
import { paiementService } from '../../services/paiementService';
import type { NotificationData } from '../../services/espaceLocataireService';

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

const TYPE_CONFIG: Record<string, { icon: React.ElementType; bg: string; iconColor: string }> = {
  facture: { icon: Receipt, bg: 'bg-amber-50', iconColor: 'text-amber-600' },
  paiement_confirme: { icon: CheckCircle, bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  rappel: { icon: Warning, bg: 'bg-red-50', iconColor: 'text-red-500' },
  info: { icon: Info, bg: 'bg-sky-50', iconColor: 'text-sky-600' },
};

const MesNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    espaceLocataireService
      .getMonEspace()
      .then((data) => setNotifications(data.notifications || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await espaceLocataireService.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, lu: true } : n))
      );
    } catch {
      /* silent */
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.lu);
    for (const n of unread) {
      try {
        await espaceLocataireService.markNotificationRead(n.id);
      } catch {
        /* silent */
      }
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, lu: true })));
  };

  const unreadCount = notifications.filter((n) => !n.lu).length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* ── Header ── */}
      <motion.div variants={item} className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Mes notifications
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Restez informé de toute l'actualité de votre contrat.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="rounded-full bg-[#c79457] px-3 py-1 text-[11px] font-bold text-white">
              {unreadCount} non-lue{unreadCount > 1 ? 's' : ''}
            </span>
          )}
          {unreadCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleMarkAllRead}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-[12px] font-semibold text-zinc-600 shadow-sm transition hover:bg-zinc-50"
            >
              Tout marquer comme lu
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* ── Notifications List ── */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n, i) => {
            const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
            const Icon = config.icon;

            return (
              <motion.div
                key={n.id}
                variants={item}
                className={`relative rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(59,36,24,0.06)] transition ${
                  !n.lu ? 'border-l-[3px] border-[#c79457]' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Type Icon */}
                  <span className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl ${config.bg} ${config.iconColor}`}>
                    <Icon size={18} weight="duotone" />
                  </span>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-bold text-zinc-900">{n.titre}</p>
                      {!n.lu && <span className="h-2 w-2 shrink-0 rounded-full bg-[#c79457]" />}
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-zinc-600">{n.message}</p>

                    {/* Actions */}
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      {n.type === 'facture' && n.paiement_id && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => navigate('/mon-espace/paiements')}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#3b2418] px-3.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-[#52342a]"
                        >
                          Payer maintenant
                        </motion.button>
                      )}
                      {n.type === 'info' && n.paiement_id && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={async () => {
                            try {
                              const blob = await paiementService.getQuittance(n.paiement_id!);
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `quittance-${n.paiement_id}.pdf`;
                              a.click();
                              window.URL.revokeObjectURL(url);
                            } catch { /* erreur silencieuse */ }
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-[11px] font-semibold text-zinc-600 transition hover:bg-zinc-50"
                        >
                          <DownloadSimple size={12} weight="bold" />
                          Télécharger la quittance
                        </motion.button>
                      )}
                      {!n.lu && (
                        <button
                          onClick={() => handleMarkRead(n.id)}
                          className="flex items-center gap-1 text-[11px] font-medium text-zinc-400 transition hover:text-emerald-600"
                        >
                          <CheckCircle size={12} weight="bold" />
                          Marquer comme lue
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Timestamp + Menu */}
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <p className="text-[11px] text-zinc-400">
                      {new Date(n.created_at).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                      })}
                      {', '}
                      {new Date(n.created_at).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <button className="grid h-7 w-7 place-items-center rounded-lg text-zinc-300 transition hover:bg-zinc-50 hover:text-zinc-500">
                      <DotsThreeVertical size={16} weight="bold" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          variants={item}
          className="flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-24 text-center shadow-[0_1px_4px_rgba(59,36,24,0.06)]"
        >
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#f7f0e8]">
            <Bell size={32} weight="duotone" className="text-[#c79457]" />
          </span>
          <p className="mt-6 text-base font-bold text-zinc-900">Aucune notification</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-500">
            Vous recevrez ici les notifications concernant vos paiements, votre contrat et les annonces de votre agence.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MesNotifications;
