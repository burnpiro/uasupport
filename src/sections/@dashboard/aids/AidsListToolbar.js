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

export default function AidsListToolbar({ filter, onFilterChange }) {
  const { t, i18n } = useTranslation();

  const handleStatusFilterChange = (event, newStatus) => {
    if (newStatus != null) {
      onFilterChange({
        ...filter,
        aidType: newStatus
      });
    } else {
      onFilterChange({
        ...filter,
        aidType: undefined
      });
    }
  };

  return (
    <Fragment>
      <ToggleButtonGroup
        exclusive
        value={filter['aidType'] != null ? filter['aidType'] : null}
        onChange={handleStatusFilterChange}
      >
        <ToggleButton value="standard-aid" sx={{ p: 0, pl: 1 }}>
          <Tooltip title={t('standard-aid')}>
            <img
              style={{ marginRight: '8px', width: '32px' }}
              alt="standard-aid"
              src={getTypeIcon('standard-aid')}
            />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="health-aid" sx={{ p: 0, pl: 1 }}>
          <Tooltip title={t('health-aid')}>
            <img
              style={{ marginRight: '8px', width: '32px' }}
              alt="health-aid"
              src={getTypeIcon('health-aid')}
            />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="medical-aid" sx={{ p: 0, pl: 1 }}>
          <Tooltip title={t('medical-aid')}>
            <img
              style={{ marginRight: '8px', width: '32px' }}
              alt="medical-aid"
              src={getTypeIcon('medical-aid')}
            />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="psych-aid" sx={{ p: 0, pl: 1 }}>
          <Tooltip title={t('psych-aid')}>
            <img
              style={{ marginRight: '8px', width: '32px' }}
              alt="psych-aid"
              src={getTypeIcon('psych-aid')}
            />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="blood-aid">
          <Tooltip title={t('blood-aid')}>
            <img
              style={{ marginRight: '8px', width: '32px' }}
              alt="blood-aid"
              src={getTypeIcon('blood-aid')}
            />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="food-aid">
          <Tooltip title={t('food-aid')}>
            <img
              style={{ marginRight: '8px', width: '32px' }}
              alt="food-aid"
              src={getTypeIcon('food-aid')}
            />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="animal-aid" sx={{ p: 0, pl: 1 }}>
          <Tooltip title={t('animal-aid')}>
            <img
              style={{ marginRight: '8px', width: '32px' }}
              alt="animal-aid"
              src={getTypeIcon('animal-aid')}
            />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="law-aid" sx={{ p: 0, pl: 1 }}>
          <Tooltip title={t('law-aid')}>
            <img
              style={{ marginRight: '8px', width: '32px' }}
              alt="law-aid"
              src={getTypeIcon('law-aid')}
            />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="translate-aid" sx={{ p: 0, pl: 1 }}>
          <Tooltip title={t('translate-aid')}>
            <img
              style={{ marginRight: '8px', width: '32px' }}
              alt="translate-aid"
              src={getTypeIcon('translate-aid')}
            />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </Fragment>
  );
}
