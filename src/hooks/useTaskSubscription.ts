import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { scheduleTaskNotifications } from '@/lib/notifications';

export function useTaskSubscription() {
  useEffect(() => {
    const subscription = supabase
      .channel('tasks')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            scheduleTaskNotifications(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);
}