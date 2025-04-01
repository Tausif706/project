/*
  # Add mentorships table

  1. New Table
    - `mentorships`
      - `id` (uuid, primary key)
      - `project_id` (uuid) - References projects.id
      - `mentor_id` (uuid) - References users.id
      - `status` (text)
      - `progress` (integer)
      - `next_meeting` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for mentors and project owners
*/

-- Create mentorships table
CREATE TABLE IF NOT EXISTS mentorships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) NOT NULL,
  mentor_id uuid REFERENCES users(id) NOT NULL,
  status text DEFAULT 'active',
  progress integer DEFAULT 0,
  next_meeting timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE mentorships ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Mentors can view and manage their mentorships"
  ON mentorships
  FOR ALL
  TO authenticated
  USING (mentor_id = auth.uid());

CREATE POLICY "Project owners can view their project mentorships"
  ON mentorships
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = mentorships.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- Add updated_at trigger
CREATE TRIGGER mentorships_updated_at
  BEFORE UPDATE ON mentorships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mentorships_mentor_id ON mentorships(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorships_project_id ON mentorships(project_id);

-- Add composite unique constraint to prevent duplicate mentorships
ALTER TABLE mentorships
ADD CONSTRAINT unique_project_mentor UNIQUE (project_id, mentor_id);


-- Step 1: Drop the existing policy (if it exists)
DROP POLICY IF EXISTS "Professionals can view seeking_mentor projects" ON projects;

-- Step 2: Create the new policy
CREATE POLICY "Professionals can view seeking_mentor projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (
    status = 'seeking_mentor'
    OR id IN (
      SELECT project_id FROM mentorships
      WHERE mentor_id = auth.uid()
    )
  );
