import PropTypes from 'prop-types';
// material
import { styled, useTheme } from '@mui/material/styles';
import {
  Toolbar,
  Tooltip,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
  Box,
  Button,
  useMediaQuery,
  Grid
} from '@mui/material';
// component
import Iconify from '../../../components/Iconify';
import { useTranslation } from 'react-i18next';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import useDebouncedEffect from '../../../hooks/useDebounceEffect';
import { useState } from 'react';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 1)
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

TransportListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func
};

export default function TransportListToolbar({
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
  const [query, setQuery] = useState(filterName);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

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

  useDebouncedEffect(
    () => {
      onFilterName(query);
    },
    300,
    [query]
  );

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
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
      <Grid
        container
        justifyContent={'space-between'}
        alignItems={'center'}
        spacing={1}
        sx={{ pt: 4, pb: 1 }}
      >
        <Grid item>
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
              value={query}
              onChange={handleQueryChange}
              placeholder={t('Szukaj transport')}
              startAdornment={
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              }
            />
          )}
        </Grid>
        {!matches && (
          <Grid item>
            {numSelected === 0 && (
              <Tooltip title="Filter list">
                <IconButton onClick={onFilterClick}>
                  <Iconify icon="ic:round-filter-list" />
                </IconButton>
              </Tooltip>
            )}
            {isFiltered > 0 && (
              <Tooltip title="Clear filter">
                <IconButton onClick={onClearFilter} color={'error'}>
                  <Iconify icon="carbon:filter-remove" />
                </IconButton>
              </Tooltip>
            )}

            {isLocationFiltered && (
              <Tooltip title="Clear location">
                <IconButton onClick={onClearLocation} color={'error'}>
                  <Iconify icon="uil:map-marker-slash" />
                </IconButton>
              </Tooltip>
            )}
          </Grid>
        )}
        <Grid item>
          <ToggleButtonGroup
            color="primary"
            exclusive
            value={filter['status'] != null ? filter['status'] : null}
            onChange={handleStatusFilterChange}
          >
            <ToggleButton value="dam">{t('Find')}</ToggleButton>
            <ToggleButton value="szukam">{t('Offer')}</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        {matches && (
          <Grid item>
            {numSelected === 0 && (
              <Tooltip title="Filter list">
                <IconButton onClick={onFilterClick}>
                  <Iconify icon="ic:round-filter-list" />
                </IconButton>
              </Tooltip>
            )}
            {isFiltered > 0 && (
              <Tooltip title="Clear filter">
                <IconButton onClick={onClearFilter} color={'error'}>
                  <Iconify icon="carbon:filter-remove" />
                </IconButton>
              </Tooltip>
            )}

            {isLocationFiltered && (
              <Tooltip title="Clear location">
                <IconButton onClick={onClearLocation} color={'error'}>
                  <Iconify icon="uil:map-marker-slash" />
                </IconButton>
              </Tooltip>
            )}
          </Grid>
        )}
      </Grid>
    </RootStyle>
  );
}
