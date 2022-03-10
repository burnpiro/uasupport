import PropTypes from 'prop-types';
import { useMemo } from 'react';
// material
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
//
import palette from './palette';
import typography from './typography';
import componentsOverride from './overrides';
import shadows, { customShadows } from './shadows';
import { SnackbarProvider } from 'notistack';

// ----------------------------------------------------------------------

ThemeConfig.propTypes = {
  children: PropTypes.node
};

export default function ThemeConfig({ children }) {
  const themeOptions = useMemo(
    () => ({
      palette,
      shape: { borderRadius: 8 },
      typography,
      shadows,
      customShadows
    }),
    []
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <CssBaseline />
          {children}
        </SnackbarProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
