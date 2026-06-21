/**
 * useSupabase — Shared hook for Supabase data with polling-based "realtime"
 * Since Supabase Realtime requires a direct WebSocket (not available through our backend proxy),
 * we simulate realtime by polling at a configurable interval.
 *
 * Usage:
 *   const { data, loading, refetch } = useSupabase('user_xp', { filters: { user_id: `eq.${userId}` }, interval: 10000 });
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { base44 } from '@/api/base44Client';

export function useSupabase(table, { filters = {}, select = '*', limit, order, interval = 0, enabled = true } = {}) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const timerRef              = useRef(null);

  const fetch = useCallback(async () => {
    if (!enabled || !table) return;
    try {
      const res = await base44.functions.invoke('supabaseQuery', { table, method: 'GET', filters, select, limit, order });
      setData(res?.data?.data ?? null);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [table, JSON.stringify(filters), select, limit, order, enabled]);

  useEffect(() => {
    fetch();
    if (interval > 0) {
      timerRef.current = setInterval(fetch, interval);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [fetch, interval]);

  return { data, loading, error, refetch: fetch };
}

export async function sbQuery(table, { filters = {}, select = '*', limit, order } = {}) {
  const res = await base44.functions.invoke('supabaseQuery', { table, method: 'GET', filters, select, limit, order });
  return res?.data?.data ?? [];
}

export async function sbInsert(table, body) {
  const res = await base44.functions.invoke('supabaseQuery', { table, method: 'POST', body, select: '*' });
  return res?.data?.data;
}

export async function sbUpdate(table, filters, body) {
  const res = await base44.functions.invoke('supabaseQuery', { table, method: 'PATCH', body, filters });
  return res?.data;
}

export async function sbDelete(table, filters) {
  const res = await base44.functions.invoke('supabaseQuery', { table, method: 'DELETE', filters });
  return res?.data;
}