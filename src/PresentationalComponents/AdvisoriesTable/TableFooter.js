import { Pagination, PaginationVariant } from '@patternfly/react-core';
import { TableToolbar } from '@redhat-cloud-services/frontend-components';
import PropTypes from 'prop-types';
import React from 'react';

const TableFooter = ({ page, perPage, onSetPage, totalItems }) => {
    return (
        <TableToolbar>
            <Pagination
                itemCount={totalItems}
                perPage={perPage}
                page={page}
                onSetPage={onSetPage}
                widgetId={`pagination-options-menu-bottom`}
                variant={PaginationVariant.bottom}
            />
        </TableToolbar>
    );
};

TableFooter.propTypes = {
    onSetPage: PropTypes.func,
    page: PropTypes.number,
    perPage: PropTypes.number,
    totalItems: PropTypes.number
};

export default TableFooter;
