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
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return new Response(JSON.stringify({ error: 'File must be an image' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'File size must be less than 5MB' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('site-images')
      .upload(file.name, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Upload error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('site-images')
      .getPublicUrl(data.path);
    
    return new Response(JSON.stringify({ 
      success: true, 
      path: data.path,
      url: publicUrl 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ error: 'Failed to upload image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
