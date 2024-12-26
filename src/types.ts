export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}