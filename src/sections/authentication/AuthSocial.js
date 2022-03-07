// material
import { Stack, Button, Divider, Typography } from '@mui/material';
// component
import Iconify from '../../components/Iconify';
import { useTranslation } from 'react-i18next';
import useAuth from '../../components/context/AuthContext';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function AuthSocial() {
  const { t, i18n } = useTranslation();
  const { loginGoogle, loginFB } = useAuth();
  const [error, setError] = useState(null);

  const handleGoogleClick = async () => {
    const res = await loginGoogle();
    if (res.status !== 200) {
      setError(res.code);
    }
  };

  const handleFBClick = async () => {
    const res = await loginFB();
    if (res.status !== 200) {
      setError(res.code);
    }
  };
  return (
    <>
      <Stack direction="row" spacing={2}>
        <Button
          fullWidth
          size="large"
          color="inherit"
          variant="outlined"
          onClick={handleGoogleClick}
        >
          <Iconify icon="eva:google-fill" color="#DF3E30" style={{ fontSize: 24 }} />
        </Button>

        <Button fullWidth size="large" color="inherit" variant="outlined" onClick={handleFBClick}>
          <Iconify icon="eva:facebook-fill" color="#1877F2" style={{ fontSize: 24 }} />
        </Button>

        {/*<Button fullWidth size="large" color="inherit" variant="outlined">*/}
        {/*  <Iconify icon="eva:twitter-fill" color="#1C9CEA" height={24} />*/}
        {/*</Button>*/}
      </Stack>
      {error && <Typography color={'error'} sx={{pt: 1}}>{t(error)}</Typography>}
      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('OR')}
        </Typography>
      </Divider>
    </>
  );
}
