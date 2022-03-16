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
import {CustomDialogTitle} from "./CustomDialogTitle";
import {useEffect, useState} from "react";
import {TCPL, TCUA, TCEN} from "../../utils/data/TC";
export default function GDPRDialog({ open, handleClose }) {
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

  let selectedTC = TCEN;
  switch (selectedLang) {
    case 'ua':
    case 'ru':
      selectedTC = TCUA;
      break;
    case 'pl':
      selectedTC = TCPL;
      break;
  }

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="gdpr-dialog">
      <CustomDialogTitle onClose={handleClose} id="gdpr-dialog">{t('GDPR')}</CustomDialogTitle>
      <DialogContent>
        <Typography component={'pre'} variant={"body1"} style={{whiteSpace: 'break-spaces'}}>
          {selectedTC}
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
