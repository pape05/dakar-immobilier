import { batimentService } from '../../services/batimentService';
import BatimentForm, { type BatimentPayload } from './BatimentForm';

const BatimentCreate = () => {
  const handleSubmit = async (data: BatimentPayload) => {
    await batimentService.create(data);
  };

  return <BatimentForm onSubmit={handleSubmit} />;
};

export default BatimentCreate;
