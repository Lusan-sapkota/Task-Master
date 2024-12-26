import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonButtons,
  IonButton,
  IonModal,
} from '@ionic/react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface TaskHistoryProps {
  isOpen: boolean;
  onDidDismiss: () => void;
}

export function TaskHistory({ isOpen, onDidDismiss }: TaskHistoryProps) {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
      .from('task_history')
      .select('*')
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (!error && data) {
      setHistory(data);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Task History</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDidDismiss}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          {history.map(task => (
            <IonItem key={task.id}>
              <IonLabel>
                <h2>{task.title}</h2>
                <p>{format(new Date(task.created_at), 'MMM d, yyyy')}</p>
              </IonLabel>
              <IonBadge
                color={task.status === 'completed' ? 'success' : 'danger'}
                slot="end"
              >
                {task.status}
              </IonBadge>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonModal>
  );
}