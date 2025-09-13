/*
  # RoboRave Germany Anmeldungssystem

  1. Neue Tabellen
    - `anmeldungen` - Haupttabelle für Anmeldungen mit Schul- und Kontaktdaten
    - `teams` - Teams pro Anmeldung
    - `team_wettbewerbe` - Wettbewerbe pro Team (Many-to-Many Relation)
    - `teilnehmer` - Teilnehmer pro Team
    - `wettbewerbe` - Verfügbare Wettbewerbe (Referenztabelle)

  2. Sicherheit
    - RLS aktiviert für alle Tabellen
    - Policies für öffentlichen Zugriff (da es ein Anmeldeformular ist)

  3. Relationen
    - anmeldungen -> teams (1:n)
    - teams -> teilnehmer (1:n)
    - teams -> team_wettbewerbe -> wettbewerbe (n:m)
*/

-- Wettbewerbe Referenztabelle
CREATE TABLE IF NOT EXISTS wettbewerbe (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  beschreibung text,
  created_at timestamptz DEFAULT now()
);

-- Haupttabelle für Anmeldungen
CREATE TABLE IF NOT EXISTS anmeldungen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schule text NOT NULL,
  adresse text DEFAULT '',
  stadt text DEFAULT '',
  plz text DEFAULT '',
  ansprechperson text NOT NULL,
  email text NOT NULL,
  telefon text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Teams Tabelle
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  anmeldung_id uuid REFERENCES anmeldungen(id) ON DELETE CASCADE,
  team_name text NOT NULL,
  zusaetzliche_info text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Teilnehmer Tabelle
CREATE TABLE IF NOT EXISTS teilnehmer (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  vorname text NOT NULL,
  nachname text NOT NULL,
  geburtsdatum date,
  klassenstufe text DEFAULT '',
  rolle text DEFAULT 'Teilnehmer',
  created_at timestamptz DEFAULT now()
);

-- Many-to-Many Relation zwischen Teams und Wettbewerben
CREATE TABLE IF NOT EXISTS team_wettbewerbe (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  wettbewerb_id uuid REFERENCES wettbewerbe(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(team_id, wettbewerb_id)
);

-- Wettbewerbe einfügen
INSERT INTO wettbewerbe (name, beschreibung) VALUES
  ('Line Following Challenge', 'Roboter folgt einer Linie'),
  ('Sumobot Challenge', 'Roboter-Sumo-Kampf'),
  ('A-Maze-Ing-Challenge', 'Labyrinth-Navigation'),
  ('Fire Fighting Challenge', 'Feuer löschen'),
  ('Jousting Challenge', 'Roboter-Turnier'),
  ('Entrepreneurial', 'Unternehmerischer Wettbewerb')
ON CONFLICT (name) DO NOTHING;

-- RLS aktivieren
ALTER TABLE anmeldungen ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE teilnehmer ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_wettbewerbe ENABLE ROW LEVEL SECURITY;
ALTER TABLE wettbewerbe ENABLE ROW LEVEL SECURITY;

-- Policies für öffentlichen Zugriff (Anmeldeformular)
CREATE POLICY "Anmeldungen können erstellt werden"
  ON anmeldungen
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Teams können erstellt werden"
  ON teams
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Teilnehmer können erstellt werden"
  ON teilnehmer
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Team-Wettbewerbe können erstellt werden"
  ON team_wettbewerbe
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Wettbewerbe können gelesen werden"
  ON wettbewerbe
  FOR SELECT
  TO anon
  USING (true);

-- Policies für authentifizierte Benutzer (Admin-Zugriff)
CREATE POLICY "Authentifizierte Benutzer können alles lesen"
  ON anmeldungen
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authentifizierte Benutzer können Teams lesen"
  ON teams
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authentifizierte Benutzer können Teilnehmer lesen"
  ON teilnehmer
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authentifizierte Benutzer können Team-Wettbewerbe lesen"
  ON team_wettbewerbe
  FOR SELECT
  TO authenticated
  USING (true);

-- Trigger für updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_anmeldungen_updated_at 
  BEFORE UPDATE ON anmeldungen 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();