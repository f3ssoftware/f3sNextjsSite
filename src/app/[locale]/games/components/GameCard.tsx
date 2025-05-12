import { useState } from 'react';
import { Game } from '../hooks/useGames';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { isSpecialGame } from '../constants';

interface GameCardProps {
  game: Game;
}

export const GameCard = ({ game }: GameCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const handleClick = () => {
    router.push(`/${locale}/games/${game.slug}`);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#24262b",
        borderRadius: "8px",
        overflow: "hidden",
        cursor: "pointer"
      }}
      onClick={handleClick}
    >
      <img
        src={game.image}
        alt={game.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          padding: "1rem"
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
          color: "white",
          fontSize: "1.2rem",
          fontWeight: "bold",
          textAlign: "center",
          padding: "1rem"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {game.name}
      </div>
    </div>
  );
}; 