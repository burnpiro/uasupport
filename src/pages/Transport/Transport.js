import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
// material
import {
  Card,
  Box,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import Iconify from '../../components/Iconify';
import SearchNotFound from '../../components/SearchNotFound';
import {
  TransportMoreMenu,
  TransportListToolbar,
  TransportListHead
} from '../../sections/@dashboard/transport';
//
import i18next from './../../i18n';

import { fDateTime, fToNow } from '../../utils/formatTime';
import isSameDay from 'date-fns/isSameDay';
import TransportMap from './TransportMap';
import FilterDialog from './Filter';
import TransportDetails from './TransportDetails';
import {
  addTransport,
  getTransport,
  removeTransport,
  updateTransport
} from '../../utils/dbService/transport';
import TransportForm from '../../sections/@dashboard/transport/TransportForm';
import { red } from '@mui/material/colors';
import TransportDeleteForm from '../../sections/@dashboard/transport/TransportDeleteForm';
import { getFilterFromQuery, getSerializedQueryParam } from '../../utils/filters';
import TransportTitle from '../../sections/@dashboard/transport/TransportTitle';
import { hasLocationChanged, mapElToLocation } from '../../components/Map';
import useAuth from '../../components/context/AuthContext';
import { useSnackbar } from 'notistack';
import DataTable from '../../components/table/DataTable';
import { AidsListToolbar } from '../../sections/@dashboard/aids';
import Backdrop from "@mui/material/Backdrop";

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

export default function Transport() {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialParams =
    searchParams.toString().length > 0
      ? getFilterFromQuery(searchParams.toString(), ALLOWED_FILTER_KEYS)
      : {};
  const initialQuery = searchParams.get('query') || '';

  const [selected, setSelected] = useState([]);
  const [formType, setFormType] = useState('dam');
  const [filterName, setFilterName] = useState(initialQuery);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [reloadList, setReloadList] = useState(true);
  const [filter, setFilter] = useState(initialParams);
  const [showDetails, setShowDetails] = useState([]);
  const [transportList, setTransportList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const { t, i18n } = useTranslation();
  const [editElement, setEditElement] = useState(null);
  const [deleteElement, setDeleteElement] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const dbCall = async () => {
      setIsLoading(true);
      const response = await getTransport();

      setReloadList(false);
      setTransportList(response);
      const initialItems = params['*'] === '' ? [] : params['*'].split('/');
      if (initialItems.length > 0) {
        setShowDetails(response.filter((el) => initialItems.includes(el.id)));
      }
      setLocationList(response.map(mapElToLocation));
      setIsLoading(false);
    };

    if (reloadList) {
      dbCall();
    }
  }, [reloadList]);

  useEffect(() => {
    const serialized = getSerializedQueryParam(filter, ALLOWED_FILTER_KEYS, filterName);
    setSearchParams(serialized);
  }, [filter, filterName]);

  const TableHead = TABLE_HEAD();

  const handleFilterByName = (value) => {
    setFilterName(value);
  };

  const filteredUsers = applyDataFilter(transportList, filter);

  const displayedUsers = filteredUsers.filter((el) =>
    Array.isArray(selectedLocations) && selectedLocations.length > 0
      ? selectedLocations.includes(el.id)
      : true
  );

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = displayedUsers.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const onSelectMarkers = (markers) => {
    if (markers.length === 1) {
      const selectedMarkerRef = filteredUsers.find((el) => el.id === markers[0].id);
      setDisplayDetails(selectedMarkerRef);
    } else {
      setSelectedLocations(markers.map((el) => el.id));
    }
  };

  const handleClearFilter = () => {
    setSelected([]);
    setFilter({});
  };

  const handleClearLocation = () => {
    setSelectedLocations([]);
  };

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
        const prevElement = transportList.find((el) => el.id === values.id);
        if (hasLocationChanged(prevElement.from, newDoc.from)) {
          locationList.forEach((el) => {
            if (el.id === values.id) {
              el.lat = Number(newDoc.from[0]);
              el.lng = Number(newDoc.from[1]);
            }
          });
        }
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
          locationList.push(mapElToLocation(newDoc));
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
      '/dashboard/transport' +
        (searchParams.toString().length > 0 ? `?${searchParams.toString()}` : '')
    );
    setShowDetails([]);
  };

  const handleShowSelected = () => {
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
        const existingLocationIndex = locationList.findIndex((el) => el && el.id === removedId);
        delete locationList[existingLocationIndex];
      }
      handleDeleteFormClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('Error'), { variant: 'error' });
      return false;
    }
  };

  return (
    <Page title={t('Transport')}>
      <Container>
        <TransportTitle handleFormOpen={handleFormOpen} />

        <TransportMap
          fullList={locationList}
          places={filteredUsers}
          onSelectMarkers={onSelectMarkers}
        />

        <DataTable
          isLoading={isLoading}
          TableHead={TableHead}
          filteredData={displayedUsers}
          handleSelectAllClick={handleSelectAllClick}
          onItemClick={setDisplayDetails}
          onItemEdit={handleEditElement}
          onItemDelete={handleDeleteElement}
          query={filterName}
          queryMatchFields={queryMatchFields}
          isLocationFiltered={selectedLocations.length > 0}
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
            {t('Loading map data, please wait...')}
          </Typography>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </Page>
  );
}
