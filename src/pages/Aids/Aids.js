import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
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
  Tooltip
} from '@mui/material';
import { useTranslation } from 'react-i18next';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import Iconify from '../../components/Iconify';
import SearchNotFound from '../../components/SearchNotFound';
//
import i18next from './../../i18n';

import USERLIST from '../../_mocks_/transport';
import { fDateTime, fToNow } from '../../utils/formatTime';
import isSameDay from 'date-fns/isSameDay';
import AidsMap from './AidsMap';
import FilterDialog from './Filter';
import AidsDetails from './AidsDetails';
import { addAid, getAids, removeAid, updateAid } from '../../utils/dbService/aids';
import { AidsListHead, AidsListToolbar, AidsMoreMenu } from '../../sections/@dashboard/aids';
import AidsForm from '../../sections/@dashboard/aids/AidsForm';
import AidsDeleteForm from '../../sections/@dashboard/aids/AidsDeleteForm';

// ----------------------------------------------------------------------

const TABLE_HEAD = () => [
  { id: 'name', label: i18next.t('AidName'), alignRight: false },
  { id: 'addressFrom', label: i18next.t('Address'), alignRight: false },
  // { id: 'isVerified', label: i18next.t('Verified'), alignRight: false },
  { id: 'aidType', label: i18next.t('AidType'), alignRight: false },
  { id: '' }
];

export const getTypeIcon = (type) => {
  switch (type) {
    case 'health-aid':
      return '/static/icons/aid-marker.png';
    case 'animal-aid':
      return '/static/icons/animal-marker.png';
    case 'law-aid':
      return '/static/icons/law-marker.png';
    case 'blood-aid':
      return '/static/icons/blood-marker.png';
    case 'medical-aid':
      return '/static/icons/medical-marker.png';
    case 'psych-aid':
      return '/static/icons/psych-marker.png';
    case 'translate-aid':
      return '/static/icons/translate-marker.png';
    case 'food-aid':
      return '/static/icons/warmfood-marker.png';
    default:
      return '/static/icons/standard-marker.png';
  }
};

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
    return filter(
      array,
      (_user) =>
        _user.addressFrom.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        (_user.aidSubType || '').toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

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

export default function Aids() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [reloadList, setReloadList] = useState(true);
  const [filter, setFilter] = useState({});
  const [showDetails, setShowDetails] = useState([]);
  const [transportList, setTransportList] = useState([]);
  const { t, i18n } = useTranslation();
  const [editElement, setEditElement] = useState(null);
  const [deleteElement, setDeleteElement] = useState(null);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  useEffect(() => {
    const dbCall = async () => {
      const response = await getAids();

      setReloadList(false);
      setTransportList(response);
    };

    if (reloadList) {
      dbCall();
    }
  }, [reloadList]);

  const TableHead = TABLE_HEAD();

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - transportList.length) : 0;

  const filteredUsers = applyDataFilter(
    applySortFilter(transportList, getComparator(order, orderBy), filterName),
    filter
  );

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

  const isUserNotFound = filteredUsers.length === 0;

  const onSelectMarkers = (markers) => {
    setSelectedLocations(markers.map((el) => el.id));
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

  const handleFormOpen = () => {
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditElement(null);
  };

  const onFormSubmitted = async (values) => {
    if (values.id != null && values.id.length > 0) {
      await updateAid(values);
    } else {
      await addAid(values);
    }
    handleFormClose();
    setReloadList(true);
  };

  const handleSelectFilter = (filter) => {
    setFilter(filter);
    handleFilterClose();
  };

  const handleCloseDetails = () => {
    setShowDetails([]);
  };

  const handleShowSelected = () => {
    setDisplayDetails(transportList.filter((el) => selected.indexOf(el.id) !== -1));
  };

  const setDisplayDetails = (element) => {
    if (Array.isArray(element)) {
      setShowDetails(element);
    } else {
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
    if (element.id != null && element.id.length > 0) {
      await removeAid(element);
    }
    handleDeleteFormClose();
    setReloadList(true);
  };

  return (
    <Page title={t('Centra Pomocy')}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {t('Aids')}
          </Typography>
          <Button
            variant="contained"
            onClick={handleFormOpen}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            {t('AddAid')}
          </Button>
        </Stack>

        <AidsMap places={filteredUsers} onSelectMarkers={onSelectMarkers} />

        <Card>
          <AidsListToolbar
            numSelected={selected.length}
            isLocationFiltered={selectedLocations.length > 0}
            isFiltered={Object.keys(filter).length > 0}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onClearFilter={handleClearFilter}
            onClearLocation={handleClearLocation}
            onFilterClick={handleFilterClick}
            showAllSelected={handleShowSelected}
            filter={filter}
            onFilterChange={handleSelectFilter}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <AidsListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TableHead}
                  rowCount={displayedUsers.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {displayedUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { id, name, addressFrom, aidType, aidSubType } = row;
                      const isItemSelected = selected.indexOf(id) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, id)}
                            />
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            padding="none"
                            onClick={() => setDisplayDetails(row)}
                          >
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={name} src={getTypeIcon(aidType)} />
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left" onClick={() => setDisplayDetails(row)}>
                            {addressFrom}
                          </TableCell>
                          {/*<TableCell align="left" onClick={() => setDisplayDetails(row)}>*/}
                          {/*  {isVerified ? t('Tak') : t('Nie')}*/}
                          {/*</TableCell>*/}
                          <TableCell align="left" style={{ maxWidth: '140px' }}>
                            <Label variant="ghost" color={'success'}>
                              <span style={{ display: 'block', lineHeight: 'initial' }}>
                                {t(aidType)}
                              </span>
                            </Label>
                            {aidSubType && (
                              <Label variant="ghost" color={'info'}>
                                <span style={{ display: 'block', lineHeight: 'initial' }}>
                                  {aidSubType}
                                </span>
                              </Label>
                            )}
                          </TableCell>

                          <TableCell align="right">
                            <AidsMoreMenu
                              onClickShow={() => setDisplayDetails(row)}
                              onClickEdit={() => handleEditElement(row)}
                              onClickDelete={() => handleDeleteElement(row)}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={displayedUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
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
    </Page>
  );
}
