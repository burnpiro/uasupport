// material
import {alpha, lighten, styled, useTheme} from '@mui/material/styles';
import { Card, Typography, Button } from '@mui/material';
// utils
// component
import Iconify from '../../components/Iconify';
import { useTranslation } from 'react-i18next';
import Stack from "@mui/material/Stack";
import {Link as RouterLink} from "react-router-dom";

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: theme.palette.warning.darker,
  backgroundColor: lighten(theme.palette.warning.light, 0.8)
}));

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: theme.palette.warning.dark,
  backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.warning.dark, 0)} 0%, ${alpha(
    theme.palette.warning.dark,
    0.24
  )} 100%)`
}));

// ----------------------------------------------------------------------

const TOTAL = 714000;

export default function AppTransportGet() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  return (
    <RootStyle>
      <IconWrapperStyle>
        <Iconify icon="eva:car-fill" width={24} height={24} />
      </IconWrapperStyle>
      <Typography variant="h3">{t('Transport')}</Typography>
      <Stack spacing={2} sx={{pl: 4, pr: 4, pt: 2}}>
        <Button variant={'outlined'} style={{color: theme.palette.info.dark}}  startIcon={<Iconify icon="eva:search-fill" />} component={RouterLink} to="/dashboard/transport">
          {t('Szukaj transport')}
        </Button>
      </Stack>
    </RootStyle>
  );
}
