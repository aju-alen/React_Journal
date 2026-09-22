import { createTheme } from '@mui/material/styles';

const INK = '#543a31';
const PEACH = '#f1ded7';
const CANVAS = '#F7F1ED';
const PAPER = '#FFFFFF';

const theme = createTheme({
  palette: {
    primary: {
      main: INK,
      light: '#7a5a4d',
      dark: '#3a271f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: PEACH,
      contrastText: INK,
    },
    background: {
      default: CANVAS,
      paper: PAPER,
    },
    text: {
      primary: '#2c241f',
      secondary: '#6b5a52',
    },
    success: { main: '#2e7d32' },
    warning: { main: '#ed6c02' },
    error: { main: '#d32f2f' },
    info: { main: '#0288d1' },
  },
  typography: {
    fontFamily: ['Figtree', 'sans-serif', 'Arial'].join(','),
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(84, 58, 49, 0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: CANVAS,
            fontWeight: 600,
            color: INK,
            borderBottom: `2px solid ${PEACH}`,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(241, 222, 215, 0.35)',
          },
        },
      },
    },
  },
});

export const dashboardColors = {
  ink: INK,
  peach: PEACH,
  canvas: CANVAS,
  paper: PAPER,
};

export default theme;
