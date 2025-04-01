/*
  # Update chat and message policies

  1. Changes
    - Update message policies to allow access for project owners and collaborators
    - Update user visibility policies
    - Add indexes for better performance

  2. Security
    - Ensure proper access control for chat features
    - Maintain data privacy between projects
*/

-- Drop existing message policies to recreate them
DROP POLICY IF EXISTS "Project members can read messages" ON messages;
DROP POLICY IF EXISTS "Project members can create messages" ON messages;

-- Create comprehensive message access policies
CREATE POLICY "Project members can read messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = messages.project_id
      AND (
        -- Project owner
        p.owner_id = auth.uid()
        OR
        -- Accepted collaborator
        EXISTS (
          SELECT 1 FROM collaborator_requests cr
          WHERE cr.project_id = p.id
          AND cr.user_id = auth.uid()
          AND cr.status = 'accepted'
        )
      )
    )
  );

CREATE POLICY "Project members can create messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = messages.project_id
      AND (
        -- Project owner
        p.owner_id = auth.uid()
        OR
        -- Accepted collaborator
        EXISTS (
          SELECT 1 FROM collaborator_requests cr
          WHERE cr.project_id = p.id
          AND cr.user_id = auth.uid()
          AND cr.status = 'accepted'
        )
      )
    )
  );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_project_id ON messages(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_collaborator_requests_project_id ON collaborator_requests(project_id);
CREATE INDEX IF NOT EXISTS idx_collaborator_requests_user_id ON collaborator_requests(user_id);

-- Update users policy to allow project members to view user information
CREATE POLICY "Project members can view user information"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    -- User can view their own info
    auth.uid() = id
    OR
    -- User can view info of members in their projects
    EXISTS (
      SELECT 1 FROM projects p
      WHERE (
        -- As project owner
        p.owner_id = auth.uid()
        OR
        -- As collaborator
        EXISTS (
          SELECT 1 FROM collaborator_requests cr
          WHERE cr.project_id = p.id
          AND cr.user_id = auth.uid()
          AND cr.status = 'accepted'
        )
      )
      AND (
        -- Can view project owner
        p.owner_id = users.id
        OR
        -- Can view project collaborators
        EXISTS (
          SELECT 1 FROM collaborator_requests cr
          WHERE cr.project_id = p.id
          AND cr.user_id = users.id
          AND cr.status = 'accepted'
        )
      )
    )
  );