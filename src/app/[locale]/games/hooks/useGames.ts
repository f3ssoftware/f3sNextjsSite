import { useState, useEffect } from 'react';

export interface Game {
  id: number;
  name: string;
  image: string;
  slug: string;
}

export const useGames = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/json/games.json");
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        const data = await response.json();
        setGames(data);
        setFilteredGames(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  const filterGames = (searchTerm: string) => {
    if (searchTerm.trim() === "") {
      setFilteredGames(games);
    } else {
      const filtered = games.filter((game) =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredGames(filtered);
    }
  };

  return {
    games,
    filteredGames,
    isLoading,
    error,
    filterGames
  };
}; 