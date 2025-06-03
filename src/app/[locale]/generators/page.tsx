import { PrimeReactProvider } from "primereact/api";
import "./generators.css";
import Generators from "./components/Generators";
import NavigationBredCrumb from "@/app/shared/NavigationBredCrumb";

export default function GeneratorsPage() {
  return (
    <PrimeReactProvider>
      <section className="generators">
        <NavigationBredCrumb />
        <Generators />
      </section>
    </PrimeReactProvider>
  );
}
