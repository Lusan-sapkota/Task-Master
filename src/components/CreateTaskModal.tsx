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
  IonButtons
} from '@ionic/react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface CreateTaskModalProps {
  isOpen: boolean;
  onDidDismiss: () => void;
}

export function CreateTaskModal({ isOpen, onDidDismiss }: CreateTaskModalProps) {
  const { session } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('personal');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState<string>();

  const handleSubmit = async () => {
    if (!session?.user) {
      toast.error('You must be logged in to create tasks');
      return;
    }

    try {
      const { error } = await supabase.from('tasks').insert({
        title,
        description,
        category,
        priority,
        due_date: dueDate,
        user_id: session.user.id // Explicitly set the user_id
      });

      if (error) throw error;

      toast.success('Task created');
      onDidDismiss();
      resetForm();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Error creating task');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('personal');
    setPriority('medium');
    setDueDate(undefined);
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>New Task</IonTitle>
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
            Create Task
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
}