import Image from "next/image";
import { Card } from "primereact/card";
import GamesNewsCardMain from "./GamesNewsCardMain";
import GamesNewsCardSecondary from "./GamesNewsCardSecondary";
import { Button } from "primereact/button";
import { useTranslations } from 'next-intl';

export default function GameNews() {
  const t = useTranslations();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div className="games-container">
        <GamesNewsCardMain
          backgroundImageUrl="https://static.tibia.com/images/news/monkrelease.jpg"
          title="Tibia lança nova vocação após 27 anos"
          subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "50%",
          }}
        >
          <GamesNewsCardSecondary
            backgroundImageUrl="https://pbs.twimg.com/media/GpFt_SaXcAEUrUt?format=jpg&name=small"
            title="Mercado de skin do CS2 continua em ascensão e atinge pico de R$ 25 milhões"
            subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
          />
          <GamesNewsCardSecondary
            backgroundImageUrl="https://noticias.maisesports.com.br/wp-content/uploads/2025/04/Ashe-Florescer-Espiritual-1068x630.jpg"
            title="Patch 25.09 traz novo mapa de Ionia, segunda temporada ranqueada e mais!"
            subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."
          />
        </div>
      </div>
      
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        padding: "1rem 0"
      }}>
        <Button 
          label={t('MORE_NEWS')} 
          icon="pi pi-arrow-right" 
          iconPos="right"
          severity="secondary"
          style={{
            backgroundColor: "#FB993E",
            border: "none",
            padding: "0.75rem 2rem",
            fontSize: "1.1rem",
            fontWeight: "bold"
          }}
        />
      </div>
    </div>
  );
}
