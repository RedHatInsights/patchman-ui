/* eslint-disable camelcase */
import { Flex, FlexItem, Tooltip } from '@patternfly/react-core';
import {
    BugIcon, CheckIcon, FlagIcon,
    EnhancementIcon, InfoCircleIcon, LongArrowAltUpIcon,
    SecurityIcon
} from '@patternfly/react-icons';
import { SortByDirection } from '@patternfly/react-table/dist/js';
import flatten from 'lodash/flatten';
import findIndex from 'lodash/findIndex';
import pickBy from 'lodash/pickBy';
import qs from 'query-string';
import React from 'react';
import LinesEllipsis from 'react-lines-ellipsis';
import { Link } from 'react-router-dom';
import messages from '../Messages';
import AdvisoriesIcon from '../PresentationalComponents/Snippets/AdvisoriesIcon';
import { systemsListColumns, packageSystemsColumns } from '../SmartComponents/Systems/SystemsListAssets';
import {
    advisorySeverities,
    compoundSortValues,
    filterCategories,
    multiValueFilters
} from './constants';
import { intl } from './IntlProvider';
import { generateFilter } from '@redhat-cloud-services/frontend-components-utilities/helpers';

export const removeUndefinedObjectItems = (originalObject) => {
    const newObject = JSON.parse(JSON.stringify(originalObject));
    Object.keys(newObject).forEach(key => newObject[key] === undefined && delete newObject[key]);
    return newObject;
};

export const convertLimitOffset = (limit, offset) => {
    return [offset / limit + 1, limit];
};

export const transformPairs = (input, remediationIdentifier) => {
    let issues = [];

    const advisoriesNames = Object.keys(input?.data || {});
    for (let i = 0; i < advisoriesNames.length; i++) {
        if (input.data[advisoriesNames[i]][0] !== '') {
            issues.push({
                id: `${remediationIdentifier}:${advisoriesNames[i]}`,
                description: advisoriesNames[i],
                systems: input.data[advisoriesNames[i]]
            });
        }
    }

    return { issues };
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

export const createSystemsSortBy = (orderBy, orderDirection, hasLastUpload) => {
    orderBy = (orderBy === 'updated' && !hasLastUpload) && 'last_upload' ||
        (orderBy === 'updated' && hasLastUpload) && packageSystemsColumns[0].key || orderBy;

    let sort = `${orderDirection === 'ASC' ? '' : '-'}${orderBy}`;

    //if orderBy is for a compound column reset sort value to relative compound sort value
    Object.keys(compoundSortValues).forEach(col => {
        if (col === orderBy) {
            sort = compoundSortValues[col][orderDirection.toLowerCase()];
        }
    });

    return sort;
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
    let payload = [].concat(selectedItems).map(item => ({ rowId: item.id, value: item.selected }));
    const mergedSelection = addOrRemoveItemFromSet(
        currentItems,
        payload
    );

    return pickBy(mergedSelection, v => !!v);
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
            {str.substring(0, max - 1)}
            ...&nbsp;{end}
        </React.Fragment>
    ) : str;
}

export const truncateDescription = (description, wordLength, setWordLength) => (
    truncate(preserveNewlines(description), wordLength,
        <a onClick={() => setWordLength(description.length)}>
            {intl.formatMessage(messages.linksReadMore)}
        </a>)
);

