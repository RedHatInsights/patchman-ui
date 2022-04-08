import { SortByDirection } from '@patternfly/react-table/dist/js';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux/actions/notifications';
import { downloadFile } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import isDeepEqualReact from 'fast-deep-equal/react';
import React from 'react';
import messages from '../Messages';
import { compoundSortValues, exportNotifications } from './constants';
import {
    convertLimitOffset, createSystemsSortBy, getLimitFromPageSize,
    getOffsetFromPageLimit, encodeURLParams, mapGlobalFilters, convertDateToISO, objUndefinedToFalse
} from './Helpers';
import { intl } from './IntlProvider';
import { multiValueFilters } from '../Utilities/constants';
import { assignSystemPatchSet, updatePatchSets } from './api';

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
        const compoundKey = compoundSortValues[columnName];
        if (compoundKey) {
            columnName = compoundKey[direction];
        }
        else if (direction === SortByDirection.desc) {
            columnName = '-' + columnName;
        }

        callback({ sort: columnName });
    });
    return onSort;
};

export const useRemoveFilter = (filters, callback, defaultFilters = { filter: {} }) => {
    const removeFilter = React.useCallback((selected, resetFilters, shouldReset) => {
        let newParams = { filter: {} };
        selected.forEach(selectedItem => {
            let { id: categoryId, chips } = selectedItem;

            if (categoryId !== 'search' && !multiValueFilters.includes(categoryId)) {
                let activeFilter = filters[categoryId];
                const toRemove = chips.map(item => item.id.toString());
                if (Array.isArray(activeFilter)) {
                    newParams.filter[categoryId] = activeFilter.filter(
                        item => !toRemove.includes(item.toString())
                    );
                } else {
                    newParams.filter[categoryId] = undefined;
                }
            } else if (multiValueFilters.includes(categoryId)) {
                const filterValues = filters[categoryId] &&
                    (typeof(filters[categoryId]) === 'string' && filters[categoryId].split(',')
                        || filters[categoryId]) || [];

                newParams.filter[categoryId] = (filterValues.length !== 1)
                    && filterValues.filter(filterValue => !chips.find(chip => chip.value === filterValue)).join(',') || undefined;
            }
            else {
                newParams.search = '';
            }

        });

        if (shouldReset) {
            newParams = resetFilters(newParams);
        }

        callback({ ...newParams });
    });

    const deleteFilterGroup = (__, filters) => {
        removeFilter(filters);
    };

    const deleteFilters = (__, selected, shouldReset) => {
        const resetFilters = (currentFilters) => {
            if (Object.keys(defaultFilters.filter).length > 0) {
                currentFilters.filter = { ...currentFilters.filter, ...defaultFilters.filter };
            }

            return currentFilters;
        };

        removeFilter(selected, resetFilters, shouldReset);
    };

    return [deleteFilters, deleteFilterGroup];
};

