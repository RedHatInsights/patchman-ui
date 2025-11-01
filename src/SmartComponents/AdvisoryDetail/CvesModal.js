import React, { useState, useMemo } from 'react';
import { Modal } from '@patternfly/react-core/deprecated';
import messages from '../../Messages';
import { intl } from '../../Utilities/IntlProvider';
import TableView from '../../PresentationalComponents/TableView/TableView';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import { cvesTableColumns } from '../../PresentationalComponents/TableView/TableViewAssets';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCves } from '../../store/Actions/Actions';
import propTypes from 'prop-types';
import { createCvesRows } from '../../Utilities/DataMappers';
import { sortCves } from '..//../Utilities/Helpers';
import { SortByDirection } from '@patternfly/react-table';

const CvesModal = ({ cveIds }) => {
  const dispatch = useDispatch();
  const [cves, setCves] = useState([]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState(undefined);
  const [sortBy, setSortBy] = useState({
    direction: SortByDirection.asc,
    index: 0,
  });

  const data = useSelector(({ CvesListStore }) => CvesListStore.rows);

  const status = useSelector(({ CvesListStore }) => CvesListStore.status);

  React.useEffect(() => {
    dispatch(fetchCves({ cveIds }));
  }, []);

  React.useMemo(() => {
    setRows(cves.slice((page - 1) * perPage, page * perPage));
  }, [cves, page, perPage, sortBy]);

  useMemo(() => {
    const sortedCves =
      (search !== undefined &&
        search !== '' &&
        data.filter((cve) => {
          const {
            attributes: { synopsis },
          } = cve;
          return synopsis && search && synopsis.toLowerCase().includes(search.toLowerCase());
        })) ||
      data;

    setCves(createCvesRows(((sortedCves.length !== 0 || search) && sortedCves) || data));
  }, [search, data]);

  const handleClose = () => {
    setRows(undefined);
  };

  const handleFilter = ({ search }) => {
    setPage(page);
    setSearch(search);
  };

  const handlePageChange = (_, page) => {
    setPage(page);
  };

  const handlePerPageChange = (_, perPage) => {
    setPage(1);
    setPerPage(perPage);
  };

  const handleSort = (_, index, direction) => {
    const { sortBy, sortedCves } = sortCves(cves, index, direction);

    setSortBy(sortBy);
    setCves(sortedCves);
  };

  return (
    <React.Fragment>
      <Modal
        variant='small'
        title={intl.formatMessage(messages.labelsCves)}
        isOpen={Boolean(rows)}
        onClose={handleClose}
      >
        <TableView
          columns={cvesTableColumns}
          onSetPage={handlePageChange}
          onPerPageSelect={handlePerPageChange}
          apply={handleFilter}
          tableOUIA='cves-table'
          paginationOUIA='cves-pagination'
          onSort={handleSort}
          sortBy={sortBy}
          store={{
            rows,
            metadata: {
              limit: perPage,
              offset: (page - 1) * perPage,
              total_items: cves && cves.length,
            },
            status,
            queryParams: { filter: {}, search },
          }}
          filterConfig={{
            items: [
              searchFilter(
                handleFilter,
                search,
                '',
                intl.formatMessage(messages.labelsFiltersCvesSearchPlaceHolder),
              ),
            ],
          }}
        />
      </Modal>
    </React.Fragment>
  );
};

CvesModal.propTypes = {
  cveIds: propTypes.array,
};

export default CvesModal;
