/*
  # Add authentication policies

  1. Security Updates
    - Add policies for user profile management
    - Add policies for session handling
    - Add policies for role-based access

  2. Changes
    - Add policy for users to read their own profile
    - Add policy for users to update their own profile
    - Add policy for basic user information visibility
*/

-- Ensure users can read their own profile and basic info of other users
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.owner_id = users.id
      AND p.status = 'open'
    )
  );

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add index for faster user lookups
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);

-- Add a function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT role FROM users WHERE id = user_id;
$$;