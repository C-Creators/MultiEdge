import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';
import { translations } from '../../../i18n/translations';

export const POST: APIRoute = async ({ cookies }) => {
  // Verify authentication
  const supabase = createServerClient(cookies);
  const accessToken = cookies.get('sb-access-token')?.value;
  const refreshToken = cookies.get('sb-refresh-token')?.value;
  
  if (!accessToken || !refreshToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const { data: { session } } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken
  });
  
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Flatten translations and sync to database
    const items = flattenTranslations(translations.en);
    
    // Batch upsert
    const { error } = await supabase
      .from('site_content')
      .upsert(
        items.map(item => ({
          section: item.section,
          key: item.key,
          en: item.en,
          es: getNestedValue(translations.es, `${item.section}.${item.key}`) || '',
          updated_at: new Date().toISOString()
        })),
        { onConflict: 'section,key' }
      );
    
    if (error) {
      console.error('Sync error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ success: true, count: items.length }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Sync error:', error);
    return new Response(JSON.stringify({ error: 'Failed to sync content' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

function flattenTranslations(obj: any, section = '', prefix = ''): { section: string; key: string; en: string }[] {
  const items: { section: string; key: string; en: string }[] = [];
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      if (!section) {
        // Top level - this is a section
        items.push(...flattenTranslations(value, key, ''));
      } else {
        // Nested object within a section
        const newPrefix = prefix ? `${prefix}.${key}` : key;
        items.push(...flattenTranslations(value, section, newPrefix));
      }
    } else if (typeof value === 'string' && section) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      items.push({ section, key: fullKey, en: value });
    }
  }
  
  return items;
}

function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((acc, part) => acc?.[part], obj) || '';
}
