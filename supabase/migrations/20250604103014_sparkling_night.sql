/*
  # Add base sections

  1. Changes
    - Insert base sections into the sections table:
      - hero
      - about
      - products
      - wood-purchase
      - contact

  2. Purpose
    - Ensures all required sections exist in the database
    - Prevents 406 errors when fetching section content
*/

-- Insert base sections if they don't exist
DO $$ 
BEGIN 
  -- Hero section
  IF NOT EXISTS (SELECT 1 FROM sections WHERE key = 'hero') THEN
    INSERT INTO sections (key) VALUES ('hero');
  END IF;

  -- About section
  IF NOT EXISTS (SELECT 1 FROM sections WHERE key = 'about') THEN
    INSERT INTO sections (key) VALUES ('about');
  END IF;

  -- Products section
  IF NOT EXISTS (SELECT 1 FROM sections WHERE key = 'products') THEN
    INSERT INTO sections (key) VALUES ('products');
  END IF;

  -- Wood Purchase section
  IF NOT EXISTS (SELECT 1 FROM sections WHERE key = 'wood-purchase') THEN
    INSERT INTO sections (key) VALUES ('wood-purchase');
  END IF;

  -- Contact section
  IF NOT EXISTS (SELECT 1 FROM sections WHERE key = 'contact') THEN
    INSERT INTO sections (key) VALUES ('contact');
  END IF;
END $$;