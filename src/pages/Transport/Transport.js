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
  Tooltip
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

// ----------------------------------------------------------------------

const TABLE_HEAD = () => [
  { id: 'name', label: i18next.t('Name'), alignRight: false },
  { id: 'addressFrom', label: i18next.t('Address'), alignRight: false },
  { id: 'date', label: i18next.t('Date'), alignRight: false },
  { id: 'people', label: i18next.t('People'), alignRight: false },
  // { id: 'isVerified', label: i18next.t('Verified'), alignRight: false },
  { id: 'status', label: i18next.t('Status'), alignRight: false },
  { id: '' }
];

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
        (_user.description || '').toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

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

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [formType, setFormType] = useState('dam');
  const [filterName, setFilterName] = useState(initialQuery);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [reloadList, setReloadList] = useState(true);
  const [filter, setFilter] = useState(initialParams);
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
      const response = await getTransport();

      setReloadList(false);
      setTransportList(response);
      const initialItems = params['*'] === '' ? [] : params['*'].split('/');
      if (initialItems.length > 0) {
        setShowDetails(response.filter((el) => initialItems.includes(el.id)));
      }
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

  const handleFilterByName = (value) => {
    setFilterName(value);
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

  const handleFormOpen = (status) => {
    setFormOpen(true);
    setFormType(status);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditElement(null);
  };

  const onFormSubmitted = async (values) => {
    if (values.id != null && values.id.length > 0) {
      const newDoc = await updateTransport(values);
      setTransportList(transportList.map((el) => (el.id === newDoc.id ? newDoc : el)));
      navigate(
        values.id + (searchParams.toString().length > 0 ? `?${searchParams.toString()}` : '')
      );
      setDisplayDetails(newDoc);
    } else {
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
    if (element.id != null && element.id.length > 0) {
      const removedId = await removeTransport(element);
      setTransportList(transportList.filter((el) => el.id !== removedId));
    }
    handleDeleteFormClose();
  };

  return (
    <Page title={t('Transport')}>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {t('Transport')}
          </Typography>
          <Box>
            <Button
              variant="contained"
              color={'warning'}
              sx={{ backgroundColor: red[300], mr: 1 }}
              onClick={() => handleFormOpen('szukam')}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              {t('GetTransport')}
            </Button>
            <Button
              variant="contained"
              onClick={() => handleFormOpen('dam')}
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              {t('AddTransport')}
            </Button>
          </Box>
        </Stack>

        <TransportMap places={filteredUsers} onSelectMarkers={onSelectMarkers} />

        <Card>
          <TransportListToolbar
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
                <TransportListHead
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
                      const {
                        id,
                        name,
                        addressFrom,
                        date,
                        car,
                        people,
                        status,
                        avatarUrl,
                        isVerified
                      } = row;
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
                              <Avatar alt={name} src={avatarUrl} />
                              <Typography variant="subtitle2" noWrap>
                                {name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left" onClick={() => setDisplayDetails(row)}>
                            {addressFrom}
                          </TableCell>
                          <TableCell align="left" onClick={() => setDisplayDetails(row)}>
                            <Tooltip title={fDateTime(date)}>
                              <Typography>{fToNow(date)}</Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell align="left">
                            <Tooltip title={car}>
                              <Typography>{people}</Typography>
                            </Tooltip>
                          </TableCell>
                          {/*<TableCell align="left">{isVerified ? t('Tak') : t('Nie')}</TableCell>*/}
                          <TableCell align="left">
                            <Label
                              variant="ghost"
                              color={(status === 'szukam' && 'info') || 'success'}
                            >
                              <span style={{ display: 'block', lineHeight: 'initial' }}>
                                {t(status)}
                              </span>
                            </Label>
                          </TableCell>

                          <TableCell align="right">
                            <TransportMoreMenu
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
    </Page>
  );
}
