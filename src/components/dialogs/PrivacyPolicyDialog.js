import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { CustomDialogTitle } from './CustomDialogTitle';
import { useEffect, useState } from 'react';
import { PPPL, PPUA, PPEN } from '../../utils/data/PP';
export default function PrivacyPolicyDialog({ open, handleClose }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState('en');

  // i18n has to resolve lang value in next tick
  useEffect(() => {
    setTimeout(() => {
      setSelectedLang(i18n.resolvedLanguage);
    }, 10);
  }, [i18n.resolvedLanguage]);

  let selectedPP = PPEN;
  switch (selectedLang) {
    case 'ua':
    case 'ru':
      selectedPP = PPUA;
      break;
    case 'pl':
      selectedPP = PPPL;
      break;
  }

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="pp-dialog">
      <CustomDialogTitle onClose={handleClose} id="pp-dialog">
        {t('Privacy Policy')}
      </CustomDialogTitle>
      <DialogContent>
        <Typography component={'pre'} variant={'body1'} style={{ whiteSpace: 'break-spaces' }}>
          {selectedPP}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          {t('OK')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
