import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { forwardRef } from 'react';
// material
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

const Page = forwardRef(({ children, title = '', ...other }, ref) => (
  <Box ref={ref} {...other}>
    <Helmet>
      <title>{title} | Pomoc dla Ukrainy 🇺🇦 Допомога Україні</title>
      <meta property="og:title" content={title + " | Pomoc dla Ukrainy 🇺🇦 Допомога Україні"} />
      <meta property="og:title" content={title + " | Pomoc dla Ukrainy 🇺🇦 Допомога Україні"} />
    </Helmet>
    {children}
  </Box>
));

Page.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string
};

export default Page;
