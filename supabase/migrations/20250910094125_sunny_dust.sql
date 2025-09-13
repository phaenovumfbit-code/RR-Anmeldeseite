/*
  # Update anmeldungen table structure for Team-Manager

  1. Changes
    - Rename `schule` column to `team_manager_name`
    - Rename `ansprechperson` column to `contact_person` (kept for compatibility)
    - Remove `telefon` column
    - Add `country` column

  2. Data Migration
    - Updates existing data structure
    - Maintains data integrity
*/

-- Add new country column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'anmeldungen' AND column_name = 'country'
  ) THEN
    ALTER TABLE anmeldungen ADD COLUMN country text DEFAULT '';
  END IF;
END $$;

-- Rename schule to team_manager_name if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'anmeldungen' AND column_name = 'schule'
  ) THEN
    ALTER TABLE anmeldungen RENAME COLUMN schule TO team_manager_name;
  END IF;
END $$;

-- Remove telefon column if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'anmeldungen' AND column_name = 'telefon'
  ) THEN
    ALTER TABLE anmeldungen DROP COLUMN telefon;
  END IF;
END $$;