"use client"
import { useState } from 'react';
import { ContactType } from '../../enums/contact-type.enum';
import styles from './contact.module.css';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';


export function Contact() {
    const { t } = useTranslation();
    const [selectedContactType, setSelectedContactType] = useState(null);
    const options = [
        {
            key: t('INDEPENDENT_DEVELOPER'),
            value: ContactType.INDEPENDENT_DEVELOPER
        },
        {
            key: t('COMPANY_REPRESENTANT'),
            value: ContactType.COMPANY_REPRESENTANT
        },
        {
            key: t('CUSTOMER'),
            value: ContactType.CUSTOMER
        },
    ]
    return <section>
        <div className={styles.topSectionCt}></div>
        <div className={styles.backgroundCt}>
            <div className={styles.contactDiv} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <h1 className={styles.contact}>Contact</h1>
            </div>
            <div className='options' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Dropdown
                    panelStyle={{ fontSize: '0.9rem', marginTop: '0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', textAlign: 'center' }}
                    value={selectedContactType}
                    onChange={(e) => setSelectedContactType(e.value)}
                    optionLabel="key"
                    options={options}
                    placeholder='Choose an option'
                ></Dropdown>
                <br></br>{t('CUSTOMER')}
            </div>
        </div>
    </section>
}