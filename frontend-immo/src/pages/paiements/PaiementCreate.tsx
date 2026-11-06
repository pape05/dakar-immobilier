import { paiementService } from '../../services/paiementService';
import type { Paiement } from '../../types';
import PaiementForm from './PaiementForm';

const PaiementCreate = () => {
  const handleSubmit = async (data: Partial<Paiement>) => {
    await paiementService.create(data);
  };

  return <PaiementForm onSubmit={handleSubmit} />;
};

export default PaiementCreate;
