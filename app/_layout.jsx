import { Stack } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';
import { PortfolioProvider } from '../context/PortfolioContext';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../context/ThemeContext';
import { useEffect } from 'react';
import { initializeStorage } from '../utils/storage';

export default function RootLayout() {
  useEffect(() => {
    // Initialize storage when app starts
    initializeStorage().catch(console.error);
  }, []);

  return (
    <ThemeProvider>
      <PortfolioProvider>
        <RootLayoutNav />
      </PortfolioProvider>
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  const { isDarkMode } = useTheme();
  return (
    <>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="tabs" />
      </Stack>
    </>
  );
}
