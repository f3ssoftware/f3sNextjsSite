import { InputText } from "primereact/inputtext";
import { useTranslations } from 'next-intl';
import { useGameContext } from '../context/GameContext';

export const GameSearch = () => {
  const t = useTranslations();
  const { filterGames } = useGameContext();

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center",
      marginBottom: "1rem"
    }}>
      <span className="p-input-icon-left" style={{ width: "100%", maxWidth: "400px" }}>
        <i className="pi pi-search" />
        <InputText
          onChange={(e) => filterGames(e.target.value)}
          placeholder={t('SEARCH_GAMES')}
          style={{ width: "100%" }}
        />
      </span>
    </div>
  );
}; 