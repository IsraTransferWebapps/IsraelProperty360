-- =============================================================================
-- IsraelProperty360 — Supabase Database Schema
-- Run this in your Supabase SQL editor to set up all tables.
-- =============================================================================

-- ─── ENUMS ──────────────────────────────────────────────────────────────────

CREATE TYPE property_type AS ENUM (
  'apartment', 'house', 'villa', 'penthouse', 'studio',
  'duplex', 'garden_apartment', 'commercial', 'land', 'other'
);

CREATE TYPE property_status AS ENUM ('for_sale', 'in_development');

CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TYPE user_type AS ENUM ('visitor', 'broker', 'expert', 'admin');

CREATE TYPE expertise_type AS ENUM (
  'lawyer', 'realtor', 'mortgage_advisor',
  'money_exchange', 'interior_designer', 'property_management'
);

CREATE TYPE blog_category AS ENUM (
  'market_update', 'buying_guide', 'legal', 'finance',
  'lifestyle', 'city_guide', 'expert_insight', 'investment'
);

CREATE TYPE event_type AS ENUM (
  'webinar', 'seminar', 'open_house', 'networking',
  'conference', 'workshop', 'consultation'
);


-- ─── TABLES ─────────────────────────────────────────────────────────────────

-- User profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  user_type user_type DEFAULT 'visitor',
  role TEXT DEFAULT 'user',
  property_alerts_enabled BOOLEAN DEFAULT false,
  alert_preferences JSONB DEFAULT '{}',
  company_name TEXT,
  license_number TEXT,
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Properties
CREATE TABLE public.properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference_number TEXT,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  price_from BOOLEAN DEFAULT false,
  property_type property_type,
  status property_status DEFAULT 'for_sale',
  city TEXT,
  neighborhood TEXT,
  address TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  size_sqm NUMERIC,
  floor INTEGER,
  parking_spaces INTEGER,
  balcony BOOLEAN DEFAULT false,
  elevator BOOLEAN DEFAULT false,
  furnished BOOLEAN DEFAULT false,
  pool BOOLEAN DEFAULT false,
  gym BOOLEAN DEFAULT false,
  mamad BOOLEAN DEFAULT false,
  storage BOOLEAN DEFAULT false,
  air_conditioning BOOLEAN DEFAULT false,
  renovated BOOLEAN DEFAULT false,
  accessible BOOLEAN DEFAULT false,
  garden BOOLEAN DEFAULT false,
  terrace BOOLEAN DEFAULT false,
  security_system BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  completion_date DATE,
  scheduled_publish_date DATE,
  images TEXT[] DEFAULT '{}',
  broker_email TEXT,
  broker_name TEXT,
  broker_phone TEXT,
  approval_status approval_status DEFAULT 'pending',
  rejection_reason TEXT,
  developer_id TEXT,
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Experts
CREATE TABLE public.experts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  expertise expertise_type,
  company TEXT,
  description TEXT,
  experience_years INTEGER,
  specialties TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  website TEXT,
  video_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  rating NUMERIC,
  approval_status approval_status DEFAULT 'pending',
  rejection_reason TEXT,
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Blog posts
CREATE TABLE public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  excerpt TEXT,
  content TEXT,
  category blog_category,
  author_expert_id UUID REFERENCES public.experts(id) ON DELETE SET NULL,
  author_name TEXT,
  author_expertise TEXT,
  tags TEXT[] DEFAULT '{}',
  image_url TEXT,
  video_url TEXT,
  audio_url TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Events
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type event_type,
  event_date DATE,
  start_time TEXT,
  end_time TEXT,
  location TEXT,
  city TEXT,
  organizer_email TEXT,
  image_url TEXT,
  registration_link TEXT,
  approval_status approval_status DEFAULT 'pending',
  rejection_reason TEXT,
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Favorites
CREATE TABLE public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_email, property_id)
);

-- Cities
CREATE TABLE public.cities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  region TEXT,
  description TEXT,
  image_url TEXT,
  population INTEGER,
  avg_price NUMERIC,
  created_date TIMESTAMPTZ DEFAULT now()
);

