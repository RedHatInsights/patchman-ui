import { CheckIcon, LongArrowAltUpIcon,
    InfoCircleIcon, BugIcon, EnhancementIcon, SecurityIcon } from '@patternfly/react-icons';
import { SortByDirection } from '@patternfly/react-table/dist/js';
import findIndex from 'lodash/findIndex';
import qs from 'query-string';
import React from 'react';
import { Link } from 'react-router-dom';
import AdvisoriesIcon from '../PresentationalComponents/Snippets/AdvisoriesIcon';
import {
    advisorySeverities,
    compoundSortValues,
    filterCategories
} from './constants';
import { Flex, FlexItem, Tooltip } from '@patternfly/react-core';
import messages from '../Messages';
import { intl } from './IntlProvider';

export const convertLimitOffset = (limit, offset) => {
    return [offset / limit + 1, limit];
};

// eslint-disable-next-line no-unused-vars
export const transformPairs = (input) => {
    return {
        issues: Object.keys(input.data).map(advisory => {
            return {
                id: 'patch-advisory:' + advisory,
                description: advisory,
                systems: input.data[advisory]
            };
        }
        )
    };
};

export const createSortBy = (header, values, offset) => {
    if (values) {
        let [column] = values;
        let multiple = values.join();
        let direction =
            column[0] === '-' ? SortByDirection.desc : SortByDirection.asc;
        Object.keys(compoundSortValues).forEach(col => {
            Object.keys(compoundSortValues[col]).forEach(dir => {
                if (compoundSortValues[col][dir] === multiple) {
                    column = col;
                    direction = dir;
                }
            });
        });

        column = column.replace(/^(-|\+)/, '');
        const index = findIndex(header, item => item.key === column);
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
            {rhsa !== 0 && (<AdvisoriesIcon tooltipText={'Security advisories'} count = { rhsa } Icon = { SecurityIcon} />)}
            {rhba !== 0 && (<AdvisoriesIcon tooltipText={'Bug fixes'} count = { rhba } Icon = { BugIcon} />)}
            {rhea !== 0 && (<AdvisoriesIcon tooltipText={'Enhancements'} count = { rhea } Icon = { EnhancementIcon} />)}
        </div>
    );
}

export function createUpgradableColumn(value) {
    return <div style={{
        display: 'flex',
        alignItems: 'center'
    }}>
        {
            value && <LongArrowAltUpIcon style={{ color: 'var(--pf-global--palette--blue-400)' }} />
                || <CheckIcon style={{ color: 'var(--pf-global--success-color--100)' }}/>
        }
        {<span style={{ marginLeft: 'var(--pf-global--spacer--sm)' }}>
            {
                value && 'Upgradable' || 'Up-to-date'
            }
        </span>}
    </div>;
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

export const remediationProvider = (issues, systems, remediationIdentifier) => {
    issues = [].concat(issues);
    systems = [].concat(systems);
    return issues.length && systems.length
        ? {
            issues: issues.map(item => ({
                id: `${remediationIdentifier}:${item}`,
                description: item
            })),
            systems
        }
        : false;
};

export async function remediationProviderWithPairs(issues, createPairs, transformFunc) {
    if (issues) {
        const pairsCreated = await createPairs(issues);
        const res = transformFunc(pairsCreated);
        console.log(await res);
        return await res;
    }
    else {
        return false;
    }
}

;

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
    let urlParams = { ...parameters };
    delete urlParams.systemProfile;
    delete urlParams.selectedTags;
    return encodeParams(urlParams, false);
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
        if (!key.startsWith('filter[system_profile]')) {
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
    const offsetResetParams = ['filter', 'search', 'limit', 'selectedTags'];
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

export function sortCves(cves, index, direction) {

    const sortedCves = cves.sort(
        ({ cells: aCells }, { cells: bCells }) => {
            const aCell = aCells[index].value || aCells[index].title;
            const bCell = bCells[index].value || bCells[index].title;

            const stringA = aCell.toString().toUpperCase();
            const stringB = bCell.toString().toUpperCase();

            return stringA.localeCompare(stringB);
        }
    );

    return {
        sortBy: { index, direction },
        sortedCves: direction === SortByDirection.asc ? sortedCves : sortedCves.reverse()
    };

}

export const createOSColumn = ({ osName, rhsm }) => rhsm === '' &&  osName || (
    <Tooltip
        content={
            intl.formatMessage(messages.textLockVersionTooltip, { lockedVersion: rhsm })
        }
    >
        <Flex flex={{ default: 'inlineFlex' }}>
            <FlexItem spacer={{ default: 'spacerSm' }}>{osName}</FlexItem>
            <FlexItem spacer={{ default: 'spacerSm' }}>
                <InfoCircleIcon size="sm" color={'var(--pf-global--info-color--100)'} />
            </FlexItem>
        </Flex>
    </Tooltip>
);
