-- Add reason column to appointments table
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS reason TEXT;

-- Refresh the schema cache (Supabase specific helper comment)
NOTIFY pgrst, 'reload config';
