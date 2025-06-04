/*
  # Update RLS policies for public content

  1. Changes
    - Modify RLS policies for sections, translations, and images tables
    - Allow public read access
    - Maintain authenticated-only write access
  
  2. Security
    - Enable public read access for content
    - Maintain write protection requiring authentication
    - Separate policies for read and write operations
*/

-- Update sections table policies
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON sections;

CREATE POLICY "Enable read access for all users" ON sections
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable write access for authenticated users" ON sections
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Update translations table policies
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON translations;

CREATE POLICY "Enable read access for all users" ON translations
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable write access for authenticated users" ON translations
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Update images table policies
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON images;

CREATE POLICY "Enable read access for all users" ON images
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable write access for authenticated users" ON images
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);