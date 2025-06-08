/*
  # Settings table setup

  1. New Tables
    - `settings`
      - `id` (uuid, primary key)
      - `key` (text, unique)
      - `value` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `settings` table
    - Add policy for public read access
    - Add policy for authenticated user write access

  3. Features
    - Auto-update timestamp trigger
    - Index on key column for performance
*/

-- Create settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Enable read access for all users on settings" ON settings;
  DROP POLICY IF EXISTS "Enable write access for authenticated users on settings" ON settings;
  DROP POLICY IF EXISTS "Allow full access for authenticated users" ON settings;
  
  -- Create new policies
  CREATE POLICY "Enable read access for all users on settings"
    ON settings FOR SELECT
    TO public
    USING (true);

  CREATE POLICY "Enable write access for authenticated users on settings"
    ON settings FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
END $$;

-- Create updated_at trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_settings_updated_at' 
    AND tgrelid = 'settings'::regclass
  ) THEN
    CREATE TRIGGER update_settings_updated_at
      BEFORE UPDATE ON settings
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Create index on key if it doesn't exist
CREATE INDEX IF NOT EXISTS settings_key_idx ON settings(key);

-- Insert default global settings if they don't exist
INSERT INTO settings (key, value) 
VALUES (
  'global_settings',
  '{
    "company_name": "OÜ Almar Puit",
    "industry_address": "Tobrokamäe 4, Mikitamäe küla, Mikitamäe vald, Põlvamaa",
    "legal_address": "Kastani 12, Räpina linn, Põlvamaa 64506",
    "contact_phone": "+372 51 07 463534444",
    "contact_email": "info@almarpuit.ee",
    "form_target_email": "info@almarpuit.ee",
    "meta_title": {
      "et": "OÜ Almar Puit - Kvaliteetsed puittooted",
      "en": "OÜ Almar Puit - Quality Wood Products"
    },
    "meta_description": {
      "et": "OÜ Almar Puit - Kvaliteetsed ja loodussõbralikud puittooted Teie kodule ja ärile. Küttepuud, kaminapuud ja puidu kokkuost.",
      "en": "OÜ Almar Puit - High-quality, eco-friendly wood products for your home and business. Heating wood, fireplace wood and wood purchase."
    }
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;