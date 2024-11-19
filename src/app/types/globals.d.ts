declare global {
    interface Window {
      gtag?: (...args: any[]) => void;
      userLanguage?: string;
    }
  }
  
  export {};
  