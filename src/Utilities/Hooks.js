import { SortByDirection } from '@patternfly/react-table/dist/js';
import React from 'react';
import { APPLICABLE_ADVISORIES_ASC, APPLICABLE_ADVISORIES_DESC } from './constants';
import { convertLimitOffset, getLimitFromPageSize, getOffsetFromPageLimit } from './Helpers';
import isDeepEqualReact from 'fast-deep-equal/react';

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

        if (columnName === '-applicable_advisories') {
            columnName = APPLICABLE_ADVISORIES_DESC;
        }
        else if (columnName === 'applicable_advisories') {
            columnName = APPLICABLE_ADVISORIES_ASC;
        }

        callback({ sort: columnName });
    });
    return onSort;
};

export const useRemoveFilter = (filters, callback) => {
    const removeFilter = React.useCallback((event, selected) => {
        let newParams = { filter: {} };
        selected.forEach(selectedItem => {
            let { id: categoryId, chips } = selectedItem;
            if (categoryId !== 'search') {
                let activeFilter = filters[categoryId];
                const toRemove = chips.map(item => item.id.toString());
                if (Array.isArray(activeFilter)) {
                    newParams.filter[categoryId] = activeFilter.filter(
                        item => !toRemove.includes(item.toString())
                    );
                } else {
                    newParams.filter[categoryId] = '';
                }
            } else {
                newParams.search = '';
            }
        });
        callback({ ...newParams });
    });
    return removeFilter;
};

export const useOnSelect = (rawData, selectedRows, fetchAllData, selectRows, constructFilename = undefined) =>{

    const onSelect =  React.useCallback((event, selected, rowId) => {
        const createSelectedRow = (rawData, toSelect = []) => {
            rawData.forEach((row)=>{
                toSelect.push(
                    {
                        id: row.id && row.id || row.name,
                        selected: constructFilename && constructFilename(row) || row.id
                    }
                );});

            return toSelect;
        };

        switch (event) {
            case 'none': {
                const toSelect = [];
                Object.keys(selectedRows).forEach(id=>{
                    toSelect.push(
                        {
                            id,
                            selected: false
                        }
                    );
                });
                selectRows(toSelect);
                break;
            }

            case 'page': {
                selectRows(createSelectedRow(rawData));
                break;
            }

            case 'all': {
                const fetchCallback = ({ data }) => {
                    selectRows(createSelectedRow(data));
                };

                fetchAllData().then(fetchCallback);

                break;
            }

            default: {
                selectRows([{
                    id: rawData[rowId].id && rawData[rowId].id || rawData[rowId].name,
                    selected: selected && (constructFilename && constructFilename(rawData[rowId]) || true)
                }]);
            }

        }}
    );

    return onSelect;
};

export const setPageTitle = (title) => {
    React.useEffect(() => {
        if (title) {
            document.title = `${title} - Patch | Red Hat Insights`;
        }
    }, [title]);
};

export const useDeepCompareEffect = (effect, deps) => {
    const ref = React.useRef(undefined);

    if (!ref.current || !isDeepEqualReact(deps, ref.current)) {
        ref.current = deps;
    }

    React.useEffect(effect, ref.current);
};
