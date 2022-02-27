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
import { sentenceCase } from 'change-case';
import {useTranslation} from "react-i18next";

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

function TransportItem(props) {
  const {
    item: {
      avatarUrl,
      name,
      addressFrom,
      addressTo,
      from,
      to,
      isVerified,
      status,
      car,
      date,
      people,
      description,
      phone,
      fb,
      email
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
        subheader={t('Wyjazd-od')+ fDateTime(date)}
        action={
          <Label variant="ghost" color={(status === 'szukam' && 'info') || 'success'}>
            {status != null && sentenceCase(t(status || 'dam'))}
          </Label>
        }
      />
      <CardContent>
        <Tooltip title={car}>
          <Box flexDirection={'row'} display={'flex'} sx={{ p: 1 }}>
            <Iconify icon="eva:person-add-fill" width={24} height={28} />
            <Typography variant="h5" sx={{ color: 'text.secondary', pl: 1 }}>
              {people}
            </Typography>
          </Box>
        </Tooltip>
        <Stack direction="column" spacing={2} sx={{ p: 2 }}>
          <Box flexDirection={'row'} display={'flex'}>
            <Typography variant="subtitle2" noWrap>
              {t("Jade-z")}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', pl: 1 }} noWrap>
              {addressFrom}
            </Typography>
          </Box>
          <Box flexDirection={'row'} display={'flex'}>
            <Typography variant="subtitle2" noWrap>
              {t("Jade-do")}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', pl: 1 }} noWrap>
              {addressTo}
            </Typography>
          </Box>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        {displayPhone && (
          <Box flexDirection={'row'} display={'flex'} sx={{ pt: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {t("Phone")}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', pl: 1 }} noWrap>
              {phone}
            </Typography>
          </Box>
        )}
        {displayEmail && (
          <Box flexDirection={'row'} display={'flex'} sx={{ pt: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {t("Email")}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', pl: 1 }} noWrap>
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
      </CardActions>
    </Card>
  );
}

export default function TransportDetails(props) {
  const [locale, setLocale] = React.useState('pl');
  const { onClose, open, transport = [] } = props;
  const { t, i18n } = useTranslation();

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{t('SzczegolyTransportu')}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ p: 3, pr: 0, pl: 0 }}>
          {transport.map((transportItem) => (
            <TransportItem key={transportItem.id} item={transportItem} />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}
