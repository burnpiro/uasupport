import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack, TextField, InputAdornment, Box, Link, Tooltip } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DateTimePicker from '@mui/lab/DateTimePicker';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import plLocale from 'date-fns/locale/pl';
import ruLocale from 'date-fns/locale/ru';
import enLocale from 'date-fns/locale/en-US';
import { Form, FormikProvider, useFormik } from 'formik';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import Iconify from '../../../components/Iconify';
import { fDateTime } from '../../../utils/formatTime';
import * as Yup from 'yup';
import PositionPicker from '../../../components/PositionPicker';

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

export default function HomeForm(props) {
  const [locale, setLocale] = React.useState('pl');
  const { t, i18n } = useTranslation();

  const { onClose, open, onFormSubmitted, editElement, defaultStatus = 'dam' } = props;

  const TransportSchema = Yup.object().shape({
    name: Yup.string().min(2, t('TooShort')).max(100, 'TooLong').required(t('Field required')),
    email: Yup.string().email(t('Invalid Email')),
    fb: Yup.string().url(t('Invalid URL')),
    phone: Yup.string(),
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

  const handleSubmitConfirmed = (values) => {
    onFormSubmitted(values);
  };

  const formik = useFormik({
    initialValues: editElement
      ? {
          ...editElement,
        description: editElement.description.replace(/↵/g, "\n").replace("\\n", "\n")
        }
      : {
          name: '',
          fb: '',
          email: '',
          phone: '',
          description: '',
          addressFrom: '',
          status: defaultStatus,
          date: new Date(),
          period: '',
          from: [],
          people: 0,
          pet: '',
          child: '',
          disability: '',
          includingTransport: '',
          separateBath: false,
          kitchen: false
        },
    validationSchema: TransportSchema,
    onSubmit: handleSubmitConfirmed
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

  const handleBathChange = (event) => {
    setFieldValue('separateBath', event.target.checked);
  };

  const handleKitchenChange = (event) => {
    setFieldValue('kitchen', event.target.checked);
  };
  const mapCenter = {
    lat: 51.059,
    lng: 19.956
  };

  return (
    <Dialog onClose={handleClose} open={open} fullWidth maxWidth={false}>
      <DialogTitle>{t(values.status === 'dam' ? 'AddHome' : 'GetHome')}</DialogTitle>
      <DialogContent>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit} style={{ minWidth: '512px' }}>
            <Stack spacing={3}>
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

              <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[locale]}>
                <DateTimePicker
                  label={t('CheckIn') + '*'}
                  mask={maskMap[locale]}
                  value={values.date}
                  onChange={(newValue) => handleDateChange(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
                {Boolean(errors.date) && <FormHelperText error>{errors.date}</FormHelperText>}
              </LocalizationProvider>

              <TextField
                fullWidth
                type={'text'}
                label={t('Mieszkanie-czas')}
                {...getFieldProps('period')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Iconify icon={'eva:clock-outline'} />
                    </InputAdornment>
                  )
                }}
                error={Boolean(touched.period && errors.period)}
                helperText={touched.period && errors.period}
              />

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
                label={t('AddressHomeDesc') + '*'}
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
              <PositionPicker
                onPositionChange={handleFromChange}
                mapCenter={mapCenter}
                defaultMarker={values.from.length > 0 ? values.from : null}
              />
              {Boolean(errors.from) && <FormHelperText error>{errors.from}</FormHelperText>}

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
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={values.separateBath} onChange={handleBathChange} />}
                  label={t('Separate Bath')}
                />
                {Boolean(errors.separateBath) && (
                  <FormHelperText error>{errors.separateBath}</FormHelperText>
                )}
                <FormControlLabel
                  control={<Checkbox checked={values.kitchen} onChange={handleKitchenChange} />}
                  label={t('Kitchen Access')}
                />
                {Boolean(errors.kitchen) && <FormHelperText error>{errors.kitchen}</FormHelperText>}
              </FormGroup>

              <TextField
                fullWidth
                type={'text'}
                label={t('Mieszkanie-zwierze')}
                {...getFieldProps('pet')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Iconify icon={'map:pet-store'} />
                    </InputAdornment>
                  )
                }}
                error={Boolean(touched.pet && errors.pet)}
                helperText={touched.pet && errors.pet}
              />

              <TextField
                fullWidth
                type={'text'}
                label={t('Mieszkanie-dzieci')}
                {...getFieldProps('child')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Iconify icon={'cil:child'} />
                    </InputAdornment>
                  )
                }}
                error={Boolean(touched.child && errors.child)}
                helperText={touched.child && errors.child}
              />

              <TextField
                fullWidth
                type={'text'}
                label={t('Mieszkanie-disability')}
                {...getFieldProps('disability')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Iconify icon={'fontisto:paralysis-disability'} />
                    </InputAdornment>
                  )
                }}
                error={Boolean(touched.disability && errors.disability)}
                helperText={touched.disability && errors.disability}
              />

              <TextField
                fullWidth
                type={'text'}
                label={t('Mieszkanie-transport')}
                {...getFieldProps('includingTransport')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Iconify icon={'ant-design:car-outlined'} />
                    </InputAdornment>
                  )
                }}
                error={Boolean(touched.includingTransport && errors.includingTransport)}
                helperText={touched.includingTransport && errors.includingTransport}
              />
            </Stack>
          </Form>
        </FormikProvider>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', alignItems: 'start' }}>
        <Button color={'error'} onClick={handleClose}>
          {t('Cancel')}
        </Button>
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
            disabled={values.fb === '' && values.email === '' && values.phone === ''}
            loading={isSubmitting}
            onClick={submitForm}
          >
            {t(values.status === 'dam' ? 'AddHome' : 'GetHome')}
          </LoadingButton>
          {Object.keys(errors).length > 0 && (
            <FormHelperText error>{t('Form Invalid')}</FormHelperText>
          )}
          {values.fb === '' && values.email === '' && values.phone === '' && (
            <FormHelperText error>{t('Form Invalid - Social')}</FormHelperText>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
