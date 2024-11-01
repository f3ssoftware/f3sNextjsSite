import Image from 'next/image';
import styles from './footer.module.css'; 
import { useTranslations } from 'next-intl';

export default function Footer() {

  const t = useTranslations(); 

  return (
    <div className={styles.footer}>
      <div className={styles.footerContents}>
        <Image
          src="/img/Logo do whatsapp.png"
          alt="WhatsApp's logo"
          width={10}
          height={10}
        />
        <a href="https://wa.me/5561981494249" target="_blank" rel="noopener noreferrer" style={{marginLeft: '0.5%'}}>
          {t("CONTACT")}
        </a>
      </div>
    </div>
  );
}



