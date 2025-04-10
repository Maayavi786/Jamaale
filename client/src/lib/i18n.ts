import en from "@/locales/en";
import ar from "@/locales/ar";

// Available languages
const languages = {
  en,
  ar
};

// Current language
let currentLanguage: string = "en";

/**
 * Set the current language
 * @param lang Language code ('en' or 'ar')
 */
export const setLanguage = (lang: string): void => {
  if (languages[lang as keyof typeof languages]) {
    currentLanguage = lang;
  } else {
    console.warn(`Language ${lang} is not supported. Falling back to English.`);
    currentLanguage = "en";
  }
};

/**
 * Translate a key
 * @param key Translation key
 * @param params Optional parameters for interpolation
 * @returns Translated string
 */
export const t = (key: string, params?: Record<string, any>): string => {
  const langDict = languages[currentLanguage as keyof typeof languages];
  
  // Check if key exists
  if (!langDict[key]) {
    console.warn(`Translation key "${key}" not found in ${currentLanguage} locale.`);
    
    // Fallback to English
    if (currentLanguage !== "en" && languages.en[key]) {
      return interpolate(languages.en[key], params);
    }
    
    // Return the key as a last resort
    return key;
  }
  
  return interpolate(langDict[key], params);
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
