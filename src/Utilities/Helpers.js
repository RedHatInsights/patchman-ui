import { SortByDirection } from '@patternfly/react-table';
import findIndex from 'lodash/findIndex';

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
