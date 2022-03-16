import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import useMediaQuery from '@mui/material/useMediaQuery';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';
import { Form, FormikProvider, useFormik } from 'formik';
import LoadingButton from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import ReCAPTCHA from 'react-google-recaptcha';
import Iconify from '../../../components/Iconify';
import * as Yup from 'yup';
import PositionPicker from '../../../components/PositionPicker';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import { getTypeIcon } from '../../../utils/getTypeIcon';
import { Fragment, useRef, useState } from 'react';
import { SITE_KEY } from '../../../utils/settings';
import { alpha, useTheme } from '@mui/material/styles';
import { DialogTransition } from '../../../components/DialogTransition';
import { GDPRContext } from '../../../components/context/GDPRContext';
import Checkbox from '@mui/material/Checkbox';
import useAuth from '../../../components/context/AuthContext';
import { LoginForm } from '../../authentication/login';
import AuthSocial from '../../authentication/AuthSocial';
import { CustomDialogTitle } from '../../../components/dialogs/CustomDialogTitle';
import { Link as RouterLink } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import MenuPopover from '../../../components/MenuPopover';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { COMBINED_LANGS } from '../../../layouts/dashboard/LanguagePopover';

export default function GroupsForm({
  onClose,
  open,
  onFormSubmitted,
  editElement,
  hideCaptcha = false
}) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const recaptchaRef = useRef(null);
  const [captchaError, setCaptchaError] = useState(false);
  const [GDPRChecked, setGDPRChecked] = useState(false);
  const [token, setToken] = useState(null);
  const { t, i18n } = useTranslation();
  const anchorRef = useRef(null);
  const [langOpen, setLangOpen] = useState(false);
  const { user } = useAuth();
  const [showGDPR, setShowGDPR] = React.useContext(GDPRContext);
  const TransportSchema = Yup.object().shape({
    groupType: Yup.string().required(t('Field required')),
    groupSubType: Yup.string(),
    lang: Yup.string().required(t('Field required')),
    name: Yup.string().min(2, t('TooShort')).max(100, 'TooLong').required(t('Field required')),
    email: Yup.string().email(t('Invalid Email')),
    fb: Yup.string().url(t('Invalid URL')),
    website: Yup.string().url(t('Invalid URL')),
    phone: Yup.string(),
    description: Yup.string().required(t('Field required'))
  });

  const handleClose = () => {
    onClose(false);
  };

  const handleLangOpen = () => {
    setLangOpen(true);
  };

  const handleLangClose = () => {
    setLangOpen(false);
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
          description: editElement.description.replaceAll(/↵/g, '\n').replaceAll('\\n', '\n'),
          website: editElement.website || '',
          groupSubType: editElement.groupSubType || ''
        }
      : {
          name: '',
          fb: '',
          email: '',
          lang: 'en',
          website: '',
          phone: '',
          description: '',
          groupType: 'fb-group',
          groupSubType: '',
          hidden: false
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

  const handleAidChange = (event) => {
    setFieldValue('groupType', event.target.value);
  };

  const handleChangeLang = (newLang) => {
    setFieldValue('lang', newLang);
    handleLangClose();
  };

  const lang = COMBINED_LANGS.find((el) => el.value === values.lang);

  const isFormValid = !(values.fb === '' && values.website === '' && values.phone === '');

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
      fullWidth
      open={open}
      maxWidth={'md'}
    >
      <CustomDialogTitle onClose={handleClose}>
        {editElement != null && editElement.id != null ? t('Edit') : t('Add')}
      </CustomDialogTitle>
      {canShowForm && (
        <DialogContent>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={3} sx={{ pt: 1 }}>
                <FormControl>
                  <FormLabel id="group-type-label">{t('GroupType')}</FormLabel>
                  <RadioGroup
                    aria-labelledby="group-type-label"
                    defaultValue={'fb-group'}
                    value={values.groupType}
                    onChange={handleAidChange}
                    name="group-type-group"
                  >
                    <FormControlLabel
                      value="fb-group"
                      sx={{ pb: 1, pt: 1 }}
                      control={<Radio />}
                      label={
                        <span
                          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                        >
                          {t('fb-group')}{' '}
                        </span>
                      }
                    />
                    <FormControlLabel
                      value="other-group"
                      sx={{ pb: 1, pt: 1 }}
                      control={<Radio />}
                      label={
                        <span
                          style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                        >
                          {t('other-group')}{' '}
                        </span>
                      }
                    />
                  </RadioGroup>
                  {Boolean(errors.groupType) && (
                    <FormHelperText error>{errors.groupType}</FormHelperText>
                  )}
                </FormControl>

                <Box>
                  <FormLabel id="lang-label" sx={{ pr: 2 }}>
                    {t('Language')}
                  </FormLabel>
                  <IconButton
                    ref={anchorRef}
                    onClick={handleLangOpen}
                    sx={{
                      padding: 0,
                      width: 28,
                      height: 28,
                      ...(open && {
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
                      })
                    }}
                  >
                    <img src={lang.icon} alt={lang.label} />
                  </IconButton>
                  <Typography variant={'body2'} component={"span"} sx={{pl: 1}}>{lang.label}</Typography>

                  <MenuPopover
                    open={langOpen}
                    onClose={handleLangClose}
                    anchorEl={anchorRef.current}
                    sx={{ maxHeight: '80vh', overflow: 'auto' }}
                  >
                    <Box sx={{ py: 1 }}>
                      {COMBINED_LANGS.map((option) => (
                        <MenuItem
                          key={option.value}
                          selected={option.value === lang.value}
                          onClick={() => handleChangeLang(option.value)}
                          sx={{ py: 1, px: 2.5 }}
                        >
                          <ListItemIcon>
                            <Box
                              component="img"
                              alt={option.label}
                              src={option.icon}
                              sx={{
                                width: 32,
                                height: 32
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                            {option.label}
                          </ListItemText>
                        </MenuItem>
                      ))}
                    </Box>
                  </MenuPopover>
                </Box>
                <TextField
                  fullWidth
                  label={t('Name') + '*'}
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />
                <TextField
                  fullWidth
                  label={t('GroupSubType')}
                  {...getFieldProps('groupSubType')}
                  error={Boolean(touched.groupSubType && errors.groupSubType)}
                  helperText={touched.groupSubType && errors.groupSubType}
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
                  label={t('Website')}
                  {...getFieldProps('website')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Iconify icon={'eva:globe-outline'} />
                      </InputAdornment>
                    )
                  }}
                  error={Boolean(touched.website && errors.website)}
                  helperText={touched.website && errors.website}
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
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label={t('TransportDescription') + '*'}
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
              {editElement != null && editElement.id != null ? t('Edit') : t('Add')}
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
