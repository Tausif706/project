/*
  # Add professional-specific tables and updates

  1. New Tables
    - `mentor_earnings`
      - `id` (uuid, primary key)
      - `mentor_id` (uuid) - References users.id
      - `amount` (decimal)
      - `project` (text)
      - `created_at` (timestamptz)

    - `mentor_stats`
      - `mentor_id` (uuid, primary key) - References users.id
      - `total_earnings` (decimal)
      - `pending_earnings` (decimal)
      - `updated_at` (timestamptz)

  2. Updates
    - Add `looking_for` column to projects table
    - Add `industry` and `stage` columns to projects table

  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Add new columns to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS looking_for text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS industry text,
ADD COLUMN IF NOT EXISTS stage text;

-- Create mentor_earnings table
CREATE TABLE IF NOT EXISTS mentor_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid REFERENCES users(id) NOT NULL,
  amount decimal NOT NULL,
  project text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create mentor_stats table
CREATE TABLE IF NOT EXISTS mentor_stats (
  mentor_id uuid PRIMARY KEY REFERENCES users(id),
  total_earnings decimal DEFAULT 0,
  pending_earnings decimal DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE mentor_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Mentors can view their own earnings"
  ON mentor_earnings
  FOR SELECT
  TO authenticated
  USING (mentor_id = auth.uid());

CREATE POLICY "Mentors can view their own stats"
  ON mentor_stats
  FOR SELECT
  TO authenticated
  USING (mentor_id = auth.uid());

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_mentor_earnings_mentor_id ON mentor_earnings(mentor_id);

-- Create function to update mentor stats
CREATE OR REPLACE FUNCTION update_mentor_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO mentor_stats (mentor_id, total_earnings, pending_earnings)
  VALUES (NEW.mentor_id, NEW.amount, 0)
  ON CONFLICT (mentor_id)
  DO UPDATE SET
    total_earnings = mentor_stats.total_earnings + NEW.amount,
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating mentor stats
CREATE TRIGGER update_mentor_stats_after_earnings
  AFTER INSERT ON mentor_earnings
  FOR EACH ROW
  EXECUTE FUNCTION update_mentor_stats();

-- Update projects policies
CREATE POLICY "Professionals can view seeking_mentor projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (
    status = 'seeking_mentor'
    OR EXISTS (
      SELECT 1 FROM mentorships m
      WHERE m.project_id = id
      AND m.mentor_id = auth.uid()
    )
  );