/*
  # Fix Tasks RLS Policies

  1. Changes
    - Update RLS policies to properly handle user_id
    - Add default value for user_id column
    - Ensure proper user authentication checks
*/

-- Update the user_id column to have a default value from auth.uid()
ALTER TABLE tasks ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;

-- Recreate policies with proper user_id handling
CREATE POLICY "Users can read own tasks"
ON tasks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
ON tasks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
ON tasks FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
ON tasks FOR DELETE
TO authenticated
USING (auth.uid() = user_id);