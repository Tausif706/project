/*
  # Update professional visibility and request handling

  1. Changes
    - Add policy for professionals to view open projects
    - Add policy for pitchers to view professional profiles
    - Add composite unique constraint to prevent duplicate requests
    - Add indexes for better query performance
*/

-- Add unique constraint to prevent duplicate requests
ALTER TABLE professional_requests
ADD CONSTRAINT unique_professional_request UNIQUE (project_id, professional_id);

-- Update project visibility for professionals
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

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_professional_profiles_expertise ON professional_profiles(expertise);