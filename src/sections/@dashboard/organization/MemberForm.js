import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
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
import Iconify from '../../../components/Iconify';
import * as Yup from 'yup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import { getTypeIcon } from '../../../utils/getTypeIcon';
import { useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { DialogTransition } from '../../../components/DialogTransition';
import useAuth from '../../../components/context/AuthContext';
import { LoginForm } from '../../authentication/login';
import AuthSocial from '../../authentication/AuthSocial';
import { CustomDialogTitle } from '../../../components/dialogs/CustomDialogTitle';
import { Link as RouterLink } from 'react-router-dom';

export default function MemberForm({
  onClose,
  open,
  onFormSubmitted,
  editElement,
  formType = 'volunteer'
}) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const { t, i18n } = useTranslation();
  const { user, isAdmin, isManager } = useAuth();

  const TransportSchema = Yup.object().shape({
    type: Yup.string().required(t('Field required')),
    name: Yup.string().min(2, t('TooShort')).max(100, 'TooLong').required(t('Field required')),
    email: Yup.string().email(t('Invalid Email')).required(t('Field required')),
    fb: Yup.string().url(t('Invalid URL')),
    phone: Yup.string().required(t('Field required'))
  });

  const handleClose = () => {
    onClose();
  };

  const handleSubmitConfirmed = async (values) => {
    return await onFormSubmitted(values);
  };

  const postFormSubmit = async (values) => {
    return await handleSubmitConfirmed(values);
  };

  const formik = useFormik({
    initialValues: editElement
      ? {
          ...editElement,
        }
      : {
          name: '',
          fb: '',
          email: '',
          phone: '',
          type: formType
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

  const isFormValid = true;

  const isDisabled = !isFormValid;

  const canShowForm = isAdmin || isManager || (editElement != null && editElement.email === user.email);

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
        {editElement != null && editElement.id != null
          ? t('Edit')
          : formType === 'volunteer'
          ? t('Add Volunteer')
          : t('Add Manager')}
      </CustomDialogTitle>
      {canShowForm && (
        <DialogContent>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={3} sx={{pt:1}}>
                <TextField
                  fullWidth
                  label={t('Name') + '*'}
                  {...getFieldProps('name')}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />

                {editElement != null && (
                  <TextField
                    fullWidth
                    type="email"
                    label={t('Email') + '*'}
                    value={values.email}
                    disabled={true}
                  />
                )}
                {editElement == null && (
                  <TextField
                    fullWidth
                    autoComplete="email"
                    type="email"
                    label={t('Email') + '*'}
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
                )}

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
                  label={t('Phone') + '*'}
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
              </Stack>
            </Form>
          </FormikProvider>
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
          </Stack>
        )}
      </DialogActions>
    </Dialog>
  );
}
