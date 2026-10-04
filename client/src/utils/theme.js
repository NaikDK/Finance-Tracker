import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#2196F3',
            light: '#64B5F6',
            dark: '#1565C0'
        },
        secondary: {
            main: '#00E676'
        },
        background: {
            default: '#0A0E1A',
            paper: '#111827'
        },
        success: {
            main: '#00E676'
        },
        error: {
            main: '#FF1744'
        },
        text: {
            primary: '#F1F5F9',
            secondary: '#94A3B8'
        }
    },
    typography: {
        fontFamily: '"Inter", sans-serif',
        h4: { fontWeight: 700 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        body2: { color: '#94A3B8' }
    },
    shape: {
        borderRadius: 8
    },
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    border: 'none',
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.85rem'
                },
                columnHeaders: {
                    backgroundColor: '#1E293B',
                    color: '#94A3B8',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                },
                row: {
                    '&:hover': {
                        backgroundColor: '#1E293B'
                    }
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    border: '1px solid #1E293B'
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600
                }
            }
        }
    }
});

export default theme;