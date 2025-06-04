/*
  # Fix CMS sections database structure

  1. New Indexes
    - Add performance indexes for frequently queried columns
    - Add composite indexes for section_id and key combinations

  2. Security
    - Enable RLS on all tables
    - Add consistent access policies across tables
    
  3. Triggers
    - Ensure updated_at columns are automatically maintained
*/

-- Add missing indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_translations_section_key ON translations(section_id, key);
CREATE INDEX IF NOT EXISTS idx_images_section_key ON images(section_id, key);
CREATE INDEX IF NOT EXISTS idx_sections_key ON sections(key);

-- Ensure RLS is enabled on all tables
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for all users on sections" ON sections;
DROP POLICY IF EXISTS "Enable write access for authenticated users on sections" ON sections;
DROP POLICY IF EXISTS "Enable read access for all users on translations" ON translations;
DROP POLICY IF EXISTS "Enable write access for authenticated users on translations" ON translations;
DROP POLICY IF EXISTS "Enable read access for all users on images" ON images;
DROP POLICY IF EXISTS "Enable write access for authenticated users on images" ON images;
DROP POLICY IF EXISTS "Enable read access for all users on settings" ON settings;
DROP POLICY IF EXISTS "Enable write access for authenticated users on settings" ON settings;

-- Add consistent RLS policies for sections
CREATE POLICY "Enable read access for all users on sections"
  ON sections FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable write access for authenticated users on sections"
  ON sections FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add consistent RLS policies for translations
CREATE POLICY "Enable read access for all users on translations"
  ON translations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable write access for authenticated users on translations"
  ON translations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add consistent RLS policies for images
CREATE POLICY "Enable read access for all users on images"
  ON images FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable write access for authenticated users on images"
  ON images FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add consistent RLS policies for settings
CREATE POLICY "Enable read access for all users on settings"
  ON settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable write access for authenticated users on settings"
  ON settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure all tables have updated_at trigger
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_sections_updated_at'
  ) THEN
    CREATE TRIGGER update_sections_updated_at
      BEFORE UPDATE ON sections
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_translations_updated_at'
  ) THEN
    CREATE TRIGGER update_translations_updated_at
      BEFORE UPDATE ON translations
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_images_updated_at'
  ) THEN
    CREATE TRIGGER update_images_updated_at
      BEFORE UPDATE ON images
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_settings_updated_at'
  ) THEN
    CREATE TRIGGER update_settings_updated_at
      BEFORE UPDATE ON settings
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;