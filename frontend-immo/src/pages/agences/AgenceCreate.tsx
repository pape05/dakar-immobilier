import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import AgenceForm from './AgenceForm';

const AgenceCreate = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: { nom: string; adresse: string; telephone: string; email: string }) => {
    await api.post('/agences', data);
    toast.success('Agence créée avec succès');
    navigate('/agences');
  };

  return <AgenceForm onSubmit={handleSubmit} />;
};

export default AgenceCreate;
