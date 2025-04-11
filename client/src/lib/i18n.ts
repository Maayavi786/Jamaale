import en from "@/locales/en";
import ar from "@/locales/ar";

// Available languages
const languages = {
  en,
  ar
};

// Current language with getter and setter to ensure it's always properly tracked
let _currentLanguage: string;

// Initialize current language
try {
  const savedLang = localStorage.getItem("appLanguage");
  console.log('i18n: Reading saved language:', savedLang);
  _currentLanguage = (savedLang === 'en' || savedLang === 'ar') ? savedLang : 'en';
  console.log('i18n: Initialized with language:', _currentLanguage);
} catch (error) {
  console.error('i18n: Error reading from localStorage:', error);
  _currentLanguage = 'en';
}

// Get the current language
export const getCurrentLanguage = (): string => {
  console.log('i18n: Getting current language:', _currentLanguage);
  return _currentLanguage;
};

/**
 * Set the current language
 * @param lang Language code ('en' or 'ar')
 */
export const setLanguage = (lang: string): void => {
  console.log('i18n: Setting language to:', lang);
  
  if (languages[lang as keyof typeof languages]) {
    try {
      // Update internal state
      _currentLanguage = lang;
      
      // Update localStorage
      localStorage.setItem("appLanguage", lang);
      console.log('i18n: Updated localStorage with:', lang);
      
      // Update DOM attributes
      const dir = lang === "ar" ? "rtl" : "ltr";
      document.documentElement.dir = dir;
      document.documentElement.lang = lang;
      console.log('i18n: Updated document attributes - dir:', dir, 'lang:', lang);
      
      // Update body class for RTL styling
      document.body.classList.remove('ltr', 'rtl');
      document.body.classList.add(dir);
      
      // Dispatch language change event
      const event = new Event('languageChanged');
      window.dispatchEvent(event);
      console.log('i18n: Dispatched languageChanged event');
    } catch (error) {
      console.error('i18n: Error during language change:', error);
    }
  } else {
    console.warn(`i18n: Language ${lang} is not supported. Falling back to English.`);
    try {
      _currentLanguage = "en";
      localStorage.setItem("appLanguage", "en");
      document.documentElement.dir = "ltr";
      document.documentElement.lang = "en";
      document.body.classList.remove('rtl');
      document.body.classList.add('ltr');
    } catch (error) {
      console.error('i18n: Error during fallback to English:', error);
    }
  }
};

/**
 * Translate a key
 * @param key Translation key
 * @param params Optional parameters for interpolation
 * @returns Translated string
 */
export const t = (key: string, params?: Record<string, any>): string => {
  const langDict = languages[_currentLanguage as keyof typeof languages];
  
  // Check if key exists in the current language
  if (!(key in langDict)) {
    console.warn(`i18n: Translation key "${key}" not found in ${_currentLanguage} locale.`);
    
    // Fallback to English
    if (_currentLanguage !== "en" && key in languages.en) {
      return interpolate(languages.en[key as keyof typeof languages.en], params);
    }
    
    // Return the key as a last resort
    return key;
  }
  
  return interpolate(langDict[key as keyof typeof langDict], params);
};

/**
 * Replace placeholders in a string with actual values
 * @param text Text with placeholders like {name}
 * @param params Values to replace placeholders
 * @returns Interpolated string
 */
const interpolate = (text: string, params?: Record<string, any>): string => {
  if (!params) return text;
  
  return text.replace(/{([^{}]*)}/g, (match, key) => {
    const value = params[key];
    return typeof value !== "undefined" ? String(value) : match;
  });
};
