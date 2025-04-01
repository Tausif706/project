-- /*
--   # Add professionals-related tables and updates

--   1. New Tables
--     - `professional_profiles`
--       - `id` (uuid, primary key) - References users.id
--       - `expertise` (text)
--       - `hourly_rate` (decimal)
--       - `availability` (text)
--       - `projects_completed` (integer)
--       - `rating` (decimal)
--       - `skills` (text[])
--       - `created_at` (timestamptz)
--       - `updated_at` (timestamptz)

--     - `professional_requests`
--       - `id` (uuid, primary key)
--       - `project_id` (uuid) - References projects.id
--       - `professional_id` (uuid) - References users.id
--       - `status` (text)
--       - `created_at` (timestamptz)
--       - `updated_at` (timestamptz)

--   2. Security
--     - Enable RLS on all tables
--     - Add policies for authenticated users
-- */

-- -- Create professional_profiles table
-- CREATE TABLE IF NOT EXISTS professional_profiles (
--   id uuid PRIMARY KEY REFERENCES users(id),
--   expertise text NOT NULL,
--   hourly_rate decimal NOT NULL,
--   availability text,
--   projects_completed integer DEFAULT 0,
--   rating decimal DEFAULT 0,
--   skills text[],
--   created_at timestamptz DEFAULT now(),
--   updated_at timestamptz DEFAULT now()
-- );

-- -- Create professional_requests table
-- CREATE TABLE IF NOT EXISTS professional_requests (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   project_id uuid REFERENCES projects(id) NOT NULL,
--   professional_id uuid REFERENCES users(id) NOT NULL,
--   status text DEFAULT 'pending',
--   created_at timestamptz DEFAULT now(),
--   updated_at timestamptz DEFAULT now()
-- );

-- -- Enable RLS
-- ALTER TABLE professional_profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE professional_requests ENABLE ROW LEVEL SECURITY;

-- -- Create policies for professional_profiles
-- CREATE POLICY "Professionals can manage their own profile"
--   ON professional_profiles
--   FOR ALL
--   TO authenticated
--   USING (id = auth.uid());

-- CREATE POLICY "Users can view professional profiles"
--   ON professional_profiles
--   FOR SELECT
--   TO authenticated
--   USING (true);

-- -- Create policies for professional_requests
-- CREATE POLICY "Project owners can create and manage requests"
--   ON professional_requests
--   FOR ALL
--   TO authenticated
--   USING (
--     EXISTS (
--       SELECT 1 FROM projects
--       WHERE projects.id = professional_requests.project_id
--       AND projects.owner_id = auth.uid()
--     )
--   );

-- CREATE POLICY "Professionals can view requests for them"
--   ON professional_requests
--   FOR SELECT
--   TO authenticated
--   USING (professional_id = auth.uid());

-- -- Add updated_at triggers
-- CREATE TRIGGER professional_profiles_updated_at
--   BEFORE UPDATE ON professional_profiles
--   FOR EACH ROW
--   EXECUTE FUNCTION update_updated_at();

-- CREATE TRIGGER professional_requests_updated_at
--   BEFORE UPDATE ON professional_requests
--   FOR EACH ROW
--   EXECUTE FUNCTION update_updated_at();

-- -- Add indexes for better performance
-- CREATE INDEX IF NOT EXISTS idx_professional_requests_project_id 
--   ON professional_requests(project_id);
-- CREATE INDEX IF NOT EXISTS idx_professional_requests_professional_id 
--   ON professional_requests(professional_id);


-- Enable extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create professional_profiles table
CREATE TABLE IF NOT EXISTS professional_profiles (
  id uuid PRIMARY KEY REFERENCES users(id),
  expertise text NOT NULL,
  hourly_rate decimal NOT NULL,
  availability text,
  projects_completed integer DEFAULT 0,
  rating decimal DEFAULT 0,
  skills text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create professional_requests table
CREATE TABLE IF NOT EXISTS professional_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) NOT NULL,
  professional_id uuid REFERENCES users(id) NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_project_professional UNIQUE (project_id, professional_id)
);

-- Create mentorships table (if not exists)
CREATE TABLE IF NOT EXISTS mentorships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) NOT NULL,
  mentor_id uuid REFERENCES users(id) NOT NULL,
  status text DEFAULT 'active',
  progress integer DEFAULT 0,
  next_meeting timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_project_mentor UNIQUE (project_id, mentor_id)
);

-- Enable Row Level Security
ALTER TABLE professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorships ENABLE ROW LEVEL SECURITY;

-- Professional Profiles Policies
CREATE POLICY "Professionals can manage their own profile" 
  ON professional_profiles
  FOR ALL
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "All users can view professional profiles"
  ON professional_profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Professional Requests Policies
