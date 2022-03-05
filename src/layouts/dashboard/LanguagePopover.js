import { useEffect, useRef, useState, Fragment } from 'react';
// material
import { alpha, useTheme } from '@mui/material/styles';
import i18next from '../../i18n';
import {
  Box,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  Tooltip
} from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';
import { useLocalStorage } from '../../hooks/useLocalStorage';

// ----------------------------------------------------------------------

export const LANGS = [
  {
    value: 'pl',
    label: 'Polski',
    icon: '/static/icons/poland-svgrepo-com.svg'
  },
  {
    value: 'ua',
    label: 'український',
    icon: '/static/icons/ukraine-svgrepo-com.svg'
  },
  {
    value: 'ru',
    label: 'русский',
    icon: '/static/icons/russia-svgrepo-com.svg'
  },
  {
    value: 'en',
    label: 'English',
    icon: '/static/icons/united-kingdom-svgrepo-com.svg'
  }
];

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useLocalStorage('lang', LANGS[0].value);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    i18next.changeLanguage(selectedLang);
  }, [selectedLang]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeLang = (lang) => {
    setSelectedLang(lang);
    handleClose();
  };

  const lang = LANGS.find((el) => el.value === selectedLang);

  return !matches ? (
    <Fragment>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 36,
          height: 36,
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
          })
        }}
      >
        <img src={lang.icon} alt={lang.label} />
      </IconButton>

      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current}>
        <Box sx={{ py: 1 }}>
          {LANGS.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === lang.value}
              onClick={() => handleChangeLang(option.value)}
              sx={{ py: 1, px: 2.5 }}
            >
              <ListItemIcon>
                <Box component="img" alt={option.label} src={option.icon} />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                {option.label}
              </ListItemText>
            </MenuItem>
          ))}
        </Box>
      </MenuPopover>
    </Fragment>
  ) : (
    <Fragment>
      {LANGS.map((option) => (
        <Tooltip title={option.label} key={option.value}>
          <IconButton
            selected={option.value === lang.value}
            onClick={() => handleChangeLang(option.value)}
            sx={{
              padding: 0,
              width: option.value === lang.value ? 42 : 36,
              height: option.value === lang.value ? 42 : 36,
              borderWidth: '3px',
              borderStyle: option.value === lang.value ? 'solid' : 'none',
              borderColor: (theme) => theme.palette.primary.light
            }}
          >
            <Box component="img" alt={option.label} src={option.icon} />
          </IconButton>
        </Tooltip>
      ))}
    </Fragment>
  );
}
