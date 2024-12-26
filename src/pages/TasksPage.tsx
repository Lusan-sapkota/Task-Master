import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButtons,
  IonButton,
  IonSearchbar,
} from '@ionic/react';
import { add, personCircle, timeOutline, logOutOutline } from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { TaskItem } from '@/components/TaskItem';
import { CreateTaskModal } from '@/components/CreateTaskModal';
import { ProfileModal } from '@/components/profile/ProfileModal';
import { TaskHistory } from '@/components/history/TaskHistory';
import { supabase } from '@/lib/supabase';
import { useTasks } from '@/hooks/useTasks';
import { useTaskSubscription } from '@/hooks/useTaskSubscription';
import { requestNotificationPermission } from '@/lib/notifications';
import { cleanupExpiredTasks } from '@/lib/taskManager';

export function TasksPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { tasks, loading } = useTasks();

  // Set up task subscription for notifications
  useTaskSubscription();

  useEffect(() => {
    // Request notification permission when component mounts
    requestNotificationPermission();

    // Clean up expired tasks every minute
    const cleanup = setInterval(cleanupExpiredTasks, 60000);
    return () => clearInterval(cleanup);
  }, []);

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tasks</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowHistoryModal(true)}>
              <IonIcon icon={timeOutline} />
            </IonButton>
            <IonButton onClick={() => setShowProfileModal(true)}>
              <IonIcon icon={personCircle} />
            </IonButton>
            <IonButton onClick={handleLogout}>
              <IonIcon icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchText}
            onIonChange={e => setSearchText(e.detail.value!)}
            placeholder="Search tasks"
          />
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {loading ? (
          <div className="flex h-full items-center justify-center">
            Loading tasks...
          </div>
        ) : (
          <IonList>
            {filteredTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </IonList>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowCreateModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <CreateTaskModal
          isOpen={showCreateModal}
          onDidDismiss={() => setShowCreateModal(false)}
        />

        <ProfileModal
          isOpen={showProfileModal}
          onDidDismiss={() => setShowProfileModal(false)}
        />

        <TaskHistory
          isOpen={showHistoryModal}
          onDidDismiss={() => setShowHistoryModal(false)}
        />
      </IonContent>
    </IonPage>
  );
}