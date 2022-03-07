import PropTypes from 'prop-types';
// material
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// components
import Logo from '../components/Logo';
import LanguagePopover from './dashboard/LanguagePopover';
import { Box } from '@mui/material';
import useAuth from '../components/context/AuthContext';
import { useLocation, Navigate } from 'react-router-dom';

// ----------------------------------------------------------------------

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7)
  }
}));

// ----------------------------------------------------------------------

AuthLayout.propTypes = {
  children: PropTypes.node
};

export default function AuthLayout({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (
    !loading &&
    user != null &&
    (location.pathname === '/login' || location.pathname === '/register')
  ) {
    return <Navigate to={'/'} replace={true} />;
  }

  return (
    <HeaderStyle>
      <Logo />

      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 0.5, sm: 1.5 }}
          sx={{ p: 0, pb: 4 }}
        >
          <LanguagePopover />
        </Stack>
        <Typography
          variant="body2"
          sx={{
            display: { xs: 'none', sm: 'block' },
            mt: { md: -2 }
          }}
        >
          {children}
        </Typography>
      </Box>
    </HeaderStyle>
  );
}
