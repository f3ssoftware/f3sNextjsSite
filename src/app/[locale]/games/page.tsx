import { PrimeReactProvider } from "primereact/api";
import Header from "../components/Header/header";
import "./games.css";
import GameNewsCard from "./components/GameNews";
import GameNews from "./components/GameNews";

export default function Games() {
  return (
    <PrimeReactProvider>
      <section className="games">
        <GameNews />
      </section>
    </PrimeReactProvider>
  );
}
