import About from '../About/about';
import { Contact } from '../Contact/contact';
import Header from '../Header/header';
import './landpage.css';

export default function LandPage() {
  return (
    <div>
      <Header />
      <About />
      <Contact />
    </div>
  );
}