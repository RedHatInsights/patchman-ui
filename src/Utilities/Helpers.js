import { Flex, FlexItem, Tooltip } from '@patternfly/react-core';
import {
  BugIcon,
  EnhancementIcon,
  FlagIcon,
  InfoCircleIcon,
  SecurityIcon,
} from '@patternfly/react-icons';
import { SortByDirection } from '@patternfly/react-table';
import flatten from 'lodash/flatten';
import findIndex from 'lodash/findIndex';
import pickBy from 'lodash/pickBy';
import qs from 'query-string';
import React from 'react';
import LinesEllipsis from 'react-lines-ellipsis';
import messages from '../Messages';
import AdvisoriesIcon from '../PresentationalComponents/Snippets/AdvisoriesIcon';
import {
  advisorySeverities,
  defaultCompoundSortValues,
  filterCategories,
  multiValueFilters,
} from './constants';
import { intl } from './IntlProvider';
import { generateFilter } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import { InsightsLink } from '@redhat-cloud-services/frontend-components/InsightsLink';

export const removeUndefinedObjectItems = (originalObject) => {
  const newObject = JSON.parse(JSON.stringify(originalObject));
  Object.keys(newObject).forEach((key) => newObject[key] === undefined && delete newObject[key]);
  return newObject;
};

export const convertLimitOffset = (limit, offset) => [offset / limit + 1, limit];

export const transformPairs = (input, remediationIdentifier) => {
  let issues = [];

  const advisoriesNames = Object.keys(input?.data || {});
  for (let i = 0; i < advisoriesNames.length; i++) {
    if (input.data[advisoriesNames[i]][0] !== '') {
      issues.push({
        id: `${remediationIdentifier}:${advisoriesNames[i]}`,
        description: advisoriesNames[i],
        systems: input.data[advisoriesNames[i]],
      });
    }
  }

  return { issues };
};

export const createSortBy = (
  header,
  values,
  offset,
  compoundSortValues = defaultCompoundSortValues,
) => {
  if (values) {
    let [column] = values;
    let multiple = values.join();
    let direction = column[0] === '-' ? SortByDirection.desc : SortByDirection.asc;
    Object.keys(compoundSortValues).forEach((col) => {
      Object.keys(compoundSortValues[col]).forEach((dir) => {
        if (compoundSortValues[col][dir] === multiple) {
          column = col;
          direction = dir;
        }
      });
    });

    column = column.replace(/^(-|\+)/, '');
    const index = findIndex(header, (item) => item.key === column);
    let sort = {
      index: index + offset,
      direction,
    };
    return sort;
  }

  return {};
};

export const addOrRemoveItemFromSet = (targetObj, inputArr) => {
  const inputObj = inputArr.reduce(
    (obj, item) => ((obj[item.rowId] = item.value || undefined), obj),
    {},
  );
  const result = { ...targetObj, ...inputObj };
  return result;
};

export const getNewSelectedItems = (selectedItems, currentItems) => {
  let payload = [].concat(selectedItems).map((item) => ({ rowId: item.id, value: item.selected }));
  const mergedSelection = addOrRemoveItemFromSet(currentItems, payload);

  return pickBy(mergedSelection, (v) => !!v);
};

// for expandable rows only
export const getRowIdByIndexExpandable = (arrayOfObjects, index) => arrayOfObjects[index / 2].id;

export const getOffsetFromPageLimit = (page, limit) => page * limit - limit;

export const getLimitFromPageSize = (limit) => limit;

export function truncate(str, max, end) {
  return str.length > max ? (
    <React.Fragment>
      {str.substring(0, max - 1)}
      ...&nbsp;{end}
    </React.Fragment>
  ) : (
    str
  );
}

const findBullets = (description) => {
  let substringIndex = description.search(/:/);
  // + 2 accounts for the 2 new lines to separate the sentence from the start of the bullets
  return substringIndex > 0
    ? description.slice(0, substringIndex + 2) +
        preserveNewlines(description.substring(substringIndex + 2))
    : description;
};

