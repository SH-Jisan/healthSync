-- Add new columns to ai_health_plans if they don't exist
ALTER TABLE public.ai_health_plans 
ADD COLUMN IF NOT EXISTS summary text,
ADD COLUMN IF NOT EXISTS precautions text;

-- Rename columns if necessary or ensure mappings (Logic handled in frontend, but ensuring columns exist)
-- We already have diet_plan and exercise_plan in the original schema (database.txt.txt)
-- Original: diet_plan, exercise_plan, lifestyle_tips
-- We actullay want to ensure we have: summary, diet_plan, exercise_plan, precautions. 

-- Make columns nullable just in case
ALTER TABLE public.ai_health_plans ALTER COLUMN diet_plan DROP NOT NULL;
ALTER TABLE public.ai_health_plans ALTER COLUMN exercise_plan DROP NOT NULL;

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload config';
