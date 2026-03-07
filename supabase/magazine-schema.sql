-- Magazine Issues & Articles Schema
-- Run this in the Supabase SQL Editor to create the magazine tables

-- Magazine Issues table
CREATE TABLE public.magazine_issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  cover_image_url TEXT,
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(month, year)
);

-- Magazine Articles table
CREATE TABLE public.magazine_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_id UUID REFERENCES public.magazine_issues(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT NOT NULL CHECK (category IN ('legal', 'mortgage', 'money_transfer', 'developer', 'realtor', 'editorial')),
  author_expert_id UUID REFERENCES public.experts(id) ON DELETE SET NULL,
  author_name TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_magazine_issues_slug ON public.magazine_issues(slug);
CREATE INDEX idx_magazine_issues_published ON public.magazine_issues(published);
CREATE INDEX idx_magazine_issues_date ON public.magazine_issues(year DESC, month DESC);
CREATE INDEX idx_magazine_articles_slug ON public.magazine_articles(slug);
CREATE INDEX idx_magazine_articles_issue ON public.magazine_articles(issue_id);
CREATE INDEX idx_magazine_articles_category ON public.magazine_articles(category);
CREATE INDEX idx_magazine_articles_order ON public.magazine_articles(issue_id, display_order);

-- Row Level Security
ALTER TABLE public.magazine_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magazine_articles ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view published magazine issues"
  ON public.magazine_issues FOR SELECT USING (true);

CREATE POLICY "Anyone can view published magazine articles"
  ON public.magazine_articles FOR SELECT USING (true);

-- Admin write access
CREATE POLICY "Admins can insert magazine issues"
  ON public.magazine_issues FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update magazine issues"
  ON public.magazine_issues FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete magazine issues"
  ON public.magazine_issues FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can insert magazine articles"
  ON public.magazine_articles FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update magazine articles"
  ON public.magazine_articles FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete magazine articles"
  ON public.magazine_articles FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
