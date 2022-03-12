// material
import { alpha, styled, useTheme, lighten } from '@mui/material/styles';
import { Card, Typography, Button, IconButton } from '@mui/material';
// utils
// component
import Iconify from '../../components/Iconify';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(3, 0),
  color: theme.palette.grey[300],
  backgroundColor: theme.palette.grey[300]
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(0),
  color: theme.palette.grey[800],
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.grey[800], 0)} 0%, ${alpha(
    theme.palette.grey[800],
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

const TOTAL = 714000;

const GreyButton = styled(Button)(({ theme }) => ({
  '&:hover': {
    backgroundColor: lighten(theme.palette.grey[300], 0.3),
    borderColor: lighten(theme.palette.grey[300], 0.1)
  },
  '&:active': {
    backgroundColor: lighten(theme.palette.grey[300], 0.3),
    borderColor: lighten(theme.palette.grey[300], 0.1)
  },
  '&:focus': {
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)'
  }
}));

export default function AppInfoGet() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  return (
    <RootStyle>
      <Link
        style={{
          textDecoration: 'none'
        }}
        target={'_blank'}
        href="https://ukraina.grupagranica.pl/granica"
      >
        <Stack
          spacing={2}
          direction={'row'}
          sx={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <IconButton aria-label={"Border Info"}>
            <IconWrapperStyle>
              <Iconify icon="emojione-monotone:passport-control" width={48} height={48} />
            </IconWrapperStyle>
          </IconButton>
          <Typography variant="h3" style={{ color: theme.palette.grey[800] }}>
            {t('Border Information')}
          </Typography>
        </Stack>
      </Link>
    </RootStyle>
  );
}
