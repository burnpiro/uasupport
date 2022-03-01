import PropTypes from 'prop-types';
// material
import { styled } from '@mui/material/styles';
import {
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
  Box,
  Button
} from '@mui/material';
// component
import Iconify from '../../../components/Iconify';
import { useTranslation } from 'react-i18next';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { getTypeIcon } from '../../../pages/Aids/Aids';
import * as React from 'react';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));

// ----------------------------------------------------------------------

AidsListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func
};

export default function AidsListToolbar({
  numSelected,
  isLocationFiltered,
  isFiltered,
  filterName,
  onFilterName,
  onClearFilter,
  onClearLocation,
  onFilterClick,
  showAllSelected,
  filter,
  onFilterChange
}) {
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
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter'
        })
      }}
    >
      {numSelected > 0 ? (
        <Box flexDirection={'row'} display={'flex'} sx={{ alignItems: 'center' }}>
          <Typography component="div" variant="subtitle1" sx={{ pr: 1 }}>
            {numSelected} {t('selected')}
          </Typography>

          <Button variant="contained" onClick={showAllSelected}>
            <Iconify icon="eva:book-open-outline" width={24} height={24} />
            <Typography>{t('Zobacz wszystkie')}</Typography>
          </Button>
        </Box>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder={t('Szukaj pomocy')}
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
        />
      )}

      <ToggleButtonGroup
        exclusive
        value={filter['aidType'] != null ? filter['aidType'] : null}
        onChange={handleStatusFilterChange}
      >
        <ToggleButton value="standard-aid" sx={{p:0, pl: 1}}>
          <Tooltip title={t('health-aid')}>
            <img
              style={{ marginRight: '8px', width: '32px' }}
              alt="standard-aid"
              src={getTypeIcon('standard-aid')}
            />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="health-aid" sx={{p:0, pl: 1}}>
          <Tooltip title={t('health-aid')}>
            <img
              style={{ marginRight: '8px', width: '32px' }}
              alt="health-aid"
              src={getTypeIcon('health-aid')}
            />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="medical-aid" sx={{p:0, pl: 1}}>
          <Tooltip title={t('medical-aid')}>
            <img
              style={{ marginRight: '8px', width: '32px' }}
              alt="medical-aid"
              src={getTypeIcon('medical-aid')}
            />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="psych-aid" sx={{p:0, pl: 1}}>
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
        <ToggleButton value="animal-aid" sx={{p:0, pl: 1}}>
          <Tooltip title={t('animal-aid')}>
            <img
              style={{ marginRight: '8px', width: '32px' }}
              alt="animal-aid"
              src={getTypeIcon('animal-aid')}
            />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="law-aid" sx={{p:0, pl: 1}}>
          <Tooltip title={t('law-aid')}>
            <img
              style={{ marginRight: '8px', width: '32px' }}
              alt="law-aid"
              src={getTypeIcon('law-aid')}
            />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="translate-aid" sx={{p:0, pl: 1}}>
          <Tooltip title={t('translate-aid')}>
            <img
              style={{ marginRight: '8px', width: '32px' }}
              alt="translate-aid"
              src={getTypeIcon('translate-aid')}
            />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>

      <div>
        {numSelected === 0 && (
          <Tooltip title={t('Filter list')}>
            <IconButton onClick={onFilterClick}>
              <Iconify icon="ic:round-filter-list" />
            </IconButton>
          </Tooltip>
        )}
        {isFiltered > 0 && (
          <Tooltip title={t('Clear filter')}>
            <IconButton onClick={onClearFilter} color={'error'}>
              <Iconify icon="carbon:filter-remove" />
            </IconButton>
          </Tooltip>
        )}

        {isLocationFiltered && (
          <Tooltip title={t('Clear location')}>
            <IconButton onClick={onClearLocation} color={'error'}>
              <Iconify icon="uil:map-marker-slash" />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </RootStyle>
  );
}
