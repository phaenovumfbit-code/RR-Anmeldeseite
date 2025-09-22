/*
  # Add competitions column to teams table

  1. Changes
    - Add `wettbewerbe` column to `teams` table to store selected competitions as JSON array
    - This simplifies the data model and avoids complex many-to-many relationships

  2. Data Structure
    - `wettbewerbe` will store an array of competition names as JSON
    - Example: ["Jousting Challenge", "SumoBot Challenge"]

  3. Benefits
    - Simpler data model
    - No need for complex joins
    - Direct storage of team competitions
*/

-- Add wettbewerbe column to teams table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'teams' AND column_name = 'wettbewerbe'
  ) THEN
    ALTER TABLE teams ADD COLUMN wettbewerbe jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;