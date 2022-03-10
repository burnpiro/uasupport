import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import LoadingButton from '@mui/lab/LoadingButton';
// component
import Iconify from '../../../components/Iconify';
import { useTranslation } from 'react-i18next';
import useAuth from "../../../components/context/AuthContext";

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { t, i18n } = useTranslation();
  const {signUp} = useAuth();

  const RegisterSchema = Yup.object().shape({
    email: Yup.string().email(t('Invalid Email')).required(t('Field required')),
    password: Yup.string().required(t('Field required')).matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase and One Number"
    )
  });

  const handleFormSubmit = async (values) => {
    const user = await signUp(values);
    return false;
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: handleFormSubmit
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

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
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            {t('Register')}
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
