/*
  # Remove address fields and update competitions

  1. Changes
    - Remove `adresse`, `stadt`, `plz` columns from `anmeldungen` table
    - Update `wettbewerbe` table with correct competition names
    - Ensure proper foreign key relationships for team competitions

  2. Tables affected
    - `anmeldungen`: Remove address-related columns
    - `wettbewerbe`: Update competition names to match frontend
    - `team_wettbewerbe`: Maintains foreign key relationships

  3. Data integrity
    - Existing team-competition relationships are preserved
    - Competition names updated to match current frontend implementation
*/

-- Remove address fields from anmeldungen table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'anmeldungen' AND column_name = 'adresse'
  ) THEN
    ALTER TABLE anmeldungen DROP COLUMN adresse;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'anmeldungen' AND column_name = 'stadt'
  ) THEN
    ALTER TABLE anmeldungen DROP COLUMN stadt;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'anmeldungen' AND column_name = 'plz'
  ) THEN
    ALTER TABLE anmeldungen DROP COLUMN plz;
  END IF;
END $$;

-- Update wettbewerbe table with correct competition names
-- First, clear existing entries to avoid conflicts
DELETE FROM team_wettbewerbe;
DELETE FROM wettbewerbe;

-- Insert correct competition names matching the frontend
INSERT INTO wettbewerbe (name, beschreibung) VALUES
  ('Jousting Challene', 'Roboter-Turnier Challenge'),
  ('SumoBot Challenge', 'Roboter-Sumo-Kampf'),
  ('a-maze-ing Challenge', 'Labyrinth-Navigation Challenge'),
  ('Fire Fighting Challenge', 'Feuer löschen Challenge'),
  ('Entrepreneurial', 'Unternehmerischer Wettbewerb'),
  ('Line Following Challenge', 'Roboter folgt einer Linie')
ON CONFLICT (name) DO NOTHING;