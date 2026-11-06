import { useAuth } from '../../hooks/useAuth';
import DashboardAdmin from './DashboardAdmin';
import DashboardAgent from './DashboardAgent';

const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'administrateur') {
    return <DashboardAdmin />;
  }

  return <DashboardAgent />;
};

export default Dashboard;
