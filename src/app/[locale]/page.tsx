import Image from "next/image";
import styles from "./page.module.css";
import { Navbar } from "./components/Navbar/navbar";
import LandPage from "./components/LandPage/LandPage";
import Footer from "./components/Footer/Footer";
import { PrimeReactProvider } from "primereact/api";


export default function Home() {
  return (
    <main className="main-content">
      <PrimeReactProvider>
        <LandPage />
      </PrimeReactProvider>

    </main>
  );
}