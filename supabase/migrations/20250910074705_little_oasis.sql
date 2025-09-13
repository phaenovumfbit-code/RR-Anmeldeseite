/*
  # Fix RLS Policies for Anonymous Access

  1. Security Updates
    - Add INSERT policies for anonymous users on all tables
    - Allow anonymous users to create registrations, teams, participants
    - Allow anonymous users to link teams with competitions
    - Keep SELECT policies for authenticated users only (except competitions)

  2. Policy Details
    - `anmeldungen`: Allow anonymous INSERT
    - `teams`: Allow anonymous INSERT  
    - `teilnehmer`: Allow anonymous INSERT
    - `team_wettbewerbe`: Allow anonymous INSERT
    - `wettbewerbe`: Allow anonymous SELECT (for form options)
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anmeldungen können erstellt werden" ON anmeldungen;
DROP POLICY IF EXISTS "Authentifizierte Benutzer können alles lesen" ON anmeldungen;
DROP POLICY IF EXISTS "Teams können erstellt werden" ON teams;
DROP POLICY IF EXISTS "Authentifizierte Benutzer können Teams lesen" ON teams;
DROP POLICY IF EXISTS "Teilnehmer können erstellt werden" ON teilnehmer;
DROP POLICY IF EXISTS "Authentifizierte Benutzer können Teilnehmer lesen" ON teilnehmer;
DROP POLICY IF EXISTS "Team-Wettbewerbe können erstellt werden" ON team_wettbewerbe;
DROP POLICY IF EXISTS "Authentifizierte Benutzer können Team-Wettbewerbe lesen" ON team_wettbewerbe;
DROP POLICY IF EXISTS "Wettbewerbe können gelesen werden" ON wettbewerbe;

-- Create new policies for anmeldungen table
CREATE POLICY "Allow anonymous insert on anmeldungen"
  ON anmeldungen
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read on anmeldungen"
  ON anmeldungen
  FOR SELECT
  TO authenticated
  USING (true);

-- Create new policies for teams table
CREATE POLICY "Allow anonymous insert on teams"
  ON teams
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read on teams"
  ON teams
  FOR SELECT
  TO authenticated
  USING (true);

-- Create new policies for teilnehmer table
CREATE POLICY "Allow anonymous insert on teilnehmer"
  ON teilnehmer
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read on teilnehmer"
  ON teilnehmer
  FOR SELECT
  TO authenticated
  USING (true);

-- Create new policies for team_wettbewerbe table
CREATE POLICY "Allow anonymous insert on team_wettbewerbe"
  ON team_wettbewerbe
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow authenticated read on team_wettbewerbe"
  ON team_wettbewerbe
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy for wettbewerbe table (allow anonymous read for form options)
CREATE POLICY "Allow anonymous read on wettbewerbe"
  ON wettbewerbe
  FOR SELECT
  TO anon
  USING (true);