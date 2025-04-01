/*
  # Update chat and message policies

  1. Changes
    - Update message policies to allow proper access for all project members
    - Add policy for collaborators to view project messages
    - Add policy for mentors to view project messages
    - Fix user visibility issues

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
        OR
        -- Active mentor
        EXISTS (
          SELECT 1 FROM mentorships m
          WHERE m.project_id = p.id
          AND m.mentor_id = auth.uid()
          AND m.status = 'active'
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
        OR
        -- Active mentor
        EXISTS (
          SELECT 1 FROM mentorships m
          WHERE m.project_id = p.id
          AND m.mentor_id = auth.uid()
          AND m.status = 'active'
        )
      )
    )
  );

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
        OR
        -- As mentor
        EXISTS (
          SELECT 1 FROM mentorships m
          WHERE m.project_id = p.id
          AND m.mentor_id = auth.uid()
          AND m.status = 'active'
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
        OR
        -- Can view project mentors
        EXISTS (
          SELECT 1 FROM mentorships m
          WHERE m.project_id = p.id
          AND m.mentor_id = users.id
          AND m.status = 'active'
        )
      )
    )
  );