import { PrimeReactProvider } from "primereact/api";
import Header from "../components/Header/header";
import "./games.css";
import LandPage from "../components/LandPage/LandPage";

export default function Games() {
  return (
    <PrimeReactProvider>
      <section className="games">
        Games
      </section>
    </PrimeReactProvider>
  );
}
