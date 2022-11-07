import { SystemProfileApi } from '@redhat-cloud-services/host-inventory-client';
import axios from './axiosInterceptors';
import { encodeApiParams, prepareEntitiesParams } from './Helpers';

const INVENTORY_API_BASE = '/api/inventory/v1';

export function createApiCall(
    endpoint,
    method,
    parameters = undefined,
    data = undefined,
    requestConfig = undefined
) {
    if (parameters && method === 'get') {
        endpoint = endpoint.concat(encodeApiParams(parameters));
    }

    let result = axios({
        method,
        url: '/api/patch/v2' + endpoint,
        withCredentials: true,
        data,
        ...requestConfig
    });

    return result;
}

const systemProfile = new SystemProfileApi(undefined, INVENTORY_API_BASE, axios);

export const fetchApplicableAdvisoriesApi = params => {
    return createApiCall('/advisories', 'get', params);
};

export const fetchApplicableSystemAdvisoriesApi = params => {
    let { id, ...allParams } = params;
    return createApiCall(`/systems/${id}/advisories`, 'get', allParams);
};

export const fetchSystems = params => {
    return createApiCall('/systems', 'get', prepareEntitiesParams(params));
};

export const fetchSystemDetails = id => {
    return createApiCall(`/systems/${id}`, 'get');
};

export const fetchAdvisoryDetailsApi = params => {
    return createApiCall(`/advisories/${params.advisoryName}`, 'get');
};

export const fetchPackageDetailsApi = params => {
    return createApiCall(`/packages/${params.packageName}`, 'get');
};

export const fetchApplicablePackagesApi = params => {
    let { id, ...allParams } = params;
    return createApiCall(`/systems/${id}/packages`, 'get', allParams);
};

export const fetchAdvisorySystems = params => {
    const { id, ...args } = params;
    return createApiCall(`/advisories/${id}/systems`, 'get', prepareEntitiesParams(args));
};

export const fetchPackageSystems = params => {
    const { package_name: packageName, ...args } = params;
    return createApiCall(`/packages/${packageName}/systems`, 'get', prepareEntitiesParams(args));
};

export const fetchPackageVersions = params => {
    const { package_name: packageName, ...args } = params;
    return createApiCall(`/packages/${packageName}/versions`, 'get', args);
};

export const fetchPackagesList = params => {
    const { systems_updatable: systemsUpdatable } = params.filter;

    // we have to reset systems_updatable filter to include all filters when we want to show all the data
    if (Array.isArray(systemsUpdatable) && systemsUpdatable.length === 2) {
        const paramsWithoutSystemsUpdatable = JSON.parse(JSON.stringify(params));
        delete paramsWithoutSystemsUpdatable.filter.systems_updatable;

        return createApiCall('/packages', 'get', paramsWithoutSystemsUpdatable);
    }

    return createApiCall('/packages', 'get', params);
};

export const fetchCvesInfo = async ({ cveIds }) => {

    const result = await fetch(`/api/vulnerability/v1/vulnerabilities/cves?limit=${cveIds && cveIds.length}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cve_list: cveIds })
    }).then(res => res.json()).then(data => data).catch(err => err);

    return result;
};

export const fetchViewAdvisoriesSystems = async (input) => {
    const result = await fetch(`/api/patch/v1/views/advisories/systems`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(input)
    }).then(res => res.json()).then(data => data).catch(err => err);

    return result;
};

const fetchFile = (params, endpoint, type) => {
    endpoint = endpoint.concat(encodeApiParams(params));
    return fetch('/api/patch/v1' + endpoint, {
        method: 'get',
        credentials: 'include',
        headers: { accept: type }
    }).then(res => res.text()).catch(err => err);
};

export const exportAdvisoriesCSV = params => {
    let endpoint = '/export/advisories';
    return fetchFile(params, endpoint, 'text/csv');
};

export const exportAdvisoriesJSON = params => {
    let endpoint = '/export/advisories';
    return fetchFile(params, endpoint, 'application/json');
};

export const exportSystemsCSV = params => {
    let endpoint = '/export/systems';
    return fetchFile(params, endpoint, 'text/csv');
};

export const exportSystemsJSON = params => {
    let endpoint = '/export/systems';
    return fetchFile(params, endpoint, 'application/json');
};

export const exportPackagesCSV = params => {
    let endpoint = '/export/packages';
    return fetchFile(params, endpoint, 'text/csv');
};

export const exportPackagesJSON = params => {
    let endpoint = '/export/packages';
    return fetchFile(params, endpoint, 'application/json');
};

export const exportAdvisorySystemsCSV = (params, advisoryId) => {
    let endpoint = `/export/advisories/${advisoryId}/systems`;
    return fetchFile(params, endpoint, 'text/csv');
};

export const exportAdvisorySystemsJSON = (params, advisoryId) => {
    let endpoint = `/export/advisories/${advisoryId}/systems`;
    return fetchFile(params, endpoint, 'application/json');
};

export const exportSystemAdvisoriesCSV = (params, systemName) => {
    let endpoint = `/export/systems/${systemName}/advisories`;
    return fetchFile(params, endpoint, 'text/csv');
};

export const exportSystemAdvisoriesJSON = (params, systemName) => {
    let endpoint = `/export/systems/${systemName}/advisories`;
    return fetchFile(params, endpoint, 'application/json');
};

export const exportSystemPackagesCSV = (params, systemName) => {
    let endpoint = `/export/systems/${systemName}/packages`;
    return fetchFile(params, endpoint, 'text/csv');
};

export const exportSystemPackagesJSON = (params, systemName) => {
    let endpoint = `/export/systems/${systemName}/packages`;
    return fetchFile(params, endpoint, 'application/json');
};

export const exportPackageSystemsCSV = (params, packageName) => {
    let endpoint = `/export/packages/${packageName}/systems`;
    return fetchFile(params, endpoint, 'text/csv');
};

export const exportPackageSystemsJSON = (params, packageName) => {
    let endpoint = `/export/packages/${packageName}/systems`;
    return fetchFile(params, endpoint, 'application/json');
};

export const assignSystemPatchSet = (payload) => {
    return createApiCall(`/baselines`, 'put', null, payload);
};

export const fetchPatchSets = params => {
    return createApiCall(`/baselines`, 'get', params);
};

export const updatePatchSets = (payload, id) => {
    return createApiCall(`/baselines/${id}`, 'put', null, payload);
};

export const deletePatchSet = patchSetID => {
    return createApiCall(`/baselines/${patchSetID}`, 'delete');
};

export const fetchPatchSet = id => {
    return createApiCall(`/baselines/${id}`, 'get');
};

export const fetchPatchSetSystems = (id, params) => {
    return createApiCall(`/baselines/${id}/systems`, 'get', params);
};

export const removePatchSetApi = (payload) => {
    return createApiCall('/baselines/systems/remove', 'post', null, payload);
};

export const getOperatingSystems = () => {
    return systemProfile.apiSystemProfileGetOperatingSystem();
};

export const fetchViewSystemsAdvisories = async (input) => {
    const result = await fetch(`/api/patch/v1/views/systems/advisories`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(input)
    }).then(res => res.json()).then(data => data);

    return result;
};

export const fetchIDs = (endpoint, queryParams) => {
    return createApiCall(endpoint, 'get', queryParams);
}