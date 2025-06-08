/*
  # Create milestone cards and product requirements tables

  1. New Tables
    - `milestone_cards`
      - `id` (uuid, primary key)
      - `section_id` (uuid, foreign key to sections)
      - `year_number` (text)
      - `description_et` (text)
      - `description_en` (text)
      - `sort_order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `product_requirements`
      - `id` (uuid, primary key)
      - `section_id` (uuid, foreign key to sections)
      - `title_et` (text)
      - `title_en` (text)
      - `items` (jsonb array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage content
    - Add policies for public users to read content
*/

-- Create milestone_cards table
CREATE TABLE IF NOT EXISTS milestone_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid REFERENCES sections(id) ON DELETE CASCADE,
  year_number text NOT NULL,
  description_et text NOT NULL DEFAULT '',
  description_en text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create product_requirements table
CREATE TABLE IF NOT EXISTS product_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid REFERENCES sections(id) ON DELETE CASCADE,
  title_et text NOT NULL DEFAULT '',
  title_en text NOT NULL DEFAULT '',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE milestone_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_requirements ENABLE ROW LEVEL SECURITY;

-- Create policies for milestone_cards
CREATE POLICY "Enable read access for all users on milestone_cards"
  ON milestone_cards FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable write access for authenticated users on milestone_cards"
  ON milestone_cards FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for product_requirements
CREATE POLICY "Enable read access for all users on product_requirements"
  ON product_requirements FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable write access for authenticated users on product_requirements"
  ON product_requirements FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create updated_at triggers
CREATE TRIGGER update_milestone_cards_updated_at
  BEFORE UPDATE ON milestone_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_requirements_updated_at
  BEFORE UPDATE ON product_requirements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_milestone_cards_section_id ON milestone_cards(section_id);
CREATE INDEX IF NOT EXISTS idx_milestone_cards_sort_order ON milestone_cards(sort_order);
CREATE INDEX IF NOT EXISTS idx_product_requirements_section_id ON product_requirements(section_id);

-- Insert default milestone cards for about section
DO $$
DECLARE
  about_section_id uuid;
BEGIN
  -- Get or create about section
  INSERT INTO sections (key) VALUES ('about') ON CONFLICT (key) DO NOTHING;
  SELECT id INTO about_section_id FROM sections WHERE key = 'about';
  
  -- Insert default milestone cards
  INSERT INTO milestone_cards (section_id, year_number, description_et, description_en, sort_order)
  VALUES 
    (about_section_id, '2006', 'Asutatud', 'Founded', 1),
    (about_section_id, 'PRIA', 'Toetatud', 'Supported by', 2),
    (about_section_id, 'Kagu-Eesti', 'Asukoht', 'Location', 3)
  ON CONFLICT DO NOTHING;
END $$;

-- Insert default product requirements for woodPurchase section
DO $$
DECLARE
  wood_purchase_section_id uuid;
BEGIN
  -- Get or create woodPurchase section
  INSERT INTO sections (key) VALUES ('woodPurchase') ON CONFLICT (key) DO NOTHING;
  SELECT id INTO wood_purchase_section_id FROM sections WHERE key = 'woodPurchase';
  
  -- Insert default product requirements
  INSERT INTO product_requirements (section_id, title_et, title_en, items)
  VALUES (
    wood_purchase_section_id,
    'Otsime:',
    'Looking for:',
    '[
      {"et": "Kasepaberipuud", "en": "Birch paper wood"},
      {"et": "3m küttepuud", "en": "3m heating wood"},
      {"et": "Piiratud koguses palki", "en": "Limited quantities of logs"}
    ]'::jsonb
  )
  ON CONFLICT DO NOTHING;
END $$;