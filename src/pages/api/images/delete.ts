import type { APIRoute } from 'astro';
import { createServerClient } from '../../../lib/supabase';

export const POST: APIRoute = async ({ cookies, request }) => {
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
    const { name } = await request.json() as { name: string };
    
    if (!name) {
      return new Response(JSON.stringify({ error: 'No file name provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Delete from Supabase Storage
    const { error } = await supabase.storage
      .from('site-images')
      .remove([name]);
    
    if (error) {
      console.error('Delete error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Delete error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
