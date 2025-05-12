import { useEffect, useState } from 'react';

export interface TibiaItem {
  id: number;
  name: string;
  type: string;
  image: string;
  [key: string]: any;
}

export const useTibiaItems = () => {
  const [items, setItems] = useState<TibiaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [armorsRes, helmetsRes] = await Promise.all([
          fetch('/json/armors_dml_format.json'),
          fetch('/json/helmets_dml_format.json'),
        ]);
        if (!armorsRes.ok || !helmetsRes.ok) {
          throw new Error('Failed to fetch item data');
        }
        const [armors, helmets] = await Promise.all([
          armorsRes.json(),
          helmetsRes.json(),
        ]);
        // Add type to each item for clarity
        const armorsWithType = armors.map((item: any) => ({ ...item, type: 'armor' }));
        const helmetsWithType = helmets.map((item: any) => ({ ...item, type: 'helmet' }));
        setItems([...armorsWithType, ...helmetsWithType]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  return { items, isLoading, error };
}; 