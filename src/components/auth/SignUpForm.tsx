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
import { authSchema, type AuthFormData } from '@/lib/validation';
import { EmailVerification } from './EmailVerification';
import toast from 'react-hot-toast';

export function SignUpForm({ onToggleForm }: { onToggleForm: () => void }) {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<AuthFormData>>({});
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  const validateForm = () => {
    try {
      authSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof Error) {
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
    if (!validateForm()) return;
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      if (error) throw error;
      
      setShowVerification(true);
      toast.success('Please check your email for the verification code');
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

  if (showVerification) {
    return <EmailVerification email={formData.email} onVerified={onToggleForm} />;
  }

  return (
    <div className="space-y-6">
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

        <IonButton expand="block" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign up'}
        </IonButton>
      </form>

      <div className="text-center">
        <IonText color="medium">
          Already have an account?{' '}
          <button
            onClick={onToggleForm}
            className="text-primary hover:underline"
          >
            Sign in
          </button>
        </IonText>
      </div>
    </div>
  );
}