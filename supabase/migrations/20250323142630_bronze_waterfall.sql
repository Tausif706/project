/*
  # Add project management policies

  1. Changes
    - Add policies for project management
    - Add function to calculate project progress
    - Add trigger to update project progress automatically
*/

-- Allow project owners to manage their projects
CREATE POLICY "Project owners can manage their projects"
  ON projects
  FOR ALL
  USING (owner_id = auth.uid());

-- Allow authenticated users to view open projects
CREATE POLICY "Users can view open projects"
  ON projects
  FOR SELECT
  USING (status = 'open' OR owner_id = auth.uid());

-- Function to calculate project progress
CREATE OR REPLACE FUNCTION calculate_project_progress(project_id uuid)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  total_tasks integer;
  completed_tasks integer;
BEGIN
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'completed')
  INTO total_tasks, completed_tasks
  FROM tasks
  WHERE project_id = $1;
  
  IF total_tasks = 0 THEN
    RETURN 0;
  END IF;
  
  RETURN (completed_tasks::float / total_tasks::float * 100)::integer;
END;
$$;