/**
 * supabaseHealth — Tests Supabase connection and discovers all public tables via RPC
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const ANON_KEY     = Deno.env.get('SUPABASE_ANON_KEY');
    const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!SUPABASE_URL || !SERVICE_KEY) {
      return Response.json({ error: 'Supabase secrets not configured' }, { status: 500 });
    }

    const headers = {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    };

    // Ping root — lists all exposed tables in the schema cache
    const pingRes  = await fetch(`${SUPABASE_URL}/rest/v1/`, { headers });
    const pingBody = await pingRes.json();

    // Extract table names from OpenAPI paths
    const tables = pingRes.ok && pingBody.paths
      ? Object.keys(pingBody.paths)
          .filter(p => p.startsWith('/') && !p.includes('{'))
          .map(p => p.replace('/', ''))
          .filter(Boolean)
      : [];

    return Response.json({
      connected: pingRes.ok,
      supabase_url: SUPABASE_URL,
      anon_key_set: !!ANON_KEY,
      service_key_set: !!SERVICE_KEY,
      public_tables: tables,
      table_count: tables.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});