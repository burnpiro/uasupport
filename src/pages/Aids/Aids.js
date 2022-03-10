import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
// material
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';
// components
import Page from '../../components/Page';
//
import i18next from './../../i18n';

import AidsMap from './AidsMap';
import FilterDialog from '../../sections/@dashboard/aids/Filter';
import AidsDetails from '../../sections/@dashboard/aids/AidsDetails';
import { addAid, getAids, removeAid, updateAid } from '../../utils/dbService/aids';
import { AidsListToolbar } from '../../sections/@dashboard/aids';
import AidsForm from '../../sections/@dashboard/aids/AidsForm';
import AidsDeleteForm from '../../sections/@dashboard/aids/AidsDeleteForm';
import { getFilterFromQuery, getSerializedQueryParam } from '../../utils/filters';
import AidsTitle from './AidsTitle';
import { hasLocationChanged, mapElToLocation } from '../../components/Map';
import useAuth from '../../components/context/AuthContext';
import { useSnackbar } from 'notistack';
import DataTable from '../../components/table/DataTable';
import Backdrop from "@mui/material/Backdrop";
import {getTypeIcon} from "../../utils/getTypeIcon";

// ----------------------------------------------------------------------

const TABLE_HEAD = () => [
  { id: 'name', label: i18next.t('AidName'), alignRight: false },
  {
    id: 'addressFrom',
    value: { field: 'addressFrom', type: 'string' },
    label: i18next.t('Address'),
    alignRight: false
  },
  // { id: 'isVerified', label: i18next.t('Verified'), alignRight: false },
  {
    id: 'aidType',
    value: [
      { field: 'aidType', type: 'label', variant: 'success' },
      { field: 'aidSubType', type: 'label', variant: 'info' }
    ],
    label: i18next.t('AidType'),
    alignRight: false
  },
  { id: '' }
];

// ----------------------------------------------------------------------

const ALLOWED_FILTER_KEYS = ['onlyVerified', 'aidType'];

function applyDataFilter(array, { aidType, onlyVerified }) {
  let result = array;
  if (onlyVerified != null && onlyVerified) {
    result = result.filter((el) => el.isVerified);
  }
  if (aidType != null && aidType !== '') {
    result = result.filter((el) => el.aidType === aidType);
  }

  return result;
}

const queryMatchFields = ['name', 'addressFrom', 'aidSubType'];

const avatarGenerator = {
  field: 'aidType',
  method: getTypeIcon
};

export default function Aids() {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialParams =
    searchParams.toString().length > 0
      ? getFilterFromQuery(searchParams.toString(), ALLOWED_FILTER_KEYS)
      : {};
  const initialQuery = searchParams.get('query') || '';

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
      const response = await getAids();

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

  const filteredUsers = applyDataFilter(transportList, filter);

  const displayedUsers = filteredUsers.filter((el) =>
    Array.isArray(selectedLocations) && selectedLocations.length > 0
      ? selectedLocations.includes(el.id)
      : true
  );

  const onSelectMarkers = (markers) => {
    if (markers.length === 1) {
      const selectedMarkerRef = filteredUsers.find((el) => el.id === markers[0].id);
      setDisplayDetails(selectedMarkerRef);
    } else {
      setSelectedLocations(markers.map((el) => el.id));
    }
  };

  const handleClearFilter = () => {
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

  const handleFormOpen = () => {
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditElement(null);
  };

  const onFormSubmitted = async (values) => {
    try {
      if (values.id != null && values.id.length > 0) {
        const newDoc = await updateAid(values);
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
        const newDoc = await addAid(values);
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

  const handleCloseDetails = () => {
    navigate(
      '/dashboard/aids' + (searchParams.toString().length > 0 ? `?${searchParams.toString()}` : '')
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
        const removedId = await removeAid(element);
        setTransportList(transportList.filter((el) => el.id !== removedId));
        const existingLocationIndex = locationList.findIndex((el) => el && el.id === removedId);
        delete locationList[existingLocationIndex];
      }
      handleDeleteFormClose();
    } catch (error) {
      enqueueSnackbar(t('Error'), { variant: 'error' });
      return false;
    }
  };

  return (
    <Page title={t('Centra Pomocy')}>
      <Container>
        <AidsTitle handleFormOpen={handleFormOpen} />

        <AidsMap
          fullList={locationList}
          places={filteredUsers}
          onSelectMarkers={onSelectMarkers}
          checkSum={filter.aidType}
        />

        <DataTable
          isLoading={isLoading}
          TableHead={TableHead}
          filteredData={displayedUsers}
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
          searchPlaceholder={'Szukaj pomocy'}
          avatarGenerator={avatarGenerator}
          ListToolbarItems={
            <AidsListToolbar
              filter={filter}
              onFilterChange={handleSelectFilter}
            />
          }
        />
      </Container>
      <FilterDialog
        open={filterOpen}
        onClose={handleFilterClose}
        selectFilter={handleSelectFilter}
        filter={filter}
      />
      <AidsDetails onClose={handleCloseDetails} open={showDetails.length > 0} aid={showDetails} />
      {formOpen && (
        <AidsForm
          open={formOpen}
          onClose={handleFormClose}
          onFormSubmitted={onFormSubmitted}
          editElement={editElement}
        />
      )}
      {deleteElement != null && (
        <AidsDeleteForm
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
