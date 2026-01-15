-- Enable Row Level Security on the table (ensure it is on)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create (or replace) a policy to allow authenticated users to INSERT their own appointments
-- This ensures a user can only book an appointment if they set themselves as the patient
CREATE POLICY "Allow patients to insert their own appointments"
ON public.appointments
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = patient_id
);

-- Also allow users to VIEW (SELECT) their own appointments
CREATE POLICY "Allow patients to view their own appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (
  auth.uid() = patient_id OR auth.uid() = doctor_id
);
