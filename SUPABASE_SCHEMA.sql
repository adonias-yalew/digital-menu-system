-- Supabase Database Schema for SMASH&CO Restaurant Management System
-- Run these SQL commands in your Supabase SQL Editor

-- Enable UUID extension for better primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_am TEXT,
  name_om TEXT,
  description_en TEXT NOT NULL,
  description_am TEXT,
  description_om TEXT,
  price INTEGER NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL CHECK (category IN ('burgers', 'sides', 'drinks', 'chicken', 'desserts', 'breakfast')),
  is_spicy BOOLEAN DEFAULT FALSE,
  is_popular BOOLEAN DEFAULT FALSE,
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  weight TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create feedbacks table
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for menu_items updated_at
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on both tables
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Menu Items RLS Policies
-- Public users can read menu items
CREATE POLICY "Public users can view menu items"
  ON menu_items FOR SELECT
  USING (true);

-- Only authenticated users can insert menu items (admin functionality)
CREATE POLICY "Authenticated users can insert menu items"
  ON menu_items FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update menu items (admin functionality)
CREATE POLICY "Authenticated users can update menu items"
  ON menu_items FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can delete menu items (admin functionality)
CREATE POLICY "Authenticated users can delete menu items"
  ON menu_items FOR DELETE
  USING (auth.role() = 'authenticated');

-- Feedbacks RLS Policies
-- Public users can insert feedback
CREATE POLICY "Public users can insert feedback"
  ON feedbacks FOR INSERT
  WITH CHECK (true);

-- Public users can read feedback (for admin display - you might want to restrict this)
CREATE POLICY "Public users can view feedback"
  ON feedbacks FOR SELECT
  USING (true);

-- Only authenticated users can update feedback (admin functionality)
CREATE POLICY "Authenticated users can update feedback"
  ON feedbacks FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can delete feedback (admin functionality)
CREATE POLICY "Authenticated users can delete feedback"
  ON feedbacks FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_popular ON menu_items(is_popular);
CREATE INDEX IF NOT EXISTS idx_menu_items_is_new ON menu_items(is_new);
CREATE INDEX IF NOT EXISTS idx_feedbacks_rating ON feedbacks(rating);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at);

-- Insert sample data (optional - remove for production)
INSERT INTO menu_items (
  name_en, name_am, name_om,
  description_en, description_am, description_om,
  price, category, image_url,
  is_spicy, is_popular, is_vegetarian, is_new, weight
) VALUES 
(
  'Classic Smash',
  'ክላሲክ ስማሽ',
  'Classic Smash',
  'Juicy smashed beef patty with fresh vegetables and signature sauce.',
  'ለስላሳ የተጨበጠ የበሬ ፓቲ ከአትክልት እና ልዩ ሶስ ጋር።',
  'Paatii loonii mi’aawaa kuduraa haaraa fi soosii addaa waliin.',
  780,
  'burgers',
  'https://via.placeholder.com/300x200?text=Classic+Smash',
  false, true, false, false, '180g'
),
(
  'Rin Ann Spicy Burger',
  'ሪን አን ቅመም የበሬ በርገር',
  'Rin Ann Burgarii Mi’aawaa',
  'Rich spicy slow-cooked beef stew made with premium Ethiopian spices.',
  'በኢትዮጵያ ቅመሞች የተሰራ በቀስታ የበሰለ ቅመም የበሬ ወጥ።',
  'Foon loowwii suuta bilchaate kan mi’eessituu Itoophiyaa waliin qophaa’e.',
  950,
  'burgers',
  'https://via.placeholder.com/300x200?text=Spicy+Burger',
  true, true, false, true, '200g'
);

-- Insert sample feedback
INSERT INTO feedbacks (customer_name, message, rating) VALUES 
('John Doe', 'Amazing burgers! The spicy one was incredible.', 5),
('Jane Smith', 'Good food, friendly service.', 4),
('Ahmed Ali', 'Best smash burgers in Addis!', 5);
