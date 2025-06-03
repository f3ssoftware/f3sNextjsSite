import { useState, useEffect } from 'react';
import { ContactType } from '../../../enums/contact-type.enum';
import { ContactFormData, ContactOption } from './types';
import { useTranslations } from 'next-intl';

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{3,}$/i;

export const useContactForm = () => {
    const [formData, setFormData] = useState<ContactFormData>({
        profile: undefined,
        subject: null,
        name: '',
        message: '',
        email: ''
    });
    const [subjectOptions, setSubjectOptions] = useState<ContactOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const t = useTranslations();

    const profileOptions: ContactOption[] = [
        {
            key: t('HEADHUNTER'),
            value: ContactType.HEADHUNTER
        },
        {
            key: t("INDEPENDENT_DEVELOPER"),
            value: ContactType.INDEPENDENT_DEVELOPER
        },
        {
            key: t("COMPANY_REPRESENTANT"),
            value: ContactType.COMPANY_REPRESENTANT
        },
        {
            key: t("CUSTOMER"),
            value: ContactType.CUSTOMER
        },
    ];

    useEffect(() => {
        let options: ContactOption[] = [];
        switch (formData.profile) {
            case ContactType.HEADHUNTER: {
                options = [{
                    key: t('JOBS/HIRING', { defaultValue: 'Jobs/Hiring' }),
                    value: 'JOBS/HIRING'
                }];
                break;
            }
            case ContactType.INDEPENDENT_DEVELOPER: {
                options = [{
                    key: t('PROJECT_OPPORTUNITIES', { defaultValue: 'Project Opportunities' }),
                    value: 'PROJECT_OPPORTUNITIES'
                }];
                break;
            }
            case ContactType.COMPANY_REPRESENTANT: {
                options = [{
                    key: t('BUSINESS_PARTNERSHIP', { defaultValue: 'Business Partnership' }),
                    value: 'BUSINESS_PARTNERSHIP'
                }];
                break;
            }
            case ContactType.CUSTOMER: {
                options = [{
                    key: t('SUPPORT', { defaultValue: 'Support' }),
                    value: 'SUPPORT'
                }];
                break;
            }
        }
        setSubjectOptions(options);
        setFormData(prev => ({ ...prev, subject: null }));
    }, [formData.profile]);

    const handleProfileChange = (value: ContactType) => {
        setFormData(prev => ({ ...prev, profile: value }));
    };

    const handleSubjectChange = (value: string) => {
        setFormData(prev => ({ ...prev, subject: value }));
    };

    const handleNameChange = (value: string) => {
        setFormData(prev => ({ ...prev, name: value }));
    };

    const handleMessageChange = (value: string) => {
        setFormData(prev => ({ ...prev, message: value }));
    };

    const handleEmailChange = (value: string) => {
        setFormData(prev => ({ ...prev, email: value }));
    };

    const validateForm = (): boolean => {
        const isEmailValid = EMAIL_REGEX.test(formData.email);
        return Boolean(
            formData.profile &&
            formData.subject &&
            formData.name.trim() &&
            formData.message.trim() &&
            formData.email.trim() &&
            isEmailValid
        );
    };

    return {
        formData,
        isLoading,
        setIsLoading,
        subjectOptions,
        profileOptions,
        handleProfileChange,
        handleSubjectChange,
        handleNameChange,
        handleEmailChange,
        handleMessageChange,
        validateForm
    };
}; 