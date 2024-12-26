import { supabase } from './supabase';

export async function moveToHistory(taskId: string, status: 'completed' | 'expired') {
  const { data: task } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', taskId)
    .single();

  if (task) {
    // Insert into history
    await supabase.from('task_history').insert({
      ...task,
      status,
      [status === 'completed' ? 'completed_at' : 'expired_at']: new Date().toISOString()
    });

    // Delete from tasks
    await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
  }
}

export async function cleanupExpiredTasks() {
  const twelveHoursAgo = new Date();
  twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);

  const { data: expiredTasks } = await supabase
    .from('tasks')
    .select('id')
    .eq('status', 'active')
    .lt('due_date', twelveHoursAgo.toISOString());

  if (expiredTasks) {
    for (const task of expiredTasks) {
      await moveToHistory(task.id, 'expired');
    }
  }
}