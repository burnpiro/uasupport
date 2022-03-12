import PropTypes from 'prop-types';
import * as React from 'react';
import { Fragment } from 'react';
// material
import Tooltip from '@mui/material/Tooltip';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
// component
import { useTranslation } from 'react-i18next';
import { getTypeIcon } from "../../../utils/getTypeIcon";

export default function OrganizationListToolbar({ filter, onFilterChange }) {
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
        <ToggleButton value="foundation-type" sx={{ p: 0, pl: 1 }}>
          <Tooltip title={t('foundation-type')}>
            <img
              style={{ marginRight: '8px', width: '48px' }}
              alt="foundation-type"
              src={getTypeIcon('foundation-type')}
            />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="association-type" sx={{ p: 0, pl: 1 }}>
          <Tooltip title={t('association-type')}>
            <img
              style={{ marginRight: '8px', width: '48px' }}
              alt="association-type"
              src={getTypeIcon('association-type')}
            />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="non-profit-company-type" sx={{ p: 0, pl: 1 }}>
          <Tooltip title={t('non-profit-company-type')}>
            <img
              style={{ marginRight: '8px', width: '48px' }}
              alt="non-profit-company-type"
              src={getTypeIcon('non-profit-company-type')}
            />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </Fragment>
  );
}
