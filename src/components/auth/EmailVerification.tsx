import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
} from '@ionic/react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
}

export function EmailVerification({ email, onVerified }: EmailVerificationProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerification = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'signup'
      });

      if (error) throw error;
      
      toast.success('Email verified successfully');
      onVerified();
    } catch (error) {
      toast.error('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Verify Your Email</h2>
        <p className="mt-2 text-gray-600">
          We've sent a verification code to {email}
        </p>
      </div>

      <IonItem>
        <IonLabel position="floating">Verification Code</IonLabel>
        <IonInput
          type="text"
          value={code}
          onIonChange={e => setCode(e.detail.value!)}
          placeholder="Enter code"
        />
      </IonItem>

      <IonButton
        expand="block"
        onClick={handleVerification}
        disabled={loading || !code}
      >
        {loading ? 'Verifying...' : 'Verify Email'}
      </IonButton>
    </div>
  );
}