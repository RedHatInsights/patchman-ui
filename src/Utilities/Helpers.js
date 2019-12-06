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

export const convertLimitOffset = (limit, offset) => {
    return [offset / limit + 1, limit];
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
