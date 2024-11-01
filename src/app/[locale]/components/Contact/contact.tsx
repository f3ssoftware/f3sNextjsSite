"use client"
import { useState } from 'react';
import { ContactType } from '../../../enums/contact-type.enum';
import styles from './contact.module.css';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

export function Contact() {
    const [profile, setProfile] = useState<ContactType>();
    const [selectedContactType, setSelectedContactType] = useState(null);
    const [subjectOptions, setSubjectOptions] = useState<any>([]);
    const [text, setText] = useState<string>();
    const [name, setName] = useState<string>();
    const [loading, setLoading] = useState<boolean>()
    const toast = useRef<Toast>(null);

    const profileOptions = [
        {
            key: "Headhunter",
            value: ContactType.HEADHUNTER
        },
        {
            key: "Independent Software Developer",
            value: ContactType.INDEPENDENT_DEVELOPER
        },
        {
            key: 'Representant of a company',
            value: ContactType.COMPANY_REPRESENTANT
        },
        {
            key: 'Customer',
            value: ContactType.CUSTOMER
        },
    ]

    const show = () => {
        toast?.current?.show({ severity: 'success', summary: 'Success', detail: 'Message sent!' });
    };

    const sendMessage = () => {
        setLoading(true);
        setTimeout(() => {
            show()
        }, 2000)
        setLoading(false);
    }

    useEffect(() => {
        let options: { key: string; value: string; }[] = []
        switch (profile) {
            case ContactType.HEADHUNTER: {
                options = [{
                    key: 'Jobs/Hiring',
                    value: 'JOBS/HIRING'
                }];
            }
        }
        setSubjectOptions(options)
    }, [profile]);

    return <section>
        <Toast ref={toast} />
        <div className={styles.topSectionCt}></div>
        <div className={styles.backgroundCt}>
            <div className={styles.contactDiv} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <h1 className={styles.contact}>Contact</h1>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '3vh' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '3vh' }}>
                    <p>If you&apos;re interested in discussing a potential project or partnership, please fill out the form below.</p>
                </div>
            </div>
            <div className='options' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div style={{ marginTop: '3vh' }}>
                    <Dropdown

                        value={profile}
                        onChange={(e) => setProfile(e.value)}
                        optionLabel="key"
                        options={profileOptions}
                        placeholder='Choose a profile'
                    ></Dropdown>
                </div>
            </div>

            <div className='options' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div style={{ marginTop: '3vh' }}>
                    <Dropdown
                        value={selectedContactType}
                        onChange={(e) => setSelectedContactType(e.value)}
                        optionLabel="key"
                        options={subjectOptions}
                        placeholder='Choose a subject'
                        disabled={!profile}
                    ></Dropdown>
                </div>
            </div>

            <div className='options' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '3vh' }}>
                <InputText value={name} onChange={(e) => setName(e.target.value)} placeholder="" />
            </div>

            <div className='options' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '3vh' }}>
                <InputTextarea value={text} placeholder="Insert a message" onChange={(e) => setText(e.target.value)} rows={20} />
            </div>

            <div className='options' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <div style={{ marginTop: '3vh' }}>
                    <Button label="Submit" onClick={() => sendMessage()} />
                </div>
            </div>

        </div>
    </section>
}