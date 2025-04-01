/*
  # Update professional constraints and indexes safely

  1. Changes
    - Add unique constraint for professional requests if not exists
    - Add missing indexes if not exists
    - Update professional visibility policies
*/

DO $$ 
BEGIN
    -- Check if the constraint exists before creating it
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'unique_professional_request'
        AND table_name = 'professional_requests'
    ) THEN
        ALTER TABLE professional_requests
        ADD CONSTRAINT unique_professional_request UNIQUE (project_id, professional_id);
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_professional_profiles_expertise ON professional_profiles(expertise);

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Professionals can view open projects" ON projects;

-- Create updated policy
CREATE POLICY "Professionals can view open projects"
ON projects
FOR SELECT
TO authenticated
USING (
  status = 'open'
  OR EXISTS (
    SELECT 1 FROM professional_requests pr
    WHERE pr.project_id = id
    AND pr.professional_id = auth.uid()
  )
);


-- First create a function that bypasses RLS
CREATE OR REPLACE FUNCTION has_professional_request(p_project_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM professional_requests
    WHERE project_id = p_project_id
    AND professional_id = p_user_id
  );
$$;

-- Then update your policy to use the function
DROP POLICY IF EXISTS "Professionals can view open projects" ON projects;
CREATE POLICY "Professionals can view open projects"
ON projects
FOR SELECT
TO authenticated
USING (
  status = 'open'
  OR has_professional_request(id, auth.uid())
);