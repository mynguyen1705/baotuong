import { createClient } from '@supabase/supabase-js';

const metaEnv = (
  typeof import.meta !== 'undefined'
    ? (import.meta as unknown as { env?: Record<string, string | undefined> }).env
    : undefined
);

export const SUPABASE_URL =
  metaEnv?.VITE_SUPABASE_URL || 'https://dludapuvvqzotyrkeimy.supabase.co';

export const SUPABASE_ANON_KEY =
  metaEnv?.VITE_SUPABASE_ANON_KEY || 'sb_publishable__bZnVMn_mCMPYwuc9XRBvw_MmXUSaCW';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Kiểm tra xem global fetch có đang bị mock bởi Vitest trong môi trường unit test hay không.
 */
export function isMockedTestFetch(): boolean {
  if (typeof globalThis.fetch !== 'function') return false;
  return Boolean((globalThis.fetch as unknown as { mock?: unknown }).mock);
}
