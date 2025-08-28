"use client";

import { useTranslations } from 'next-intl';
import './header.css'

export default function Header() {

    const t = useTranslations(); 
    
    return <div className="top-presentation">
        <section className="presentation">
            <h1>{t('SOFTWARE_ENGINEERING')}</h1>
            <h1 style={{ left: '540px', color: '#FB993E' }}>{t('NICHE_MARKETS')}</h1>
        </section>
    </div>
}