import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import FormHelperText from '@mui/material/FormHelperText';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import Iconify from '../../../components/Iconify';
import * as Yup from 'yup';
import PositionPicker from '../../../components/PositionPicker';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import { getTypeIcon } from '../../../pages/Aids/Aids';
import { TextField, Typography } from '@mui/material';
import ReCAPTCHA from 'react-google-recaptcha';
import { useCallback, useEffect, useRef, useState } from 'react';
import {SITE_KEY} from "../../../utils/settings";

export default function HomeDeleteForm({ onClose, open, onFormSubmitted, deleteElement }) {
  const { t, i18n } = useTranslation();
  const [typedName, setTypedName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const [token, setToken] = useState(null);
  const recaptchaRef = useRef(null);

  const handleClose = () => {
    onClose();
  };

  const handleSubmitConfirmed = () => {
    setIsSubmitting(true);
    onFormSubmitted(deleteElement);
  };

  const onCaptchaSubmit = (token) => {
    setToken(token);
    setCaptchaError(false);
  };

  const handleCaptchaExpired = () => {
    setToken(null);
  };

  const handleCaptchaError = () => {
    setCaptchaError(true);
  };

  const submitForm = () => {
    const recaptchaValue = recaptchaRef.current.getValue();
    if (recaptchaValue.length > 3) {
      handleSubmitConfirmed();
    } else {
      handleCaptchaError(true);
    }
  };
  const handleChange = (event) => {
    setTypedName(event.target.value);
  };

  return (
    <Dialog onClose={handleClose} fullWidth open={open} maxWidth={false}>
      <DialogTitle>{t('RemoveHome')}</DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Typography>
            {t('Name')}: <b>{deleteElement.name}</b>
          </Typography>
          <TextField
            fullWidth
            value={typedName}
            onChange={handleChange}
            label={t('TypeTheName2') + '*'}
            error={Boolean(typedName.trim() !== deleteElement.name.trim())}
            helperText={
              Boolean(typedName.trim() !== deleteElement.name.trim()) && t('TypedNameIncorrect2')
            }
          />
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={SITE_KEY}
            onChange={onCaptchaSubmit}
            onErrored={handleCaptchaError}
            onExpired={handleCaptchaExpired}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', alignItems: 'start' }}>
        <Button color={'info'} onClick={handleClose}>
          {t('Cancel')}
        </Button>
        <Stack spacing={1}>
          <LoadingButton
            fullWidth
            size="medium"
            type="submit"
            variant="contained"
            color={'error'}
            disabled={
              Boolean(typedName.trim() !== deleteElement.name.trim()) ||
              captchaError ||
              token == null
            }
            loading={isSubmitting}
            onClick={submitForm}
          >
            {t('Usuń')}
          </LoadingButton>
          {captchaError && <FormHelperText error>{t('CAPTCHA Error')}</FormHelperText>}
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
