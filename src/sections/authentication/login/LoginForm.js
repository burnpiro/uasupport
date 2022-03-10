import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import LoadingButton from '@mui/lab/LoadingButton';
// component
import Iconify from '../../../components/Iconify';
import { useTranslation } from 'react-i18next';
import useAuth from '../../../components/context/AuthContext';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { t, i18n } = useTranslation();
  const { login } = useAuth();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email(t('Invalid Email')).required(t('Field required')),
    password: Yup.string().required(t('Field required'))
  });

  const handleSubmitSent = async (values) => {
    const res = login({ email: values.email, password: values.password });
    if (res) {

    }
    return true;
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: handleSubmitSent
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label={t('Email')}
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label={t('Password')}
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          {/*<FormControlLabel*/}
          {/*  control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}*/}
          {/*  label={t('RememberMe')}*/}
          {/*/>*/}
          <Box sx={{ flexGrow: 1 }} />

          <Link component={RouterLink} variant="subtitle2" to="/forgot" underline="hover">
            {t('Forgot password?')}
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          {t('Login')}
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