export function createAdvisoriesIcons([rhea, rhba, rhsa, other]) {
    return (
        <Flex flex={{ default: 'inlineFlex' }} style={{ flexWrap: 'nowrap' }}>
            {[rhea, rhba, rhsa].every(item => item === 0) &&
                'No applicable advisories'}
            {rhsa !== 0 && (
                <FlexItem spacer={{ default: 'spacerXs' }}>
                    <AdvisoriesIcon tooltipText={'Security advisories'} count={rhsa} Icon={SecurityIcon} />
                </FlexItem>)}
            {rhba !== 0 && (
                <FlexItem spacer={{ default: 'spacerXs' }}>
                    <AdvisoriesIcon tooltipText={'Bug fixes'} count={rhba} Icon={BugIcon} />
                </FlexItem>)}
            {rhea !== 0 && (
                <FlexItem spacer={{ default: 'spacerXs' }}>
                    <AdvisoriesIcon tooltipText={'Enhancements'} count={rhea} Icon={EnhancementIcon} />
                </FlexItem>)}
            {other !== 0 && (
                <FlexItem spacer={{ default: 'spacerXs' }}>
                    <AdvisoriesIcon tooltipText={'Other'} count={other} Icon={FlagIcon} />
                </FlexItem>)}
        </Flex>
    );
}

export function createUpgradableColumn(value) {
    return <div style={{
        display: 'flex',
        alignItems: 'center'
    }}>
        {
            value && <LongArrowAltUpIcon style={{ color: 'var(--pf-global--palette--blue-400)' }} />
            || <CheckIcon style={{ color: 'var(--pf-global--success-color--100)' }} />
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

export const createPackagesColumn = (packageCount, systemID) => (
    <Link to={{
        pathname: `/systems/${systemID}`,
        state: { tab: 'packages' }
    }}>
        {packageCount}
    </Link>
);

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

export const remediationProviderWithPairs = (issuePairs, transformFunc, remediationIdentifier) => {
    return issuePairs ? transformFunc(issuePairs, remediationIdentifier) : false;
};

export const getFilterValue = (category, key) => {
    const filterCategory = filterCategories[category];
    if (filterCategory) {
        const filterOption = /* some filters don't have constant values */
        (filterCategory?.values || []).find((item) => item.value === key);
        return filterOption || { apiValue: key };
    } else {
        return { apiValue: key };
    }
};

export const encodeParams = (parameters, shouldTranslateKeys) => {
    const calculateWorkloads = ({ sap_sids, ...restOfProfile }) => {
        let result = '';
        Object.entries(generateFilter({ system_profile: restOfProfile })).forEach(entry => {
            const [key, value] = entry;
            result = `${result}&${key}=${value}`;
        });

        const SIDsFilter = sap_sids?.map(sid => `filter[system_profile][sap_sids][in]=${sid}`).join('&');

        return result.concat(sap_sids ? `&${SIDsFilter}#SIDs=${sap_sids.join(',') }` : '');
    };

    const flattenFilters = filter => {
        let result = {};
        filter &&
            Object.entries(filter).forEach(item => {
                let [key, value] = item;
                value = shouldTranslateKeys && getFilterValue(key, value).apiValue || value;
                const operator = ([].concat(value).length > 1 || multiValueFilters.includes(key)) ? 'in:' : '';
                result = {
                    ...result,
                    [`filter[${key}]`]: `${operator}${value.toString()}`
                };
            });
        return result;
    };

    let { filter, systemProfile = {}, ...allParams } = parameters;

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
            }
        }
    });

    const workloadsFilter = (Object.keys(systemProfile).length > 0)
        && calculateWorkloads(systemProfile) || '';

    return '?'.concat(params.join('&')).concat(workloadsFilter);
};

export const encodeApiParams = parameters => {
    return encodeParams(parameters, true);
};

export const encodeURLParams = parameters => {
    delete parameters.id;
    let urlParams = { ...parameters };
    delete urlParams.selectedTags;
    return encodeParams(removeUndefinedObjectItems(urlParams), false);
};

export const decomposeFilterValue = filterValue => {
    if (typeof(filterValue) === 'string' && filterValue.startsWith('in:')) {
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
            const convertedToInt = parseInt(parsed[key], 10);
            const typeHandledParam = isNaN(convertedToInt) ? parsed[key] : convertedToInt;
            const bracketIndex = key.search(/\[.*\]/);
            if (bracketIndex > 0) {
                const objParent = key.slice(0, bracketIndex);
                const objKey = key.slice(bracketIndex + 1, -1);
                res[objParent] = {
                    ...res[objParent],
                    [objKey]: decomposeFilterValue(typeHandledParam)
                };
            } else {
                res[key] = typeHandledParam;
            }
        }
    });
    return res;
};

