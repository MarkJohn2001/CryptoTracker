import { LinearGradient } from 'expo-linear-gradient';

export const theme = {
  dark: {
    background: '#000000',
    surface: '#1A1A1A',
    surfaceGradient: ['#1A1A1A', '#262626'],
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    primary: '#FFD700', // Bright yellow
    primaryGradient: ['#FFD700', '#FFA500'], // Yellow to orange gradient
    secondary: '#FFC107',
    accent: '#FFE57F',
    border: '#333333',
    error: '#FF6B6B',
    success: '#4CAF50',
    cardGradient: ['#1A1A1A', '#262626'],
    headerGradient: ['#000000', '#1A1A1A'],
  },
  light: {
    background: '#000000',
    surface: '#1A1A1A',
    surfaceGradient: ['#1A1A1A', '#262626'],
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',
    primary: '#FFD700',
    primaryGradient: ['#FFD700', '#FFA500'],
    secondary: '#FFC107',
    accent: '#FFE57F',
    border: '#333333',
    error: '#FF6B6B',
    success: '#4CAF50',
    cardGradient: ['#1A1A1A', '#262626'],
    headerGradient: ['#000000', '#1A1A1A'],
  },
};

// Common styles that can be reused across components
export const commonStyles = {
  gradientButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  gradientCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  gradientText: {
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
};
