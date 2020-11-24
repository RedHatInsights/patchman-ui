import { Pagination, PaginationVariant } from '@patternfly/react-core/dist/js/components/Pagination';
import { TableToolbar } from '@redhat-cloud-services/frontend-components/components/cjs/TableToolbar';
import PropTypes from 'prop-types';
import React from 'react';

const TableFooter = ({ page, perPage, onSetPage, totalItems, onPerPageSelect, paginationOUIA }) => {
    return (
        <TableToolbar>
            <Pagination
                itemCount={totalItems}
                perPage={perPage}
                page={page}
                onSetPage={onSetPage}
                onPerPageSelect={onPerPageSelect}
                widgetId={`pagination-options-menu-bottom`}
                variant={PaginationVariant.bottom}
                ouiaId={paginationOUIA}
            />
        </TableToolbar>
    );
};

TableFooter.propTypes = {
    onSetPage: PropTypes.func,
    onPerPageSelect: PropTypes.func,
    page: PropTypes.number,
    perPage: PropTypes.number,
    totalItems: PropTypes.number,
    paginationOUIA: PropTypes.string
};

export default TableFooter;