export const buildFilterChips = (filters, search, searchChipLabel = 'Search') => {

    let filterConfig = [];
    const buildChips = (filters, category) => {
        if (multiValueFilters.includes(category)) {
            const filterValues = filters[category] && (typeof(filters[category]) === 'string' && filters[category].split(',')
                || filters[category]) || [];
            return filterValues.map(value => ({
                name: value,
                id: category,
                value
            }));
        } else {
            const { values } = filterCategories[category];

            if (!filters[category]) {
                return [];
            }

            return [].concat(filters[category]).map(filterValue => {
                const match = values.find(
                    item =>
                        item.value.toString() === filterValue.toString()
                );
                return {
                    name: match.label,
                    value: filterValue,
                    id: match.value
                };
            });
        }
    };

    const processFilters = () => {
        let categories = Object.keys(filters).filter(
            item =>
                filters[item] !== '' && [].concat(filters[item]).length !== 0
        );
        filterConfig = filterConfig.concat(
            categories.map(category => {
                const label = category === 'installed_evra' && 'Package version' || filterCategories[category].label;
                return {
                    category: label,
                    id: category,
                    chips: buildChips(filters, category)
                };
            })
        );
    };

    const processSearch = () => {
        filterConfig = filterConfig.concat([
            {
                category: searchChipLabel,
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

        //we need explicitly remove 'undefined' filters for safety
        Object.keys(newState.filter).forEach(
            (key) =>
                (newState.filter[key] === undefined ||
                    newState.filter[key] === '') &&
                delete newState.filter[key]
        );
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

export const createOSColumn = ({ osName, rhsm }) => (rhsm === '' || rhsm === undefined) && osName || (
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

export const removeUndefinedObjectKeys = (selectedRows) => Object.keys(selectedRows).filter(row => selectedRows[row]);

export const prepareEntitiesParams = (parameters) => {
    const offset = parameters.offset || getOffsetFromPageLimit(parameters.page || 1, parameters.perPage || 20);
    const limit = parameters.limit || getLimitFromPageSize(parameters.perPage || 20);

    const apiParams = { ...parameters, offset, limit };

    //we need explicitly remove 'undefined' parameters for safety
    return removeUndefinedObjectItems(apiParams);
};

export const filterRemediatableSystems = result => ({
    data: result?.data.filter(system => {
        const {
            packages_installed: installedPckg,
            packages_updatable: updatablePckg,
            rhba_count: rhba,
            rhsa_count: rhsa,
            rhea_count: rhea
        } = system.attributes || {};

        const isDisabled = updatablePckg === 0 || [installedPckg, rhba, rhsa, rhea].every(count => count === 0);

        return !isDisabled;
    })
});

export const filterRemediatablePackageSystems = result => ({ data: result.data.filter(system => system.updatable) });

export const persistantParams = (patchParams, decodedParams) => {
    const persistantParams = { ...patchParams, ...decodedParams };
    return (
        {
            page: Number(persistantParams.page || 1),
            perPage: Number(persistantParams.perPage || 20),
            ...(persistantParams.sort && {
                sortBy: {
                    key: persistantParams.sort.replace(/^-/, ''),
                    direction: persistantParams.sort.match(/^-/) ? 'desc' : 'asc'
                }
            })
        }
    );
};

export const handleLongSynopsis = (synopsis) => {
    return (
        <LinesEllipsis
            text={synopsis}
            maxLine='1'
            ellipsis='(...)'
            trimRight
            basedOn='letters'
        />
    );
};

export const isRHAdvisory = (name) => {
    return /^(RHEA|RHBA|RHSA)/.test(name);
};

export const buildTagString = (tag) => {
    return `${tag.category}/${tag.values?.tagKey}=${tag.value?.tagValue}`;
};

export const mapGlobalFilters = (tags, SIDs, workloads = {}) => {
    let tagsInUrlFormat = [];
    tags && tags.forEach((tag, index) => {
        let tagGruop = tag;
        if (typeof tag === 'object') {
            tagGruop = tag?.values.map(value => `tags=${encodeURIComponent(`${tag.category}/${value.tagKey}=${value.value}`)}`);
            tagsInUrlFormat[index] = Array.isArray(tagGruop) && flatten(tagGruop) || tagGruop;
        }
        else {
            tagsInUrlFormat[index] = `tags=${encodeURIComponent(tagGruop)}`;
        }

    });

    const globalFilterConfig = { selectedTags: [], systemProfile: {} };

    globalFilterConfig.systemProfile = {
        ...workloads?.SAP?.isSelected && { sap_system: true },
        ...workloads?.['Ansible Automation Platform']?.isSelected
        && { ansible: { controller_version: 'not_nil' } },
        ...workloads?.['Microsoft SQL']?.isSelected
        && { mssql: { version: 'not_nil' } },
        ...SIDs?.length > 0 && { sap_sids: SIDs }
    };

    tagsInUrlFormat && (globalFilterConfig.selectedTags = tagsInUrlFormat);

    return globalFilterConfig;

};

export const systemsColumnsMerger = (defaultColumns, isPatchSetEnabled) => {
    let lastSeen = defaultColumns.filter(({ key }) => key === 'updated');
    lastSeen = [{ ...lastSeen[0], key: 'last_upload', sortKey: 'last_upload' }];

    let nameAndTag = defaultColumns.filter(({ key }) => key === 'display_name' || key === 'tags');

    return [...nameAndTag, ...systemsListColumns(isPatchSetEnabled), lastSeen[0]];
};

export const convertDateToISO = (dateString)  => {
    const parsedDate = Date.parse(dateString);

    if (isNaN(parsedDate) === false) {
        let date = new Date(parsedDate);

        const tzOffset = -date.getTimezoneOffset();
        const diff = tzOffset >= 0 ? '+' : '-';
        const pad = n => `${Math.floor(Math.abs(n))}`.padStart(2, '0');

        return date.getFullYear() +
                '-' + pad(date.getMonth() + 1) +
                '-' + pad(date.getDate()) +
                'T' + pad(date.getHours()) +
                ':' + pad(date.getMinutes()) +
                ':' + pad(date.getSeconds()) +
                diff + pad(tzOffset / 60) +
                ':' + pad(tzOffset % 60);
    }

    return dateString;
};

export const convertIsoToDate = (isoDate) => {
    if (!isoDate) {
        return '';
    }

    const dateObject = new Date(isoDate);
    return `${dateObject.getFullYear()}-${(dateObject.getMonth() + 1).toString().padStart(2, '0')}` +
        `-${dateObject.getDate().toString().padStart(2, '0')}`;
};

export const filterSelectedActiveSystemIDs = (selectedSystemsObject) => {
    const formValueSystemIDs = [];
    if (typeof selectedSystemsObject === 'object') {
        Object.keys(selectedSystemsObject).forEach((key) => {
            if (selectedSystemsObject[key]) {
                formValueSystemIDs.push(key);
            }
        });
    }

    return formValueSystemIDs;
};

export const buildSelectedSystemsObj = (systemsIDs, formValueSystems) => {

    const mergedSystems = [...systemsIDs, ...filterSelectedActiveSystemIDs(formValueSystems)];

    const assignedSystemsObject = mergedSystems?.reduce((object, system) => {
        object[system] = true;
        return object;
    }, {});

    return assignedSystemsObject;
};

export const objUndefinedToFalse = (object) =>
    Object.keys(object).reduce((modifiedObject, key) => {
        modifiedObject[key] =  object[key] === undefined ? false : object[key];
        return modifiedObject;
    }, {});

export const isObject = (variable) => {
    return (typeof variable === 'object' && variable !== null) ? true : false;
};
