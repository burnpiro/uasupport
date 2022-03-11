import PropTypes from 'prop-types';
// material
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
// component
import { useTranslation } from 'react-i18next';
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Iconify from "../../../components/Iconify";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function TransportListToolbar({
  filter,
  onFilterChange
}) {
  const { t, i18n } = useTranslation();

  const handlePeopleChange = (event) => {
    const newPeople = Number(event.target.value);
    if (newPeople > 0) {
      onFilterChange({
        ...filter,
        from: newPeople,
        to: newPeople === 9 ? undefined : newPeople + 1
      });
    } else {
      onFilterChange({
        ...filter,
        from: undefined,
        to: undefined
      });
    }
  };

  return (
    <Box sx={{ minWidth: 140 }}>
      <FormControl fullWidth>
        <InputLabel
          id="people-select-label"
          sx={{ justifyContent: 'center', display: 'inline-flex' }}
        >
          <Iconify icon="bi:people" sx={{ p: 0, m: 0, width: '1.35em', height: '1.35em' }} />
          <span style={{ marginLeft: '8px' }}>{t('People')}</span>
        </InputLabel>
        <Select
          labelId="people-select-label"
          id="people-select"
          value={filter['from'] || ''}
          label={t('People')}
          onChange={handlePeopleChange}
        >
          <MenuItem value={-1}>{t('Clear filter')}</MenuItem>
          <MenuItem value={1}>1 - 2</MenuItem>
          <MenuItem value={2}>2 - 3</MenuItem>
          <MenuItem value={3}>3 - 4</MenuItem>
          <MenuItem value={4}>4 - 5</MenuItem>
          <MenuItem value={5}>5 - 6</MenuItem>
          <MenuItem value={6}>6 - 7</MenuItem>
          <MenuItem value={7}>7 - 8</MenuItem>
          <MenuItem value={8}>8 - 9</MenuItem>
          <MenuItem value={9}>9+</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
