/*
  # Add INSERT policy for users table

  1. Changes
    - Add policy to allow authenticated users to create their own profile
    - This policy ensures users can only create their own profile during signup
*/

-- Allow users to insert their own profile
CREATE POLICY "Users can create own profile"
  ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);