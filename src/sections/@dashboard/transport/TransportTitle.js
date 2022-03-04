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
  Grid,
  Stack,
  Menu,
  MenuItem
} from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
// component
import Iconify from '../../../components/Iconify';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import useDebouncedEffect from '../../../hooks/useDebounceEffect';
import { red } from '@mui/material/colors';

export default function TransportTitle({ handleFormOpen }) {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectMenu = (option) => {
    handleFormOpen(option);
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h4" gutterBottom>
        {t('Transport')}
      </Typography>
      {!matches && (
        <Box>
          <IconButton
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            style={{alignItems: 'center'}}
          >
            <Iconify icon="eva:plus-fill" sx={{ fontSize: '24px', fontWeight: 'bold', color: theme.palette.primary.main }} />
            <Typography variant={'subtitle1'}>{t('Add')}</Typography>

          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button'
            }}
          >
            <MenuItem onClick={() => handleSelectMenu('dam')}>{t('AddTransport')}</MenuItem>
            <MenuItem onClick={() => handleSelectMenu('szukam')}>{t('GetTransport')}</MenuItem>
          </Menu>
        </Box>
      )}
      {matches && (
        <Box>
          <Button
            variant="contained"
            color={'warning'}
            sx={{ backgroundColor: red[300], mr: 1 }}
            onClick={() => handleSelectMenu('szukam')}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            {t('GetTransport')}
          </Button>
          <Button
            variant="contained"
            onClick={() => handleSelectMenu('dam')}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            {t('AddTransport')}
          </Button>
        </Box>
      )}
    </Stack>
  );
}
