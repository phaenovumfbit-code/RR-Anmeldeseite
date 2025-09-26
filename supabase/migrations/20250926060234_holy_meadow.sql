/*
  # Ensure birthdate field is text type

  1. Changes
    - Ensure `geburtsdatum` column in `teilnehmer` table is of type `text`
    - Convert any existing date values to text format
    - Allow null values for optional birthdate

  2. Benefits
    - Supports German date format (DD.MM.YYYY)
    - Allows free text input
    - No validation errors for date format
*/

-- Ensure geburtsdatum column is text type
DO $$
BEGIN
  -- Check if column exists and change type if needed
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'teilnehmer' 
    AND column_name = 'geburtsdatum'
  ) THEN
    -- Change column type to text, converting existing values
    ALTER TABLE teilnehmer ALTER COLUMN geburtsdatum TYPE text USING 
      CASE 
        WHEN geburtsdatum IS NULL THEN NULL
        ELSE geburtsdatum::text
      END;
  ELSE
    -- If column doesn't exist, create it as text
    ALTER TABLE teilnehmer ADD COLUMN geburtsdatum text;
  END IF;
END $$;