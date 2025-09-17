/*
  # Add T-shirt size column to teilnehmer table

  1. Changes
    - Add `tshirt_groesse` column to `teilnehmer` table
    - Column allows storing T-shirt sizes (XS, S, M, L, XL, XXL)
    - Optional field with default empty string

  2. Security
    - No changes to RLS policies needed
    - Column is part of existing table structure
*/

-- Add T-shirt size column to teilnehmer table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'teilnehmer' AND column_name = 'tshirt_groesse'
  ) THEN
    ALTER TABLE teilnehmer ADD COLUMN tshirt_groesse text DEFAULT '';
  END IF;
END $$;