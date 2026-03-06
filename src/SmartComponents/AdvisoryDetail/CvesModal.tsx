import React, { useState, useMemo, useEffect } from 'react';
import { Modal } from '@patternfly/react-core/deprecated';
import messages from '../../Messages';
import { intl } from '../../Utilities/IntlProvider';
import TableView from '../../PresentationalComponents/TableView/TableView';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import { cvesTableColumns } from '../../PresentationalComponents/TableView/TableViewAssets';
import { fetchCves } from '../../store/Actions/VulnerabilityActions';
import { createCvesRows } from '../../Utilities/DataMappers';
import { sortCves } from '../../Utilities/Helpers';
import { SortByDirection } from '@patternfly/react-table';
import { CveItem } from '../../Utilities/api/vulnerabilityApi';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

interface CvesModalProps {
  cveIds: Array<string>;
}

const CvesModal = ({ cveIds }: CvesModalProps) => {
  const [cves, setCves] = useState<Array<CveItem>>([]);
  const [rows, setRows] = useState<Array<CveItem>>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState({
    direction: SortByDirection.asc,
    index: 0,
  });

  const data = useAppSelector(({ CvesListStore }) => CvesListStore.rows);

  const status = useAppSelector(({ CvesListStore }) => CvesListStore.status);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCves({ cveIds }));
  }, []);

  useMemo(() => {
    setRows(cves.slice((page - 1) * perPage, page * perPage));
  }, [cves, page, perPage, sortBy]);

  useMemo(() => {
    const sortedCves =
      (search !== undefined &&
        search !== '' &&
        data.filter((cve: CveItem) => {
          const {
            attributes: { synopsis },
          } = cve;
          return synopsis && search && synopsis.toLowerCase().includes(search.toLowerCase());
        })) ||
      data;

    setCves(createCvesRows(((sortedCves.length !== 0 || search) && sortedCves) || data));
  }, [search, data]);

  const handleClose = () => {
    setRows([]);
  };

  const handleFilter = ({ search }: { search: string }) => {
    setPage(page);
    setSearch(search);
  };

  const handlePageChange = (_, page: number) => {
    setPage(page);
  };

  const handlePerPageChange = (_, perPage: number) => {
    setPage(1);
    setPerPage(perPage);
  };

  const handleSort = (_, index: number, direction: SortByDirection) => {
    const { sortBy, sortedCves } = sortCves(cves, index, direction);

    setSortBy(sortBy);
    setCves(sortedCves);
  };

  return (
    <React.Fragment>
      <Modal
        variant='small'
        title={intl.formatMessage(messages.labelsCves)}
        isOpen={rows.length > 0}
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

export default CvesModal;
