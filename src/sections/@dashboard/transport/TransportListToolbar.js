import PropTypes from 'prop-types';
// material
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
// component
import { useTranslation } from 'react-i18next';

export default function TransportListToolbar({
  filter,
  onFilterChange
}) {
  const { t, i18n } = useTranslation();

  const handleStatusFilterChange = (event, newStatus) => {
    if (newStatus != null) {
      onFilterChange({
        ...filter,
        status: newStatus
      });
    } else {
      onFilterChange({
        ...filter,
        status: undefined
      });
    }
  };

  return (
    <ToggleButtonGroup
      color="primary"
      exclusive
      value={filter['status'] != null ? filter['status'] : null}
      onChange={handleStatusFilterChange}
    >
      <ToggleButton value="dam">{t('Find')}</ToggleButton>
      <ToggleButton value="szukam">{t('Offer')}</ToggleButton>
    </ToggleButtonGroup>
  );
}