export const truncateDescription = (description, wordLength, setWordLength) =>
  truncate(
    findBullets(description),
    wordLength,
    <a onClick={() => setWordLength(description.length)}>
      {intl.formatMessage(messages.linksReadMore)}
    </a>,
  );

export function createAdvisoriesIcons([rhea, rhba, rhsa, other], type = 'applicable') {
  return (
    <Flex flex={{ default: 'inlineFlex' }} style={{ flexWrap: 'nowrap' }}>
      {[rhea, rhba, rhsa].every((item) => item === 0) && `No ${type} advisories`}
      {rhsa !== 0 && (
        <FlexItem spacer={{ default: 'spacerXs' }}>
          <AdvisoriesIcon tooltipText='Security advisories' count={rhsa} Icon={SecurityIcon} />
        </FlexItem>
      )}
      {rhba !== 0 && (
        <FlexItem spacer={{ default: 'spacerXs' }}>
          <AdvisoriesIcon tooltipText='Bug fixes' count={rhba} Icon={BugIcon} />
        </FlexItem>
      )}
      {rhea !== 0 && (
        <FlexItem spacer={{ default: 'spacerXs' }}>
          <AdvisoriesIcon tooltipText='Enhancements' count={rhea} Icon={EnhancementIcon} />
        </FlexItem>
      )}
      {other !== 0 && (
        <FlexItem spacer={{ default: 'spacerXs' }}>
          <AdvisoriesIcon tooltipText='Other' count={other} Icon={FlagIcon} />
        </FlexItem>
      )}
    </Flex>
  );
}

export function createUpgradableColumn(updatableStatus) {
  switch (updatableStatus) {
    case 'None':
      return intl.formatMessage(messages.labelsColumnsUpToApplicable);
    case 'Applicable':
      return intl.formatMessage(messages.labelsColumnsUpToInstallable);
    case 'Installable':
      return intl.formatMessage(messages.labelsColumnsUpgradable);
  }
}

export function getSeverityByValue(value) {
  // Convert `undefined` to `null`, as utility functions rely on `null` to signify no severity
  const severityValue = value === undefined ? null : value;

  return advisorySeverities.find((item) => item.value === severityValue) || advisorySeverities[0];
}

export const createPackagesColumn = (packageCount, systemID) => (
  <InsightsLink
    to={{
      pathname: `/systems/${systemID}`,
      state: { tab: 'packages' },
    }}
  >
    {packageCount}
  </InsightsLink>
);

export function handlePatchLink(type, name, body) {
  if (location.href.indexOf('inventory') === -1) {
    return <InsightsLink to={`/${type}/${name}`}>{body === undefined ? name : body}</InsightsLink>;
  } else {
    return <a href={`${document.baseURI}insights/patch/${type}/${name}`}>{body || name}</a>;
  }
}

export const arrayFromObj = (items) => Object.values(items).filter((value) => value);

export const remediationProvider = (issues, systems, remediationIdentifier) => {
  issues = [].concat(issues);
  systems = [].concat(systems);
  return issues.length && systems.length
    ? {
        issues: issues.map((item) => ({
          id: `${remediationIdentifier}:${item}`,
          description: item,
        })),
        systems,
      }
    : false;
};

export const remediationProviderWithPairs = (issuePairs, transformFunc, remediationIdentifier) =>
  issuePairs ? transformFunc(issuePairs, remediationIdentifier) : false;

export const getFilterValue = (category, key) => {
  const filterCategory = filterCategories[category];
  if (filterCategory) {
    const filterOption =
      /* some filters don't have constant values */
      (filterCategory?.values || []).find((item) => item.value === key);
    return filterOption || { apiValue: key };
  } else {
    return { apiValue: key };
  }
};

