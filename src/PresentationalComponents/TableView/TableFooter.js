import { Pagination, PaginationVariant, Skeleton } from '@patternfly/react-core';
import TableToolbar from '@redhat-cloud-services/frontend-components/TableToolbar';
import PropTypes from 'prop-types';
import React from 'react';

const TableFooter = ({
  isLoading,
  page,
  perPage,
  onSetPage,
  totalItems,
  onPerPageSelect,
  paginationOUIA,
}) => {
  return (
    <TableToolbar isFooter>
      {isLoading ? (
        <div className='pf-v6-c-pagination pf-m-bottom'>
          <Skeleton fontSize='xl' width='350px' style={{ margin: 10 }} />
        </div>
      ) : (
        <Pagination
          itemCount={totalItems}
          perPage={perPage}
          page={page}
          onSetPage={onSetPage}
          onPerPageSelect={onPerPageSelect}
          widgetId={`pagination-options-menu-bottom`}
          variant={PaginationVariant.bottom}
          ouiaId={paginationOUIA}
          isDisabled={totalItems === 0}
        />
      )}
    </TableToolbar>
  );
};

TableFooter.propTypes = {
  isLoading: PropTypes.bool,
  onSetPage: PropTypes.func,
  onPerPageSelect: PropTypes.func,
  page: PropTypes.number,
  perPage: PropTypes.number,
  totalItems: PropTypes.number,
  paginationOUIA: PropTypes.string,
};

export default TableFooter;
