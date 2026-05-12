-- Feedback Table Setup for Supabase
-- Run this in your Supabase SQL Editor to set up the feedbacks table

-- Create the feedbacks table if it doesn't exist
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL DEFAULT 'Anonymous',
  message TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedbacks_rating ON feedbacks(rating);

-- Enable Row Level Security
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert to feedbacks" ON feedbacks;
DROP POLICY IF EXISTS "Allow public read feedbacks" ON feedbacks;
DROP POLICY IF EXISTS "Allow authenticated read all feedbacks" ON feedbacks;
DROP POLICY IF EXISTS "Allow authenticated delete feedbacks" ON feedbacks;

-- Create RLS policies
-- Allow anyone to insert feedback (public form)
CREATE POLICY "Allow public insert to feedbacks" ON feedbacks
FOR INSERT WITH CHECK (true);

-- Allow anyone to read feedback (public display)
CREATE POLICY "Allow public read feedbacks" ON feedbacks
FOR SELECT USING (true);

-- Allow authenticated users to read all feedbacks (for admin)
CREATE POLICY "Allow authenticated read all feedbacks" ON feedbacks
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete feedbacks (for admin)
CREATE POLICY "Allow authenticated delete feedbacks" ON feedbacks
FOR DELETE USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON feedbacks TO authenticated;
GRANT SELECT, INSERT ON feedbacks TO anon;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_feedbacks_updated_at ON feedbacks;
CREATE TRIGGER update_feedbacks_updated_at 
    BEFORE UPDATE ON feedbacks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Test the table by inserting a sample row (you can delete this later)
INSERT INTO feedbacks (customer_name, message, rating)
VALUES ('Test User', 'This is a test feedback', 5)
ON CONFLICT DO NOTHING;
