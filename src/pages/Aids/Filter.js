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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import plLocale from 'date-fns/locale/pl';
import ruLocale from 'date-fns/locale/ru';
import enLocale from 'date-fns/locale/en-US';
import {useTranslation} from "react-i18next";

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
  const { t, i18n } = useTranslation();
  const [form, setForm] = React.useState({
    onlyVerified: false,
    aidType: ''
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
  const handleAidChange = (event) => {
    handleFormChange('aidType', event.target.value);
  };

  const handleFilter = () => {
    selectFilter(form);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Filter</DialogTitle>
      <DialogContent>
        <Stack direction={{ xs: 'column' }} sx={{ mt: 2 }} spacing={2}>
          <FormGroup>
            <FormControlLabel
              onChange={(e) => handleFormChange('onlyVerified', e.target.checked)}
              control={<Switch checked={form.onlyVerified} />}
              label="Tylko zweryfikowane profile"
            />
          </FormGroup>
          <FormControl>
            <FormLabel id="aid-type-label">{t('AidType')}</FormLabel>
            <RadioGroup
              aria-labelledby="aid-type-label"
              defaultValue={''}
              value={form.aidType}
              onChange={handleAidChange}
              name="aid-type-group"
            >
              <FormControlLabel
                value="standard-aid"
                control={<Radio />}
                label={t('standard-aid')}
              />
              <FormControlLabel value="health-aid" control={<Radio />} label={t('health-aid')} />
              <FormControlLabel value={''} control={<Radio />} label={t('all-aid')} />
            </RadioGroup>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleFilter}>Filter</Button>
      </DialogActions>
    </Dialog>
  );
}
