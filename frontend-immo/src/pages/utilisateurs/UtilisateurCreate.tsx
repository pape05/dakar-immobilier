import api from '../../services/api';
import UtilisateurForm from './UtilisateurForm';

const UtilisateurCreate = () => {
  const handleSubmit = async (data: Record<string, unknown>) => {
    await api.post('/users', data);
  };

  return <UtilisateurForm onSubmit={handleSubmit} />;
};

export default UtilisateurCreate;
