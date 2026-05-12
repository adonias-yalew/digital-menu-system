-- Supabase Storage Setup for Menu Images
-- Run this in your Supabase SQL Editor to set up the storage bucket

-- Create the menu-images bucket with public access
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'menu-images', 
  'menu-images', 
  true, 
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) 
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) policies for the bucket
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public access to images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own images" ON storage.objects;

-- Allow public access to read images
CREATE POLICY "Allow public access to images" ON storage.objects
FOR SELECT USING (bucket_id = 'menu-images');

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'menu-images' AND 
  auth.role() = 'authenticated'
);

-- Allow users to update their own images
CREATE POLICY "Allow users to update their own images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'menu-images' AND 
  auth.role() = 'authenticated'
);

-- Allow users to delete their own images
CREATE POLICY "Allow users to delete their own images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'menu-images' AND 
  auth.role() = 'authenticated'
);

-- Grant necessary permissions
GRANT ALL ON storage.buckets TO authenticated;
GRANT ALL ON storage.objects TO authenticated;

-- Note: Make sure your menu_items table has an image_url column
-- If it doesn't exist, run:
-- ALTER TABLE menu_items ADD COLUMN image_url TEXT;
