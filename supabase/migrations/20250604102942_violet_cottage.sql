/*
  # Add default sections

  1. New Data
    - Insert default sections into the `sections` table:
      - hero
      - about
      - products
      - wood-purchase
      - contact

  2. Changes
    - No schema changes, only data insertion
*/

-- Insert sections if they don't exist
INSERT INTO sections (key)
VALUES 
  ('hero'),
  ('about'),
  ('products'),
  ('wood-purchase'),
  ('contact')
ON CONFLICT (key) DO NOTHING;