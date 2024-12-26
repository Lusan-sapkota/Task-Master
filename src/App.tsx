import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { isSupabaseConfigured } from '@/lib/supabase';

import { AuthPage } from '@/pages/AuthPage';
import { TasksPage } from '@/pages/TasksPage';
import { useAuth } from '@/hooks/useAuth';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

setupIonicReact();

function App() {
  const { session } = useAuth();

  if (!isSupabaseConfigured()) {
    return (
      <IonApp>
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
          <div className="text-center">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Setup Required</h2>
            <p className="text-gray-600">
              Please click the "Connect to Supabase" button in the top right corner to set up your database.
            </p>
          </div>
        </div>
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/auth">
            {!session ? <AuthPage /> : <Redirect to="/tasks" />}
          </Route>
          <Route exact path="/tasks">
            {session ? <TasksPage /> : <Redirect to="/auth" />}
          </Route>
          <Route exact path="/">
            <Redirect to={session ? '/tasks' : '/auth'} />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
      <Toaster position="bottom-center" />
    </IonApp>
  );
}

export default App;