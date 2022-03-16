import { useEffect, useRef, useState, Fragment } from 'react';
// material
import { alpha, useTheme } from '@mui/material/styles';
import i18next from '../../i18n';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import Tooltip from '@mui/material/Tooltip';
// components
import MenuPopover from '../../components/MenuPopover';
import { useLocalStorage } from '../../hooks/useLocalStorage';

// ----------------------------------------------------------------------

export const LANGS = [
  {
    value: 'ua',
    label: 'український',
    icon: '/static/icons/flags/ukraine-svgrepo-com.svg'
  },
  {
    value: 'ru',
    label: 'русский',
    icon: '/static/icons/flags/russia-svgrepo-com.svg'
  },
  {
    value: 'en',
    label: 'English',
    icon: '/static/icons/flags/united-kingdom-svgrepo-com.svg'
  }
];

export const OTHER_LANGS = [
  {
    value: 'bg',
    label: 'български',
    icon: '/static/icons/flags/bulgaria-svgrepo-com.svg'
  },
  // {
  //   value: 'hr',
  //   label: 'Hrvatski',
  //   icon: '/static/icons/flags/croatia-svgrepo-com.svg'
  // },
  {
    value: 'cs',
    label: 'Češki',
    icon: '/static/icons/flags/czech-republic-svgrepo-com.svg'
  },
  {
    value: 'da',
    label: 'Dansk',
    icon: '/static/icons/flags/denmark-svgrepo-com.svg'
  },
  // {
  //   value: 'et',
  //   label: 'Eesti keel',
  //   icon: '/static/icons/flags/estonia-svgrepo-com.svg'
  // },
  // {
  //   value: 'fi',
  //   label: 'Suomalainen',
  //   icon: '/static/icons/flags/finland-svgrepo-com.svg'
  // },
  // {
  //   value: 'fr',
  //   label: 'Français',
  //   icon: '/static/icons/flags/france-svgrepo-com.svg'
  // },
  {
    value: 'de',
    label: 'Deutsch',
    icon: '/static/icons/flags/germany-svgrepo-com.svg'
  },
  // {
  //   value: 'el',
  //   label: 'Ελληνικά',
  //   icon: '/static/icons/flags/greece-svgrepo-com.svg'
  // },
  // {
  //   value: 'hu',
  //   label: 'Magyar',
  //   icon: '/static/icons/flags/hungary-svgrepo-com.svg'
  // },
  {
    value: 'it',
    label: 'Italiano',
    icon: '/static/icons/flags/italy-svgrepo-com.svg'
  },
  // {
  //   value: 'lv',
  //   label: 'Latviešu',
  //   icon: '/static/icons/flags/latvia-svgrepo-com.svg'
  // },
  // {
  //   value: 'lt',
  //   label: 'Lietuvių',
  //   icon: '/static/icons/flags/lithuania-svgrepo-com.svg'
  // },
  {
    value: 'mt',
    label: 'Malti',
    icon: '/static/icons/flags/malta-svgrepo-com.svg'
  },
  {
    value: 'nl',
    label: 'Nederlands',
    icon: '/static/icons/flags/netherlands-svgrepo-com.svg'
  },
  {
    value: 'no',
    label: 'Norsk',
    icon: '/static/icons/flags/norway-svgrepo-com.svg'
  },
  {
    value: 'pl',
    label: 'Polski',
    icon: '/static/icons/flags/poland-svgrepo-com.svg'
  },
  {
    value: 'pt',
    label: 'Português',
    icon: '/static/icons/flags/portugal-svgrepo-com.svg'
  },
  // {
  //   value: 'ro',
  //   label: 'Română',
  //   icon: '/static/icons/flags/romania-svgrepo-com.svg'
  // },
  {
    value: 'sk',
    label: 'Slovenský',
    icon: '/static/icons/flags/slovakia-svgrepo-com.svg'
  },
  // {
  //   value: 'sl',
  //   label: 'Slovenščina',
  //   icon: '/static/icons/flags/slovenia-svgrepo-com.svg'
  // },
  // {
  //   value: 'es',
  //   label: 'Español',
  //   icon: '/static/icons/flags/spain-svgrepo-com.svg'
  // },
  {
    value: 'sv',
    label: 'Svenska',
    icon: '/static/icons/flags/sweden-svgrepo-com.svg'
  }
];

// ----------------------------------------------------------------------

const COMBINED_LANGS = [...LANGS, ...OTHER_LANGS];
const AVAILABLE_CODES = COMBINED_LANGS.map((el) => el.value);

export default function LanguagePopover() {
  let defaultLanguage =
    window && window.navigator ? window.navigator.userLanguage || window.navigator.language : 'en';
  if (!AVAILABLE_CODES.includes(defaultLanguage)) {
    defaultLanguage = 'en';
  }
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useLocalStorage('lang', defaultLanguage);
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

  const lang = COMBINED_LANGS.find((el) => el.value === selectedLang);

  const isSelectedMainLang = LANGS.findIndex((el) => el.value === lang.value) > -1;

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

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ maxHeight: '80vh', overflow: 'auto' }}
      >
        <Box sx={{ py: 1 }}>
          {COMBINED_LANGS.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === lang.value}
              onClick={() => handleChangeLang(option.value)}
              sx={{ py: 1, px: 2.5 }}
            >
              <ListItemIcon>
                <Box
                  component="img"
                  alt={option.label}
                  src={option.icon}
                  sx={{
                    width: 32,
                    height: 32
                  }}
                />
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
              width: option.value === lang.value ? 30 : 24,
              height: option.value === lang.value ? 30 : 24,
              borderWidth: '3px',
              borderStyle: option.value === lang.value ? 'solid' : 'none',
              borderColor: (theme) => theme.palette.primary.light
            }}
          >
            <Box component="img" alt={option.label} src={option.icon} />
          </IconButton>
        </Tooltip>
      ))}
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: !isSelectedMainLang ? 32 : 30,
          height: !isSelectedMainLang ? 32 : 30,
          borderWidth: '3px',
          borderStyle: !isSelectedMainLang ? 'solid' : 'none',
          borderColor: (theme) => theme.palette.primary.light,
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
          })
        }}
      >
        {isSelectedMainLang ? (
          <img src={'/static/icons/flags/worldwide-svgrepo-com.svg'} alt={lang.label} />
        ) : (
          <img src={lang.icon} alt={lang.label} />
        )}
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ maxHeight: '250px', overflow: 'auto' }}
      >
        <Box sx={{ py: 1 }}>
          {OTHER_LANGS.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === lang.value}
              onClick={() => handleChangeLang(option.value)}
              sx={{ py: 1, px: 2.5 }}
            >
              <ListItemIcon>
                <Box
                  component="img"
                  alt={option.label}
                  src={option.icon}
                  sx={{
                    width: 32,
                    height: 32
                  }}
                />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                {option.label}
              </ListItemText>
            </MenuItem>
          ))}
        </Box>
      </MenuPopover>
    </Fragment>
  );
}
