import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
// material
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';
// components
import Page from '../../../components/Page';
import { TransportListToolbar } from '../../../sections/@dashboard/transport';
//
import i18next from './../../../i18n';

import isSameDay from 'date-fns/isSameDay';
import FilterDialog from '../../../sections/@dashboard/transport/Filter';
import TransportDetails from '../../../sections/@dashboard/transport/TransportDetails';
import {
  addTransport,
  getMyTransport,
  removeTransport,
  updateTransport
} from '../../../utils/dbService/transport';
import TransportForm from '../../../sections/@dashboard/transport/TransportForm';
import TransportDeleteForm from '../../../sections/@dashboard/transport/TransportDeleteForm';
import { getFilterFromQuery, getSerializedQueryParam } from '../../../utils/filters';
import useAuth from '../../../components/context/AuthContext';
import { useSnackbar } from 'notistack';
import DataTable from '../../../components/table/DataTable';
import Backdrop from '@mui/material/Backdrop';
import MyTransportTitle from './MyTransportTitle';

// ----------------------------------------------------------------------

const TABLE_HEAD = () => [
  { id: 'name', label: i18next.t('Name'), alignRight: false },
  {
    id: 'addressFrom',
    value: { field: 'addressFrom', type: 'string' },
    label: i18next.t('Address'),
    alignRight: false
  },
  {
    id: 'date',
    value: { field: 'date', type: 'date', variant: 'dateTillNow' },
    label: i18next.t('Date'),
    alignRight: false
  },
  {
    id: 'people',
    value: { field: 'people', type: 'number' },
    label: i18next.t('People'),
    alignRight: false
  },
  // { id: 'isVerified', label: i18next.t('Verified'), alignRight: false },
  {
    id: 'status',
    value: {
      field: 'status',
      type: 'label',
      variant: 'success',
      variantConditions: {
        dam: 'success',
        szukam: 'info'
      }
    },
    label: i18next.t('Status'),
    alignRight: false
  },
  { id: '' }
];

const queryMatchFields = ['name', 'addressFrom', 'description'];

const ALLOWED_FILTER_KEYS = ['from', 'to', 'onlyVerified', 'status', 'phone'];

function applyDataFilter(array, { from, to, date, onlyVerified, status, phone }) {
  let result = array;
  if (from != null && Number(from) > 0) {
    result = result.filter((el) => el.people >= Number(from));
  }
  if (to != null && Number(to) > 0) {
    result = result.filter((el) => el.people <= Number(to));
  }
  if (onlyVerified != null && onlyVerified) {
    result = result.filter((el) => el.isVerified);
  }
  if (date != null) {
    result = result.filter((el) => isSameDay(el.date, date));
  }
  if (status != null && status !== '') {
    result = result.filter((el) => el.status === status);
  }
  if (phone != null && phone !== '') {
    result = result.filter(
      (el) =>
        el.phone != null &&
        el.phone.toLowerCase().replace(/\s/g, '').includes(phone.toLowerCase().replace(/\s/g, ''))
    );
  }

  return result;
}

