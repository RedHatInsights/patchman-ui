import { prepareFilters } from './Helpers';

export function createApiCall(
    endpoint,
    method,
    parameters = undefined,
    data = undefined
) {
    if (parameters && method === 'get') {
        let params = Object.keys(parameters)
        .map(key => [
            encodeURIComponent(key)
            .concat('=')
            .concat(encodeURIComponent(parameters[key]))
        ])
        .join('&');
        endpoint = endpoint.concat('?').concat(params);
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
    allParams = { ...allParams, ...prepareFilters(filter) };
    return createApiCall('/advisories', 'get', allParams);
};

export const fetchApplicableSystemAdvisoriesApi = params => {
    let { id, filter, ...allParams } = params;
    allParams = { ...allParams, ...prepareFilters(filter) };
    return createApiCall(`/systems/${id}/advisories`, 'get', allParams);
};

export const fetchSystems = params => {
    return createApiCall('/systems', 'get', params);
};

export const fetchAdvisoryDetailsApi = params => {
    return createApiCall(`/advisories/${params.advisoryName}`, 'get');
};

export const fetchAffectedSystems = params => {
    const { id } = params;
    return createApiCall(`/advisories/${id}/systems`);
};
