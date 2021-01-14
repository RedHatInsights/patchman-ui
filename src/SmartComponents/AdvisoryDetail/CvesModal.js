import React, { useState, useMemo } from 'react';
import propTypes from 'prop-types';
import { Modal } from '@patternfly/react-core';
import messages from '../../Messages';
import { intl } from '../../Utilities/IntlProvider';
import TableView from '../../PresentationalComponents/TableView/TableView';
import { STATUS_RESOLVED } from '../../Utilities/constants';
import searchFilter from '../../PresentationalComponents/Filters/SearchFilter';
import { cvesTableColumns } from '../../PresentationalComponents/TableView/TableViewAssets';

const CvesModal = ({ cves: data }) =>{
    const [cves, setCves] = useState(data);
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [search, setSearch] = useState(undefined);

    const handlePagination = (cves) => {
        setRows(cves.slice((page - 1) * perPage, page * perPage).map(cve => ({ cells: [{ title: cve }] })));
        setCves(cves);
    };

    useMemo(() => {
        const sortedCves = data.filter(cve => cve.toString().includes(search || ''));
        handlePagination(sortedCves);
    }, [search]);

    useMemo(() => {
        handlePagination(cves);
    }, [page, perPage]);

    const handleClose = () => {
        setCves(undefined);
    };

    const handleFilter = ({ search }) =>{
        setPage(page);
        setSearch(search);
    };

    const handlePageChange = (_, page) => {
        setPage(page);
    };

    const handlePerPageChange = (_, perPage) => {
        setPerPage(perPage);
    };

    return (
        <React.Fragment>
            <Modal
                variant='small'
                title={intl.formatMessage(messages.labelsCves)}
                isOpen={Boolean(cves)}
                onClose={handleClose}
            >
                <TableView
                    columns={cvesTableColumns}
                    onSetPage={handlePageChange}
                    onPerPageSelect={handlePerPageChange}
                    apply={handleFilter}
                    tableOUIA={'cves-table'}
                    paginationOUIA={'cves-pagination'}
                    store={{
                        rows,
                        metadata: { limit: perPage, offset: (page - 1) * perPage, total_items: cves && cves.length },
                        status: STATUS_RESOLVED, queryParams: { filter: {}, search }
                    }}
                    filterConfig={{
                        items: [
                            searchFilter(handleFilter, search)
                        ]
                    }}
                />
            </Modal>
        </React.Fragment>
    );

};

CvesModal.propTypes = {
    cves: propTypes.array
};

export default CvesModal;
