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
import {useTranslation} from "react-i18next";

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

HomeListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func
};

export default function HomeListToolbar({
  numSelected,
  isLocationFiltered,
  isFiltered,
  filterName,
  onFilterName,
  onClearFilter,
  onClearLocation,
  onFilterClick,
  showAllSelected
}) {
  const { t, i18n } = useTranslation();
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
          placeholder={t("Szukaj zakwaterowania")}
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
        />
      )}

      <div>
        {numSelected === 0 && (
          <Tooltip title={t("Filter list")}>
            <IconButton onClick={onFilterClick}>
              <Iconify icon="ic:round-filter-list" />
            </IconButton>
          </Tooltip>
        )}
        {isFiltered > 0 && (
          <Tooltip title={t("Clear filter")}>
            <IconButton onClick={onClearFilter} color={'error'}>
              <Iconify icon="carbon:filter-remove" />
            </IconButton>
          </Tooltip>
        )}

        {isLocationFiltered && (
          <Tooltip title={t("Clear location")}>
            <IconButton onClick={onClearLocation} color={'error'}>
              <Iconify icon="uil:map-marker-slash" />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </RootStyle>
  );
}
