import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Iconify from '../../components/Iconify';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {CustomDialogTitle} from "../../components/dialogs/CustomDialogTitle";

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
    <Card>
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
            <Typography variant="body2" sx={{ color: 'text.secondary', pl: 1 }}>
              {addressFrom}
            </Typography>
          </Box>
        </Stack>
        <Typography variant="body2" color="text.secondary" component={"pre"} style={{whiteSpace: 'break-spaces'}}>
          {description.replaceAll(/↵/g, '\n').replaceAll('\\n', '\n')}
        </Typography>
        {displayPhone && (
          <Box flexDirection={'row'} display={'flex'} sx={{ pt: 1 }}>
            <Typography variant="subtitle2">
              {t('Phone')}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', pl: 1 }}>
              {phone}
            </Typography>
          </Box>
        )}
        {displayEmail && (
          <Box flexDirection={'row'} display={'flex'} sx={{ pt: 1 }}>
            <Typography variant="subtitle2">
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
        <Link href={fb ? fb : undefined} target="_blank">
          <IconButton aria-label="fb" color={'info'} disabled={fb == null || fb === ''}>
            <Iconify icon="eva:facebook-fill" width={24} height={24} />
          </IconButton>
        </Link>
        <Link href={twitter ? twitter : undefined} target="_blank">
          <IconButton
            aria-label="twitter"
            color={'info'}
            disabled={twitter == null || twitter === ''}
          >
            <Iconify icon="eva:twitter-fill" width={24} height={24} />
          </IconButton>
        </Link>
        <Link href={website ? website : undefined} target="_blank">
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
    <Dialog onClose={handleClose} open={open} fullScreen={fullScreen} maxWidth={"sm"}>
      <CustomDialogTitle sx={{ m: 0, p: 1}} onClose={handleClose}>
        {fund && (
          <Box flexDirection={'row'} display={'flex'} sx={{ alignItems: 'center', pt: 2 }}>
            <Avatar aria-label="author" src={fund.author.avatarUrl} />
            <Typography variant="h4" sx={{ color: 'text.secondary', pl: 1 }} >
              {fund.author.name}
            </Typography>
          </Box>
        )}
      </CustomDialogTitle>
      <DialogContent sx={{ p: 0 }}>{fund && <FundItem item={fund} />}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}
