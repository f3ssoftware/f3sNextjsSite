import { PrimeReactProvider } from "primereact/api";
import "./generators.css";
import Generators from "./components/Generators";

export default function GeneratorsPage() {
  return (
    <PrimeReactProvider>
      <section className="generators">
        <Generators />
      </section>
    </PrimeReactProvider>
  );
}
