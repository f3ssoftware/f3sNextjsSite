import { Card } from "primereact/card";

export default function GamesNewsCardSecondary({
  backgroundImageUrl,
  title,
  subtitle,
}: {
  backgroundImageUrl: string;
  title: string;
  subtitle: string;
}) {
  return (
    <Card
      className="card-secondary-news"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </Card>
  );
}