export const encodeParams = (parameters, shouldTranslateKeys) => {
  const calculateWorkloads = (systemProfile) => {
    let result = '';
    Object.entries(generateFilter({ system_profile: systemProfile })).forEach((entry) => {
      const [key, value] = entry;
      result = `${result}&${key}=${value}`;
    });

    return result;
  };

  const flattenFilters = (filter) => {
    let result = {};
    filter &&
      Object.entries(filter).forEach((item) => {
        let [key, value] = item;
        value = (shouldTranslateKeys && getFilterValue(key, value).apiValue) || value;
        const operator =
          [].concat(value).length > 1 || multiValueFilters.includes(key) ? 'in:' : '';
        result = {
          ...result,
          [`filter[${key}]`]: `${operator}${String(value)}`,
        };
      });
    return result;
  };

  let { filter, systemProfile = {}, group_name, ...allParams } = parameters;

  allParams = {
    ...allParams,
    ...flattenFilters({ ...filter, ...(group_name ? { group_name } : {}) }),
  };
  let params = [];
  Object.keys(allParams).forEach((key) => {
    const argKey = encodeURIComponent(key);
    const argValue = encodeURIComponent(allParams[key]);

    if (!['', undefined, null].some((value) => [argValue, key].includes(value))) {
      if (!['selectedTags', 'systemProfile'].includes(key)) {
        params.push(argKey.concat('=').concat(argValue));
      } else if (key === 'selectedTags') {
        params.push.apply(params, allParams[key]);
      }
    }
  });

  const workloadsFilter =
    (Object.keys(systemProfile).length > 0 && calculateWorkloads(systemProfile)) || '';

  return '?'.concat(params.join('&')).concat(workloadsFilter);
};

export const encodeApiParams = (parameters) => encodeParams(parameters, true);

export const encodeURLParams = (parameters) => {
  delete parameters.id;
  let urlParams = { ...parameters };
  delete urlParams.selectedTags;
  return encodeParams(removeUndefinedObjectItems(urlParams), false);
};

export const decomposeFilterValue = (filterValue, parser) => {
  if (parser) {
    return parser(filterValue);
  } else if (typeof filterValue === 'string' && filterValue.startsWith('in:')) {
    const values = filterValue.slice(3);
    return values.split(',');
  } else {
    return filterValue;
  }
};

const getApiValueFromFilterString = (value) => {
  if (Array.isArray(value)) {
    return value.map(getApiValueFromFilterString);
  }

  return value === 'null' ? null : value;
};

export const decodeQueryparams = (queryString, parsers = {}) => {
  const parsed = qs.parse(queryString);
  const res = {};
  Object.keys(parsed).forEach((key) => {
    if (!key.startsWith('filter[system_profile]')) {
      const convertedToInt = parseInt(parsed[key], 10);
      const typeHandledParam = isNaN(convertedToInt) ? parsed[key] : convertedToInt;
      const bracketIndex = key.search(/\[.*\]/);
      if (bracketIndex > 0) {
        const objParent = key.slice(0, bracketIndex);
        const objKey = key.slice(bracketIndex + 1, -1);
        const parser = parsers[objKey];
        const decomposedValue = decomposeFilterValue(typeHandledParam, parser);
        const normalizedValue =
          objParent === 'filter' ? getApiValueFromFilterString(decomposedValue) : decomposedValue;
        res[objParent] = {
          ...res[objParent],
          [objKey]: normalizedValue,
        };
      } else {
        res[key] = typeHandledParam;
      }
    }
  });
  return res;
};

const getFilterStringFromApi = (value) => (value === null ? 'null' : String(value));

