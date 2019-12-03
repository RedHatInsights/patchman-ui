import React from 'react';
import { useDispatch } from 'react-redux';

export const useMountDispatch = actionCreator => {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(actionCreator());
    }, []);
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
