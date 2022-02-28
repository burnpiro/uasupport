import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack, TextField, InputAdornment, Box, Link, Tooltip } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Iconify from '../../components/Iconify';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import plLocale from 'date-fns/locale/pl';
import ruLocale from 'date-fns/locale/ru';
import enLocale from 'date-fns/locale/en-US';
import { fDateTime } from '../../utils/formatTime';
import Label from '../../components/Label';
import { useTranslation } from 'react-i18next';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';

const localeMap = {
  pl: plLocale,
  ru: ruLocale,
  en: enLocale
};

const maskMap = {
  pl: '__/__/____',
  ru: '__.__.____',
  en: '__/__/____'
};

function HomeItem(props) {
  const {
    item: {
      avatarUrl,
      name,
      addressFrom,
      from,
      isVerified,
      status,
      date,
      people,
      description,
      phone,
      fb,
      email,
      pet,
      period,
      child,
      disability,
      includingTransport,
      separateBath,
      kitchen
    }
  } = props;
  const [displayPhone, setDisplayPhone] = React.useState(false);
  const [displayEmail, setDisplayEmail] = React.useState(false);
  const { t, i18n } = useTranslation();

  const handlePhoneClick = () => {
    setDisplayPhone(!displayPhone);
  };
  const handleEmailClick = () => {
    setDisplayEmail(!displayEmail);
  };

  return (
    <Card sx={{ min: 345 }}>
      <CardHeader
        avatar={<Avatar aria-label="recipe" src={avatarUrl} />}
        title={name}
        subheader={t('CheckIn') + ': ' + fDateTime(date)}
        action={
          <Label variant="ghost" color={(status === 'szukam' && 'info') || 'success'}>
            {status != null && t(status || 'dam')}
          </Label>
        }
      />
      <CardContent>
        <Box flexDirection={'row'} display={'flex'} sx={{ p: 1 }}>
          <Iconify icon="eva:person-add-fill" width={24} height={28} />
          <Typography variant="h5" sx={{ color: 'text.secondary', pl: 1 }}>
            {people}
          </Typography>
        </Box>
        <Stack direction="column" spacing={2} sx={{ p: 2 }}>
          <Box flexDirection={'row'} display={'flex'}>
            <Typography variant="subtitle2">
              {t('Mieszkanie-adres')}:
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', pl: 1 }}>
              {addressFrom}
            </Typography>
          </Box>
          {period != null && period.length > 0 && (
            <Box flexDirection={'row'} display={'flex'}>
              <Typography variant="subtitle2">
                {t('Mieszkanie-czas')}:
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', pl: 1 }}>
                {period}
              </Typography>
            </Box>
          )}
          {pet != null && pet.length > 0 && (
            <Box flexDirection={'row'} display={'flex'}>
              <Typography variant="subtitle2">
                {t('Mieszkanie-zwierze')}:
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', pl: 1 }}>
                {pet}
              </Typography>
            </Box>
          )}
          {child != null && child.length > 0 && (
            <Box flexDirection={'row'} display={'flex'}>
              <Typography variant="subtitle2">
                {t('Mieszkanie-dzieci')}:
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', pl: 1 }}>
                {child}
              </Typography>
            </Box>
          )}
          {disability != null && disability.length > 0 && (
            <Box flexDirection={'row'} display={'flex'}>
              <Typography variant="subtitle2">
                {t('Mieszkanie-disability')}:
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', pl: 1 }}>
                {disability}
              </Typography>
            </Box>
          )}
          {includingTransport != null && includingTransport.length > 0 && (
            <Box flexDirection={'row'} display={'flex'}>
              <Typography variant="subtitle2">
                {t('Mieszkanie-transport')}:
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', pl: 1 }}>
                {includingTransport}
              </Typography>
            </Box>
          )}
          <FormGroup>
            {separateBath === true && (
              <FormControlLabel
                control={<Checkbox checked={true} />}
                label={t('Separate Bath')}
              />
            )}
            {kitchen === true && (
              <FormControlLabel
                control={<Checkbox checked={true} />}
                label={t('Kitchen Access')}
              />
            )}
          </FormGroup>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        {displayPhone && (
          <Box flexDirection={'row'} display={'flex'} sx={{ pt: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {t('Phone')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', pl: 1 }}>
              {phone}
            </Typography>
          </Box>
        )}
        {displayEmail && (
          <Box flexDirection={'row'} display={'flex'} sx={{ pt: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {t('Email')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', pl: 1 }}>
              {email}
            </Typography>
          </Box>
        )}
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          aria-label="phone"
          color={'success'}
          disabled={phone == null || phone === ''}
          onClick={handlePhoneClick}
        >
          <Iconify
            icon={phone ? 'eva:phone-call-fill' : 'eva:phone-off-fill'}
            width={24}
            height={24}
          />
        </IconButton>
        <IconButton
          aria-label="email"
          color={'success'}
          disabled={email == null || email === ''}
          onClick={handleEmailClick}
        >
          <Iconify
            icon={email ? 'eva:email-outline' : 'mdi:email-off-outline'}
            width={24}
            height={24}
          />
        </IconButton>
        <Link href={fb} target="_blank">
          <IconButton aria-label="fb" color={'info'} disabled={fb == null || fb === ''}>
            <Iconify icon="eva:facebook-fill" width={24} height={24} />
          </IconButton>
        </Link>
        <Link
          href={`https://www.google.com/maps/dir/?api=1&destination=${from[0]}, ${from[1]}`}
          target="_blank"
        >
          <IconButton aria-label="location" color={'info'} disabled={from == null}>
            <Iconify icon="fa-solid:map-marked-alt" width={24} height={24} />
          </IconButton>
        </Link>
      </CardActions>
    </Card>
  );
}

export default function HomesDetails(props) {
  const [locale, setLocale] = React.useState('pl');
  const { onClose, open, home = [] } = props;
  const { t, i18n } = useTranslation();

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{t('SzczegolyZakwaterowania')}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ p: 3, pr: 0, pl: 0 }}>
          {home.map((homeItem) => (
            <HomeItem key={homeItem.id} item={homeItem} />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}
