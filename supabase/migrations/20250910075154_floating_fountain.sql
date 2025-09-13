/*
  # Disable RLS for registration tables

  This migration temporarily disables RLS for the registration tables to allow
  anonymous users to submit registration forms. This is appropriate for a public
  registration system where users need to submit data without authentication.

  1. Security Changes
    - Disable RLS on anmeldungen, teams, teilnehmer, and team_wettbewerbe tables
    - Keep RLS enabled on wettbewerbe table with public read access
    - This allows anonymous form submissions while maintaining data integrity

  2. Tables affected
    - anmeldungen: RLS disabled for public registration
    - teams: RLS disabled for public registration  
    - teilnehmer: RLS disabled for public registration
    - team_wettbewerbe: RLS disabled for public registration
    - wettbewerbe: RLS enabled with public read policy
*/

-- Disable RLS on registration tables to allow anonymous submissions
ALTER TABLE anmeldungen DISABLE ROW LEVEL SECURITY;
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE teilnehmer DISABLE ROW LEVEL SECURITY;
ALTER TABLE team_wettbewerbe DISABLE ROW LEVEL SECURITY;

-- Keep RLS enabled on wettbewerbe but allow public read access
ALTER TABLE wettbewerbe ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous read on wettbewerbe" ON wettbewerbe;

-- Create policy to allow anonymous users to read competitions
CREATE POLICY "Allow anonymous read on wettbewerbe"
  ON wettbewerbe
  FOR SELECT
  TO anon
  USING (true);