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
import { Form, FormikProvider, useFormik } from 'formik';
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

export default function AidsForm(props) {
  const [locale, setLocale] = React.useState('pl');
  const { t, i18n } = useTranslation();

  const { onClose, open, onFormSubmitted, editElement } = props;

  const TransportSchema = Yup.object().shape({
    aidType: Yup.string().required(t('Field required')),
    aidSubType: Yup.string(),
    name: Yup.string().min(2, t('TooShort')).max(100, 'TooLong').required(t('Field required')),
    email: Yup.string().email(t('Invalid Email')),
    fb: Yup.string().url(t('Invalid URL')),
    website: Yup.string().url(t('Invalid URL')),
    phone: Yup.string(),
    description: Yup.string().required(t('Field required')),
    addressFrom: Yup.string().required(t('Field required')),
    from: Yup.array().of(Yup.number()).min(2, t('Field required')).required(t('Field required'))
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
          description: editElement.description.replace(/↵/g, '\n').replace('\\n', '\n'),
          website: editElement.website || '',
          aidSubType: editElement.aidSubType || ''
        }
      : {
          name: '',
          fb: '',
          email: '',
          website: '',
          phone: '',
          description: '',
          addressFrom: '',
          from: [],
          aidType: 'standard-aid',
          aidSubType: ''
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
  const handleAidChange = (event) => {
    setFieldValue('aidType', event.target.value);
  };

  const mapCenter = {
    lat: 51.059,
    lng: 19.956
  };

  return (
    <Dialog onClose={handleClose} fullWidth open={open} maxWidth={false}>
      <DialogTitle>{t('AddAid')}</DialogTitle>
      <DialogContent>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit} style={{ minWidth: '512px' }}>
            <Stack spacing={3}>
              <FormControl>
                <FormLabel id="aid-type-label">{t('AidType')}</FormLabel>
                <RadioGroup
                  aria-labelledby="aid-type-label"
                  defaultValue={'standard-aid'}
                  value={values.aidType}
                  onChange={handleAidChange}
                  name="aid-type-group"
                >
                  <FormControlLabel
                    value="standard-aid"
                    sx={{ pb: 1, pt: 1 }}
                    control={<Radio />}
                    label={
                      <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <img
                          style={{ marginRight: '8px' }}
                          alt="standard-aid"
                          src={getTypeIcon('standard-aid')}
                        />
                        {t('standard-aid')}{' '}
                      </span>
                    }
                  />
                  <FormControlLabel
                    value="health-aid"
                    sx={{ pb: 1, pt: 1 }}
                    control={<Radio />}
                    label={
                      <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <img
                          style={{ marginRight: '8px' }}
                          alt="health-aid"
                          src={getTypeIcon('health-aid')}
                        />
                        {t('health-aid')}{' '}
                      </span>
                    }
                  />
                  <FormControlLabel
                    value="medical-aid"
                    sx={{ pb: 1, pt: 1 }}
                    control={<Radio />}
                    label={
                      <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <img
                          style={{ marginRight: '8px' }}
                          alt="medical-aid"
                          src={getTypeIcon('medical-aid')}
                        />
                        {t('medical-aid')}{' '}
                      </span>
                    }
                  />
                  <FormControlLabel
                    value="psych-aid"
                    sx={{ pb: 1, pt: 1 }}
                    control={<Radio />}
                    label={
                      <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <img
                          style={{ marginRight: '8px' }}
                          alt="psych-aid"
                          src={getTypeIcon('psych-aid')}
                        />
                        {t('psych-aid')}{' '}
                      </span>
                    }
                  />
                  <FormControlLabel
                    value="blood-aid"
                    sx={{ pb: 1, pt: 1 }}
                    control={<Radio />}
                    label={
                      <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <img
                          style={{ marginRight: '8px' }}
                          alt="blood-aid"
                          src={getTypeIcon('blood-aid')}
                        />
                        {t('blood-aid')}{' '}
                      </span>
                    }
                  />
                  <FormControlLabel
                    value="food-aid"
                    sx={{ pb: 1, pt: 1 }}
                    control={<Radio />}
                    label={
                      <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <img
                          style={{ marginRight: '8px' }}
                          alt="food-aid"
                          src={getTypeIcon('food-aid')}
                        />
                        {t('food-aid')}{' '}
                      </span>
                    }
                  />
                  <FormControlLabel
                    value="animal-aid"
                    sx={{ pb: 1, pt: 1 }}
                    control={<Radio />}
                    label={
                      <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <img
                          style={{ marginRight: '8px' }}
                          alt="animal-aid"
                          src={getTypeIcon('animal-aid')}
                        />
                        {t('animal-aid')}{' '}
                      </span>
                    }
                  />
                  <FormControlLabel
                    value="law-aid"
                    sx={{ pb: 1, pt: 1 }}
                    control={<Radio />}
                    label={
                      <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <img
                          style={{ marginRight: '8px' }}
                          alt="law-aid"
                          src={getTypeIcon('law-aid')}
                        />
                        {t('law-aid')}{' '}
                      </span>
                    }
                  />
                  <FormControlLabel
                    value="translate-aid"
                    sx={{ pb: 1, pt: 1 }}
                    control={<Radio />}
                    label={
                      <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <img
                          style={{ marginRight: '8px' }}
                          alt="translate-aid"
                          src={getTypeIcon('translate-aid')}
                        />
                        {t('translate-aid')}{' '}
                      </span>
                    }
                  />
                </RadioGroup>
                {Boolean(errors.aidType) && <FormHelperText error>{errors.aidType}</FormHelperText>}
              </FormControl>
              <TextField
                fullWidth
                label={t('Name') + '*'}
                {...getFieldProps('name')}
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
              />
              {values.aidType === 'medical-aid' && (
                <TextField
                  fullWidth
                  label={t('MedicalAidType')}
                  {...getFieldProps('aidSubType')}
                  error={Boolean(touched.aidSubType && errors.aidSubType)}
                  helperText={touched.aidSubType && errors.aidSubType}
                />
              )}

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

              <TextField
                fullWidth
                label={t('AddressAidDesc') + '*'}
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
            {t('AddAid')}
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
