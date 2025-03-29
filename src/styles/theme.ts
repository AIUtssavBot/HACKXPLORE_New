import { createTheme, alpha } from '@mui/material/styles';
import { red, blue, green, orange, purple } from '@mui/material/colors';

declare module '@mui/material/styles' {
  interface Palette {
    customBackground: {
      main: string;
      light: string;
      dark: string;
    };
  }
  interface PaletteOptions {
    customBackground?: {
      main: string;
      light: string;
      dark: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
      light: purple[300],
      dark: purple[700],
    },
    secondary: {
      main: orange[500],
      light: orange[300],
      dark: orange[700],
    },
    error: {
      main: red[500],
    },
    success: {
      main: green[500],
    },
    info: {
      main: blue[500],
    },
    customBackground: {
      main: '#f5f5f5',
      light: '#ffffff',
      dark: '#e0e0e0',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px 0 ' + alpha('#000000', 0.1),
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px 0 ' + alpha('#000000', 0.08),
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#000000',
          boxShadow: '0 1px 4px 0 ' + alpha('#000000', 0.05),
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid ' + alpha('#000000', 0.08),
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
          borderRadius: 6,
        },
      },
    },
  },
});

export default theme; 