/*
  # Ensure competitions exist with correct names

  1. Changes
    - Clear existing team-competition relationships
    - Clear existing competitions
    - Insert competitions with exact names matching frontend
    - Ensure proper foreign key relationships

  2. Competition Names (exact match with frontend)
    - 'Jousting Challenge'
    - 'SumoBot Challenge' 
    - 'a-maze-ing Challenge'
    - 'Fire Fighter Challenge'
    - 'Entrepreneurial'
    - 'Line Following Challenge'

  3. Data integrity
    - Clear existing data to avoid conflicts
    - Re-insert with correct names for proper matching
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
  ('Line Following Challenge', 'Roboter folgt einer Linie');

-- Verify the competitions were inserted
SELECT name FROM wettbewerbe ORDER BY name;