-- Wiki topics
CREATE TABLE public.wiki_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  content TEXT,
  category TEXT,
  published BOOLEAN DEFAULT false,
  created_date TIMESTAMPTZ DEFAULT now()
);

-- Testimonials
CREATE TABLE public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  text TEXT,
  role TEXT,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_date TIMESTAMPTZ DEFAULT now()
);

-- Newsletter subscriptions
CREATE TABLE public.newsletter_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);


-- ─── INDEXES ────────────────────────────────────────────────────────────────

CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_approval ON public.properties(approval_status);
CREATE INDEX idx_properties_broker ON public.properties(broker_email);
CREATE INDEX idx_properties_created ON public.properties(created_date DESC);
CREATE INDEX idx_properties_featured ON public.properties(featured) WHERE featured = true;

CREATE INDEX idx_experts_expertise ON public.experts(expertise);
CREATE INDEX idx_experts_approval ON public.experts(approval_status);
CREATE INDEX idx_experts_featured ON public.experts(featured) WHERE featured = true;

CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX idx_blog_posts_author ON public.blog_posts(author_expert_id);

CREATE INDEX idx_events_date ON public.events(event_date DESC);
CREATE INDEX idx_events_approval ON public.events(approval_status);

CREATE INDEX idx_favorites_user ON public.favorites(user_email);
CREATE INDEX idx_favorites_property ON public.favorites(property_id);

CREATE INDEX idx_wiki_topics_slug ON public.wiki_topics(slug);
CREATE INDEX idx_cities_name ON public.cities(name);


-- ─── ROW-LEVEL SECURITY ────────────────────────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wiki_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Properties: anyone can read, brokers create/update their own, admins manage all
CREATE POLICY "Anyone can view properties"
  ON public.properties FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create properties"
  ON public.properties FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Brokers can update own properties"
  ON public.properties FOR UPDATE USING (
    auth.jwt() ->> 'email' = broker_email
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Brokers can delete own properties"
  ON public.properties FOR DELETE USING (
    auth.jwt() ->> 'email' = broker_email
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Experts
CREATE POLICY "Anyone can view experts"
  ON public.experts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create expert profiles"
  ON public.experts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update experts"
  ON public.experts FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can delete experts"
  ON public.experts FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Blog posts
CREATE POLICY "Anyone can view blog posts"
  ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Admins can manage blog posts"
  ON public.blog_posts FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Events
CREATE POLICY "Anyone can view events"
  ON public.events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create events"
  ON public.events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update events"
  ON public.events FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can delete events"
  ON public.events FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Favorites
CREATE POLICY "Users can view own favorites"
  ON public.favorites FOR SELECT USING (auth.jwt() ->> 'email' = user_email);
CREATE POLICY "Users can create favorites"
  ON public.favorites FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = user_email);
CREATE POLICY "Users can delete own favorites"
  ON public.favorites FOR DELETE USING (auth.jwt() ->> 'email' = user_email);

-- Public read-only tables
CREATE POLICY "Anyone can view cities"
  ON public.cities FOR SELECT USING (true);
CREATE POLICY "Admins can manage cities"
  ON public.cities FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Anyone can view wiki topics"
  ON public.wiki_topics FOR SELECT USING (true);
CREATE POLICY "Admins can manage wiki topics"
  ON public.wiki_topics FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Anyone can view testimonials"
  ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Admins can manage testimonials"
  ON public.testimonials FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Anyone can view newsletter subscriptions"
  ON public.newsletter_subscriptions FOR SELECT USING (true);
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscriptions FOR INSERT WITH CHECK (true);


-- ─── AUTO-CREATE PROFILE ON SIGNUP ──────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─── STORAGE ────────────────────────────────────────────────────────────────

-- Create a public bucket for media uploads (property images, expert photos, etc.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload media"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Allow public read access to all media
CREATE POLICY "Public read access to media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own media"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'media' AND auth.role() = 'authenticated');
