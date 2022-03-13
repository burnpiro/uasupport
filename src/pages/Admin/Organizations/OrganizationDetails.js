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
  addOrganization,
  getOrganization,
  getOrganizations,
  updateOrganization
} from '../../../utils/dbService/organizations';
import OrganizationForm from '../../../sections/@dashboard/organization/OrganizationForm';
import OrganizationListToolbar from '../../../sections/@dashboard/organization/OrganizationListToolbar';
import { getVolunteersFromOrg, updateVolunteer } from '../../../utils/dbService/volunteers';
import OrganizationDetailsTitle from './OrganizationDetailsTitle';
import MemberForm from '../../../sections/@dashboard/organization/MemberForm';
import { getManagersFromOrg, updateManager } from '../../../utils/dbService/managers';
import { addVolunteer, removeVolunteer } from '../../../utils/apiService/volunteersService';
import { addManager, removeManager } from '../../../utils/apiService/managersService';
import OrganizationMemberToolbar from '../../../sections/@dashboard/organization/OrganizationMemberToolbar';
import TransportDeleteForm from '../../../sections/@dashboard/transport/TransportDeleteForm';
import MemberDeleteForm from '../../../sections/@dashboard/organization/MemberDeleteForm';
import { removeTransport } from '../../../utils/dbService/transport';

// ----------------------------------------------------------------------

const TABLE_HEAD = () => [
  { id: 'name', label: i18next.t('Name'), alignRight: false },
  {
    id: 'email',
    value: { field: 'email', type: 'string', mask: true },
    label: i18next.t('Email'),
    alignRight: false
  },
  {
    id: 'phone',
    value: { field: 'phone', type: 'string', mask: true },
    label: i18next.t('Phone'),
    alignRight: false
  },
  {
    id: 'fb',
    value: { field: 'fb', type: 'link', icon: 'eva:facebook-fill' },
    label: i18next.t('FB'),
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
          volunteer: 'success',
          manager: 'info',
          admin: 'warning'
        }
      }
    ],
    label: i18next.t('Role'),
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

const queryMatchFields = ['name', 'type', 'email'];

const avatarGenerator = {
  field: 'type',
  method: getTypeIcon
};

