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
//
import i18next from './../../../i18n';

import FilterDialog from '../../../sections/@dashboard/groups/Filter';
import { getMyGroups, addGroup, removeGroup, updateGroup } from '../../../utils/dbService/groups';
import { getFilterFromQuery, getSerializedQueryParam } from '../../../utils/filters';
import useAuth from '../../../components/context/AuthContext';
import { useSnackbar } from 'notistack';
import DataTable from '../../../components/table/DataTable';
import Backdrop from '@mui/material/Backdrop';
import MyGroupsTitle from './MyGroupsTitle';
import { getTypeIcon } from '../../../utils/getTypeIcon';
import { COMBINED_LANGS } from '../../../layouts/dashboard/LanguagePopover';
import GroupsDetails from '../../../sections/@dashboard/groups/GroupsDetails';
import GroupsListToolbar from '../../../sections/@dashboard/groups/GroupsListToolbar';
import GroupsForm from '../../../sections/@dashboard/groups/GroupsForm';
import GroupsDeleteForm from '../../../sections/@dashboard/groups/GroupsDeleteForm';

// ----------------------------------------------------------------------

const TABLE_HEAD = () => [
  { id: 'name', label: i18next.t('GroupName'), alignRight: false },

  // { id: 'isVerified', label: i18next.t('Verified'), alignRight: false },
  {
    id: 'groupType',
    value: [
      { field: 'groupType', type: 'label', variant: 'success' },
      { field: 'groupSubType', type: 'label', variant: 'info' }
    ],
    label: i18next.t('GroupType'),
    alignRight: false
  },
  {
    id: 'fb',
    value: { field: 'fb', type: 'link', icon: 'eva:facebook-fill' },
    label: i18next.t('FB'),
    alignRight: false
  },
  {
    id: 'website',
    value: { field: 'website', type: 'link', icon: 'eva:globe-outline' },
    label: i18next.t('Website'),
    alignRight: false
  },
  {
    id: 'lang',
    value: {
      field: 'lang',
      type: 'image',
      valueParser: (value) => {
        if (value != null && value != '') {
          return COMBINED_LANGS.find((el) => el.value === value).icon;
        }
        return '/static/icons/flags/worldwide-svgrepo-com.svg';
      }
    },
    label: i18next.t('Language'),
    alignRight: false
  },
  {
    id: 'hidden',
    value: {
      field: 'hidden',
      type: 'label',
      variant: 'success',
      variantConditions: {
        false: 'success',
        true: 'error'
      }
    },
    label: i18next.t('Is Hidden?'),
    alignRight: false
  },
  { id: '' }
];

// ----------------------------------------------------------------------

const ALLOWED_FILTER_KEYS = ['onlyVerified', 'groupType'];

function applyDataFilter(array, { groupType, onlyVerified }) {
  let result = array;
  if (onlyVerified != null && onlyVerified) {
    result = result.filter((el) => el.isVerified);
  }
  if (groupType != null && groupType !== '') {
    result = result.filter((el) => el.groupType === groupType);
  }

  return result;
}

const queryMatchFields = ['name', 'description', 'groupSubType'];

export default function MyGroups() {
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
      const response = await getMyGroups(user.uid);

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
        const newDoc = await updateGroup(values);
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
        const newDoc = await addGroup(values);
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

  const handleCloseDetails = () => {
    navigate(
      '/dashboard/my/groups' +
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
        const removedId = await removeGroup(element);
        setTransportList(transportList.filter((el) => el.id !== removedId));
        if (showDetails.length > 0 && showDetails.findIndex((el) => el.id === removedId) > -1) {
          setShowDetails(showDetails.filter((el) => el.id !== removedId));
        }
      }
      handleDeleteFormClose();
    } catch (error) {
      enqueueSnackbar(t('Error'), { variant: 'error' });
      return false;
    }
  };

  const handleToggleAvailability = async (element) => {
    try {
      await onFormSubmitted({
        ...element,
        hidden: !element.hidden
      });
      setShowDetails([]);
    } catch (error) {
      enqueueSnackbar(t('Error'), { variant: 'error' });
      return false;
    }
  };

  return (
    <Page title={t('MyGroups')}>
      <Container>
        <MyGroupsTitle handleFormOpen={handleFormOpen} />

        <DataTable
          isLoading={isLoading}
          TableHead={TableHead}
          filteredData={filteredData}
          onItemClick={setDisplayDetails}
          onItemEdit={handleEditElement}
          onItemDelete={handleDeleteElement}
          onClickToggle={handleToggleAvailability}
          query={filterName}
          queryMatchFields={queryMatchFields}
          isLocationFiltered={false}
          isFiltered={Object.keys(filter).length > 0}
          onClearFilter={handleClearFilter}
          onClearLocation={handleClearLocation}
          onFilterQueryChange={handleFilterByName}
          searchPlaceholder={'Szukaj'}
          selectable={false}
          ListToolbarItems={
            <GroupsListToolbar filter={filter}  />
          }
        />
      </Container>
      <FilterDialog
        open={filterOpen}
        onClose={handleFilterClose}
        selectFilter={handleSelectFilter}
        filter={filter}
      />
      <GroupsDetails
        onClose={handleCloseDetails}
        open={showDetails.length > 0}
        group={showDetails}
        showAlert={false}
        onClickEdit={handleEditElement}
        onClickDelete={handleDeleteElement}
      />
      {formOpen && (
        <GroupsForm
          open={formOpen}
          onClose={handleFormClose}
          onFormSubmitted={onFormSubmitted}
          editElement={editElement}
        />
      )}
      {deleteElement != null && (
        <GroupsDeleteForm
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
