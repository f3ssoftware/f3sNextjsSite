"use client"
import { useState } from 'react';
import { ContactType } from '../../enums/contact-type.enum';
import styles from './contact.module.css';
import { Dropdown } from 'primereact/dropdown';
import useTranslation from 'next-translate/useTranslation';

export function Contact() {
    const { t } = useTranslation('common');
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
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <h1>Contact</h1>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>

                <Dropdown
                    value={selectedContactType}
                    onChange={(e) => setSelectedContactType(e.value)}
                    optionLabel="key"
                    options={options}
                    placeholder='Choose an option'
                ></Dropdown>
            </div>
        </div>
    </section>
}