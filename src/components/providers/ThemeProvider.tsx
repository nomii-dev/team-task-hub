/**
 * Theme Provider Component
 * Material You (Material Design 3) Theme
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  // Load theme preference from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode;
    if (savedMode) {
      setMode(savedMode);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  // Material You Color Palette
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#6750A4' : '#D0BCFF',
        light: mode === 'light' ? '#7965AF' : '#E8DEF8',
        dark: mode === 'light' ? '#4F378B' : '#B69DF8',
        contrastText: mode === 'light' ? '#FFFFFF' : '#381E72',
      },
      secondary: {
        main: mode === 'light' ? '#625B71' : '#CCC2DC',
        light: mode === 'light' ? '#7D7589' : '#E8DEF8',
        dark: mode === 'light' ? '#4A4458' : '#B0A7C0',
        contrastText: mode === 'light' ? '#FFFFFF' : '#332D41',
      },
      tertiary: {
        main: mode === 'light' ? '#7D5260' : '#EFB8C8',
        light: mode === 'light' ? '#986977' : '#FFD8E4',
        dark: mode === 'light' ? '#633B48' : '#D29DAC',
        contrastText: mode === 'light' ? '#FFFFFF' : '#492532',
      },
      error: {
        main: mode === 'light' ? '#B3261E' : '#F2B8B5',
        light: mode === 'light' ? '#C5302B' : '#F9DEDC',
        dark: mode === 'light' ? '#8C1D18' : '#EC928E',
        contrastText: mode === 'light' ? '#FFFFFF' : '#601410',
      },
      warning: {
        main: mode === 'light' ? '#F59E0B' : '#FCD34D',
        light: mode === 'light' ? '#FBBF24' : '#FDE68A',
        dark: mode === 'light' ? '#D97706' : '#F59E0B',
      },
      success: {
        main: mode === 'light' ? '#10B981' : '#6EE7B7',
        light: mode === 'light' ? '#34D399' : '#A7F3D0',
        dark: mode === 'light' ? '#059669' : '#34D399',
      },
      background: {
        default: mode === 'light' ? '#FEF7FF' : '#1C1B1F',
        paper: mode === 'light' ? '#FFFFFF' : '#2B2930',
      },
      surface: {
        main: mode === 'light' ? '#FEF7FF' : '#1C1B1F',
        variant: mode === 'light' ? '#E7E0EC' : '#49454F',
      },
      text: {
        primary: mode === 'light' ? '#1C1B1F' : '#E6E1E5',
        secondary: mode === 'light' ? '#49454F' : '#CAC4D0',
        disabled: mode === 'light' ? '#1C1B1F61' : '#E6E1E561',
      },
      divider: mode === 'light' ? '#79747E29' : '#CAC4D029',
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      // Display styles
      h1: {
        fontSize: '3.5rem',
        fontWeight: 400,
        lineHeight: 1.2,
        letterSpacing: '-0.25px',
      },
      h2: {
        fontSize: '2.8rem',
        fontWeight: 400,
        lineHeight: 1.2,
        letterSpacing: '0px',
      },
      h3: {
        fontSize: '2.25rem',
        fontWeight: 400,
        lineHeight: 1.3,
        letterSpacing: '0px',
      },
      // Headline styles
      h4: {
        fontSize: '2rem',
        fontWeight: 400,
        lineHeight: 1.4,
        letterSpacing: '0px',
      },
      h5: {
        fontSize: '1.5rem',
        fontWeight: 400,
        lineHeight: 1.4,
        letterSpacing: '0px',
      },
      h6: {
        fontSize: '1.25rem',
        fontWeight: 400,
        lineHeight: 1.4,
        letterSpacing: '0px',
      },
      // Body styles
      body1: {
        fontSize: '1rem',
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: '0.5px',
      },
      body2: {
        fontSize: '0.875rem',
        fontWeight: 400,
        lineHeight: 1.43,
        letterSpacing: '0.25px',
      },
      // Label styles
      button: {
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1.75,
        letterSpacing: '0.1px',
        textTransform: 'none',
      },
      caption: {
        fontSize: '0.75rem',
        fontWeight: 400,
        lineHeight: 1.66,
        letterSpacing: '0.4px',
      },
      overline: {
        fontSize: '0.75rem',
        fontWeight: 500,
        lineHeight: 2.66,
        letterSpacing: '1px',
        textTransform: 'uppercase',
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      // Elevation 1
      mode === 'light'
        ? '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)'
        : '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
      // Elevation 2
      mode === 'light'
        ? '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)'
        : '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
      // Elevation 3
      mode === 'light'
        ? '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3)'
        : '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3)',
      // Elevation 4
      mode === 'light'
        ? '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.3)'
        : '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.3)',
      // Elevation 5
      mode === 'light'
        ? '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px rgba(0, 0, 0, 0.3)'
        : '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px rgba(0, 0, 0, 0.3)',
      ...Array(19).fill('none'),
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            textTransform: 'none',
            fontWeight: 500,
            padding: '10px 24px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: mode === 'light'
                ? '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)'
                : '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
            },
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: mode === 'light'
                ? '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)'
                : '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
            },
          },
          outlined: {
            borderWidth: 1,
            '&:hover': {
              borderWidth: 1,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: mode === 'light'
              ? '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)'
              : '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
          elevation1: {
            boxShadow: mode === 'light'
              ? '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)'
              : '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 28,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRadius: 0,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: `1px solid ${mode === 'light' ? '#79747E29' : '#CAC4D029'}`,
            borderRadius: 0,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            margin: '2px 8px',
            '&.Mui-selected': {
              backgroundColor: mode === 'light' ? '#E8DEF8' : '#4A4458',
              '&:hover': {
                backgroundColor: mode === 'light' ? '#D0BCFF20' : '#4A445820',
              },
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 0,
          },
        },
      },
    },
  });

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
