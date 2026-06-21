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

    // Security: whitelist of tables accessible via this proxy
    const ALLOWED_TABLES = [
      'vip_tiers','vip_benefits','vip_rewards','vip_profiles','vip_events','vip_reports',
      'user_wallets','wallets','coin_wallets','global_wallets','coin_reward_transactions','coin_global_price',
      'daily_tasks','daily_bonus','reward_claims','reward_settings','reward_leaderboards',
      'referrals','live_streams','live_users','stream_profiles','stream_levels',
      'gift_catalog','room_gifts','user_gifting_stats',
      'support_tickets','kyc_requests',
      'leaderboard','user_medals','user_xp','user_inventory','user_presence','user_settings',
      'social_friends','social_relationships','relationships','social_invites','families',
      'application_ids','application_id_history','application_notifications',
      'room_moderation','room_notifications','room_settings','room_likes','seat_requests',
      'commissions','call_sessions','muted_chats',
      'post_comments','post_shares','saved_posts','social_media_posts',
      'bonus_campaigns','country_kpis','country_vip_analytics',
      'admin_kpis','finance_dashboard','revenue_summary',
      'control_center_modules','bm_dashboard_modules','bd_dashboard_modules','role_access_matrix',
      'immortal_core_status',
    ];

    if (!ALLOWED_TABLES.includes(table)) {
      return Response.json({ error: `Table '${table}' is not accessible via this proxy` }, { status: 403 });
    }

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