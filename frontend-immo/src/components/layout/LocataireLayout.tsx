import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bell,
  CurrencyCircleDollar,
  HouseLine,
  Plus,
  SignOut,
  User,
  CaretDown,
} from '@phosphor-icons/react';
import { useAuth } from '../../hooks/useAuth';
import DakarLogo from '../common/DakarLogo';
import { useState, useRef, useEffect } from 'react';

const navItems = [
  { label: 'Accueil', to: '/mon-espace', icon: HouseLine },
  { label: 'Paiements', to: '/mon-espace/paiements', icon: CurrencyCircleDollar },
  { label: 'Notifications', to: '/mon-espace/notifications', icon: Bell },
  { label: 'Profil', to: '/mon-espace/profil', icon: User },
];

interface LocataireLayoutProps {
  children: React.ReactNode;
}

const LocataireLayout = ({ children }: LocataireLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '';

  return (
    <div className="min-h-[100dvh] bg-[#faf6f1]">
      {/* ── Desktop Header ── */}
      <header className="sticky top-0 z-30 border-b border-[#ede4da]/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 sm:px-8">
          {/* Logo */}
          <DakarLogo variant="dark" size="xl" />

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-0.5 md:flex">
            {navItems.map((navItem) => (
              <NavLink
                key={navItem.to}
                to={navItem.to}
                end={navItem.to === '/mon-espace'}
                className={({ isActive }) =>
                  [
                    'relative px-5 py-5 text-[13px] font-semibold tracking-wide transition-colors',
                    isActive
                      ? 'text-[#3b2418]'
                      : 'text-zinc-400 hover:text-zinc-700',
                  ].join(' ')
                }
              >
                {({ isActive }) => (
                  <>
                    {navItem.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[#3b2418]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right: Avatar + Menu + Logout */}
          <div className="flex items-center gap-3">
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="hidden items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-[#f7f0e8] md:flex"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#c79457] text-[11px] font-bold tracking-wide text-white">
                  {initials}
                </span>
                <span className="max-w-[140px] truncate text-[13px] font-semibold text-zinc-700">
                  {user?.name}
                </span>
                <CaretDown
                  size={12}
                  weight="bold"
                  className={`text-zinc-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-[#ede4da] bg-white shadow-[0_12px_40px_-12px_rgba(59,36,24,0.12)]"
                >
                  <div className="border-b border-zinc-100 px-4 py-3">
                    <p className="text-[13px] font-semibold text-zinc-900">{user?.name}</p>
                    <p className="mt-0.5 text-[11px] text-zinc-400">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-3 text-[13px] font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <SignOut size={15} weight="bold" />
                    Se déconnecter
                  </button>
                </motion.div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="hidden h-9 w-9 place-items-center rounded-xl text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 md:grid"
              title="Se déconnecter"
            >
              <SignOut size={17} weight="bold" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="mx-auto max-w-[1200px] px-4 pb-28 pt-8 sm:px-8 md:pb-10 lg:pt-10">
        {children}
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#ede4da]/60 bg-white/95 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-lg items-end justify-around px-2 pb-[env(safe-area-inset-bottom)]">
          {navItems.slice(0, 2).map((navItem) => {
            const Icon = navItem.icon;
            return (
              <NavLink
                key={navItem.to}
                to={navItem.to}
                end={navItem.to === '/mon-espace'}
                className={({ isActive }) =>
                  [
                    'flex flex-col items-center gap-1 py-3 text-[10px] font-semibold transition',
                    isActive ? 'text-[#3b2418]' : 'text-zinc-400',
                  ].join(' ')
                }
              >
                <Icon size={20} weight="duotone" />
                {navItem.label}
              </NavLink>
            );
          })}

          {/* Center FAB */}
          <div className="relative -top-4 flex flex-col items-center">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate('/mon-espace/paiements')}
              className="grid h-14 w-14 place-items-center rounded-full bg-[#3b2418] shadow-[0_4px_20px_-4px_rgba(59,36,24,0.4)]"
            >
              <Plus size={22} weight="bold" className="text-white" />
            </motion.button>
          </div>

          {navItems.slice(2).map((navItem) => {
            const Icon = navItem.icon;
            return (
              <NavLink
                key={navItem.to}
                to={navItem.to}
                className={({ isActive }) =>
                  [
                    'flex flex-col items-center gap-1 py-3 text-[10px] font-semibold transition',
                    isActive ? 'text-[#3b2418]' : 'text-zinc-400',
                  ].join(' ')
                }
              >
                <Icon size={20} weight="duotone" />
                {navItem.label}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default LocataireLayout;
