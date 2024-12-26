import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonAvatar,
  IonButtons,
} from '@ionic/react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface ProfileModalProps {
  isOpen: boolean;
  onDidDismiss: () => void;
}

export function ProfileModal({ isOpen, onDidDismiss }: ProfileModalProps) {
  const { session } = useAuth();
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${session?.user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await supabase
        .from('user_profiles')
        .upsert({
          id: session?.user.id,
          avatar_url: data.publicUrl,
          username
        });

      setAvatarUrl(data.publicUrl);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setUploading(false);
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit Profile</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDidDismiss}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="space-y-6">
          <div className="flex justify-center">
            <IonAvatar className="h-24 w-24">
              <img
                src={avatarUrl || `https://ui-avatars.com/api/?name=${session?.user.email}&background=random`}
                alt="Profile"
              />
            </IonAvatar>
          </div>

          <div className="text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
              id="avatar-upload"
            />
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark"
            >
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </label>
          </div>

          <IonItem>
            <IonLabel position="floating">Username</IonLabel>
            <IonInput
              value={username}
              onIonChange={e => setUsername(e.detail.value!)}
              placeholder="Enter username"
            />
          </IonItem>

          <IonItem>
            <IonLabel>Email</IonLabel>
            <IonInput value={session?.user.email} readonly />
          </IonItem>
        </div>
      </IonContent>
    </IonModal>
  );
}