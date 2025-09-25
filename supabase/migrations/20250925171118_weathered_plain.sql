/*
  # Change birthdate field to text to allow German date format

  1. Changes
    - Change `geburtsdatum` column from `date` to `text` type
    - This allows storing German date format (DD.MM.YYYY)
    - Existing data will be preserved

  2. Benefits
    - Users can enter dates in familiar German format
    - No validation errors for date format
    - Flexible input handling
*/

-- Change geburtsdatum column from date to text
DO $$
BEGIN
  -- Check if column exists and is of date type
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'teilnehmer' 
    AND column_name = 'geburtsdatum'
    AND data_type = 'date'
  ) THEN
    -- Change column type to text
    ALTER TABLE teilnehmer ALTER COLUMN geburtsdatum TYPE text USING geburtsdatum::text;
  END IF;
  
  -- If column doesn't exist, create it as text
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'teilnehmer' AND column_name = 'geburtsdatum'
  ) THEN
    ALTER TABLE teilnehmer ADD COLUMN geburtsdatum text DEFAULT '';
  END IF;
END $$;