import { Flex, FlexItem, Tooltip } from '@patternfly/react-core';
import BugIcon from '@patternfly/react-icons/dist/js/icons/bug-icon';
import EnhancementIcon from '@patternfly/react-icons/dist/js/icons/enhancement-icon';
import SecurityIcon from '@patternfly/react-icons/dist/js/icons/security-icon';
import { SortByDirection } from '@patternfly/react-table/dist/js';
import findIndex from 'lodash/findIndex';
import qs from 'query-string';
import React from 'react';
import { Link } from 'react-router-dom';
import { advisorySeverities, APPLICABLE_ADVISORIES_ASC, APPLICABLE_ADVISORIES_DESC, filterCategories } from './constants';

export const convertLimitOffset = (limit, offset) => {
    return [offset / limit + 1, limit];
};

export const createSortBy = (header, values, offset) => {
    if (values) {
        let [value] = values;
        let multiple = values.join();
        if (multiple === APPLICABLE_ADVISORIES_DESC) {
            value = '-applicable_advisories';
        }
        else if (multiple === APPLICABLE_ADVISORIES_ASC) {
            value = 'applicable_advisories';
        }

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
            {rhsa !== 0 && (
                <Tooltip content={'Security advisories'}>
                    <Flex flex={{ default: 'inlineFlex' }}>
                        <FlexItem spacer={{ default: 'spacerSm' }}>
                            <SecurityIcon/>
                        </FlexItem>
                        <FlexItem spacer={{ default: 'spacerSm' }}>
                            {rhsa.toString()}
                        </FlexItem>
                    </Flex>
                </Tooltip>
            )}
            {rhba !== 0 && (
                <Tooltip content={'Bug fixes'}>
                    <Flex flex={{ default: 'inlineFlex' }}>
                        <FlexItem spacer={{ default: 'spacerSm' }}>
                            <BugIcon />
                        </FlexItem>
                        <FlexItem spacer={{ default: 'spacerSm' }}>
                            {rhba.toString()}
                        </FlexItem>
                    </Flex>
                </Tooltip>
            )}
            {rhea !== 0 && (
                <Tooltip content={'Enhancements'}>
                    <Flex flex={{ default: 'inlineFlex' }}>
                        <FlexItem spacer={{ default: 'spacerSm' }}>
                            <EnhancementIcon />
                        </FlexItem>
                        <FlexItem spacer={{ default: 'spacerSm' }}>
                            {rhea.toString()}
                        </FlexItem>

                    </Flex>
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

export function handlePatchLink(type, name, body) {
    if (location.href.indexOf('inventory') === -1) {
        return (
            <Link to={`/${type}/${name}`}>
                {body === undefined ? name : body}
            </Link>
        );
    } else {
        return (
            <a href={`${document.baseURI}insights/patch/${type}/${name}`}>
                {body || name}
            </a>
        );
    }
}

export const arrayFromObj = items =>
    Object.values(items).filter(value => value);

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

        if (!['', undefined, null].some(value => [argValue, key].includes(value))) {
            if (!['selectedTags', 'systemProfile'].includes(key)) {
                params.push(argKey.concat('=').concat(argValue));
            } else if (key === 'selectedTags') {
                params.push.apply(params, allParams[key]);
            } else {
                params.push(allParams[key]);
            }
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

    //TODO: find a way to parse query filters with the type deep object
    parsed && delete parsed['filter[system_profile][sap_system]=true'];

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

    if (newState.hasOwnProperty('tags')) {
        newState && delete newState.tags;
    }

    return newState;
};

export function subtractDate(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
}

export function preserveNewlines(input) {
    return input && input.replace(
        new RegExp('\\n(?=[^\\n])', 'g'),
        ''
    );
}
