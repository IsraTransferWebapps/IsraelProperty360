import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.');
}

// Custom lock implementation to avoid navigator.locks "AbortError: Lock broken"
// issue in Supabase gotrue-js. Uses a simple in-memory queue instead.
const lockMap = new Map();
const customLock = async (name, acquireTimeout, fn) => {
  const start = Date.now();

  // Wait for any existing lock on this name to resolve
  while (lockMap.has(name)) {
    if (Date.now() - start > acquireTimeout) {
      throw new Error(`Lock "${name}" acquisition timed out`);
    }
    // Wait a tick then check again
    await new Promise((r) => setTimeout(r, 50));
  }

  // Acquire lock
  lockMap.set(name, true);
  try {
    return await fn();
  } finally {
    lockMap.delete(name);
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    lock: customLock,
  },
});
