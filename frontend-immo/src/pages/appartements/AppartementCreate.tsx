import { appartementService } from '../../services/appartementService';
import type { Appartement } from '../../types';
import AppartementForm from './AppartementForm';

const AppartementCreate = () => {
  const handleSubmit = async (data: Partial<Appartement>) => {
    await appartementService.create(data);
  };

  return <AppartementForm onSubmit={handleSubmit} />;
};

export default AppartementCreate;
