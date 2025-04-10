import en from "@/locales/en";
import ar from "@/locales/ar";

// Available languages
const languages = {
  en,
  ar
};

// Current language with getter and setter to ensure it's always properly tracked
let _currentLanguage: string = localStorage.getItem("appLanguage") || "en";

// Get the current language
export const getCurrentLanguage = (): string => {
  return _currentLanguage;
};

/**
 * Set the current language
 * @param lang Language code ('en' or 'ar')
 */
export const setLanguage = (lang: string): void => {
  if (languages[lang as keyof typeof languages]) {
    _currentLanguage = lang;
    localStorage.setItem("appLanguage", lang);
    // This forces DOM update for language change
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  } else {
    console.warn(`Language ${lang} is not supported. Falling back to English.`);
    _currentLanguage = "en";
    localStorage.setItem("appLanguage", "en");
    document.documentElement.dir = "ltr";
    document.documentElement.lang = "en";
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
    console.warn(`Translation key "${key}" not found in ${_currentLanguage} locale.`);
    
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
