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
    const changes = await request.json() as Record<string, { en: string; es: string }>;
    
    // Update each changed content item
    for (const [key, values] of Object.entries(changes)) {
      const [section, ...keyParts] = key.split('.');
      const contentKey = keyParts.join('.');
      
      // Upsert the content
      const { error } = await supabase
        .from('site_content')
        .upsert({
          section,
          key: contentKey,
          en: values.en,
          es: values.es,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'section,key'
        });
      
      if (error) {
        console.error('Error updating content:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: 'Failed to update content' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
