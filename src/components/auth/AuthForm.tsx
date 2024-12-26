import {
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonText
} from '@ionic/react';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { authSchema, type AuthFormData } from '@/lib/validation';
import toast from 'react-hot-toast';

export function AuthForm() {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<AuthFormData>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    try {
      authSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<AuthFormData> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof AuthFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp(formData);
      if (error) throw error;
      toast.success('Check your email for the confirmation link');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error creating account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <IonItem className={errors.email ? 'ion-invalid' : ''}>
        <IonIcon icon={mailOutline} slot="start" />
        <IonLabel position="floating">Email</IonLabel>
        <IonInput
          type="email"
          value={formData.email}
          onIonChange={e => setFormData(prev => ({ ...prev, email: e.detail.value! }))}
          required
        />
        {errors.email && (
          <IonText color="danger" className="text-sm">
            {errors.email}
          </IonText>
        )}
      </IonItem>

      <IonItem className={errors.password ? 'ion-invalid' : ''}>
        <IonIcon icon={lockClosedOutline} slot="start" />
        <IonLabel position="floating">Password</IonLabel>
        <IonInput
          type="password"
          value={formData.password}
          onIonChange={e => setFormData(prev => ({ ...prev, password: e.detail.value! }))}
          required
        />
        {errors.password && (
          <IonText color="danger" className="text-sm">
            {errors.password}
          </IonText>
        )}
      </IonItem>

      <IonButton
        expand="block"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'Sign up'}
      </IonButton>
    </form>
  );
}