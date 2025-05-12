import { createContext, useContext, ReactNode } from 'react';
import { useGames, Game } from '../hooks/useGames';

interface GameContextType {
  games: Game[];
  filteredGames: Game[];
  isLoading: boolean;
  error: string | null;
  filterGames: (searchTerm: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const gameState = useGames();

  return (
    <GameContext.Provider value={gameState}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}; 