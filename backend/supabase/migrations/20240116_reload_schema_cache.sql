-- Force PostgREST to reload the schema cache
-- Run this in the Supabase SQL Editor
NOTIFY pgrst, 'reload config';
