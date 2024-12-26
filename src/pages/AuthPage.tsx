import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
} from '@ionic/react';
import { useState } from 'react';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="flex min-h-full items-center justify-center">
          <IonCard className="w-full max-w-md">
            <IonCardContent>
              <h2 className="mb-6 text-center text-3xl font-bold">
                Welcome to TaskMaster
              </h2>
              {isSignUp ? (
                <SignUpForm onToggleForm={() => setIsSignUp(false)} />
              ) : (
                <SignInForm onToggleForm={() => setIsSignUp(true)} />
              )}
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}