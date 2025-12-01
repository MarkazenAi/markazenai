import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import '../i18n/config';

export default function RootLayout() {
  const loadUser = useUserStore((state) => state.loadUser);
  
  useEffect(() => {
    loadUser();
  }, []);
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0E0E10' },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
