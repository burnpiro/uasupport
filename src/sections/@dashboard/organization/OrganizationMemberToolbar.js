import PropTypes from 'prop-types';
import * as React from 'react';
import { Fragment } from 'react';
// material
import Tooltip from '@mui/material/Tooltip';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
// component
import { useTranslation } from 'react-i18next';
import { getTypeIcon } from '../../../utils/getTypeIcon';

export default function OrganizationMemberToolbar({ filter, onFilterChange }) {
  const { t, i18n } = useTranslation();

  const handleStatusFilterChange = (event, newStatus) => {
    if (newStatus != null) {
      onFilterChange({
        ...filter,
        type: newStatus
      });
    } else {
      onFilterChange({
        ...filter,
        type: undefined
      });
    }
  };

  return (
    <Fragment>
      <ToggleButtonGroup
        exclusive
        value={filter['type'] != null ? filter['type'] : null}
        onChange={handleStatusFilterChange}
      >
        <ToggleButton value="volunteer">{t('volunteer')}</ToggleButton>
        <ToggleButton value="manager">{t('manager')}</ToggleButton>
      </ToggleButtonGroup>
    </Fragment>
  );
}
