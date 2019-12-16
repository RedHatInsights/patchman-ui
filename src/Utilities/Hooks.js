import { SortByDirection } from '@patternfly/react-table';
import React from 'react';
import { getLimitFromPageSize, getOffsetFromPageLimit } from './Helpers';

export const useSetPage = (limit, callback) => {
    const onSetPage = React.useCallback((_, page) =>
        callback({ offset: getOffsetFromPageLimit(page, limit) })
    );
    return onSetPage;
};

export const usePerPageSelect = callback => {
    const onPerPageSelect = React.useCallback((_, perPage) =>
        callback({ limit: getLimitFromPageSize(perPage), offset: 0 })
    );
    return onPerPageSelect;
};

export const useSortColumn = (columns, callback, offset = 0) => {
    const onSort = React.useCallback((_, index, direction) => {
        let columnName = columns[index - offset].key;
        if (direction === SortByDirection.desc) {
            columnName = '-' + columnName;
        }

        callback({ sort: columnName });
    });
    return onSort;
};
