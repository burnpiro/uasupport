import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
// material
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';
// components
import Page from '../../../components/Page';
//
import i18next from '../../../i18n';

import FilterDialog from '../../../sections/@dashboard/aids/Filter';
import { getFilterFromQuery, getSerializedQueryParam } from '../../../utils/filters';
import useAuth from '../../../components/context/AuthContext';
import { useSnackbar } from 'notistack';
import DataTable from '../../../components/table/DataTable';
import Backdrop from '@mui/material/Backdrop';
import { getTypeIcon } from '../../../utils/getTypeIcon';
import OrganizationsTitle from './OrganizationTitle';
import {
  addOrganization, getMyOrganizations,
  getOrganizations,
  updateOrganization
} from '../../../utils/dbService/organizations';
import OrganizationForm from '../../../sections/@dashboard/organization/OrganizationForm';
import OrganizationListToolbar from '../../../sections/@dashboard/organization/OrganizationListToolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = () => [
  { id: 'name', label: i18next.t('Organization Name'), alignRight: false },
  {
    id: 'addressFrom',
    value: { field: 'addressFrom', type: 'string' },
    label: i18next.t('Address'),
    alignRight: false
  },
  // { id: 'isVerified', label: i18next.t('Verified'), alignRight: false },
  {
    id: 'type',
    value: [
      {
        field: 'type',
        type: 'label',
        variant: 'success',
        variantConditions: {
          'foundation-type': 'success',
          'association-type': 'info',
          'non-profit-company-type': 'warning'
        }
      }
    ],
    label: i18next.t('Organization Type'),
    alignRight: false
  }
];

// ----------------------------------------------------------------------

const ALLOWED_FILTER_KEYS = ['type'];

function applyDataFilter(array, { type }) {
  let result = array;
  if (type != null && type !== '') {
    result = result.filter((el) => el.type === type);
  }

  return result;
}

const queryMatchFields = ['name', 'addressFrom', 'type'];

const avatarGenerator = {
  field: 'type',
  method: getTypeIcon
};

export default function Organizations() {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialParams =
    searchParams.toString().length > 0
      ? getFilterFromQuery(searchParams.toString(), ALLOWED_FILTER_KEYS)
      : {};
  const initialQuery = searchParams.get('query') || '';

  const [filterName, setFilterName] = useState(initialQuery);
  const [filterOpen, setFilterOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [reloadList, setReloadList] = useState(true);
  const [filter, setFilter] = useState(initialParams);
  const [transportList, setTransportList] = useState([]);
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAdmin, isManager } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const dbCall = async () => {
      setIsLoading(true);
      const response = await (isManager ? getMyOrganizations(user.uid) : getOrganizations(user));

      setReloadList(false);
      if (!Array.isArray(response)) {
        enqueueSnackbar(t(response.code), { variant: 'error' });
      }
      setTransportList(Array.isArray(response) ? response : []);
      setIsLoading(false);
    };

    if (reloadList && user != null) {
      dbCall();
    }
  }, [reloadList, user]);

  useEffect(() => {
    const serialized = getSerializedQueryParam(filter, ALLOWED_FILTER_KEYS, filterName);
    setSearchParams(serialized);
  }, [filter, filterName]);

  const TableHead = TABLE_HEAD();

  const filteredData = applyDataFilter(transportList, filter);

  const handleClearFilter = () => {
    setFilter({});
  };

  const handleFilterClick = () => {
    setFilterOpen(true);
  };

  const handleFilterClose = () => {
    setFilterOpen(false);
  };

  const handleFormOpen = () => {
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

  const onFormSubmitted = async (values) => {
    try {
      if (values.id != null && values.id.length > 0) {
        const newDoc = await updateOrganization(values);
        setTransportList(transportList.map((el) => (el.id === newDoc.id ? newDoc : el)));
        navigate(
          values.id + (searchParams.toString().length > 0 ? `?${searchParams.toString()}` : '')
        );
        setDisplayDetails(newDoc);
      } else {
        values.createdAt = new Date();
        values.roles = {
          [user.uid]: 'owner'
        };
        const newDoc = await addOrganization(values);
        if (newDoc.id) {
          navigate(
            newDoc.id + (searchParams.toString().length > 0 ? `?${searchParams.toString()}` : '')
          );
          setTransportList([...transportList, newDoc]);
          setDisplayDetails(newDoc);
        }
      }
      handleFormClose();
    } catch (error) {
      enqueueSnackbar(t('Error'), { variant: 'error' });
      return false;
    }
  };

  const handleSelectFilter = (filter) => {
    setFilter(filter);
    handleFilterClose();
  };

  const handleFilterByName = (value) => {
    setFilterName(value);
  };

  const handleShowSelected = (selected) => {
    setDisplayDetails(transportList.filter((el) => selected.indexOf(el.id) !== -1));
  };

  const setDisplayDetails = (element) => {
    navigate(
      element.id + (searchParams.toString().length > 0 ? `?${searchParams.toString()}` : '')
    );
  };

  return (
    <Page title={t('MyAid')}>
      <Container>
        <OrganizationsTitle handleFormOpen={isAdmin && handleFormOpen} />

        <DataTable
          isLoading={isLoading}
          TableHead={TableHead}
          filteredData={filteredData}
          onItemClick={setDisplayDetails}
          query={filterName}
          queryMatchFields={queryMatchFields}
          isLocationFiltered={false}
          isFiltered={Object.keys(filter).length > 0}
          onClearFilter={handleClearFilter}
          onClearLocation={undefined}
          onFilterQueryChange={handleFilterByName}
          showAllSelected={handleShowSelected}
          searchPlaceholder={'Organization search'}
          avatarGenerator={avatarGenerator}
          selectable={false}
          showMenu={false}
          ListToolbarItems={
            <OrganizationListToolbar filter={filter} onFilterChange={handleSelectFilter} />
          }
        />
      </Container>
      {formOpen && (
        <OrganizationForm
          open={formOpen}
          onClose={handleFormClose}
          onFormSubmitted={onFormSubmitted}
        />
      )}
      {isLoading && (
        <Backdrop
          sx={{
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            zIndex: (theme) => theme.zIndex.drawer + 1
          }}
          open={true}
        >
          <Typography variant={'h3'} color={'inherit'}>
            {t('Loading data, please wait...')}
          </Typography>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </Page>
  );
}
