// Auth-compatible User export.
// Pages that import User expect auth methods: me(), loginWithRedirect(), logout(), updateMe().
// These are injected into the bridge by AuthContext at mount time.
import { base44 } from '@/api/base44Client';

// Export a proxy that always reflects the current auth methods
export const User = new Proxy({}, {
  get(_, prop) {
    if (base44.auth && prop in base44.auth) {
      return base44.auth[prop];
    }
    // Fallback: if auth hasn't been injected yet, throw a clear error
    return () => {
      throw new Error(`Auth not initialized yet. "${String(prop)}" called before AuthContext mounted.`);
    };
  },
});
