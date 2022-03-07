import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack, TextField, InputAdornment, Box, Link, Tooltip, useMediaQuery } from '@mui/material';
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
import Label from '../../components/Label';
import { useTranslation } from 'react-i18next';
import { getTypeIcon } from './Aids';
import { useTheme } from '@mui/material/styles';
import { DialogTransition } from '../../components/DialogTransition';
import {CustomDialogTitle} from "../../components/dialogs/CustomDialogTitle";

function AidItem(props) {
  const {
    item: {
      avatarUrl,
      name,
      addressFrom,
      from,
      isVerified,
      description = '',
      aidSubType,
      aidType,
      phone,
      fb,
      email,
      website
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
        avatar={<Avatar aria-label="recipe" src={getTypeIcon(aidType)} />}
        title={name}
        action={
          <Label variant="ghost" color={(aidType === 'health-aid' && 'info') || 'success'}>
            {aidType != null && t(aidType || 'standard-aid')}
          </Label>
        }
      />
      <CardContent>
        <Stack direction="column" spacing={2} sx={{ p: 2 }}>
          <Box flexDirection={'row'} display={'flex'}>
            <Typography variant="subtitle2">{t('Aid-address')}:</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', pl: 1 }}>
              {addressFrom}
            </Typography>
          </Box>
          {aidSubType && aidType === 'medical-aid' && (
            <Box flexDirection={'row'} display={'flex'}>
              <Typography variant="subtitle2">{t('MedicalAidType')}:</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', pl: 1 }}>
                {aidSubType}
              </Typography>
            </Box>
          )}
        </Stack>
        <Typography variant="body2" color="text.secondary" style={{ whiteSpace: 'pre-line' }}>
          {description.replace(/↵/g, '\n').replace('\\n', '\n')}
        </Typography>
        {displayPhone && (
          <Box flexDirection={'row'} display={'flex'} sx={{ pt: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {t('Phone')}:
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', pl: 1 }}>
              {phone}
            </Typography>
          </Box>
        )}
        {displayEmail && (
          <Box flexDirection={'row'} display={'flex'} sx={{ pt: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {t('Email')}:
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
        <Link href={website} target="_blank">
          <IconButton
            aria-label="website"
            color={'warning'}
            disabled={website == null || website === ''}
          >
            <Iconify icon="eva:globe-outline" width={24} height={24} />
          </IconButton>
        </Link>
      </CardActions>
    </Card>
  );
}

export default function AidsDetails(props) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const [locale, setLocale] = React.useState('pl');
  const { onClose, open, aid = [] } = props;
  const { t, i18n } = useTranslation();

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullScreen={matches}
      TransitionComponent={DialogTransition}
    >
      <CustomDialogTitle onClose={handleClose}>{t('SzczegolyPomocy')}</CustomDialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ p: 3, pr: 0, pl: 0 }}>
          {aid.map((aidItem) => (
            <AidItem key={aidItem.id} item={aidItem} />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('OK')}</Button>
      </DialogActions>
    </Dialog>
  );
}
