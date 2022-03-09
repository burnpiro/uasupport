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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import {useTranslation} from "react-i18next";
import {useEffect} from "react";
import {getTypeIcon} from "../../../utils/getTypeIcon";
import {CustomDialogTitle} from "../../../components/dialogs/CustomDialogTitle";

export default function FilterDialog(props) {
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
  const handleAidChange = (event) => {
    handleFormChange('aidType', event.target.value);
  };

  const handleFilter = () => {
    selectFilter(form);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <CustomDialogTitle onClose={handleClose}>{t('Filter')}</CustomDialogTitle>
      <DialogContent>
        <Stack direction={{ xs: 'column' }} sx={{ mt: 2 }} spacing={2}>
          {/*<FormGroup>*/}
          {/*  <FormControlLabel*/}
          {/*    onChange={(e) => handleFormChange('onlyVerified', e.target.checked)}*/}
          {/*    control={<Switch checked={form.onlyVerified} />}*/}
          {/*    label={t("Tylko zweryfikowane profile")}*/}
          {/*  />*/}
          {/*</FormGroup>*/}
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
                sx={{pb: 1, pt: 1}}
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
                sx={{pb: 1, pt: 1}}
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
                sx={{pb: 1, pt: 1}}
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
                sx={{pb: 1, pt: 1}}
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
                sx={{pb: 1, pt: 1}}
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
                sx={{pb: 1, pt: 1}}
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
                sx={{pb: 1, pt: 1}}
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
                sx={{pb: 1, pt: 1}}
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
                sx={{pb: 1, pt: 1}}
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
              <FormControlLabel
                sx={{pb: 1, pt: 1}} value={''} control={<Radio />} label={t('all-aid')} />
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
