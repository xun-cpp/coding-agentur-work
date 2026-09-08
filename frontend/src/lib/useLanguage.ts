import { useEffect, useState } from 'react';

export type Language = 'de' | 'en';
export const translate = (language: Language, de: string, en: string) => (language === 'de' ? de : en);

export function useLanguage(): Language {
  const [language, setLanguage] = useState<Language>('de');
  useEffect(() => {
    const update = () => setLanguage(document.documentElement.lang === 'en' ? 'en' : 'de');
    update();
    document.addEventListener('ca:lang', update);
    return () => document.removeEventListener('ca:lang', update);
  }, []);
  return language;
}
