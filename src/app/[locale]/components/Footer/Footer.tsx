import Image from 'next/image';
import styles from './footer.module.css';
import { useTranslations } from 'next-intl';

export default function Footer() {

  const t = useTranslations();

  return (
    <div className={styles.footer}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', paddingLeft: '1vw', paddingRight: '1vw' }}>
        <Image src="/img/logo_f3s_site.png" width={200} height={35} alt="F3S Software Logo" />
        <a style={{ fontSize: '1rem' }}>{t('FOLLOW_ON_SOCIAL_MEDIA')}</a>
        <i className="pi pi-linkedin" style={{ fontSize: '1.5rem' }}></i>
        <i className="pi pi-facebook" style={{ fontSize: '1.5rem' }}></i>
        <i className="pi pi-instagram" style={{ fontSize: '1.5rem' }}></i>
      </div>
      <div style={{ marginTop: '2vh' }}>
        <hr></hr>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.2rem', paddingLeft: '1vw', paddingRight: '1vw', paddingTop: '2vh' }}>
        <Image src="/img/patriot.png" width={200} height={80} alt="F3S Software Logo" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.2rem', paddingLeft: '1vw', paddingRight: '1vw', paddingTop: '2vh' }}>
        <a>Q Shcgn Clr, 705 Bloco E Loja 8 - Asa Norte</a>
        <a>Brasilia, DF - CEP 70730-555</a>
        <a>Telefone: (61) 98149-4249</a>
      </div>
    </div>
  );
}



