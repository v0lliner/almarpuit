/*
  # Add initial sections data

  1. New Data
    - Adds initial section records for:
      - hero
      - about
      - products
      - woodPurchase
      - contact
    
  2. Changes
    - Inserts base records into sections table
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