export const fetchApplicableSystems = () => {
    return fetch('/api/patch/v1/advisories', {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Methods': 'POST, GET'
        }
    })
    .then(res => res.json())
    .then(res => res);
};
