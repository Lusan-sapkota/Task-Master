import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.taskmaster.app',
  appName: 'Task Master',
  webDir: 'dist',
  
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,  // Show splash screen for 3 seconds
      backgroundColor: "#1A1A1A",  // Dark background color, close to black but not too harsh
      showSpinner: false,  // No spinner
      androidSpinnerStyle: "small",  // Small spinner on Android
      iosSpinnerStyle: "small",  // Small spinner on iOS
      spinnerColor: "#E5E5E5",  // Light gray color for the spinner, stands out on dark background
      splashFullScreen: true,  // Splash screen covers the entire screen
      splashImmersive: true,  // Immersive mode (no system bars)
      layoutName: "launch_screen",  // Custom splash screen layout name if needed
      useDialog: true  // Using a dialog for splash (Android)
    },
  },  

};

export default config;
