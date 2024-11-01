import Image from "next/image";
import styles from "./page.module.css";
import { Navbar } from "./components/Navbar/navbar";
import LandPage from "./components/LandPage/LandPage";
import Footer from "./components/Footer/Footer";


export default function Home() {
  return (
    <main className="main-content">
      <LandPage />
    </main>
  );
}