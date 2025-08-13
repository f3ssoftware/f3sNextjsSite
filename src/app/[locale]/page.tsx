import Image from "next/image";
import styles from "./page.module.css";
import { Navbar } from "./components/Navbar/navbar";
import LandPage from "./components/LandPage/LandPage";
import Footer from "./components/Footer/Footer";
import { PrimeReactProvider } from "primereact/api";

// Test hot reload - this should update immediately

export default function LocalePage() {
  return (
    <PrimeReactProvider>
      <Navbar />
      <LandPage />
      <Footer />
    </PrimeReactProvider>
  );
}