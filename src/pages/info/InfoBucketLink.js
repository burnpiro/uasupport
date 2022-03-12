// material
import { alpha, styled, useTheme } from '@mui/material/styles';
import { Card, Typography, Button } from '@mui/material';
// utils
// component
import Iconify from '../../components/Iconify';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import { Link as RouterLink } from 'react-router-dom';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme, color = theme.palette.primary.darker, backgroundcolor = theme.palette.primary.lighter }) => ({
  boxShadow: 'none',
  textAlign: 'center',
  padding: theme.spacing(5, 0),
  color: color,
  backgroundColor: backgroundcolor
}));

const IconWrapperStyle = styled('div')(({ theme, color = theme.palette.primary.dark }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  color: color,
  backgroundImage: `linear-gradient(135deg, ${alpha(color, 0)} 0%, ${alpha(color, 0.24)} 100%)`
}));

// ----------------------------------------------------------------------

const TOTAL = 714000;

export default function InfoBucketLink({ title, subtitle, icon, color, backgroundColor }) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  return (
    <RootStyle color={color} backgroundcolor={backgroundColor}>
      <IconWrapperStyle color={color}>
        <Iconify icon={icon} width={42} height={42} />
      </IconWrapperStyle>
      {title && <Typography variant="h3">{t(title)}</Typography>}
      {subtitle && (
        <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
          {t(subtitle)}
        </Typography>
      )}
    </RootStyle>
  );
}
