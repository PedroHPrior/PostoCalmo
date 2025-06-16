import { TextStyle } from 'react-native';

export const theme = {
  colors: {
    primary: '#1F0845',
    secondary: '#094C24',
    background: '#F5F5F5',
    text: '#1F0845',
    textLight: '#666666',
    error: '#FF0000',
    success: '#00FF00',
    white: '#FFFFFF',
    black: '#000000',
    gray: '#CCCCCC',
    lightGray: '#E0E0E0',
    accent: '#094C24',
    lotacao: {
      lotado: '#FF3B30',
      alta: '#FF9500',
      media: '#FFCC00',
      baixa: '#34C759',
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as TextStyle['fontWeight'],
    },
    h2: {
      fontSize: 24,
      fontWeight: '700' as TextStyle['fontWeight'],
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as TextStyle['fontWeight'],
    },
    caption: {
      fontSize: 14,
      fontWeight: '400' as TextStyle['fontWeight'],
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
}; 