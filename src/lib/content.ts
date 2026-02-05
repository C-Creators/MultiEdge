import { supabase } from './supabase';
import { translations as fileTranslations } from '../i18n/translations';

export interface TranslationData {
  en: Record<string, any>;
  es: Record<string, any>;
}

/**
 * Fetch translations from Supabase and merge with file-based translations
 * Supabase values override file values
 */
export async function getTranslations(): Promise<TranslationData> {
  try {
    console.log('Fetching translations from Supabase...');
    const { data, error } = await supabase
      .from('site_content')
      .select('section, key, en, es');
    
    console.log('Supabase response:', { data: data?.length || 0, error });
    
    if (error) {
      console.error('Error fetching translations:', error);
      return fileTranslations;
    }
    
    if (!data || data.length === 0) {
      console.log('No data from Supabase, using file translations');
      return fileTranslations;
    }
    
    console.log('Merging', data.length, 'items from Supabase');
    
    // Deep clone file translations
    const merged: TranslationData = {
      en: JSON.parse(JSON.stringify(fileTranslations.en)),
      es: JSON.parse(JSON.stringify(fileTranslations.es))
    };
    
    // Override with database values
    for (const item of data) {
      if (item.en) {
        setNestedValue(merged.en, `${item.section}.${item.key}`, item.en);
      }
      if (item.es) {
        setNestedValue(merged.es, `${item.section}.${item.key}`, item.es);
      }
    }
    
    return merged;
  } catch (error) {
    console.error('Error in getTranslations:', error);
    return fileTranslations;
  }
}

/**
 * Set a nested value in an object using dot notation path
 */
function setNestedValue(obj: Record<string, any>, path: string, value: string): void {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
}

/**
 * Get a nested value from an object using dot notation path
 */
export function getNestedValue(obj: Record<string, any>, path: string): string | undefined {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}
