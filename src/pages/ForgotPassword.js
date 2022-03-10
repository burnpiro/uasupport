import { Link as RouterLink } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// layouts
import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
import { LoginForm } from '../sections/authentication/login';
import AuthSocial from '../sections/authentication/AuthSocial';
import {useTranslation} from "react-i18next";
import {ForgotForm} from "../sections/authentication/forgot";

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

export default function ForgotPassword() {
  const { t, i18n } = useTranslation();
  return (
    <RootStyle title={t('Password Recovery')}>
      <AuthLayout>
      </AuthLayout>

      <SectionStyle sx={{ display: { xs: 'none', md: 'flex' } }}>
        <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
          {t('Hi, Welcome Back')}
        </Typography>
        <img src="/static/illustrations/illustration_forgot.png" alt="login" />
        <Typography variant={'caption'} sx={{textAlign: 'center'}}>
          Images provided by freepik -
          <Link href="https://www.freepik.com/psd/3d-woman"> www.freepik.com</Link>
        </Typography>
      </SectionStyle>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 2 }}>
            <Typography variant="h4" gutterBottom>
              {t('Password Recovery')}
            </Typography>
          </Stack>

          <ForgotForm />

          <Typography
            variant="body2"
            align="center"
            sx={{
              mt: 3,
              display: { sm: 'none' }
            }}
          >
          </Typography>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
