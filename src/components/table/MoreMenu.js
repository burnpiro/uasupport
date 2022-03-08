import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
// component
import Iconify from '../Iconify';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

export default function MoreMenu({ onClickShow, onClickEdit, onClickDelete }) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const handleEditClick = () => {
    if (onClickEdit) {
      onClickEdit();
      setIsOpen(false);
    }
  };
  const handleDeleteClick = () => {
    if (onClickDelete) {
      onClickDelete();
      setIsOpen(false);
    }
  };

  const handleShowClick = () => {
    if (onClickShow) {
      onClickShow();
      setIsOpen(false);
    }
  };

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem sx={{ color: 'text.secondary' }} onClick={handleShowClick}>
          <ListItemIcon>
            <Iconify icon="eva:book-open-outline" width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary={t('Zobacz')} primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>

        {onClickEdit && (
          <MenuItem onClick={handleEditClick} sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Iconify icon="eva:edit-fill" width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary={t('Edytuj')} primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}

        {onClickDelete && (
          <MenuItem onClick={handleDeleteClick} sx={{ color: 'text.secondary' }}>
            <ListItemIcon>
              <Iconify icon="flat-color-icons:cancel" width={24} height={24} />
            </ListItemIcon>
            <ListItemText primary={t('Usuń')} primaryTypographyProps={{ variant: 'body2' }} />
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
