import { Tooltip } from '@patternfly/react-core';
import BugIcon from '@patternfly/react-icons/dist/js/icons/bug-icon';
import EnhancementIcon from '@patternfly/react-icons/dist/js/icons/enhancement-icon';
import SecurityIcon from '@patternfly/react-icons/dist/js/icons/security-icon';
import { SortByDirection } from '@patternfly/react-table/dist/js';
import findIndex from 'lodash/findIndex';
import qs from 'query-string';
import React from 'react';
import { Link } from 'react-router-dom';
import { advisorySeverities, filterCategories } from './constants';

export const convertLimitOffset = (limit, offset) => {
    return [offset / limit + 1, limit];
};

export const createSortBy = (header, values, offset) => {
    if (values) {
        let [value] = values;
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

export const getNewSelectedItems = (selectedItems, currentItems) => {
    let payload = [].concat(selectedItems).map(item=>({ rowId: item.id, value: item.selected }));
    return addOrRemoveItemFromSet(
        currentItems,
        payload
    );
};

// for expandable rows only
export const getRowIdByIndexExpandable = (arrayOfObjects, index) => {
    return arrayOfObjects[index / 2].id;
};

export const getOffsetFromPageLimit = (page, limit) => {
    return page * limit - limit;
};

export const getLimitFromPageSize = limit => {
    return limit;
};

export function truncate(str, max, end) {
    return str.length > max ? (
        <React.Fragment>
            {str.substr(0, max - 1)}
            ...&nbsp;{end}
        </React.Fragment>
    ) : str;
}

export function createAdvisoriesIcons([rhea, rhba, rhsa]) {
    return (
        <div>
            {[rhea, rhba, rhsa].every(item => item === 0) &&
                'No applicable advisories'}
            {rhea !== 0 && (
                <Tooltip content={'Enhancements'}>
                    <span className="icon-with-label">
                        <EnhancementIcon />
                        {rhea.toString()}
                    </span>
                </Tooltip>
            )}
            {rhba !== 0 && (
                <Tooltip content={'Bug fixes'}>
                    <span className="icon-with-label">
                        <BugIcon />
                        {rhba.toString()}
                    </span>
                </Tooltip>
            )}
            {rhsa !== 0 && (
                <Tooltip content={'Security advisories'}>
                    <span className="icon-with-label">
                        <SecurityIcon
                            color={'var(--pf-global--warning-color--100)'}
                        />
                        {rhsa.toString()}
                    </span>
                </Tooltip>
            )}
        </div>
    );
}

export function getSeverityById(id) {
    return (
        advisorySeverities.find(item => item.value === id) ||
        advisorySeverities[0]
    );
}

export function handleAdvisoryLink(name, body) {
    if (location.href.indexOf('inventory') === -1) {
        return (
            <Link to={'/advisories/' + name}>
                {body === undefined ? name : body}
            </Link>
        );
    } else {
        return (
            <a href={`${document.baseURI}insights/patch/advisories/${name}`}>
                {body || name}
            </a>
        );
    }
}

export const arrayFromObj = items =>
    Object.keys(items).filter(key => items[key]);

export const remediationProvider = (issues, systems) => {
    issues = [].concat(issues);
    systems = [].concat(systems);
    return issues.length && systems.length
        ? {
            issues: issues.map(item => ({
                id: `patch-advisory:${item}`,
                description: item
            })),
            systems
        }
        : false;
};

export const getFilterValue = (category, key) => {
    const filterCategory = filterCategories[category];
    if (filterCategory) {
        const filterOption = filterCategory.values.find(
            item => item.value === key
        );
        return filterOption || { apiValue: key };
    }
};

export const encodeParams = (parameters, shouldTranslateKeys) => {
    const flattenFilters = filter => {
        let result = {};
        filter &&
            Object.entries(filter).forEach(item => {
                let [key, value] = item;
                value = shouldTranslateKeys && getFilterValue(key, value).apiValue || value;
                const operator = [].concat(value).length > 1 ? 'in:' : '';
                result = {
                    ...result,
                    [`filter[${key}]`]: `${operator}${value.toString()}`
                };
            });
        return result;
    };

    let { filter, ...allParams } = parameters;
    allParams = { ...allParams, ...flattenFilters(filter) };
    let params = [];
    Object.keys(allParams).forEach(key => {
        const argKey = encodeURIComponent(key);
        const argValue = encodeURIComponent(allParams[key]);
        if (argValue !== '') {
            params.push(argKey.concat('=').concat(argValue));
        }
    });

    return '?'.concat(params.join('&'));
};

export const encodeApiParams = parameters => {
    return encodeParams(parameters, true);
};

export const encodeURLParams = parameters => {
    delete parameters.id;
    return encodeParams(parameters, false);
};

export const decomposeFilterValue = filterValue => {
    if (filterValue.startsWith('in:')) {
        const values = filterValue.slice(3);
        return values.split(',');
    }

    return filterValue;
};

export const decodeQueryparams = queryString => {
    const parsed = qs.parse(queryString);
    const res = {};
    Object.keys(parsed).forEach(key => {
        const value = parsed[key];
        const bracketIndex = key.search(/\[.*\]/);
        if (bracketIndex > 0) {
            const objParent = key.slice(0, bracketIndex);
            const objKey = key.slice(bracketIndex + 1, -1);
            res[objParent] = {
                ...res[objParent],
                [objKey]: decomposeFilterValue(value)
            };
        } else {
            res[key] = value;
        }
    });
    return res;
};

export const buildFilterChips = (filters, search) => {
    let filterConfig = [];
    const processFilters = () => {
        let categories = Object.keys(filters).filter(
            item =>
                filters[item] !== '' && [].concat(filters[item]).length !== 0
        );
        filterConfig = filterConfig.concat(
            categories.map(category => {
                const { label, values } = filterCategories[category];
                return {
                    category: label,
                    id: category,
                    chips: [].concat(filters[category]).map(filterValue => {
                        const match = values.find(
                            item =>
                                item.value.toString() === filterValue.toString()
                        );
                        return {
                            name: match.label,
                            value: filterValue,
                            id: match.value
                        };
                    })
                };
            })
        );
    };

    const processSearch = () => {
        filterConfig = filterConfig.concat([
            {
                category: 'Search',
                id: 'search',
                chips: [
                    {
                        name: search,
                        value: search
                    }
                ]
            }
        ]);
    };

    filters && processFilters();
    search && processSearch();

    return filterConfig;
};

export const changeListParams = (oldParams, newParams) => {
    const newState = { ...oldParams, ...newParams };
    const offsetResetParams = ['filter', 'search', 'limit'];
    if (offsetResetParams.some(item => newParams.hasOwnProperty(item))) {
        newState.offset = 0;
    }

    if (newParams.hasOwnProperty('filter')) {
        newState.filter = { ...oldParams.filter, ...newParams.filter };
    }

    return newState;
};

export function subtractDate(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
}
