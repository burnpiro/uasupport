import PropTypes from 'prop-types';
import { useState } from 'react';
// material
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
// component
import Iconify from '../Iconify';
import { useTranslation } from 'react-i18next';
import * as React from 'react';
import useDebouncedEffect from '../../hooks/useDebounceEffect';

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

export default function ListToolbar({
  numSelected,
  isLocationFiltered,
  isFiltered,
  filterName,
  onFilterName,
  onClearFilter,
  onClearLocation,
  onFilterClick,
  showAllSelected,
  ListToolbarItems,
  searchPlaceholder = 'Szukaj'
}) {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState(filterName);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

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
              placeholder={t(searchPlaceholder)}
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
            {numSelected === 0 && onFilterClick && (
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
          </Grid>
        )}

        <Grid item>{ListToolbarItems}</Grid>

        {matches && (
          <Grid item>
            {numSelected === 0 && onFilterClick && (
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
          </Grid>
        )}
      </Grid>
    </RootStyle>
  );
}
