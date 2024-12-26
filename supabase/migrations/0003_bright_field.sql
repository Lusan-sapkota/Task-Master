/*
  # Add Task History and Status Tracking

  1. New Tables
    - task_history: Stores completed and expired tasks
    - user_profiles: Stores user profile information
  
  2. Changes
    - Add status and expiration tracking to tasks table
    - Add notification preferences
*/

-- Create task_history table
CREATE TABLE task_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  priority text NOT NULL,
  due_date timestamptz,
  completed_at timestamptz,
  expired_at timestamptz,
  status text NOT NULL CHECK (status IN ('completed', 'expired')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS for task_history
ALTER TABLE task_history ENABLE ROW LEVEL SECURITY;

-- Create user_profiles table
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  username text,
  avatar_url text,
  notification_preferences jsonb DEFAULT '{"enabled": true}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for task_history
CREATE POLICY "Users can read own task history"
  ON task_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own task history"
  ON task_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add RLS policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Add status and expiration tracking to tasks
ALTER TABLE tasks 
  ADD COLUMN status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  ADD COLUMN notification_sent_at timestamptz[];