/*
  # Add tasks and mentorships tables

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `project_id` (uuid) - References projects.id
      - `title` (text)
      - `description` (text)
      - `status` (text)
      - `assigned_to` (uuid) - References users.id
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

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
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) NOT NULL,
  title text NOT NULL,
  description text,
  status text DEFAULT 'todo',
  assigned_to uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

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
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorships ENABLE ROW LEVEL SECURITY;

-- Tasks policies
CREATE POLICY "Project members can manage tasks"
  ON tasks
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = tasks.project_id
      AND (
        p.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM collaborator_requests cr
          WHERE cr.project_id = p.id
          AND cr.user_id = auth.uid()
          AND cr.status = 'accepted'
        )
        OR EXISTS (
          SELECT 1 FROM mentorships m
          WHERE m.project_id = p.id
          AND m.mentor_id = auth.uid()
          AND m.status = 'active'
        )
      )
    )
  );

-- Mentorships policies
CREATE POLICY "Project owners can manage mentorships"
  ON mentorships
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = mentorships.project_id
      AND p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Mentors can view and update their mentorships"
  ON mentorships
  FOR ALL TO authenticated
  USING (mentor_id = auth.uid());

-- Add updated_at triggers
CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER mentorships_updated_at
  BEFORE UPDATE ON mentorships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();