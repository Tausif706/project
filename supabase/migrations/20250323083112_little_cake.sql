/*
  # Create users and related tables

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - References auth.users
      - `name` (text)
      - `role` (text) - 'pitcher', 'collaborator', or 'professional'
      - `expertise` (text, nullable)
      - `skills` (text[], nullable)
      - `idea_description` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `projects`
      - `id` (uuid, primary key)
      - `owner_id` (uuid) - References users.id
      - `title` (text)
      - `description` (text)
      - `status` (text)
      - `progress` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `collaborator_requests`
      - `id` (uuid, primary key)
      - `project_id` (uuid) - References projects.id
      - `user_id` (uuid) - References users.id
      - `status` (text)
      - `created_at` (timestamptz)

    - `messages`
      - `id` (uuid, primary key)
      - `project_id` (uuid) - References projects.id
      - `user_id` (uuid) - References users.id
      - `content` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('pitcher', 'collaborator', 'professional')),
  expertise text,
  skills text[],
  idea_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES users(id) NOT NULL,
  title text NOT NULL,
  description text,
  status text DEFAULT 'draft',
  progress integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create collaborator_requests table
CREATE TABLE IF NOT EXISTS collaborator_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) NOT NULL,
  user_id uuid REFERENCES users(id) NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) NOT NULL,
  user_id uuid REFERENCES users(id) NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborator_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Project owners can manage their projects" ON projects
  FOR ALL TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can read projects" ON projects
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create collaboration requests" ON collaborator_requests
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Project owners can manage collaboration requests" ON collaborator_requests
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = collaborator_requests.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can read own collaboration requests" ON collaborator_requests
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Project members can read messages" ON messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = messages.project_id
      AND (
        projects.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM collaborator_requests
          WHERE collaborator_requests.project_id = messages.project_id
          AND collaborator_requests.user_id = auth.uid()
          AND collaborator_requests.status = 'accepted'
        )
      )
    )
  );

CREATE POLICY "Project members can create messages" ON messages
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = messages.project_id
      AND (
        projects.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM collaborator_requests
          WHERE collaborator_requests.project_id = messages.project_id
          AND collaborator_requests.user_id = auth.uid()
          AND collaborator_requests.status = 'accepted'
        )
      )
    )
  );

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();