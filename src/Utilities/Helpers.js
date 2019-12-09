import { SortByDirection } from '@patternfly/react-table';
import findIndex from 'lodash/findIndex';
import React from 'react';
import { useDispatch } from 'react-redux';

export const useMountDispatch = actionCreator => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(actionCreator());
    }, []);
};

export const useSetPage = (limit, callback) => {
    const onSetPage = React.useCallback((_, page) =>
        callback({ offset: page * limit - limit })
    );
    return onSetPage;
};

export const usePerPageSelect = callback => {
    const onPerPageSelect = React.useCallback((_, perPage) =>
        callback({ limit: perPage, offset: 0 })
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

export const convertLimitOffset = (limit, offset) => {
    return [offset / limit + 1, limit];
};

export const createSortBy = (header, value, offset) => {
    if (value) {
        let direction =
            value[0] === '-' ? SortByDirection.desc : SortByDirection.asc;
        value = value.replace(/^(-|\+)/, '');
        const index = findIndex(header, item => item.key === value);
        let sort = {
            index: index + offset,
            direction
        };
        return sort;
    }

    return {};
};

export const addOrRemoveItemFromSet = (targetObj, inputArr) => {
    const inputObj = inputArr.reduce(
        (obj, item) => ((obj[item.rowId] = item.value || undefined), obj),
        {}
    );
    const result = { ...targetObj, ...inputObj };
    return result;
};

// for expandable rows only
export const getRowIdByIndexExpandable = (arrayOfObjects, index) => {
    return arrayOfObjects[index / 2].id;
};