export default function OrganizationDetails() {
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
  const [organizationFormOpen, setOrganizationFormOpen] = useState(false);
  const [memberFormOpen, setMemberFormOpen] = useState(false);
  const [reloadList, setReloadList] = useState(true);
  const [filter, setFilter] = useState(initialParams);
  const [showDetails, setShowDetails] = useState([]);
  const [deleteElement, setDeleteElement] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [editMemberElement, setEditMemberElement] = useState(null);
  const [editOrganizationElement, setOrganizationEditElement] = useState(null);
  const [list, setList] = useState([]);
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAdmin, isManager, isVolunteer } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const selectedOrganizationUID = params['organizationId'];

  useEffect(() => {
    const dbCall = async () => {
      setIsLoading(true);
      const org = await getOrganization(selectedOrganizationUID);

      setReloadList(false);
      if (org == null || org.id == null) {
        enqueueSnackbar(t(response ? response.code : 'Error'), { variant: 'error' });
      }
      setOrganization(org);
      if (org.id) {
        let newList = [];
        const volunteers = await getVolunteersFromOrg(org.id);
        if (!Array.isArray(volunteers)) {
          enqueueSnackbar(t(volunteers.code), { variant: 'error' });
        } else {
          newList = [...newList, ...volunteers];
        }
        const managers = await getManagersFromOrg(org.id);
        if (!Array.isArray(managers)) {
          enqueueSnackbar(t(managers.code), { variant: 'error' });
        } else {
          newList = [...newList, ...managers];
        }
        setList(Array.isArray(newList) ? newList : []);
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

  const filteredData = applyDataFilter(list, filter);

  const handleClearFilter = () => {
    setFilter({});
  };

  const handleFilterClick = () => {
    setFilterOpen(true);
  };

  const handleFilterClose = () => {
    setFilterOpen(false);
  };

  const handleOrganizationFormOpen = () => {
    setOrganizationFormOpen(true);
    setOrganizationEditElement(organization);
  };

  const handleOrganizationFormClose = () => {
    setOrganizationFormOpen(false);
  };

  const handleMemberFormOpen = (type) => {
    setMemberFormOpen(type);
  };

  const handleMemberFormClose = () => {
    setMemberFormOpen(false);
  };

  const handleEditMemberFormOpen = (member) => {
    if (member == null) {
      const currMember = list.find(el => el.email === user.email);
      console.log(currMember);
      setMemberFormOpen(currMember.type);
      setEditMemberElement(currMember);
    } else {
      setMemberFormOpen(member.type);
      setEditMemberElement(member);
    }
  };

  const onOrganizationFormSubmitted = async (values) => {
    try {
      if (values.id != null && values.id.length > 0) {
        const newDoc = await updateOrganization(values);
        setOrganization(newDoc);
      }
      handleOrganizationFormClose();
    } catch (error) {
      enqueueSnackbar((error && t(error.code)) || t('Error'), { variant: 'error' });
      return false;
    }
  };

  const onMemberFormSubmitted = async (values) => {
    try {
      if (values.id != null && values.id.length > 0) {
        const updateMethod =
          values.type === 'volunteer'
            ? updateVolunteer
            : values.type === 'manager'
            ? updateManager
            : null;
        if (updateMethod != null) {
          const newDoc = await updateMethod(values);
          setOrganization(newDoc);
        } else {
          enqueueSnackbar(t('Error'), { variant: 'error' });
        }
      } else {
        const addMethod =
          values.type === 'volunteer'
            ? addVolunteer
            : values.type === 'manager'
            ? addManager
            : null;
        if (addMethod != null) {
          const newDoc = await addMethod(organization.id, values);
        } else {
          enqueueSnackbar(t('Error'), { variant: 'error' });
        }
      }
      setReloadList(true);
      handleMemberFormClose();
    } catch (error) {
      enqueueSnackbar((error && t(error.code)) || t('Error'), { variant: 'error' });
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
    setDisplayDetails(list.filter((el) => selected.indexOf(el.id) !== -1));
  };

  const setDisplayDetails = (element) => {
    navigate(
      element.id + (searchParams.toString().length > 0 ? `?${searchParams.toString()}` : '')
    );
    setShowDetails([element]);
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
        const removeMethod =
          element.type === 'volunteer'
            ? removeVolunteer
            : element.type === 'manager'
            ? removeManager
            : null;
        if (removeMethod != null) {
          const newDoc = await removeMethod(organization.id, deleteElement);
        } else {
          enqueueSnackbar(t('Error'), { variant: 'error' });
        }
        setReloadList(true);
      }
      handleDeleteFormClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t('Error'), { variant: 'error' });
      return false;
    }
  };

  return (
    <Page title={`${t(organization && organization.name)} | ${t('Organization')}`}>
      <Container>
        {organization && (
          <OrganizationDetailsTitle
            onEdit={isAdmin || isManager ? handleOrganizationFormOpen : undefined}
            handleAddVolunteer={isAdmin || isManager ? handleMemberFormOpen : undefined}
            handleEditCurrentMember={isManager || isVolunteer ? handleEditMemberFormOpen : undefined}
            handleAddManager={isAdmin ? handleMemberFormOpen : undefined}
            name={organization.name}
          />
        )}

        <DataTable
          isLoading={isLoading}
          TableHead={TableHead}
          filteredData={filteredData}
          onItemDelete={handleDeleteElement}
          query={filterName}
          queryMatchFields={queryMatchFields}
          isLocationFiltered={false}
          isFiltered={Object.keys(filter).length > 0}
          onClearFilter={handleClearFilter}
          onClearLocation={undefined}
          onFilterQueryChange={handleFilterByName}
          showAllSelected={handleShowSelected}
          searchPlaceholder={'Search'}
          selectable={false}
          ListToolbarItems={
            <OrganizationMemberToolbar filter={filter} onFilterChange={handleSelectFilter} />
          }
        />
      </Container>
      {organizationFormOpen && (
        <OrganizationForm
          open={organizationFormOpen}
          onClose={handleOrganizationFormClose}
          onFormSubmitted={onOrganizationFormSubmitted}
          editElement={editOrganizationElement}
        />
      )}
      {memberFormOpen && (
        <MemberForm
          open={memberFormOpen != null && memberFormOpen !== false}
          formType={memberFormOpen}
          onClose={handleMemberFormClose}
          onFormSubmitted={onMemberFormSubmitted}
          editElement={editMemberElement}
        />
      )}
      {deleteElement != null && (
        <MemberDeleteForm
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
