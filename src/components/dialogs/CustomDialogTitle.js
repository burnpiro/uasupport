import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Iconify from '../Iconify';

export const CustomDialogTitle = ({ children, onClose, ...other }) => {
  return (
    <DialogTitle {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <Iconify icon="eva:close-fill" />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};
