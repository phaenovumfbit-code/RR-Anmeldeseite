/*
  # Add teamname field to teilnehmer table

  1. Changes
    - Add `teamname` column to `teilnehmer` table
    - This allows tracking which team each participant belongs to
    - Useful for reporting and data organization

  2. Benefits
    - Better data organization
    - Easier reporting and filtering
    - Redundant storage for performance (avoids joins)

  3. Data Structure
    - `teamname` will store the team name as text
    - This duplicates the team name from the teams table for easier access
*/

-- Add teamname column to teilnehmer table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'teilnehmer' AND column_name = 'teamname'
  ) THEN
    ALTER TABLE teilnehmer ADD COLUMN teamname text DEFAULT '';
  END IF;
END $$;