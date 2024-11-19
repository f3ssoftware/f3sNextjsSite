import { useLanguage } from '@/context/LanguageContext';

export const trackClickEvent = (label: string) => {
  if (typeof window !== "undefined" && window.gtag) {
 
    const { language } = useLanguage();

    window.gtag('event', 'click', {
      event_category: 'Navbar',
      event_label: `${label} (${language})`, 
      user_language: language, 
    });
  }
};
