/*
  # Add Hero Section

  1. New Data
    - Add 'hero' section to sections table
    
  2. Changes
    - Insert a new row into the sections table with key 'hero'
*/

-- Insert hero section if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM sections WHERE key = 'hero'
  ) THEN
    INSERT INTO sections (key) VALUES ('hero');
  END IF;
END $$;