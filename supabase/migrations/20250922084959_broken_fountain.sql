/*
  # Fix competition names to match frontend exactly

  1. Changes
    - Update competition names in wettbewerbe table to match frontend exactly
    - Ensure proper matching between frontend and database

  2. Competition Names
    - 'Jousting Challenge' (corrected spelling)
    - 'SumoBot Challenge' 
    - 'a-maze-ing Challenge'
    - 'Fire Fighter Challenge' (corrected from 'Fire Fighting Challenge')
    - 'Entrepreneurial'
    - 'Line Following Challenge'

  3. Data integrity
    - Clear existing team-competition relationships to avoid conflicts
    - Re-insert competitions with correct names
*/

-- Clear existing team-competition relationships to avoid conflicts
DELETE FROM team_wettbewerbe;

-- Clear existing competitions
DELETE FROM wettbewerbe;

-- Insert competitions with exact names matching the frontend
INSERT INTO wettbewerbe (name, beschreibung) VALUES
  ('Jousting Challenge', 'Roboter-Turnier Challenge'),
  ('SumoBot Challenge', 'Roboter-Sumo-Kampf'),
  ('a-maze-ing Challenge', 'Labyrinth-Navigation Challenge'),
  ('Fire Fighter Challenge', 'Feuer löschen Challenge'),
  ('Entrepreneurial', 'Unternehmerischer Wettbewerb'),
  ('Line Following Challenge', 'Roboter folgt einer Linie')
ON CONFLICT (name) DO NOTHING;