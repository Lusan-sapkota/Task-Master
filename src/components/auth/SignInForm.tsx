import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonText,
} from '@ionic/react';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export function SignInForm({ onToggleForm }: { onToggleForm: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success('Successfully signed in');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error signing in');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <IonItem>
          <IonIcon icon={mailOutline} slot="start" />
          <IonLabel position="floating">Email</IonLabel>
          <IonInput
            type="email"
            value={email}
            onIonChange={e => setEmail(e.detail.value!)}
            required
          />
        </IonItem>

        <IonItem>
          <IonIcon icon={lockClosedOutline} slot="start" />
          <IonLabel position="floating">Password</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={e => setPassword(e.detail.value!)}
            required
          />
        </IonItem>

        <IonButton expand="block" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </IonButton>
      </form>

      <div className="text-center">
        <IonText color="medium">
          Don't have an account?{' '}
          <button
            onClick={onToggleForm}
            className="text-primary hover:underline"
          >
            Sign up
          </button>
        </IonText>
      </div>
    </div>
  );
}