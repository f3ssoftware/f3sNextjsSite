import { ContactType } from '../../../enums/contact-type.enum';

export interface ContactFormData {
    profile: ContactType | undefined;
    subject: string | null;
    name: string;
    message: string;
    email: string;
}

export interface ContactOption {
    key: string;
    value: string;
}

export interface ContactProps {
    
} 