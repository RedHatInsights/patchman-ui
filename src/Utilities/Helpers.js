import BugIcon from '@patternfly/react-icons/dist/js/icons/bug-icon';
import EnhancementIcon from '@patternfly/react-icons/dist/js/icons/enhancement-icon';
import SecurityIcon from '@patternfly/react-icons/dist/js/icons/security-icon';
import { SortByDirection } from '@patternfly/react-table';
import findIndex from 'lodash/findIndex';
// eslint-disable-next-line no-unused-vars
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

export function createAdvisoriesIcons([rhea, rhba, rhsa]) {
    return (
        <div>
            {[rhea, rhba, rhsa].every(item => item === 0) &&
                'No applicable advisories'}
            {rhea !== 0 && (
                <span className="icon-with-label">
                    <EnhancementIcon />
                    {rhea.toString()}
                </span>
            )}
            {rhba !== 0 && (
                <span className="icon-with-label">
                    <BugIcon />
                    {rhba.toString()}
                </span>
            )}
            {rhsa !== 0 && (
                <span className="icon-with-label">
                    <SecurityIcon
                        color={'var(--pf-global--warning-color--100)'}
                    />
                    {rhsa.toString()}
                </span>
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
    if (location.href.indexOf('patch') !== -1) {
        return (
            <Link to={'/advisories/' + name}>
                {body === undefined ? name : body}
            </Link>
        );
    } else {
        return (
            <a href={`${document.baseURI}rhel/patch/advisories/${name}`}>
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

export const flattenFilters = filter => {
    let result = {};
    filter &&
        Object.entries(filter).forEach(item => {
            const [key, value] = item;
            const operator = [].concat(value).length > 1 ? 'in:' : '';
            result = {
                ...result,
                [`filter[${key}]`]: `${operator}${value.toString()}`
            };
        });
    return result;
};

export const encodeQueryParams = parameters => {
    let params = [];
    Object.keys(parameters).forEach(key => {
        const argKey = encodeURIComponent(key);
        const argValue = encodeURIComponent(parameters[key]);
        if (argValue !== '') {
            params.push(argKey.concat('=').concat(argValue));
        }
    });

    return '?'.concat(params.join('&'));
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
