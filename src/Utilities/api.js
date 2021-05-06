import { encodeApiParams } from './Helpers';
import axios from './axiosInterceptors';

export function createApiCall(
    endpoint,
    method,
    parameters = undefined,
    data = undefined
) {
    if (parameters && method === 'get') {
        endpoint = endpoint.concat(encodeApiParams(parameters));
    }

    let result = window.insights.chrome.auth
    .getUser()
    .then(() =>
        axios({
            method,
            url: '/api/patch/v1' + endpoint,
            withCredentials: true,
            data
        }).then(response => { console.log(response.status); return response; })
    );

    return result;
}

export const fetchApplicableAdvisoriesApi = params => {
    return createApiCall('/advisories', 'get', params);
};

export const fetchApplicableSystemAdvisoriesApi = params => {
    let { id, ...allParams } = params;
    return createApiCall(`/systems/${id}/advisories`, 'get', allParams);
};

export const fetchSystems = params => {
    return createApiCall('/systems', 'get', params);
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
    return createApiCall(`/advisories/${id}/systems`, 'get', args);
};

export const fetchPackageSystems = params => {
    const { id, ...args } = params;
    return createApiCall(`/packages/${id}/systems`, 'get', args);
};

export const fetchPackagesList = params => {
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
    }).then(res => res.json()).then(data => data);

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
    }).then(res => res.json()).then(data => data);

    return result;
};

export const exportAdvisoriesCSV = params => {
    let endpoint = '/export/advisories';
    endpoint = endpoint.concat(encodeApiParams(params));
    return fetch('/api/patch/v1' + endpoint, {
        method: 'get',
        credentials: 'include',
        headers: new Headers({ accept: 'text/csv' })
    }).then(res => res.text());
};

export const exportAdvisoriesJSON = params => {
    let endpoint = '/export/advisories';
    endpoint = endpoint.concat(encodeApiParams(params));
    return fetch('/api/patch/v1' + endpoint, {
        method: 'get',
        credentials: 'include',
        headers: new Headers({ accept: 'application/json' })
    }).then(res => res.json());
};

export const exportSystemsCSV = params => {
    let endpoint = '/export/systems';
    endpoint = endpoint.concat(encodeApiParams(params));
    return fetch('/api/patch/v1' + endpoint, {
        method: 'get',
        credentials: 'include',
        headers: new Headers({ accept: 'text/csv' })
    }).then(res => res.text());
};

export const exportSystemsJSON = params => {
    let endpoint = '/export/systems';
    endpoint = endpoint.concat(encodeApiParams(params));
    return fetch('/api/patch/v1' + endpoint, {
        method: 'get',
        credentials: 'include',
        headers: new Headers({ accept: 'application/json' })
    }).then(res => res.json());
};

export const exportPackagesCSV = params => {
    let endpoint = '/export/packages';
    endpoint = endpoint.concat(encodeApiParams(params));
    return fetch('/api/patch/v1' + endpoint, {
        method: 'get',
        credentials: 'include',
        headers: new Headers({ accept: 'text/csv' })
    }).then(res => res.text());
};

export const exportPackagesJSON = params => {
    let endpoint = '/export/packages';
    endpoint = endpoint.concat(encodeApiParams(params));
    return fetch('/api/patch/v1' + endpoint, {
        method: 'get',
        credentials: 'include',
        headers: new Headers({ accept: 'application/json' })
    }).then(res => res.json());
};
