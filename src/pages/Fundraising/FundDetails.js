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
import Label from '../../components/Label';
import { useTranslation } from 'react-i18next';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const CoverImgStyle = styled('img')({
  top: 0,
  width: 'calc(100% + 48px)',
  maxWidth: 'calc(100% + 48px)',
  transform: 'translateX(-24px)',
  height: 'auto',
  objectFit: 'cover'
});

function FundItem(props) {
  const {
    item: {
      author: { avatarUrl, name: authorName },
      cover,
      title,
      createdAt,
      name,
      twitter,
      website,
      addressFrom,
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
      <CardContent>
        <CoverImgStyle alt={title} src={cover} />
        <Typography variant="h3" sx={{ pt: 1 }}>
          {title}
        </Typography>
        <Stack direction="column" spacing={2} sx={{ p: 2 }}>
          <Box flexDirection={'row'} display={'flex'}>
            <Typography variant="subtitle2" noWrap>
              {t('Fund-address')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', pl: 1 }} noWrap>
              {addressFrom}
            </Typography>
          </Box>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
        {displayPhone && (
          <Box flexDirection={'row'} display={'flex'} sx={{ pt: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {t('Phone')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', pl: 1 }} noWrap>
              {phone}
            </Typography>
          </Box>
        )}
        {displayEmail && (
          <Box flexDirection={'row'} display={'flex'} sx={{ pt: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {t('Email')}
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
        <Link href={twitter} target="_blank">
          <IconButton
            aria-label="twitter"
            color={'info'}
            disabled={twitter == null || twitter === ''}
          >
            <Iconify icon="eva:twitter-fill" width={24} height={24} />
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

export default function FundDetails(props) {
  const [locale, setLocale] = React.useState('pl');
  const { onClose, open, fund } = props;
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open} sx={{ minWidth: 550 }} fullScreen={fullScreen}>
      <DialogTitle>
        {fund && (
          <Box flexDirection={'row'} display={'flex'} sx={{ alignItems: 'center', pt: 2 }}>
            <Avatar aria-label="author" src={fund.author.avatarUrl} />
            <Typography variant="h4" sx={{ color: 'text.secondary', pl: 1 }} noWrap>
              {fund.author.name}
            </Typography>
          </Box>
        )}
      </DialogTitle>
      <DialogContent sx={{ minWidth: 500, p: 0 }}>{fund && <FundItem item={fund} />}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}