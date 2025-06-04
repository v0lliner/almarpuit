/*
  # Fix Row Level Security Policies

  1. Changes
    - Drop existing RLS policies for sections table
    - Create new specific policies for each operation type
    - Ensure authenticated users have proper access

  2. Security
    - Enable RLS on sections table (already enabled)
    - Add specific policies for SELECT, INSERT, UPDATE, and DELETE operations
    - Restrict access to authenticated users only
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Allow full access for authenticated users" ON public.sections;

-- Create specific policies for each operation
CREATE POLICY "Enable read access for authenticated users"
ON public.sections FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON public.sections FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
ON public.sections FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users"
ON public.sections FOR DELETE
TO authenticated
USING (true);