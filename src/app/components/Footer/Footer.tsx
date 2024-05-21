import Image from 'next/image';
import "./footer.css";

export default function Footer() {
  return (
    <div>
      <div className="footer">
        <div className="footer-contents">
          <Image
            src="/img/Logo do whatsapp.png"
            alt="WhatsApp's logo"
            width={10}
            height={10}
          />
          <a href="https://wa.me/5561981494249" target="_blank" rel="noopener noreferrer">
            Contact
          </a>
        </div>
      </div>
    </div>
  );
}


