import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with cookie handling
export function createServerClient(cookies: { get: (name: string) => { value: string } | undefined; set: (name: string, value: string, options?: any) => void }) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      detectSessionInUrl: false,
      persistSession: true,
      storage: {
        getItem: (key) => {
          const cookie = cookies.get(key);
          return cookie?.value ?? null;
        },
        setItem: (key, value) => {
          cookies.set(key, value, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 1 week
          });
        },
        removeItem: (key) => {
          cookies.set(key, '', {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 0
          });
        }
      }
    }
  });
}

// Database types for content management
export interface SiteContent {
  id: string;
  section: string;
  key: string;
  en: string;
  es: string;
  updated_at: string;
}

export interface SiteImage {
  id: string;
  name: string;
  url: string;
  alt_text: string;
  section: string;
  updated_at: string;
}

export interface AnalyticsData {
  visitors: number;
  pageviews: number;
  bounce_rate: number;
  visit_duration: number;
  top_pages: { page: string; visitors: number }[];
  top_sources: { source: string; visitors: number }[];
}
