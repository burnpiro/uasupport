import PropTypes from 'prop-types';
import * as React from 'react';
import { Fragment } from 'react';
// material
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
// component
import { useTranslation } from 'react-i18next';
import { getTypeIcon } from '../../../utils/getTypeIcon';

export default function GroupsListToolbar({ filter, onFilterChange }) {
  const { t, i18n } = useTranslation();

  const handleStatusFilterChange = (event, newStatus) => {
    if (newStatus != null) {
      onFilterChange({
        ...filter,
        groupType: newStatus
      });
    } else {
      onFilterChange({
        ...filter,
        groupType: undefined
      });
    }
  };

  return (
    <Fragment>
      <ToggleButtonGroup
        exclusive
        value={filter['groupType'] != null ? filter['groupType'] : null}
        onChange={handleStatusFilterChange}
      >
        <ToggleButton value="fb-group" sx={{ p: 1 }}>
          {t('fb-group')}
        </ToggleButton>
        <ToggleButton value="other-group" sx={{ p: 1 }}>
          {t('other-group')}
        </ToggleButton>
      </ToggleButtonGroup>
    </Fragment>
  );
}
