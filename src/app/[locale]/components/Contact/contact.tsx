"use client"
import { useState } from 'react';
import { ContactType } from '../../../enums/contact-type.enum';
import styles from './contact.module.css';
import { Dropdown } from 'primereact/dropdown';
import {useTranslations} from 'next-intl';

export function Contact() {
    const t = useTranslations(); 
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
            <div className={styles.contactDiv} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <h1 className={styles.contact}>{t(`contact`)}</h1>
            </div>
            <div className='options' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>

                <Dropdown
                    panelStyle={{fontSize: '0.9rem', marginTop:'0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', textAlign: 'center'}}
                    value={selectedContactType}
                    onChange={(e) => setSelectedContactType(e.value)}
                    optionLabel="key"
                    options={options}
                    placeholder={t('choose_option')}
                ></Dropdown>
            </div>
        </div>
    </section>
}