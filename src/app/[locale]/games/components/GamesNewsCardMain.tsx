import { Card } from "primereact/card";

export default function GamesNewsCardMain({ backgroundImageUrl, title, subtitle }: { backgroundImageUrl: string, title: string, subtitle: string }) {
  return (
    <Card className="card-main-news" style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <h1>{title}</h1>
      <p>
        {subtitle}
      </p>
    </Card>
  )
}