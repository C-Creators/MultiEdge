import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const supabase = createServerClient(cookies);
  
  // Clear the auth cookies
  cookies.delete('sb-access-token', { path: '/' });
  cookies.delete('sb-refresh-token', { path: '/' });
  
  // Sign out from Supabase
  await supabase.auth.signOut();
  
  return redirect('/admin/login');
};
