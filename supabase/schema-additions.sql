-- Additional columns discovered from Base44 data export
-- Run this AFTER the initial schema.sql

-- Cities: additional fields from Base44
ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS average_property_price NUMERIC;
ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS key_features TEXT[];
ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS neighborhoods TEXT[];
ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS transportation TEXT;
ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS schools_rating NUMERIC;
ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS safety_rating NUMERIC;
ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS cost_of_living_rating NUMERIC;
ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS latitude NUMERIC;
ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS longitude NUMERIC;

-- Events: additional fields from Base44
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS organizer_name TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS organizer_type TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS max_attendees INTEGER;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS registration_required BOOLEAN DEFAULT false;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS event_website_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Experts: add missing fields
ALTER TABLE public.experts ADD COLUMN IF NOT EXISTS approval_status approval_status DEFAULT 'pending';
