import { supabase } from './supabaseClient';

/**
 * Creates an entity interface that mirrors the Base44 SDK API.
 * Methods: list(sortBy, limit), filter(conditions, sortBy, limit),
 *          create(data), update(id, data), delete(id)
 */
function createEntity(tableName) {
  return {
    async list(sortBy, limit) {
      let query = supabase.from(tableName).select('*');

      if (sortBy) {
        const desc = sortBy.startsWith('-');
        const column = desc ? sortBy.slice(1) : sortBy;
        query = query.order(column, { ascending: !desc });
      }
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },

    async filter(conditions, sortBy, limit) {
      let query = supabase.from(tableName).select('*');

      for (const [key, value] of Object.entries(conditions)) {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else {
          query = query.eq(key, value);
        }
      }

      if (sortBy) {
        const desc = sortBy.startsWith('-');
        const column = desc ? sortBy.slice(1) : sortBy;
        query = query.order(column, { ascending: !desc });
      }
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },

    async create(record) {
      const { data, error } = await supabase
        .from(tableName)
        .insert(record)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async update(id, updates) {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },

    async delete(id) {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
  };
}

// Exported entities matching Base44 entity names
export const Property = createEntity('properties');
export const Expert = createEntity('experts');
export const BlogPost = createEntity('blog_posts');
export const Event = createEntity('events');
export const Favorite = createEntity('favorites');
export const City = createEntity('cities');
export const WikiTopic = createEntity('wiki_topics');
export const Testimonial = createEntity('testimonials');
export const NewsletterSubscription = createEntity('newsletter_subscriptions');
export const User = createEntity('profiles');
