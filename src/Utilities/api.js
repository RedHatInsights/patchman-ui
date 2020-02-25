import { flattenFilters, encodeQueryParams } from './Helpers';

export function createApiCall(
    endpoint,
    method,
    parameters = undefined,
    data = undefined
) {
    if (parameters && method === 'get') {
        endpoint = endpoint.concat(encodeQueryParams(parameters));
    }

    let result = window.insights.chrome.auth
    .getUser()
    .then(() =>
        fetch('/api/patch/v1' + endpoint, {
            method,
            credentials: 'include',
            body: JSON.stringify(data)
        })
    )
    .then(res => {
        if (!res.ok) {
            const contentType = res.headers.get('content-type');
            if (contentType.indexOf('json') !== -1) {
                throw res.json();
            } else {
                throw new Promise(resolve =>
                    resolve({
                        errors: [
                            { status: res.status, detail: res.statusText }
                        ]
                    })
                );
            }
        }

        return res.json();
    })
    .catch(error => {
        error = Promise.resolve(error || {});
        const genericError = {
            detail:
                    'There was an error getting data. Reload the page and try again'
        };
        return error.then(error => {
            const res = (error.errors && error.errors[0]) || genericError;
            throw { ...res };
        });
    });
    return result;
}

export const fetchApplicableAdvisoriesApi = params => {
    let { filter, ...allParams } = params;
    allParams = { ...allParams, ...flattenFilters(filter) };
    return createApiCall('/advisories', 'get', allParams);
};

export const fetchApplicableSystemAdvisoriesApi = params => {
    let { id, filter, ...allParams } = params;
    allParams = { ...allParams, ...flattenFilters(filter) };
    return createApiCall(`/systems/${id}/advisories`, 'get', allParams);
};

export const fetchSystems = params => {
    return createApiCall('/systems', 'get', params);
};

export const fetchAdvisoryDetailsApi = params => {
    return createApiCall(`/advisories/${params.advisoryName}`, 'get');
};

export const fetchAffectedSystems = params => {
    const { id, ...args } = params;
    return createApiCall(`/advisories/${id}/systems`, 'get', args);
};
