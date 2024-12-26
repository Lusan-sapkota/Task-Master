import { supabase } from './supabase';
import type { Task } from '@/types';

export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

export function scheduleTaskNotifications(task: Task) {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  if (!task.due_date) return;

  const dueDate = new Date(task.due_date);
  const now = new Date();
  const timeUntilDue = dueDate.getTime() - now.getTime();

  // Schedule notifications at 12h, 6h, and 3h before due date
  const notificationTimes = [12 * 3600000, 6 * 3600000, 3 * 3600000];

  notificationTimes.forEach(time => {
    if (timeUntilDue > time) {
      setTimeout(() => {
        sendTaskNotification(task, time);
      }, timeUntilDue - time);
    }
  });
}

function sendTaskNotification(task: Task, timeRemaining: number) {
  const hours = timeRemaining / 3600000;
  const notification = new Notification(`Task Reminder: ${task.title}`, {
    body: `You have ${hours} hours remaining to complete this task.`,
    icon: '/favicon.ico'
  });

  // Update notification_sent_at in the database
  supabase.from('tasks')
    .update({ 
      notification_sent_at: supabase.sql`array_append(notification_sent_at, now())`
    })
    .eq('id', task.id);
}