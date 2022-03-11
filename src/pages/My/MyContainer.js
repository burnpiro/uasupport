import * as React from 'react';
import { Link as RouterLink, Outlet } from 'react-router-dom';
// material
import useAuth from '../../components/context/AuthContext';
import Typography from '@mui/material/Typography';
import AuthSocial from '../../sections/authentication/AuthSocial';
import { LoginForm } from '../../sections/authentication/login';
import Link from '@mui/material/Link';
import {useTranslation} from "react-i18next";

export default function MyContainer() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  if (user == null) {
    return (
      <React.Fragment>
        <Typography variant={'subtitle1'} sx={{ pb: 1, textAlign: 'center' }}>
          {t('Login to add new data')}
        </Typography>
        <AuthSocial showMore={false} />
        <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
          {t('By registering, I agree to')} &nbsp;
          <Link
            component={RouterLink}
            underline="always"
            color="textPrimary"
            to={'/dashboard/tc'}
            style={{ cursor: 'pointer' }}
          >
            {t('Terms of Service')}
          </Link>
          &nbsp;{t('and')}&nbsp;
          <Link
            component={RouterLink}
            underline="always"
            color="textPrimary"
            to={'/dashboard/privacy-policy'}
            style={{ cursor: 'pointer' }}
          >
            {t('Privacy Policy')}
          </Link>
          .
        </Typography>
      </React.Fragment>
    );
  }
  return user && <Outlet />;
}
