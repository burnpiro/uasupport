import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack, TextField, IconButton, InputAdornment, Typography } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Iconify from '../../../components/Iconify';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import plLocale from 'date-fns/locale/pl';
import ruLocale from 'date-fns/locale/ru';
import enLocale from 'date-fns/locale/en-US';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import {CustomDialogTitle} from "../../../components/dialogs/CustomDialogTitle";

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

export default function FilterDialog(props) {
  const [locale, setLocale] = React.useState('pl');
  const { t, i18n } = useTranslation();
  const { onClose, selectFilter, open, filter } = props;
  const [form, setForm] = React.useState({});

  useEffect(() => {
    setForm(filter);
  }, [filter]);

  const handleClose = () => {
    onClose();
  };

  const handleFormChange = (field, value) => {
    setForm({
      ...form,
      [field]: value
    });
  };
  const handleStatusChange = (event) => {
    handleFormChange('status', event.target.value);
  };

  const handleFilter = () => {
    selectFilter(form);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <CustomDialogTitle onClose={handleClose}>{t('Filter')}</CustomDialogTitle>
      <DialogContent>
        <Stack direction={{ xs: 'column' }} sx={{ mt: 2 }} spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label={t('Osoby od')}
              type={'number'}
              value={form.from}
              onChange={(e) => handleFormChange('from', e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Iconify icon={'bi:people'} />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              fullWidth
              label={t('Osoby do')}
              type={'number'}
              onChange={(e) => handleFormChange('to', e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Iconify icon={'bi:people'} />
                  </InputAdornment>
                )
              }}
              value={form.to}
              error={Boolean(form.to != null && form.to > 0 && form.to < form.from)}
              helperText={form.to < form.from ? '' : ''}
            />
          </Stack>
          <TextField
            fullWidth
            label={t('Phone')}
            type={'text'}
            onChange={(e) => handleFormChange('phone', e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Iconify icon={'eva:phone-call-fill'} />
                </InputAdornment>
              )
            }}
            value={form.phone}
          />
          {/*<FormGroup>*/}
          {/*  <FormControlLabel*/}
          {/*    onChange={(e) => handleFormChange('onlyVerified', e.target.checked)}*/}
          {/*    control={<Switch checked={form.onlyVerified} />}*/}
          {/*    label={t("Tylko zweryfikowane profile")}*/}
          {/*  />*/}
          {/*</FormGroup>*/}
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[locale]}>
            <DatePicker
              label={t('Date')}
              mask={maskMap[locale]}
              value={form.date}
              onChange={(newValue) => handleFormChange('date', newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <FormControl>
            <FormLabel id="status-label">{t('Status')}</FormLabel>
            <RadioGroup
              aria-labelledby="status-label"
              defaultValue={''}
              value={form.status}
              onChange={handleStatusChange}
              name="aid-type-group"
            >
              <FormControlLabel value="szukam" control={<Radio />} label={t('szukam')} />
              <FormControlLabel value="dam" control={<Radio />} label={t('dam')} />
              <FormControlLabel value={''} control={<Radio />} label={t('all-statuses')} />
            </RadioGroup>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('Cancel')}</Button>
        <Button onClick={handleFilter}>{t('Filter')}</Button>
      </DialogActions>
    </Dialog>
  );
}
