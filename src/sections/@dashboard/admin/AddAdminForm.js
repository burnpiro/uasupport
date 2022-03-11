import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import ReCAPTCHA from 'react-google-recaptcha';
import { useRef, useState } from 'react';
import { SITE_KEY } from '../../../utils/settings';
import { CustomDialogTitle } from '../../../components/dialogs/CustomDialogTitle';

export default function AddAdminForm({ onClose, open, onFormSubmitted }) {
  const { t, i18n } = useTranslation();
  const [typedEmail, setTypedEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const [token, setToken] = useState(null);
  const recaptchaRef = useRef(null);

  const handleClose = () => {
    onClose();
  };

  const handleSubmitConfirmed = () => {
    setIsSubmitting(true);
    onFormSubmitted(typedEmail);
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
    // const recaptchaValue = recaptchaRef.current.getValue();
    // if (recaptchaValue.length > 3) {
      handleSubmitConfirmed();
    // } else {
    //   handleCaptchaError(true);
    // }
  };
  const handleChange = (event) => {
    setTypedEmail(event.target.value);
  };

  return (
    <Dialog onClose={handleClose} fullWidth open={open} maxWidth={false}>
      <CustomDialogTitle onClose={handleClose}>{t('Add Admin')}</CustomDialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <TextField
            fullWidth
            value={typedEmail}
            onChange={handleChange}
            label={t('Email') + '*'}
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
            disabled={typedEmail.length < 6}
            loading={isSubmitting}
            onClick={submitForm}
          >
            {t('Add Admin')}
          </LoadingButton>
          {captchaError && <FormHelperText error>{t('CAPTCHA Error')}</FormHelperText>}
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
