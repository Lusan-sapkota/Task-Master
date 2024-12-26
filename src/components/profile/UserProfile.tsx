import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonAvatar,
} from '@ionic/react';
import { logOutOutline } from 'ionicons/icons';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export function UserProfile() {
  const { session } = useAuth();
  const email = session?.user?.email;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="p-4">
          <div className="mb-6 flex items-center space-x-4">
            <IonAvatar className="h-16 w-16">
              <img
                src={`https://ui-avatars.com/api/?name=${email}&background=random`}
                alt="Profile"
              />
            </IonAvatar>
            <div>
              <h2 className="text-xl font-semibold">{email}</h2>
              <p className="text-sm text-gray-500">TaskMaster User</p>
            </div>
          </div>

          <IonList>
            <IonItem>
              <IonLabel>
                <h2>Email</h2>
                <p>{email}</p>
              </IonLabel>
            </IonItem>
          </IonList>

          <div className="mt-6">
            <IonButton
              expand="block"
              color="danger"
              onClick={handleSignOut}
            >
              <IonIcon slot="start" icon={logOutOutline} />
              Sign Out
            </IonButton>
          </div>
        </div>
      </IonContent>
    </>
  );
}