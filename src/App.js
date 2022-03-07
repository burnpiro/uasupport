// routes
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from './components/context/AuthContext';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeConfig>
      <SnackbarProvider maxSnack={3}>
        <AuthProvider>
          <ScrollToTop />
          <GlobalStyles />
          <BaseOptionChartStyle />
          <Router />
        </AuthProvider>
      </SnackbarProvider>
    </ThemeConfig>
  );
}
