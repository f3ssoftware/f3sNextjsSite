"use client";
import { GameFilterContainer } from "./GameFilter.styled";
import { useState } from "react";
import { Paginator } from "primereact/paginator";
import { useTranslations } from 'next-intl';
import { GameProvider } from '../context/GameContext';
import { useGameContext } from '../context/GameContext';
import { GameSearch } from './GameSearch';
import { GameCard } from './GameCard';

const GameFilterContent = () => {
  const t = useTranslations();
  const { filteredGames, isLoading, error } = useGameContext();
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  // Calculate pagination
  const currentGames = filteredGames.slice(first, first + rows);

  const onPageChange = (event: { first: number; rows: number }) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      gap: "2rem",
      minHeight: "100vh",
      position: "relative",
      padding: "5%"
    }}>
      <GameSearch />

      <div style={{ flex: 1 }}>
        <GameFilterContainer>
          {currentGames.length > 0 ? (
            currentGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))
          ) : (
            <div style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "2rem",
              color: "#666",
              fontSize: "1.2rem"
            }}>
              {t('NO_GAMES_FOUND')}
            </div>
          )}
        </GameFilterContainer>
      </div>

      {filteredGames.length > 0 && (
        <Paginator
          first={first}
          rows={rows}
          totalRecords={filteredGames.length}
          rowsPerPageOptions={[10, 20, 30]}
          onPageChange={onPageChange}
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        />
      )}
    </div>
  );
};

export default function GameFilter() {
  return (
    <GameProvider>
      <GameFilterContent />
    </GameProvider>
  );
}
