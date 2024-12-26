import {
  IonItem,
  IonLabel,
  IonNote,
  IonBadge,
  IonIcon,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonCard,
} from '@ionic/react';
import { checkmarkCircle } from 'ionicons/icons';
import { format } from 'date-fns';
import { useState } from 'react';
import type { Task } from '@/types';
import { supabase } from '@/lib/supabase';
import { TaskMenu } from '@/components/TaskMenu';
import { EditTaskModal } from '@/components/EditTaskModal';
import toast from 'react-hot-toast';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleComplete = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          completed: !task.completed,
          status: !task.completed ? 'completed' : 'active'
        })
        .eq('id', task.id);

      if (error) throw error;
    } catch (error) {
      toast.error('Error updating task');
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', task.id);

      if (error) throw error;
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Error deleting task');
    }
  };

  return (
    <>
      <IonCard className="mx-4 my-2">
        <IonItemSliding>
          <IonItem className="pr-2" lines="none">
            <IonIcon
              icon={checkmarkCircle}
              slot="start"
              className={`h-6 w-6 ${task.completed ? 'text-green-600' : 'text-gray-400'}`}
              onClick={handleComplete}
            />
            <IonLabel>
              <h2 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h2>
              {task.description && (
                <p className="mt-1 text-sm text-gray-600">{task.description}</p>
              )}
              <div className="mt-2 flex items-center gap-2">
                <IonBadge
                  color={
                    task.priority === 'high' ? 'danger' :
                    task.priority === 'medium' ? 'warning' :
                    'success'
                  }
                >
                  {task.priority}
                </IonBadge>
                {task.due_date && (
                  <IonNote className="text-sm">
                    Due: {format(new Date(task.due_date), 'MMM d, h:mm a')}
                  </IonNote>
                )}
              </div>
            </IonLabel>
            <TaskMenu
              task={task}
              onEdit={() => setShowEditModal(true)}
              onDelete={handleDelete}
            />
          </IonItem>

          <IonItemOptions side="end">
            <IonItemOption color="danger" onClick={handleDelete}>
              Delete
            </IonItemOption>
          </IonItemOptions>
        </IonItemSliding>
      </IonCard>

      <EditTaskModal
        task={task}
        isOpen={showEditModal}
        onDidDismiss={() => setShowEditModal(false)}
      />
    </>
  );
}