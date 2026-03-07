import * as entities from './entities';
import * as integrations from './integrations';

// Compatibility bridge that mimics the Base44 SDK structure.
// Pages that `import { base44 } from '@/api/base44Client'` continue working unchanged.
export const base44 = {
  entities: {
    Property: entities.Property,
    Expert: entities.Expert,
    BlogPost: entities.BlogPost,
    Event: entities.Event,
    Favorite: entities.Favorite,
    City: entities.City,
    WikiTopic: entities.WikiTopic,
    Testimonial: entities.Testimonial,
    NewsletterSubscription: entities.NewsletterSubscription,
    User: entities.User,
    MagazineIssue: entities.MagazineIssue,
    MagazineArticle: entities.MagazineArticle,
  },
  integrations: {
    Core: integrations.Core,
  },
  auth: null, // Injected at runtime by AuthContext via setAuthMethods()
  appLogs: {
    logUserInApp: async () => {}, // no-op — Base44-specific telemetry
  },
};

/**
 * Called by AuthContext on mount to inject Supabase auth methods
 * into the bridge so that `base44.auth.me()`, `base44.auth.logout()`, etc. work.
 */
export function setAuthMethods(authMethods) {
  base44.auth = authMethods;
}
