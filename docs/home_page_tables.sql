-- ============================================================
-- Home Page Management Tables
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. home_content: fixed sections (hero, featured, about, contact)
CREATE TABLE IF NOT EXISTS public.home_content (
  id            TEXT PRIMARY KEY,   -- e.g. 'hero', 'featured', 'about', 'contact'
  data          JSONB NOT NULL DEFAULT '{}',
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.home_content ENABLE ROW LEVEL SECURITY;

-- Anyone can read home content
CREATE POLICY "home_content_select_all" ON public.home_content
  FOR SELECT USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "home_content_modify_admin" ON public.home_content
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.people
      WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
  );

-- Seed default sections
INSERT INTO public.home_content (id, data) VALUES
  ('hero', '{
    "title": "Wabi-Sabi Aesthetics.",
    "subtitle": "Premium Japan Surplus – Philippines",
    "description": "Discover authentic Japan surplus items at Jeany''s Olshoppe. Handpicked for quality, minimalism, and quiet elegance — delivered anywhere in the Philippines.",
    "button_text": "Explore Collection",
    "button_link": "/shop",
    "image_url": "",
    "quote": "Simplicity is the ultimate sophistication."
  }'),
  ('featured', '{
    "title": "Selected Arrivals",
    "subtitle": "Pieces that bring calm to your space.",
    "visible": true,
    "view_all_text": "View All Items",
    "view_all_link": "/shop"
  }'),
  ('about', '{
    "text": "We curate authentic Japan surplus clothing and lifestyle pieces that embody wabi-sabi — the beauty of imperfection, simplicity, and nature. Each piece is handpicked for quality and conscious living.",
    "image_url": ""
  }'),
  ('contact', '{
    "heading": "Connect with Jeany''s Olshoppe",
    "subheading": "Watch us live, shop directly, or reach out — we''re always here for you.",
    "facebook_url": "https://www.facebook.com/profile.php?id=100064110249756",
    "messenger_url": "https://m.me/100064110249756?ref=WebsiteVisitor",
    "phone": "0907 654 5313",
    "email": "jeanyrazo945@gmail.com",
    "location": "Mapandan, Pangasinan, Philippines",
    "maps_url": "https://maps.app.goo.gl/mtaKXkw4Uzum44hT9"
  }')
ON CONFLICT (id) DO NOTHING;


-- 2. home_sections: dynamic/custom sections
CREATE TABLE IF NOT EXISTS public.home_sections (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  image_url     TEXT,
  layout        TEXT NOT NULL DEFAULT 'text-only', -- 'banner' | 'grid' | 'text-only'
  sort_order    INT NOT NULL DEFAULT 0,
  visible       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.home_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "home_sections_select_all" ON public.home_sections
  FOR SELECT USING (true);

CREATE POLICY "home_sections_modify_admin" ON public.home_sections
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.people
      WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
  );
