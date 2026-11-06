import { locationService } from '../../services/locationService';
import type { Location } from '../../types';
import LocationForm from './LocationForm';

const LocationCreate = () => {
  const handleSubmit = async (data: Partial<Location>) => {
    await locationService.create(data);
  };

  return <LocationForm onSubmit={handleSubmit} />;
};

export default LocationCreate;
