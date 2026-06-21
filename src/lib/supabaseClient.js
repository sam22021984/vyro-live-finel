/**
 * supabaseClient — Frontend helper for calling Supabase via Base44 backend functions
 * 
 * All Supabase access goes through backend functions (supabaseQuery, supabaseHealth)
 * to keep the service role key server-side only.
 * 
 * Usage:
 *   import { supabase } from '@/lib/supabaseClient';
 *   const { data } = await supabase.from('profiles').select('*').eq('user_id', userId).get();
 *   const { data } = await supabase.from('profiles').insert({ user_id, name }).post();
 *   const { data } = await supabase.from('profiles').eq('id', id).update({ name }).patch();
 *   const { data } = await supabase.from('profiles').eq('id', id).delete();
 *   const info    = await supabase.health();
 */
import { base44 } from '@/api/base44Client';

class SupabaseQueryBuilder {
  constructor(table) {
    this._table   = table;
    this._filters = {};
    this._select  = '*';
    this._limit   = undefined;
    this._order   = undefined;
  }

  select(cols)        { this._select = cols; return this; }
  limit(n)            { this._limit  = n;    return this; }
  order(col, { ascending = true } = {}) { this._order = `${col}.${ascending ? 'asc' : 'desc'}`; return this; }

  eq(col, val)        { this._filters[col] = `eq.${val}`;      return this; }
  neq(col, val)       { this._filters[col] = `neq.${val}`;     return this; }
  gt(col, val)        { this._filters[col] = `gt.${val}`;      return this; }
  gte(col, val)       { this._filters[col] = `gte.${val}`;     return this; }
  lt(col, val)        { this._filters[col] = `lt.${val}`;      return this; }
  lte(col, val)       { this._filters[col] = `lte.${val}`;     return this; }
  ilike(col, val)     { this._filters[col] = `ilike.${val}`;   return this; }

  async get() {
    const res = await base44.functions.invoke('supabaseQuery', {
      table: this._table, method: 'GET',
      filters: this._filters, select: this._select,
      limit: this._limit, order: this._order,
    });
    return res.data;
  }

  async insert(body) {
    const res = await base44.functions.invoke('supabaseQuery', {
      table: this._table, method: 'POST', body, select: this._select,
    });
    return res.data;
  }

  async update(body) {
    const res = await base44.functions.invoke('supabaseQuery', {
      table: this._table, method: 'PATCH', body,
      filters: this._filters, select: this._select,
    });
    return res.data;
  }

  async delete() {
    const res = await base44.functions.invoke('supabaseQuery', {
      table: this._table, method: 'DELETE', filters: this._filters,
    });
    return res.data;
  }
}

export const supabase = {
  from: (table) => new SupabaseQueryBuilder(table),
  health: async () => {
    const res = await base44.functions.invoke('supabaseHealth', {});
    return res.data;
  },
};