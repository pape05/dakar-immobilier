import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { locationService } from '../../services/locationService';
import type { Location } from '../../types';
import LocationForm from './LocationForm';

const LocationEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await locationService.getById(Number(id));
        setLocation(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!location) return <p className="text-red-600">Location introuvable.</p>;

  const handleSubmit = async (data: Partial<Location>) => {
    await locationService.update(location.id, data);
  };

  return <LocationForm initialData={location} onSubmit={handleSubmit} isEdit />;
};

export default LocationEdit;
