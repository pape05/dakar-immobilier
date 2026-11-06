import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('administrateur' | 'agent' | 'locataire')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-zinc-100 px-4">
        <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="h-4 w-28 animate-pulse rounded-full bg-zinc-200" />
          <div className="mt-4 h-10 animate-pulse rounded-xl bg-zinc-100" />
          <div className="mt-3 h-10 animate-pulse rounded-xl bg-zinc-100" />
          <p className="mt-4 text-sm text-zinc-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.must_change_password && window.location.pathname !== '/changer-mot-de-passe') {
    return <Navigate to="/changer-mot-de-passe" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    if (user.role === 'locataire') {
      return <Navigate to="/mon-espace" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
