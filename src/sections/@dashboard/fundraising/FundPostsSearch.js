import PropTypes from 'prop-types';
// material
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
// component
import Iconify from '../../../components/Iconify';
import {useTranslation} from "react-i18next";

// ----------------------------------------------------------------------

const RootStyle = styled(Box)(({ theme }) => ({
  '& .MuiAutocomplete-root': {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.shorter
    }),
    '&.Mui-focused': {
      '& .MuiAutocomplete-inputRoot': {
        boxShadow: theme.customShadows.z12
      }
    }
  },
  '& .MuiAutocomplete-inputRoot': {
    '& fieldset': {
      borderWidth: `1px !important`,
      borderColor: `${theme.palette.grey[500_32]} !important`
    }
  },
  '& .MuiAutocomplete-option': {
    '&:not(:last-child)': {
      borderBottom: `solid 1px ${theme.palette.divider}`
    }
  }
}));

// ----------------------------------------------------------------------

FundPostsSearch.propTypes = {
  posts: PropTypes.array.isRequired
};

export default function FundPostsSearch({ posts, onSelect }) {
  const { t, i18n } = useTranslation();

  const handleChangeVal = (e, newVal) => {
    if(onSelect) {
      onSelect(newVal)
    }
  }
  return (
    <RootStyle sx={{flexGrow: 1}}>
      <Autocomplete
        size="small"
        disablePortal
        popupIcon={null}
        options={posts}
        onChange={handleChangeVal}
        getOptionLabel={(post) => post.title}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={t('Search for fundraising')}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <Iconify
                      icon="eva:search-fill"
                      sx={{
                        ml: 1,
                        width: 20,
                        height: 20,
                        color: 'text.disabled'
                      }}
                    />
                  </InputAdornment>
                  {params.InputProps.startAdornment}
                </>
              )
            }}
          />
        )}
      />
    </RootStyle>
  );
}
