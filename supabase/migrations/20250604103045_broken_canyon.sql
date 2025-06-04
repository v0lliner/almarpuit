/*
  # Add initial sections

  1. New Data
    - Insert initial sections for the website:
      - hero
      - about
      - products
      - woodPurchase
      - contact

  2. Changes
    - Adds required section records to the sections table
    - Each section has a unique key
*/

-- Insert sections if they don't exist
INSERT INTO sections (key)
VALUES 
  ('hero'),
  ('about'),
  ('products'),
  ('woodPurchase'),
  ('contact')
ON CONFLICT (key) DO NOTHING;