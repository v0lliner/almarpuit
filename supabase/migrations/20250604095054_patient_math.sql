/*
  # Initial Schema Setup for OÜ Almar Puit CMS

  1. New Tables
    - `sections`: Stores main content sections
      - `id` (uuid, primary key)
      - `key` (text, unique identifier for the section)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `translations`: Stores all translatable content
      - `id` (uuid, primary key)
      - `section_id` (uuid, references sections)
      - `key` (text, translation key)
      - `et` (text, Estonian content)
      - `en` (text, English content)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `images`: Stores image metadata
      - `id` (uuid, primary key)
      - `section_id` (uuid, references sections)
      - `key` (text, image identifier)
      - `url` (text, Supabase storage URL)
      - `alt_text` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `settings`: Stores global settings
      - `id` (uuid, primary key)
      - `key` (text, unique setting identifier)
      - `value` (jsonb, flexible value storage)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin access
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create sections table
CREATE TABLE IF NOT EXISTS sections (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    key text UNIQUE NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER update_sections_updated_at
    BEFORE UPDATE ON sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id uuid REFERENCES sections(id) ON DELETE CASCADE,
    key text NOT NULL,
    et text,
    en text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(section_id, key)
);

CREATE TRIGGER update_translations_updated_at
    BEFORE UPDATE ON translations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create images table
CREATE TABLE IF NOT EXISTS images (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_id uuid REFERENCES sections(id) ON DELETE CASCADE,
    key text NOT NULL,
    url text NOT NULL,
    alt_text text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(section_id, key)
);

CREATE TRIGGER update_images_updated_at
    BEFORE UPDATE ON images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    key text UNIQUE NOT NULL,
    value jsonb NOT NULL DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow full access for authenticated users"
    ON sections
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow full access for authenticated users"
    ON translations
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow full access for authenticated users"
    ON images
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow full access for authenticated users"
    ON settings
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Insert initial sections
INSERT INTO sections (key) VALUES
    ('hero'),
    ('about'),
    ('products'),
    ('wood_purchase'),
    ('contact'),
    ('footer');

-- Insert initial settings
INSERT INTO settings (key, value) VALUES
    ('meta', '{"title": "OÜ Almar Puit", "description": "Kvaliteetsed ja loodussõbralikud puittooted Teie kodule ja ärile."}'),
    ('contact_form', '{"recipient": "info@almarpuit.ee"}'),
    ('default_language', '"et"');