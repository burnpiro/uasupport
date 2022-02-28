import { Link as RouterLink } from 'react-router-dom';
// material
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../../sections/@dashboard/blog';
//
import POSTS from '../../_mocks_/blog';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { getHomes } from '../../utils/dbService/homes';
import { getFundraising } from '../../utils/dbService/fundrasings';
import {
  FundPostCard,
  FundPostsSearch,
  FundPostsSort
} from '../../sections/@dashboard/fundraising';
import { filter } from 'lodash';
import HomesDetails from '../Homes/HomesDetails';
import FundDetails from './FundDetails';

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Fundraising() {
  const { t, i18n } = useTranslation();
  const [reloadList, setReloadList] = useState(true);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [filterName, setFilterName] = useState('');
  const [selectedFund, setSelectedFund] = useState(null);
  const [fundList, setFundList] = useState([]);

  useEffect(() => {
    const dbCall = async () => {
      const response = await getFundraising();

      setReloadList(false);
      setFundList(response);
    };

    if (reloadList) {
      dbCall();
    }
  }, [reloadList]);

  const handleSelectFund = (fund) => {
    setSelectedFund(fund);
  };

  const handleSort = (e) => {
    setOrder(e.target.value);
  };

  const handleCloseDetails = () => {
    setSelectedFund(null);
  };

  const filteredData = applySortFilter(fundList, getComparator(order, orderBy), filterName);
  console.log(filteredData)
  const SORT_OPTIONS = [
    { value: 'desc', label: t('Latest') },
    { value: 'asc', label: t('Oldest') }
  ];
  return (
    <Page title={t('Fundraising')}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {t('Fundraising')}
          </Typography>
          {/*<Button*/}
          {/*  variant="contained"*/}
          {/*  component={RouterLink}*/}
          {/*  to="#"*/}
          {/*  startIcon={<Iconify icon="eva:plus-fill" />}*/}
          {/*>*/}
          {/*  New Post*/}
          {/*</Button>*/}
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <FundPostsSearch posts={filteredData} onSelect={handleSelectFund} />
          <FundPostsSort options={SORT_OPTIONS} onSort={handleSort} order={order} />
        </Stack>

        <Grid container spacing={3}>
          {filteredData.map((post, index) => (
            <FundPostCard key={post.id} post={post} index={index} onSelect={handleSelectFund} />
          ))}
        </Grid>
      </Container>
      <FundDetails onClose={handleCloseDetails} open={selectedFund != null} fund={selectedFund} />
    </Page>
  );
}
