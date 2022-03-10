import PropTypes from 'prop-types';
// material
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

// ----------------------------------------------------------------------

FundPostsSort.propTypes = {
  options: PropTypes.array,
  onSort: PropTypes.func
};

export default function FundPostsSort({ options, onSort, order }) {
  return (
    <TextField select size="small" value={order} onChange={onSort}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