export const buildFilterChips = (filters, search, searchChipLabel = 'Search', parsers = {}) => {
  let filterConfig = [];
  const buildChips = (filters, category) => {
    if (parsers[category]) {
      return parsers[category](filters[category]);
    } else if (multiValueFilters.includes(category)) {
      const filterValues =
        (filters[category] &&
          ((typeof filters[category] === 'string' && filters[category].split(',')) ||
            filters[category])) ||
        [];
      // Leave the raw value intact (including `null`) so chips render and removal logic works
      return filterValues.map((value) => ({
        name: value,
        id: category,
        value,
      }));
    } else {
      const { values } = filterCategories[category];

      // Previously we dropped truthy-but-falsy values like `null`, which hid the severity chip
      if (filters[category] === undefined || filters[category] === '') {
        return [];
      }

      return [].concat(filters[category]).map((filterValue) => {
        const match = values.find(
          (item) => getFilterStringFromApi(item.value) === getFilterStringFromApi(filterValue),
        );
        return {
          name: match.label,
          value: filterValue,
          id: match.value,
        };
      });
    }
  };

  const processFilters = () => {
    let categories = Object.keys(filters).filter(
      (item) => filters[item] !== '' && [].concat(filters[item]).length !== 0,
    );
    filterConfig = filterConfig.concat(
      categories.map((category) => {
        const label =
          (category === 'installed_evra' && 'Package version') || filterCategories[category].label;
        return {
          category: label,
          id: category,
          chips: buildChips(filters, category),
        };
      }),
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
            value: search,
          },
        ],
      },
    ]);
  };

  filters && processFilters();
  search && processSearch();

  return filterConfig;
};

export const buildOsFilter = (osFilter = {}) => {
  const osVersions = Object.entries(osFilter).reduce(
    (acc, [, osGroupValues]) => [
      ...acc,
      ...Object.entries(osGroupValues)
        .filter(([, value]) => value === true)
        .map(([key]) => {
          const keyParts = key.split('-');
          return keyParts.slice(0, keyParts.length - 2) + ' ' + keyParts[keyParts.length - 1];
        }),
    ],
    [],
  );

  return osVersions.length > 0
    ? {
        os: osVersions.join(','),
      }
    : {};
};

export const buildApiFilters = (patchFilters, inventoryFilters) => ({
  ...patchFilters,
  ...(Array.isArray(inventoryFilters.hostGroupFilter) && inventoryFilters.hostGroupFilter.length > 0
    ? { group_name: inventoryFilters.hostGroupFilter }
    : {}),
  ...buildOsFilter(inventoryFilters?.osFilter),
});

