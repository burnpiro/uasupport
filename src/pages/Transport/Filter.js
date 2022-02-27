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
import Iconify from '../../components/Iconify';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import plLocale from 'date-fns/locale/pl';
import ruLocale from 'date-fns/locale/ru';
import enLocale from 'date-fns/locale/en-US';

const localeMap = {
  pl: plLocale,
  ru: ruLocale,
  en: enLocale
};

const maskMap = {
  pl: '__/__/____',
  ru: '__.__.____',
  en: '__/__/____'
};

export default function FilterDialog(props) {
  const [locale, setLocale] = React.useState('pl');
  const [form, setForm] = React.useState({
    from: 0,
    to: 0,
    onlyVerified: false,
    date: null
  });
  const { onClose, selectFilter, open } = props;

  const handleClose = () => {
    onClose();
  };

  const handleFormChange = (field, value) => {
    setForm({
      ...form,
      [field]: value
    });
  };

  const handleFilter = () => {
    selectFilter(form);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Filter</DialogTitle>
      <DialogContent>
        <Stack direction={{ xs: 'column' }} sx={{ mt: 2}} spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Osoby od"
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
              label="Osoby do"
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
          <FormGroup>
            <FormControlLabel
              onChange={(e) => handleFormChange('onlyVerified', e.target.checked)}
              control={<Switch checked={form.onlyVerified} />}
              label="Tylko zweryfikowane profile"
            />
          </FormGroup>
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeMap[locale]}>
            <DatePicker
              label="Data"
              mask={maskMap[locale]}
              value={form.date}
              onChange={(newValue) => handleFormChange('date', newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleFilter}>Filter</Button>
      </DialogActions>
    </Dialog>
  );
}
