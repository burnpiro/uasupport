import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
// component
import {useTranslation} from "react-i18next";
import useAuth from "../../../components/context/AuthContext";

// ----------------------------------------------------------------------

export default function ForgotForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { t, i18n } = useTranslation();
  const {forgotPassword} = useAuth();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email(t('Invalid Email')).required(t('Field required')),
  });

  const handleSubmitSent = async (values) => {
    await forgotPassword({email: values.email})
    return true;
  }

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
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          {/*<FormControlLabel*/}
          {/*  control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}*/}
          {/*  label={t('RememberMe')}*/}
          {/*/>*/}
          <Box sx={{ flexGrow: 1 }} />

          {/*<Link component={RouterLink} variant="subtitle2" to="#" underline="hover">*/}
          {/*  {t('Forgot password?')}*/}
          {/*</Link>*/}
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          {t('Send a link')}
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