export const useOnSelect = (rawData, selectedRows, fetchAllData, selectRows,
    constructFilename = undefined, transformKey = undefined) => {
    const constructKey = (row) => {
        if (transformKey) {
            return transformKey(row);
        }
        else {
            return row.id || row.name;
        }
    };

    const onSelect = React.useCallback((event, selected, rowId) => {
        const createSelectedRow = (rawData, toSelect = []) => {
            rawData.forEach((row) => {
                toSelect.push(
                    {
                        id: constructKey(row),
                        selected: constructFilename && constructFilename(row) || row.id
                    }
                );
            });

            return toSelect;
        };

        switch (event) {
            case 'none': {
                const toSelect = [];
                Object.keys(selectedRows).forEach(id => {
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
                if (Array.isArray(rawData)) {
                    rawData = rawData.filter(row => !row.disableCheckbox);
                }

                selectRows(createSelectedRow(rawData));
                break;
            }

            case 'all': {
                const fetchCallback = ({ data }) => {
                    selectRows(createSelectedRow(data));
                };

                fetchAllData().then(fetchCallback).catch(err => err);

                break;
            }

            default: {
                selectRows([{
                    id: constructKey(rawData[rowId]),
                    selected: selected && (constructFilename && constructFilename(rawData[rowId]) || true)
                }]);
            }

        }
    }
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

export const useBulkSelectConfig = (selectedCount, onSelect, metadata, rows, onCollapse) => ({
    count: selectedCount,
    items: [{
        title: intl.formatMessage(messages.labelsBulkSelectNone),
        onClick: () => {
            onSelect('none');
        }
    }, {
        title: intl.formatMessage(messages.labelsBulkSelectPage,
            { count: onCollapse && rows.length / 2 || rows.length }
        ),
        onClick: () => {
            onSelect('page');
        }
    },
    {
        title: intl.formatMessage(messages.labelsBulkSelectAll, { count: metadata.total_items }),
        onClick: () => {
            onSelect('all');
        }
    }],
    onSelect: () => {
        selectedCount === 0 ? onSelect('all') : onSelect('none');
    },
    toggleProps: {
        'data-ouia-component-type': 'bulk-select-toggle-button'
    },
    checked: selectedCount === 0 ? false : selectedCount === metadata.total_items ? true : null,
    isDisabled: metadata.total_items === 0 && selectedCount === 0
});

export const useGetEntities = (fetchApi, apply, config, history, applyMetadata, applyGlobalFilter) => {
    const { id, packageName } = config || {};
    const getEntities = async (
        _items,
        { orderBy, orderDirection, page, per_page: perPage, patchParams, filters }
    ) => {

        const { selectedTags: activeTags = [] } = patchParams;
        const { selectedTags } = mapGlobalFilters(filters.tagFilters);

        const sort = createSystemsSortBy(orderBy, orderDirection, packageName);

        const items = await fetchApi({
            page,
            perPage,
            ...patchParams,
            selectedTags: [...activeTags, ...selectedTags],
            sort,
            ...id && { id } || {},
            ...packageName && { package_name: packageName } || {}
        });

        apply({
            page,
            perPage,
            sort,
            metadata: items.meta
        });

        applyMetadata && applyMetadata(items.meta);
        applyGlobalFilter && applyGlobalFilter(selectedTags);

        history.push(encodeURLParams({
            page,
            perPage,
            sort,
            ...patchParams
        }));

        return {
            results: items.data.map(row => ({ ...row, ...row.attributes })),
            total: items.meta?.total_items
        };
    };

    return getEntities;
};

export const useOnExport = (prefix, queryParams, formatHandlers, dispatch) => {
    const onExport = React.useCallback((_, format) => {
        const date = new Date().toISOString().replace(/[T:]/g, '-').split('.')[0] + '-utc';
        const filename = `${prefix}-${date}`;
        dispatch(addNotification(exportNotifications(format).pending));
        formatHandlers[format](queryParams, prefix).then(data => {
            dispatch(addNotification(exportNotifications(format).success));
            downloadFile(data, filename, format);
        }).catch(() => dispatch(addNotification(exportNotifications().error)));
    });
    return onExport;
};

export const usePatchSetApi = (wizardState, setWizardState, patchSetID) => {
    const onSubmit = React.useCallback((formValues) => {
        const { name, description, toDate, id } = formValues.existing_patch_set || formValues;
        const fomattedDate = convertDateToISO(toDate);

        const { systems } = formValues;
        const config = {
            onUploadProgress: progressEvent => {
                const percent = (progressEvent.loaded / progressEvent.total) * 100;
                setWizardState({ ...wizardState, submitted: true, percent });
            }
        };

        const requestConfig = {
            name,
            description,
            inventory_ids: (patchSetID || id) ? objUndefinedToFalse(systems) : Object.keys(systems),
            config: { to_time: fomattedDate }
        };

        if (patchSetID || id) {

            updatePatchSets(requestConfig, config, patchSetID || id)
            .catch(() => {
                setWizardState({ ...wizardState, submitted: true, failed: true });
            });
        } else {
            assignSystemPatchSet(requestConfig, config)
            .catch(() => {
                setWizardState({ ...wizardState, submitted: true, failed: true });
            });
        }
    });
    return onSubmit;
};