export const changeListParams = (oldParams, newParams) => {
  const newState = { ...oldParams, ...newParams };
  const offsetResetParams = ['filter', 'search', 'limit', 'selectedTags'];
  if (offsetResetParams.some((item) => newParams.hasOwnProperty(item))) {
    newState.offset = 0;
  }

  if (newParams.hasOwnProperty('filter')) {
    newState.filter = { ...oldParams.filter, ...newParams.filter };

    // we need explicitly remove 'undefined' filters for safety
    Object.keys(newState.filter).forEach(
      (key) =>
        (newState.filter[key] === undefined || newState.filter[key] === '') &&
        delete newState.filter[key],
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
  return input && input.replace(new RegExp('\\n\\n(?=.*[\\n\\n])', 'g'), '\n');
}

export function sortCves(cves, index, direction) {
  const sortedCves = cves.sort(({ cells: aCells }, { cells: bCells }) => {
    const aCell = aCells[index].value || aCells[index].title;
    const bCell = bCells[index].value || bCells[index].title;

    const stringA = aCell.toString().toUpperCase();
    const stringB = bCell.toString().toUpperCase();

    return stringA.localeCompare(stringB);
  });

  return {
    sortBy: { index, direction },
    sortedCves: direction === SortByDirection.asc ? sortedCves : sortedCves.reverse(),
  };
}

export const createOSColumn = ({ osName, rhsm }) =>
  !rhsm ? (
    osName
  ) : (
    <Tooltip
      content={intl.formatMessage(messages.textLockVersionTooltip, {
        lockedVersion: rhsm,
      })}
    >
      <Flex flex={{ default: 'inlineFlex' }}>
        <FlexItem spacer={{ default: 'spacerSm' }}>{osName}</FlexItem>
        <FlexItem spacer={{ default: 'spacerSm' }}>
          <InfoCircleIcon size='sm' color='var(--pf-t--global--color--status--info--100)' />
        </FlexItem>
      </Flex>
    </Tooltip>
  );

export const removeUndefinedObjectKeys = (selectedRows) =>
  Object.keys(selectedRows).filter((row) => selectedRows[row]);

export const prepareEntitiesParams = (parameters) => {
  const offset =
    parameters.offset || getOffsetFromPageLimit(parameters.page || 1, parameters.perPage || 20);
  const limit = parameters.limit || getLimitFromPageSize(parameters.perPage || 20);

  const apiParams = { ...parameters, offset, limit };

  // we need explicitly remove 'undefined' parameters for safety
  return removeUndefinedObjectItems(apiParams);
};

export const filterRemediatableSystems = (result) => ({
  data: result?.data.filter((system) => {
    const {
      packages_installed: installedPckg,
      packages_updatable: updatablePckg,
      rhba_count: rhba,
      rhsa_count: rhsa,
      rhea_count: rhea,
    } = system.attributes || {};

    const isDisabled =
      updatablePckg === 0 || [installedPckg, rhba, rhsa, rhea].every((count) => count === 0);

    return !isDisabled;
  }),
});

export const filterRemediatablePackageSystems = (result) => ({
  data: result.data.filter((system) => system.updatable),
});

export const persistantParams = (patchParams, decodedParams) => {
  const persistantParams = { ...patchParams, ...decodedParams };

  if (typeof persistantParams.sort === 'string' && persistantParams.sort.match(/-?groups/)) {
    // "group_name" is the sort key used by Inventory (requires translation between Patch and Inventory)
    persistantParams.sort = persistantParams.sort.replace('groups', 'group_name');
  }

  return {
    page: Number(persistantParams.page || 1),
    perPage: Number(persistantParams.perPage || 20),
    ...(persistantParams.sort && {
      sortBy: {
        key: persistantParams.sort.replace(/^-/, ''),
        direction: persistantParams.sort.match(/^-/) ? 'desc' : 'asc',
      },
    }),
  };
};

export const handleLongSynopsis = (synopsis) => (
  <LinesEllipsis text={synopsis} maxLine='1' ellipsis='(...)' trimRight basedOn='letters' />
);

export const isRHAdvisory = (name) => /^(RHEA|RHBA|RHSA)/.test(name);

export const buildTagString = (tag) =>
  `${tag.category}/${tag.values?.tagKey}=${tag.value?.tagValue}`;

export const mapGlobalFilters = (tags, workloads = {}) => {
  let tagsInUrlFormat = [];
  tags &&
    tags.forEach((tag, index) => {
      let tagGruop = tag;
      if (typeof tag === 'object') {
        tagGruop = tag?.values.map(
          (value) => `tags=${encodeURIComponent(`${tag.category}/${value.tagKey}=${value.value}`)}`,
        );
        tagsInUrlFormat[index] = (Array.isArray(tagGruop) && flatten(tagGruop)) || tagGruop;
      } else {
        tagsInUrlFormat[index] = `tags=${encodeURIComponent(tagGruop)}`;
      }
    });

  const globalFilterConfig = { selectedTags: [], systemProfile: {} };

  globalFilterConfig.systemProfile = {
    ...(workloads?.SAP?.isSelected && { sap_system: true }),
    ...(workloads?.['Ansible Automation Platform']?.isSelected && {
      ansible: { controller_version: 'not_nil' },
    }),
    ...(workloads?.['Microsoft SQL']?.isSelected && {
      mssql: { version: 'not_nil' },
    }),
  };

  tagsInUrlFormat && (globalFilterConfig.selectedTags = tagsInUrlFormat);

  return globalFilterConfig;
};

export const isObject = (variable) =>
  typeof variable === 'object' && variable !== null ? true : false;

export const findFilterData = (optionName, options) =>
  options.find((item) => item.label === optionName);
