import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Language resources (sample - full 65 languages would be added)
const resources = {
  en: {
    translation: {
      common: {
        welcome: 'Welcome to Nova Q7',
        loading: 'Loading...',
        error: 'Error occurred',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        delete: 'Delete',
      },
      auth: {
        login: 'Login',
        register: 'Register',
        email: 'Email',
        password: 'Password',
        forgotPassword: 'Forgot Password?',
      },
      home: {
        chatZone: 'Chat & Voice Zone',
        creativeZone: 'Creative Zone',
        workZone: 'Work Zone',
        learnZone: 'Learn Zone',
      },
      modules: {
        chat: 'AI Chat',
        imageGen: 'Image Generator',
        voice: 'Voice Assistant',
        pdf: 'PDF Tools',
        faceSwap: 'Face Swap',
        removeBg: 'Remove Background',
        business: 'Business AI',
        manufacturing: 'Manufacturing',
        iot: 'IoT Control',
        social: 'Social Media',
        email: 'Email AI',
        education: 'Education',
        legal: 'Legal AI',
        travel: 'Travel Planner',
        notes: 'Notes',
        todo: 'To-Do',
      },
    },
  },
  es: {
    translation: {
      common: {
        welcome: 'Bienvenido a Nova Q7',
        loading: 'Cargando...',
        error: 'Error ocurrido',
        success: 'Éxito',
      },
    },
  },
  fr: {
    translation: {
      common: {
        welcome: 'Bienvenue à Nova Q7',
        loading: 'Chargement...',
      },
    },
  },
  de: {
    translation: {
      common: {
        welcome: 'Willkommen bei Nova Q7',
        loading: 'Wird geladen...',
      },
    },
  },
  // Add more languages as needed (65 total)
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.locale.split('-')[0],
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
