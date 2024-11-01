import About from '../About/about';
import { Contact } from '../Contact/contact';
import Header from '../Header/header';
import './landpage.css';
import Image from 'next/image';

export default function LandPage() {
  return (
    <div>
      <Header/>
      <About/>
      <Contact/>
    </div>
  );
}