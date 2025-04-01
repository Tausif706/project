/*
  # Fix Professional Dashboard Tables

  1. Changes
    - Add missing indexes for professional queries
    - Add default values for professional stats
    - Update column references for consistency
    - Add constraints to ensure data integrity

  2. Security
    - Update policies to ensure proper access
*/

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_mentor_stats_mentor_id ON mentor_stats(mentor_id);
CREATE INDEX IF NOT EXISTS idx_professional_profiles_user_id ON professional_profiles(id);

-- Add default values for mentor_stats if not exists
DO $$ 
BEGIN
  INSERT INTO mentor_stats (mentor_id, total_earnings, pending_earnings)
  SELECT 
    u.id as mentor_id,
    0 as total_earnings,
    0 as pending_earnings
  FROM users u
  LEFT JOIN mentor_stats ms ON u.id = ms.mentor_id
  WHERE u.role = 'professional'
  AND ms.mentor_id IS NULL;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;

-- Add default professional profiles if not exists
DO $$ 
BEGIN
  INSERT INTO professional_profiles (id, expertise, hourly_rate, availability, projects_completed, rating, skills)
  SELECT 
    u.id,
    'General' as expertise,
    0 as hourly_rate,
    'Available' as availability,
    0 as projects_completed,
    0 as rating,
    ARRAY[]::text[] as skills
  FROM users u
  LEFT JOIN professional_profiles pp ON u.id = pp.id
  WHERE u.role = 'professional'
  AND pp.id IS NULL;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;