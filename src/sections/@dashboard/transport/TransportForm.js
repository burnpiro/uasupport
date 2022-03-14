import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DateTimePicker from '@mui/lab/DateTimePicker';
import Typography from '@mui/material/Typography';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import plLocale from 'date-fns/locale/pl';
import ruLocale from 'date-fns/locale/ru';
import enLocale from 'date-fns/locale/en-US';
import { Form, FormikProvider, useFormik } from 'formik';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import Iconify from '../../../components/Iconify';
import * as Yup from 'yup';
import PositionPicker from '../../../components/PositionPicker';
import ReCAPTCHA from 'react-google-recaptcha';
import { SITE_KEY } from '../../../utils/settings';
import { useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { DialogTransition } from '../../../components/DialogTransition';
import { GDPRContext } from '../../../components/context/GDPRContext';
import Checkbox from '@mui/material/Checkbox';
import useAuth from '../../../components/context/AuthContext';
import { LoginForm } from '../../authentication/login';
import AuthSocial from '../../authentication/AuthSocial';
import { CustomDialogTitle } from '../../../components/dialogs/CustomDialogTitle';
import { getCurrentPosition } from '../../../utils/locationService/locationService';
import { Link as RouterLink } from 'react-router-dom';

const localeMap = {
  pl: plLocale,
  ua: ruLocale,
  ru: ruLocale,
  en: enLocale
};

const maskMap = {
  pl: '__/__/____',
  ua: '__.__.____',
  ru: '__.__.____',
  en: '__/__/____'
};

const defaultMapCenter = {
  lat: 50.4118,
  lng: 23.3635
};

export default function TransportForm({
  onClose,
  open,
  onFormSubmitted,
  editElement,
  defaultStatus = 'dam',
  hideCaptcha = false
}) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const [locale, setLocale] = React.useState('pl');
  const recaptchaRef = useRef(null);
  const [captchaError, setCaptchaError] = useState(false);
  const [GDPRChecked, setGDPRChecked] = useState(false);
  const [token, setToken] = useState(null);
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [showGDPR, setShowGDPR] = React.useContext(GDPRContext);
  const [mapCenter, setMapCenter] = useState(defaultMapCenter);

  const TransportSchema = Yup.object().shape({
    name: Yup.string().min(2, t('TooShort')).max(100, 'TooLong').required(t('Field required')),
    email: Yup.string().email(t('Invalid Email')),
    fb: Yup.string().url(t('Invalid URL')),
    phone: Yup.string(),
    car: Yup.string(),
    people: Yup.number()
      .required(t('Field required'))
      .positive(t('PositiveNumberError'))
      .integer(t('IntegerNumberError')),
    description: Yup.string(),
    status: Yup.string().required(),
    date: Yup.date().required(),
    addressFrom: Yup.string().required(t('Field required')),
    from: Yup.array().of(Yup.number()).min(2, t('Field required')).required(t('Field required')),
    addressTo: Yup.string()
  });

  const handleClose = () => {
    onClose();
  };

  const handleSubmitConfirmed = async (values) => {
    return await onFormSubmitted(values);
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

  const postFormSubmit = async (values) => {
    if (hideCaptcha) {
      return await handleSubmitConfirmed(values);
    }
    const recaptchaValue = recaptchaRef.current.getValue();
    if (recaptchaValue.length > 3) {
      return await handleSubmitConfirmed(values);
    } else {
      handleCaptchaError(true);
    }
  };

  const handleGDPRClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowGDPR(true);
  };

  const formik = useFormik({
    initialValues: editElement
      ? {
          ...editElement,
          description: editElement.description.replaceAll(/↵/g, '\n').replaceAll('\\n', '\n')
        }
      : {
          name: '',
          fb: '',
          email: '',
          phone: '',
          car: '',
          description: '',
          addressFrom: '',
          addressTo: '',
          status: defaultStatus,
          date: new Date(),
          from: [],
          people: 0
        },
    validationSchema: TransportSchema,
    onSubmit: postFormSubmit
  });
  const {
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    setFieldValue,
    submitForm,
    values
  } = formik;

  const handleFromChange = (newFromPosition) => {
    setFieldValue('from', [newFromPosition.lat, newFromPosition.lng]);
  };

  const handleDateChange = (newDate) => {
    setFieldValue('date', newDate);
  };

  const handleUserPositionChange = (newPosition) => {
    if (newPosition != null) {
      setMapCenter({
        lat: newPosition.latitude,
        lng: newPosition.longitude
      });
      setFieldValue('from', [newPosition.latitude, newPosition.longitude]);
    }
  };

  const handleUseLocation = () => {
    getCurrentPosition(handleUserPositionChange);
  };

  const isFormValid = !(values.fb === '' && values.email === '' && values.phone === '');

  const isDisabled =
    !isFormValid || ((captchaError || token == null) && !hideCaptcha) || !GDPRChecked;

  const canShowForm =
    (editElement == null && user != null) ||
    (editElement != null &&
      user != null &&
      editElement.owner != null &&
      editElement.owner === user.id) ||
    (editElement != null && editElement.owner == null);

  return (
    <Dialog
      onClose={handleClose}
      fullScreen={matches}
      TransitionComponent={DialogTransition}
      open={open}
      fullWidth
      maxWidth={'md'}
    >
      <CustomDialogTitle onClose={handleClose}>
        {editElement != null && editElement.id != null
          ? t('EdytujTransport')
          : t(values.status === 'dam' ? 'DodajTransport' : 'SzukajTransport')}
      </CustomDialogTitle>

      {canShowForm && (
        <DialogContent>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={3} sx={{ pt: 1 }}>
                <TextField
                  fullWidth
                  label={t('Name') + '*'}
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />

                <TextField
                  fullWidth
                  autoComplete="email"
                  type="email"
                  label={t('Email')}
                  {...getFieldProps('email')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Iconify icon={'eva:email-outline'} />
                      </InputAdornment>
                    )
                  }}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                />

                <TextField
                  fullWidth
                  type={'text'}
                  label={t('FB')}
                  {...getFieldProps('fb')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Iconify icon={'eva:facebook-fill'} />
                      </InputAdornment>
                    )
                  }}
                  error={Boolean(touched.fb && errors.fb)}
                  helperText={touched.fb && errors.fb}
                />

                <TextField
                  fullWidth
                  type={'text'}
                  label={t('Phone')}
                  {...getFieldProps('phone')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Iconify icon={'eva:phone-call-fill'} />
                      </InputAdornment>
                    )
                  }}
                  error={Boolean(touched.phone && errors.phone)}
                  helperText={touched.phone && errors.phone}
                />
                <FormHelperText sx={{ color: 'darkorange' }}>
                  {t('OnlyYourOwnDataWarning')}
                </FormHelperText>

                <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[locale]}>
                  <DateTimePicker
                    label={t('Date') + '*'}
                    mask={maskMap[locale]}
                    value={values.date}
                    onChange={(newValue) => handleDateChange(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  {Boolean(errors.date) && <FormHelperText error>{errors.date}</FormHelperText>}
                </LocalizationProvider>

                <TextField
                  fullWidth
                  type={'number'}
                  label={t('People') + '*'}
                  {...getFieldProps('people')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Iconify icon={'akar-icons:person-add'} />
                      </InputAdornment>
                    )
                  }}
                  error={Boolean(touched.people && errors.people)}
                  helperText={touched.people && errors.people}
                />

                <TextField
                  fullWidth
                  label={t('AddressDesc') + '*'}
                  {...getFieldProps('addressFrom')}
                  error={Boolean(touched.addressFrom && errors.addressFrom)}
                  helperText={touched.addressFrom && errors.addressFrom}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Iconify icon={'entypo:address'} />
                      </InputAdornment>
                    )
                  }}
                />
                <FormHelperText error>{t('AddressWarning')}</FormHelperText>
                <Button color={'primary'} variant={'outlined'} onClick={handleUseLocation}>
                  {t('Use current location')}
                </Button>
                <PositionPicker
                  onPositionChange={handleFromChange}
                  mapCenter={mapCenter}
                  defaultMarker={values.from.length > 0 ? values.from : null}
                />
                {Boolean(errors.from) && <FormHelperText error>{errors.from}</FormHelperText>}

                <TextField
                  fullWidth
                  label={t('AddressToDesc')}
                  {...getFieldProps('addressTo')}
                  error={Boolean(touched.addressTo && errors.addressTo)}
                  helperText={touched.addressTo && errors.addressTo}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Iconify icon={'entypo:address'} />
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  fullWidth
                  label={t('Car')}
                  {...getFieldProps('car')}
                  error={Boolean(touched.car && errors.car)}
                  helperText={touched.car && errors.car}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Iconify icon={'eva:car-fill'} />
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label={t('TransportDescription')}
                  {...getFieldProps('description')}
                  error={Boolean(touched.description && errors.description)}
                  helperText={touched.description && errors.description}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Iconify icon={'fa:info-circle'} />
                      </InputAdornment>
                    )
                  }}
                />
              </Stack>
            </Form>
          </FormikProvider>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              required
              control={
                <Checkbox
                  checked={GDPRChecked}
                  onChange={(event) => setGDPRChecked(event.target.checked)}
                />
              }
              label={
                <Typography variant={'caption'}>
                  {t('TCFillInfo')}
                  {': '}
                  <Link onClick={handleGDPRClick}>{t('GDPR')}</Link>{' '}
                </Typography>
              }
            />
            {!GDPRChecked && <FormHelperText error>{t('TCAccept')}</FormHelperText>}
          </Box>
          {!hideCaptcha && (
            <Box sx={{ mt: 2 }}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={SITE_KEY}
                onChange={onCaptchaSubmit}
                onErrored={handleCaptchaError}
                onExpired={handleCaptchaExpired}
              />
            </Box>
          )}
        </DialogContent>
      )}
      {!canShowForm && (
        <DialogContent>
          <Typography variant={'subtitle1'} sx={{ pb: 1, textAlign: 'center' }}>
            {t('Login to add new data')}
          </Typography>
          <AuthSocial />
          <LoginForm />
          <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
            {t('By registering, I agree to')} &nbsp;
            <Link
              component={RouterLink}
              underline="always"
              color="textPrimary"
              to={'/dashboard/tc'}
              style={{ cursor: 'pointer' }}
            >
              {t('Terms of Service')}
            </Link>
            &nbsp;{t('and')}&nbsp;
            <Link
              component={RouterLink}
              underline="always"
              color="textPrimary"
              to={'/dashboard/privacy-policy'}
              style={{ cursor: 'pointer' }}
            >
              {t('Privacy Policy')}
            </Link>
            .
          </Typography>
        </DialogContent>
      )}
      <DialogActions sx={{ justifyContent: 'space-between', alignItems: 'start' }}>
        <Button color={'error'} onClick={handleClose}>
          {t('Cancel')}
        </Button>

        {canShowForm && (
          <Stack spacing={1}>
            <LoadingButton
              fullWidth
              size="medium"
              type="submit"
              variant="contained"
              color={
                Object.keys(errors).length > 0 || Object.keys(touched).length === 0
                  ? 'primary'
                  : 'success'
              }
              disabled={isDisabled}
              loading={isSubmitting}
              onClick={submitForm}
            >
              {editElement != null && editElement.id != null
                ? t('EdytujTransport')
                : t(values.status === 'dam' ? 'DodajTransport' : 'SzukajTransport')}
            </LoadingButton>
            {Object.keys(errors).length > 0 && (
              <FormHelperText error>{t('Form Invalid')}</FormHelperText>
            )}
            {values.fb === '' && values.email === '' && values.phone === '' && (
              <FormHelperText error>{t('Form Invalid - Social')}</FormHelperText>
            )}
            {captchaError && !hideCaptcha && (
              <FormHelperText error>{t('CAPTCHA Error')}</FormHelperText>
            )}
            {isFormValid && !GDPRChecked && <FormHelperText error>{t('TCAccept')}</FormHelperText>}
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  );
}
