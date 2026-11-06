import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Bell,
  Buildings,
  CaretLeft,
  CaretRight,
  ChartBar,
  CurrencyCircleDollar,
  DoorOpen,
  FileText,
  GearSix,
  HouseLine,
  List,
  SquaresFour,
  UsersThree,
  UserCircleGear,
  X,
} from '@phosphor-icons/react';
import { useAuth } from '../../hooks/useAuth';
import DakarLogo from '../common/DakarLogo';

const adminNavigation = [
  { label: 'Dashboard', to: '/dashboard', icon: SquaresFour },
  { label: 'Utilisateurs', to: '/utilisateurs', icon: UserCircleGear },
  { label: 'Agences', to: '/agences', icon: Buildings },
  { label: 'Rapports', to: '/rapports', icon: ChartBar },
  { label: 'Alertes', to: '/alertes', icon: Bell },
  { label: 'Paramètres', to: '/parametres', icon: GearSix },
];

const agentNavigation = [
  { label: 'Dashboard', to: '/dashboard', icon: SquaresFour },
  { label: 'Bâtiments', to: '/batiments', icon: Buildings },
  { label: 'Appartements', to: '/appartements', icon: HouseLine },
  { label: 'Locataires', to: '/locataires', icon: UsersThree },
  { label: 'Locations', to: '/locations', icon: FileText },
  { label: 'Paiements', to: '/paiements', icon: CurrencyCircleDollar },
];

const STORAGE_KEY = 'sidebar-collapsed';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === 'true'; } catch { return false; }
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, String(collapsed)); } catch {}
  }, [collapsed]);

  const isAdmin = user?.role === 'administrateur';
  const navigation = isAdmin ? adminNavigation : agentNavigation;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-[100dvh] bg-[#f7f0e8] text-zinc-950">
      {/* ── Mobile Header ── */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#dfd1c2] bg-[#3b2418] px-4 py-3 lg:hidden">
        <DakarLogo variant="light" size="lg" />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="grid h-10 w-10 place-items-center rounded-xl text-white/80 transition hover:bg-white/10"
        >
          {mobileOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
        </button>
      </header>

      {/* ── Mobile Overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex min-h-[100dvh]">
        {/* ── Sidebar ── */}
        <aside
          className={[
            'fixed inset-y-0 left-0 z-50 flex flex-col bg-[#3b2418] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
            'lg:sticky lg:top-0 lg:z-auto lg:h-[100dvh]',
            mobileOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full w-[280px]',
            collapsed ? 'lg:w-[76px] lg:translate-x-0' : 'lg:w-[280px] lg:translate-x-0',
          ].join(' ')}
        >
          {/* Logo + Toggle */}
          <div className="flex shrink-0 items-center justify-between px-5 pt-6 pb-2">
            <div className={`overflow-hidden transition-all duration-300 ${collapsed ? 'lg:w-9' : 'lg:w-auto'}`}>
              <DakarLogo variant="light" size={collapsed ? 'md' : '2xl'} />
            </div>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 text-white/60 transition hover:bg-white/20 hover:text-white lg:grid"
              title={collapsed ? 'Étendre le menu' : 'Rétracter le menu'}
            >
              {collapsed ? <CaretRight size={14} weight="bold" /> : <CaretLeft size={14} weight="bold" />}
            </button>
          </div>

          {/* Nav Links */}
          <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    [
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.98]',
                      collapsed ? 'lg:justify-center lg:px-0' : '',
                      isActive
                        ? 'border-l-[3px] border-[#c79457] bg-white/10 text-white'
                        : 'border-l-[3px] border-transparent text-white/60 hover:bg-white/5 hover:text-white/90',
                    ].join(' ')
                  }
                >
                  <Icon size={19} weight="duotone" className="shrink-0" />
                  <span className={`whitespace-nowrap transition-all duration-300 ${collapsed ? 'lg:hidden' : ''}`}>
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>

          {/* Session Card */}
          <div className="shrink-0 px-3 pb-5 pt-4">
            {collapsed ? (
              <div className="hidden flex-col items-center gap-3 lg:flex">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#c79457] text-sm font-bold text-white">
                  {initials}
                </span>
                <button
                  onClick={handleLogout}
                  title="Se déconnecter"
                  className="grid h-9 w-9 place-items-center rounded-lg bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white/90"
                >
                  <DoorOpen size={17} weight="bold" />
                </button>
              </div>
            ) : (
              <div className="hidden lg:block">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#c79457] text-sm font-bold text-white">
                      {initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
                      <span className={`mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        isAdmin ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {user?.role}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white/90 active:scale-[0.98]"
                >
                  <DoorOpen size={17} weight="bold" />
                  Se déconnecter
                </button>
              </div>
            )}

            {/* Mobile session */}
            <div className="lg:hidden">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#c79457] text-sm font-bold text-white">
                  {initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
                  <span className={`mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    isAdmin ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {user?.role}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white/90"
              >
                <DoorOpen size={17} weight="bold" />
                Se déconnecter
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
