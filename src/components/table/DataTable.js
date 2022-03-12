import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Tooltip from '@mui/material/Tooltip';
import Label from '../Label';
import SearchNotFound from '../SearchNotFound';
import { useEffect, useState } from 'react';
import ListHead from './ListHead';
import MoreMenu from './MoreMenu';
import useAuth from '../context/AuthContext';
import Scrollbar from '../Scrollbar';
import { useTranslation } from 'react-i18next';
import ListToolbar from './ListToolbar';
import { filter } from 'lodash';
import { fToNow, fDateTime, fDate } from '../../utils/formatTime';
import { isAfter } from 'date-fns';

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

function applySortFilter(array, comparator, query, fieldsToQuery = []) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (typeof query === 'string' && query.length > 2) {
    return array.filter((_user) =>
      fieldsToQuery.some((fieldName) => {
        return (
          _user[fieldName] != null &&
          (String(_user[fieldName]) || '').toLowerCase().indexOf(query.toLowerCase()) !== -1
        );
      })
    );
  }
  return stabilizedThis.map((el) => el[0]);
}

function CellValue({ row, value: { type, field, variant, variantConditions } }) {
  const { t, i18n } = useTranslation();
  switch (type) {
    case 'label':
      return row[field] != null && row[field] !== '' ? (
        <Label
          variant="ghost"
          color={variantConditions ? variantConditions[row[field]] : variant || 'success'}
        >
          <span style={{ display: 'block', lineHeight: 'initial' }}>{t(row[field])}</span>
        </Label>
      ) : null;
    case 'number':
      return Number(row[field]);
    case 'date':
      let dateString = fDate(row[field]);
      switch (variant) {
        case 'dateTillNow':
          const nowDate = new Date();
          dateString = isAfter(nowDate, row[field]) ? t('Dostępne') : fToNow(row[field]);
          break;
      }
      return (
        <Tooltip title={fDateTime(row[field])}>
          <Typography>{dateString}</Typography>
        </Tooltip>
      );
    case 'boolean':
      return (
        <Label variant="ghost" color={row[field] ? 'success' : 'error'}>
          <span style={{ display: 'block', lineHeight: 'initial' }}>
            {row[field] ? t('Tak') : t('Nie')}
          </span>
        </Label>
      );
    default:
      return t(String(row[field]));
  }
}

function CellData({ headObj: { value }, row }) {
  return Array.isArray(value) ? (
    value.map((el) => <CellValue key={el.field} row={row} value={el} />)
  ) : (
    <CellValue key={value.field} row={row} value={value} />
  );
}

export default function DataTable({
  isLoading,
  TableHead,
  filteredData,
  onItemClick,
  onItemEdit,
  onItemDelete,
  query,
  isLocationFiltered,
  isFiltered,
  onClearFilter,
  onClearLocation,
  onFilterClick,
  onFilterQueryChange,
  showAllSelected,
  ListToolbarItems,
  searchPlaceholder,
  avatarGenerator,
  queryMatchFields = ['name', 'addressFrom'],
  showAvatar = true,
  selectable = true,
  showMenu = true
}) {
  const { t, i18n } = useTranslation();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const allIds = filteredData.map((n) => n.id);
    setSelected(selected.filter((el) => allIds.includes(el)));
  }, [filteredData]);

  useEffect(() => {
    setPage(0);
  }, [filteredData, query]);

  const displayedData = applySortFilter(
    filteredData,
    getComparator(order, orderBy),
    query,
    queryMatchFields
  );

  const handleRequestSort = (event, property) => {
    if (property === orderBy && order === 'desc') {
      setOrder('asc');
      setOrderBy(null);
    }
    if (property === orderBy && order !== 'desc') {
      const isAsc = order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    }
    if (orderBy !== property) {
      setOrder('asc');
      setOrderBy(property);
    }
  };

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

  const handleItemClick = (row) => {
    if (onItemClick) {
      onItemClick(row);
    }
  };

  const handleItemEditClick = (row) => {
    if (onItemEdit) {
      onItemEdit(row);
    }
  };

  const handleItemDeleteClick = (row) => {
    if (onItemDelete) {
      onItemDelete(row);
    }
  };

  const handleFilterByName = (value) => {
    onFilterQueryChange(value);
  };

  const handleClearFilter = () => {
    setSelected([]);
    onClearFilter();
  };

  const handleClearLocation = () => {
    onClearLocation();
  };

  const handleFilterClick = () => {
    onFilterClick();
  };

  const handleShowSelected = () => {
    showAllSelected(selected);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - displayedData.length) : 0;

  const isDataNotFound = displayedData.length === 0;

  const handleSelectAllClick = (event) => {
    if (event.target.checked && event.target.getAttribute('data-indeterminate') !== 'true') {
      const newSelecteds = displayedData
        .map((n) => n.id)
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  return (
    <Card>
      <ListToolbar
        numSelected={selected.length}
        isLocationFiltered={isLocationFiltered}
        isFiltered={isFiltered}
        filterName={query}
        onFilterName={handleFilterByName}
        onClearFilter={handleClearFilter}
        onClearLocation={handleClearLocation}
        onFilterClick={handleFilterClick}
        showAllSelected={handleShowSelected}
        ListToolbarItems={ListToolbarItems}
        searchPlaceholder={searchPlaceholder}
      />
      <Scrollbar>
        <TableContainer>
          <Table>
            {isLoading && (
              <caption style={{ textAlign: 'center' }}>
                <CircularProgress disableShrink sx={{ m: 'auto' }} />
              </caption>
            )}
            <ListHead
              order={order}
              orderBy={orderBy}
              headLabel={TableHead}
              rowCount={displayedData.length}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
              selectable={selectable}
              showMenu={showMenu}
            />
            <TableBody>
              {displayedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  const { id, name } = row;
                  const isItemSelected = selected.indexOf(id) !== -1;

                  const canEdit =
                    isAdmin ||
                    (row.roles != null && user != null && row.roles[user.uid] === 'owner');
                  const canRemove =
                    isAdmin || (row.roles != null && user != null && row.roles[user.uid] === 'owner');

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
                        {selectable && (
                          <Checkbox
                            checked={isItemSelected}
                            onChange={(event) => handleClick(event, id)}
                          />
                        )}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        padding="none"
                        onClick={() => handleItemClick(row)}
                      >
                        <Stack direction="row" alignItems="center" spacing={2}>
                          {showAvatar !== false && (
                            <Avatar
                              alt={name}
                              src={
                                avatarGenerator != null && avatarGenerator.field
                                  ? avatarGenerator.method(row[avatarGenerator.field])
                                  : null
                              }
                            />
                          )}
                          <Typography variant="subtitle2" noWrap>
                            {name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      {TableHead.filter(
                        (headObj) =>
                          headObj.id != null && headObj.id !== '' && headObj.value != null
                      ).map((headObj) => (
                        <TableCell
                          key={headObj.id}
                          style={{ cursor: 'pointer' }}
                          align="left"
                          onClick={() => handleItemClick(row)}
                        >
                          <CellData row={row} headObj={headObj} />
                        </TableCell>
                      ))}

                      {showMenu && (
                        <TableCell align="right">
                          <MoreMenu
                            onClickShow={() => handleItemClick(row)}
                            onClickEdit={canEdit ? () => handleItemEditClick(row) : undefined}
                            onClickDelete={canRemove ? () => handleItemDeleteClick(row) : undefined}
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            {isDataNotFound && !isLoading && (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                    <SearchNotFound searchQuery={query} />
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
        count={displayedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Card>
  );
}
