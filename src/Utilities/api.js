import { encodeApiParams } from './Helpers';

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
                throw res;
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
    .catch(res => {
        const error = Promise.resolve(res.json() || {});
        const genericError = {
            title:
                    'There was an error getting data'
        };
        return error.then(error => {
            const result = error.error && { ...genericError, detail: error.error, status: res.status } || genericError;
            throw result ;
        });
    });
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

export const fetchAdvisoryDetailsApi = params => {
    return createApiCall(`/advisories/${params.advisoryName}`, 'get');
};

export const fetchAffectedSystems = params => {
    const { id, ...args } = params;
    return createApiCall(`/advisories/${id}/systems`, 'get', args);
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