CREATE POLICY "Project owners can create requests"
  ON professional_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = professional_requests.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can manage their requests"
  ON professional_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = professional_requests.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Professionals can view and respond to their requests"
  ON professional_requests
  FOR SELECT
  TO authenticated
  USING (professional_id = auth.uid());

CREATE POLICY "Professionals can update request status"
  ON professional_requests
  FOR UPDATE
  TO authenticated
  USING (professional_id = auth.uid())
  WITH CHECK (professional_id = auth.uid());

-- Mentorships Policies
CREATE POLICY "Mentors can manage their mentorships"
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

-- Create update_updated_at function if not exists
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER professional_profiles_updated_at
  BEFORE UPDATE ON professional_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER professional_requests_updated_at
  BEFORE UPDATE ON professional_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER mentorships_updated_at
  BEFORE UPDATE ON mentorships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to create mentorship when request is accepted
CREATE OR REPLACE FUNCTION create_mentorship_from_accepted_request()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    INSERT INTO mentorships (project_id, mentor_id, status)
    VALUES (NEW.project_id, NEW.professional_id, 'active')
    ON CONFLICT (project_id, mentor_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create mentorship when request is accepted
CREATE TRIGGER trigger_create_mentorship
AFTER UPDATE ON professional_requests
FOR EACH ROW
EXECUTE FUNCTION create_mentorship_from_accepted_request();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_professional_requests_project_id ON professional_requests(project_id);
CREATE INDEX IF NOT EXISTS idx_professional_requests_professional_id ON professional_requests(professional_id);
CREATE INDEX IF NOT EXISTS idx_professional_requests_status ON professional_requests(status);
CREATE INDEX IF NOT EXISTS idx_mentorships_project_id ON mentorships(project_id);
CREATE INDEX IF NOT EXISTS idx_mentorships_mentor_id ON mentorships(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentorships_status ON mentorships(status);

-- Update projects table if needed
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS looking_for text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS industry text,
ADD COLUMN IF NOT EXISTS stage text;

-- Update projects policy for professionals
DROP POLICY IF EXISTS "Professionals can view seeking_mentor projects" ON projects;

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
    OR id IN (
      SELECT project_id FROM professional_requests
      WHERE professional_id = auth.uid()
    )
  );  





-- DROP POLICY IF EXISTS "Professionals can view seeking_mentor projects" ON projects;
-- CREATE POLICY "Professionals can view seeking_mentor projects"
-- ON projects
-- FOR SELECT
-- TO authenticated
-- USING (
--   status = 'seeking_mentor'
--   AND EXISTS (
--     SELECT 1 FROM professional_profiles
--     WHERE professional_profiles.id = auth.uid()
--   )
-- );

-- CREATE POLICY "Mentors can view their projects"
-- ON projects
-- FOR SELECT
-- TO authenticated
-- USING (
--   EXISTS (
--     SELECT 1 FROM mentorships
--     WHERE mentorships.project_id = projects.id
--     AND mentorships.mentor_id = auth.uid()
--   )
-- );

-- CREATE POLICY "Professionals can view requested projects"
-- ON projects
-- FOR SELECT
-- TO authenticated
-- USING (
--   EXISTS (
--     SELECT 1 FROM professional_requests
--     WHERE professional_requests.project_id = projects.id
--     AND professional_requests.professional_id = auth.uid()
--   )
-- );
DROP POLICY IF EXISTS "Professionals can view seeking_mentor projects" ON projects;
DROP POLICY IF EXISTS "Mentors can view their projects" ON projects;
DROP POLICY IF EXISTS "Professionals can view requested projects" ON projects;

-- Base policy for project owners
CREATE POLICY "Project owners can access their projects" 
ON projects
FOR ALL
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- Public view of seeking_mentor projects
CREATE POLICY "Public view of seeking_mentor projects"
ON projects
FOR SELECT
TO authenticated
USING (status = 'seeking_mentor');

-- Alternative approach for mentor access using a function
CREATE OR REPLACE FUNCTION is_project_mentor(project_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM mentorships 
    WHERE mentorships.project_id = is_project_mentor.project_id
    AND mentorships.mentor_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "Mentors can access their projects"
ON projects
FOR SELECT
TO authenticated
USING (is_project_mentor(id));

-- Alternative approach for professional requests using a function
CREATE OR REPLACE FUNCTION has_professional_request(project_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM professional_requests
    WHERE professional_requests.project_id = has_professional_request.project_id
    AND professional_requests.professional_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "Professionals can access requested projects"
ON projects
FOR SELECT
TO authenticated
USING (has_professional_request(id));

CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_mentorships_mentor ON mentorships(mentor_id);
CREATE INDEX IF NOT EXISTS idx_professional_requests_professional ON professional_requests(professional_id);