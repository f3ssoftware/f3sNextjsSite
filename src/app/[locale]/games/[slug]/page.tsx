"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { isSpecialGame } from '../constants';
import NavigationBredCrumb from '@/app/shared/NavigationBredCrumb';
interface Game {
  id: number;
  name: string;
  image: string;
  slug: string;
}

export default function GameDetails() {
  const params = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/json/games.json");
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        const games = await response.json();
        const foundGame = games.find((g: Game) => g.slug === params.slug);
        
        if (!foundGame) {
          throw new Error('Game not found');
        }
        
        setGame(foundGame);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch and show the default game details if it's not a special game
    if (!isSpecialGame(params.slug as string)) {
      fetchGame();
    } else {
      setIsLoading(false);
    }
  }, [params.slug]);

  // If it's a special game, don't render anything here
  // The special game's page.tsx will be rendered instead
  if (isSpecialGame(params.slug as string)) {
    return null;
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        Loading...
      </div>
    );
  }

  if (error || !game) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
        {error || 'Game not found'}
      </div>
    );
  }

  return (
    <div style={{ 
      padding: "5%",
      margin: "0 auto"
    }}>
      <NavigationBredCrumb />
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
        alignItems: "center"
      }}>
        <h1 style={{ 
          fontSize: "2.5rem", 
          color: "#fff",
          textAlign: "center"
        }}>
          {game.name}
        </h1>
        
        <div style={{
          width: "100%",
          maxWidth: "600px",
          aspectRatio: "1",
          backgroundColor: "#24262b",
          borderRadius: "8px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <img
            src={game.image}
            alt={game.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "2rem"
            }}
          />
        </div>
      </div>
    </div>
  );
} 