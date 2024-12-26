import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonButton,
  IonButtons,
} from '@ionic/react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Task } from '@/types';
import toast from 'react-hot-toast';

interface EditTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onDidDismiss: () => void;
}

export function EditTaskModal({ task, isOpen, onDidDismiss }: EditTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('personal');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState<string>();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setCategory(task.category);
      setPriority(task.priority);
      setDueDate(task.due_date || undefined);
    }
  }, [task]);

  const handleSubmit = async () => {
    if (!task) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title,
          description,
          category,
          priority,
          due_date: dueDate,
        })
        .eq('id', task.id);

      if (error) throw error;

      toast.success('Task updated successfully');
      onDidDismiss();
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Error updating task');
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit Task</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDidDismiss}>Cancel</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Title</IonLabel>
          <IonInput
            value={title}
            onIonChange={e => setTitle(e.detail.value!)}
            required
          />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Description</IonLabel>
          <IonTextarea
            value={description}
            onIonChange={e => setDescription(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonLabel>Category</IonLabel>
          <IonSelect value={category} onIonChange={e => setCategory(e.detail.value)}>
            <IonSelectOption value="personal">Personal</IonSelectOption>
            <IonSelectOption value="work">Work</IonSelectOption>
            <IonSelectOption value="shopping">Shopping</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel>Priority</IonLabel>
          <IonSelect value={priority} onIonChange={e => setPriority(e.detail.value)}>
            <IonSelectOption value="low">Low</IonSelectOption>
            <IonSelectOption value="medium">Medium</IonSelectOption>
            <IonSelectOption value="high">High</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel>Due Date</IonLabel>
          <IonDatetime
            value={dueDate}
            onIonChange={e => setDueDate(e.detail.value!)}
          />
        </IonItem>

        <div className="ion-padding">
          <IonButton expand="block" onClick={handleSubmit}>
            Update Task
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
}