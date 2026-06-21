/**
 * supabaseQuery — Generic Supabase REST API proxy (secondary data source)
 * Usage: base44.functions.invoke('supabaseQuery', { table, method, filters, body, select })
 * 
 * method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
 * table:  Supabase table name (public schema)
 * filters: object of PostgREST filter params e.g. { "user_id": "eq.abc123" }
 * select: comma-separated columns e.g. "id,name,email" (default: *)
 * body:   object for POST/PATCH
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!SUPABASE_URL || !SERVICE_KEY) {
      return Response.json({ error: 'Supabase secrets not configured' }, { status: 500 });
    }

    const { table, method = 'GET', filters = {}, body, select = '*', limit, order } = await req.json();

    if (!table) return Response.json({ error: 'table is required' }, { status: 400 });

    const params = new URLSearchParams({ select });
    if (limit) params.set('limit', String(limit));
    if (order) params.set('order', order);
    Object.entries(filters).forEach(([k, v]) => params.set(k, v));

    const url = `${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`;

    const headers = {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'POST' ? 'return=representation' : 'return=minimal',
    };

    const fetchOpts = { method, headers };
    if (body && (method === 'POST' || method === 'PATCH')) {
      fetchOpts.body = JSON.stringify(body);
    }

    const res = await fetch(url, fetchOpts);
    const contentRange = res.headers.get('content-range');
    const data = res.status !== 204 ? await res.json() : null;

    if (!res.ok) {
      return Response.json({ error: data?.message || 'Supabase error', details: data }, { status: res.status });
    }

    return Response.json({ data, contentRange, status: res.status });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});