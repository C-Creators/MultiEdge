import { translations, type Language } from './translations';

const STORAGE_KEY = 'multiedge-lang';

export function getDefaultLanguage(): Language {
  // Check localStorage first
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'es') {
      return stored;
    }
    
    // Check browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('es')) {
      return 'es';
    }
  }
  
  return 'en';
}

export function setLanguage(lang: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute('data-lang', lang);
    window.dispatchEvent(new CustomEvent('language-change', { detail: lang }));
  }
}

export function getCurrentLanguage(): Language {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'es') {
      return stored;
    }
  }
  return 'en';
}

export function t(section: string, key: string, lang?: Language): string {
  const currentLang = lang || getCurrentLanguage();
  const sectionData = translations[currentLang]?.[section as keyof typeof translations.en];
  if (sectionData && typeof sectionData === 'object' && key in sectionData) {
    return (sectionData as Record<string, string>)[key];
  }
  // Fallback to English
  const fallbackSection = translations.en[section as keyof typeof translations.en];
  if (fallbackSection && typeof fallbackSection === 'object' && key in fallbackSection) {
    return (fallbackSection as Record<string, string>)[key];
  }
  return `${section}.${key}`;
}

// Client-side initialization script
export const initLanguageScript = `
<script is:inline>
  (function() {
    const STORAGE_KEY = 'multiedge-lang';
    let currentLang = localStorage.getItem(STORAGE_KEY);
    
    if (!currentLang) {
      const browserLang = navigator.language.toLowerCase();
      currentLang = browserLang.startsWith('es') ? 'es' : 'en';
      localStorage.setItem(STORAGE_KEY, currentLang);
    }
    
    document.documentElement.setAttribute('data-lang', currentLang);
  })();
</script>
`;