export default function MyTransport() {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialParams =
    searchParams.toString().length > 0
      ? getFilterFromQuery(searchParams.toString(), ALLOWED_FILTER_KEYS)
      : {};
  const initialQuery = searchParams.get('query') || '';

  const [formType, setFormType] = useState('dam');
  const [filterName, setFilterName] = useState(initialQuery);
  const [filterOpen, setFilterOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [reloadList, setReloadList] = useState(true);
  const [filter, setFilter] = useState(initialParams);
  const [showDetails, setShowDetails] = useState([]);
  const [transportList, setTransportList] = useState([]);
  const { t, i18n } = useTranslation();
  const [editElement, setEditElement] = useState(null);
  const [deleteElement, setDeleteElement] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const dbCall = async () => {
      setIsLoading(true);
      const response = await getMyTransport(user.uid);

      setReloadList(false);
      setTransportList(response);
      const initialItems = params['*'] === '' ? [] : params['*'].split('/');
      if (initialItems.length > 0) {
        setShowDetails(response.filter((el) => initialItems.includes(el.id)));
      }
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

  const handleFilterByName = (value) => {
    setFilterName(value);
  };

  const filteredData = applyDataFilter(transportList, filter);

  const handleClearFilter = () => {
    setFilter({});
  };

  const handleClearLocation = () => {};

  const handleFilterClick = () => {
    setFilterOpen(true);
  };

  const handleFilterClose = () => {
    setFilterOpen(false);
  };

  const handleFormOpen = (status) => {
    setFormOpen(true);
    setFormType(status);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditElement(null);
  };

  const onFormSubmitted = async (values) => {
    try {
      if (values.id != null && values.id.length > 0) {
        const newDoc = await updateTransport(values);
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
        const newDoc = await addTransport(values);
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
      console.error(error);
      enqueueSnackbar(t('Error'), { variant: 'error' });
      return false;
    }
  };

  const handleSelectFilter = (filter) => {
    setFilter(filter);
    handleFilterClose();
  };

  const handleCloseDetails = () => {
    navigate(
      '/dashboard/my/transport' +
        (searchParams.toString().length > 0 ? `?${searchParams.toString()}` : '')
    );
    setShowDetails([]);
  };

  const handleShowSelected = (selected) => {
    setDisplayDetails(transportList.filter((el) => selected.indexOf(el.id) !== -1));
  };

  const setDisplayDetails = (element) => {
    if (Array.isArray(element)) {
      setShowDetails(element);
    } else {
      navigate(
        element.id + (searchParams.toString().length > 0 ? `?${searchParams.toString()}` : '')
      );
      setShowDetails([element]);
    }
  };

  const handleEditElement = (element) => {
    setEditElement(element);
    setFormOpen(true);
  };

  const handleDeleteElement = (element) => {
    setDeleteElement(element);
  };

  const handleDeleteFormClose = () => {
    setDeleteElement(null);
  };

  const onDeleteFormSubmitted = async (element) => {
    try {
      if (element.id != null && element.id.length > 0) {
        const removedId = await removeTransport(element);
        setTransportList(transportList.filter((el) => el.id !== removedId));
        if (showDetails.length > 0 && showDetails.findIndex((el) => el.id === removedId) > -1 ) {
          setShowDetails(showDetails.filter((el) => el.id !== removedId));
        }
      }
      handleDeleteFormClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('Error'), { variant: 'error' });
      return false;
    }
  };

  return (
    <Page title={t('MyTransport')}>
      <Container>
        <MyTransportTitle handleFormOpen={handleFormOpen} />

        <DataTable
          isLoading={isLoading}
          TableHead={TableHead}
          filteredData={filteredData}
          onItemClick={setDisplayDetails}
          onItemEdit={handleEditElement}
          onItemDelete={handleDeleteElement}
          query={filterName}
          queryMatchFields={queryMatchFields}
          isLocationFiltered={false}
          isFiltered={Object.keys(filter).length > 0}
          onClearFilter={handleClearFilter}
          onClearLocation={handleClearLocation}
          onFilterClick={handleFilterClick}
          onFilterQueryChange={handleFilterByName}
          showAllSelected={handleShowSelected}
          searchPlaceholder={'Szukaj transport'}
          ListToolbarItems={
            <TransportListToolbar filter={filter} onFilterChange={handleSelectFilter} />
          }
          showAvatar={false}
        />
      </Container>
      <FilterDialog
        open={filterOpen}
        onClose={handleFilterClose}
        selectFilter={handleSelectFilter}
        filter={filter}
      />
      <TransportDetails
        onClose={handleCloseDetails}
        open={showDetails.length > 0}
        transport={showDetails}
        onClickEdit={handleEditElement}
        onClickDelete={handleDeleteElement}
        showAlert={false}
      />
      {formOpen && (
        <TransportForm
          open={formOpen}
          defaultStatus={formType}
          onClose={handleFormClose}
          onFormSubmitted={onFormSubmitted}
          editElement={editElement}
        />
      )}
      {deleteElement != null && (
        <TransportDeleteForm
          open={true}
          onClose={handleDeleteFormClose}
          onFormSubmitted={onDeleteFormSubmitted}
          deleteElement={deleteElement}
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
