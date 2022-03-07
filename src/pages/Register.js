import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
// material
import { styled } from '@mui/material/styles';
import { Box, Card, Link, Container, Typography } from '@mui/material';
// layouts
import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
import { RegisterForm } from '../sections/authentication/register';
import AuthSocial from '../sections/authentication/AuthSocial';
import { useTranslation } from 'react-i18next';
import TCDialog from '../components/dialogs/TCDialog';
import PrivacyPolicyDialog from '../components/dialogs/PrivacyPolicyDialog';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Register() {
  const { t, i18n } = useTranslation();
  const [showTC, setShowTC] = useState(false);
  const [showPP, setShowPP] = useState(false);
  return (
    <RootStyle title={t('Register')}>
      <AuthLayout>
        {t('Already have an account?')} &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to="/login">
          {t('Login')}
        </Link>
      </AuthLayout>

      <SectionStyle sx={{ display: { xs: 'none', md: 'flex' } }}>
        <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
          {t('Start helping today!')}
        </Typography>
        <img alt="register" src="/static/illustrations/illustration_register.png" />
        <Typography variant={'caption'} sx={{ textAlign: 'center' }}>
          {t('Images provided by')}&nbsp;freepik -
          <Link href="https://www.freepik.com/psd/3d-woman"> www.freepik.com</Link>
        </Typography>
      </SectionStyle>

      <Container>
        <ContentStyle>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4" gutterBottom>
              {t('Create a free account.')}
            </Typography>
          </Box>

          <AuthSocial />

          <RegisterForm />

          <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
            {t('By registering, I agree to')} &nbsp;
            <Link underline="always" color="textPrimary" onClick={() => setShowTC(true)} style={{cursor: 'pointer'}}>
              {t('Terms of Service')}
            </Link>
            &nbsp;{t('and')}&nbsp;
            <Link underline="always" color="textPrimary" onClick={() => setShowPP(true)} style={{cursor: 'pointer'}}>
              {t('Privacy Policy')}
            </Link>
            .
          </Typography>

          <Typography
            variant="subtitle2"
            sx={{
              mt: 3,
              textAlign: 'center',
              display: { sm: 'none' }
            }}
          >
            Already have an account?&nbsp;
            <Link underline="hover" to="/login" component={RouterLink}>
              Login
            </Link>
          </Typography>
        </ContentStyle>
      </Container>
      <TCDialog open={showTC} handleClose={() => setShowTC(false)} />
      <PrivacyPolicyDialog open={showPP} handleClose={() => setShowPP(false)} />
    </RootStyle>
  );
}
