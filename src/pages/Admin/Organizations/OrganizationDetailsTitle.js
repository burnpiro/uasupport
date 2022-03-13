import PropTypes from 'prop-types';
// material
import { styled, useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
// component
import Iconify from '../../../components/Iconify';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Tooltip } from '@mui/material';

export default function OrganizationDetailsTitle({
  handleAddManager,
  handleAddVolunteer,
  handleEditCurrentMember,
  onEdit,
  name
}) {
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
    switch (option) {
      case 'addVolunteer':
        handleAddVolunteer('volunteer');
        break;
      case 'addManager':
        handleAddManager('manager');
        break;
      case 'editCurrentMember':
        handleEditCurrentMember();
        break;
    }
    handleClose();
  };

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        {t(name)}
        {onEdit && (
          <Tooltip title={t('Edit')}>
            <Button
              variant={'outlined'}
              color={'warning'}
              onClick={onEdit}
              sx={{ minWidth: '30px', width: '52px', height: '52px', padding: 0, ml: 1 }}
            >
              <Iconify
                icon="eva:edit-fill"
                sx={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: theme.palette.warning.main,
                  padding: 0,
                  margin: 0
                }}
              />
            </Button>
          </Tooltip>
        )}
      </Typography>
      {!matches && (handleAddVolunteer || handleAddManager) && (
        <Box>
          <IconButton
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            style={{ alignItems: 'center' }}
          >
            <Iconify
              icon="eva:plus-fill"
              sx={{ fontSize: '24px', fontWeight: 'bold', color: theme.palette.primary.main }}
            />
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
            {handleAddVolunteer && (
              <MenuItem onClick={() => handleSelectMenu('addVolunteer')}>
                {t('Add Volunteer')}
              </MenuItem>
            )}
            {handleAddManager && (
              <MenuItem onClick={() => handleSelectMenu('addManager')}>{t('Add Manager')}</MenuItem>
            )}
          </Menu>
        </Box>
      )}
      {matches && (
        <Box>
          {handleAddManager && (
            <Button
              variant="contained"
              color={"warning"}
              onClick={() => handleSelectMenu('addManager')}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              {t('Add Manager')}
            </Button>
          )}
          {handleAddVolunteer && (
            <Button
              variant="contained"
              onClick={() => handleSelectMenu('addVolunteer')}
              startIcon={<Iconify icon="eva:plus-fill" />}
              sx={{ml: 1}}
            >
              {t('Add Volunteer')}
            </Button>
          )}
          {handleEditCurrentMember && (
            <Button
              variant="contained"
              onClick={() => handleSelectMenu('editCurrentMember')}
              startIcon={<Iconify icon="eva:edit-fill" />}
              sx={{ml: 1}}
            >
              {t('Edit My Data')}
            </Button>
          )}
        </Box>
      )}
    </Stack>
  );
}
