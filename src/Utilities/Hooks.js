import { SortByDirection } from '@patternfly/react-table';
import React from 'react';
import {
    convertLimitOffset,
    getLimitFromPageSize,
    getOffsetFromPageLimit
} from './Helpers';

export const useSetPage = (limit, callback) => {
    const onSetPage = React.useCallback((_, page) =>
        callback({ offset: getOffsetFromPageLimit(page, limit) })
    );
    return onSetPage;
};

export const useHandleRefresh = (metadata, callback) => {
    const handleRefresh = React.useCallback(({ page, per_page: perPage }) => {
        const offset = getOffsetFromPageLimit(page, perPage);
        const limit = getLimitFromPageSize(perPage);
        (metadata.offset !== offset || metadata.limit !== limit) &&
            callback({
                ...(metadata.offset !== offset && { offset }),
                ...(metadata.limit !== limit && { limit })
            });
    });
    return handleRefresh;
};

export const usePagePerPage = (limit, offset) => {
    const [page, perPage] = React.useMemo(
        () => convertLimitOffset(limit, offset),
        [limit, offset]
    );
    return [page, perPage];
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

export const useRemoveFilter = (filters, callback) => {
    const removeFilter = React.useCallback((event, selected) => {
        let newFilter = {};
        selected.forEach(selectedItem => {
            let { id: categoryId, chips } = selectedItem;
            let activeFilter = filters[categoryId];
            const toRemove = chips.map(item => item.id.toString());
            if (Array.isArray(activeFilter)) {
                newFilter[categoryId] = activeFilter.filter(
                    item => !toRemove.includes(item.toString())
                );
            } else {
                newFilter[categoryId] = '';
            }
        });
        callback({ filter: newFilter });
    });
    return removeFilter;
};
