import PropTypes from 'prop-types';
// material
import { Paper, Typography } from '@mui/material';
import {useTranslation} from "react-i18next";

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string
};

export default function SearchNotFound({ searchQuery = '', ...other }) {
  const { t, i18n } = useTranslation();
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        {t('Not found')}
      </Typography>
      <Typography variant="body2" align="center">
        {t('No results found for your query, please consider to change it in order to see more.')}
      </Typography>
    </Paper>
  );
}
