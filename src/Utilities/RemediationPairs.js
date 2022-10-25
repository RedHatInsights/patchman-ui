import chunk from 'lodash/chunk';

const REQUEST_CHUNK_SIZE = 1000;
const BATCH_REQUEST_SIZE = 5;
const REQUEST_INTERVAL = 15000; //15 econds. AKAMAI allowed life for 5 API calls

const fetchDataCallback  = (endpoint) => (input) =>
    fetch(`/api/patch/v1/views${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(input)
    }).then(result =>
        result.status === 200
            ? result.json()
            : Promise.reject(result.statusText)
    );

export const transformPairs = (input) => {
    return {
        issues: Object.keys(input?.data || {}).map(advisory => {
            return {
                id: `patch-advisory:${advisory}`,
                description: advisory,
                systems: input.data[advisory]
            };
        }
        )
    };
};

const transformSystemsPairs = (input) => {
    const pairs = [];
    Object.entries(input.data).map(
        ([systemID, advisories]) => {
            advisories.map(advisory => {
                const pairID = `patch-advisory:${advisory}`;
                const index = pairs.findIndex(pair => pair.id === pairID);
                if (index >= 0) {
                    pairs[index].systems.push(systemID);
                } else {
                    pairs.push(
                        {
                            id: pairID,
                            description: advisory,
                            systems: [systemID]
                        }
                    );
                }
            });
        });

    return { issues: pairs };
};

const batchRequest = async (
    payload,
    { responseTransformer, dataFetcher, payloadModifier }
) => {

    const payloadChunks = chunk(payload, REQUEST_CHUNK_SIZE);

    const paginatedRequest = async (batchIndex, groupChunks) => {
        const requests = [];
        for (let i = 0; i < groupChunks.length; i++) {
            requests.push(
                await dataFetcher({
                    ...payloadModifier(payload),
                    limit: REQUEST_CHUNK_SIZE,
                    offset: ((batchIndex * BATCH_REQUEST_SIZE) + i) * REQUEST_CHUNK_SIZE
                }
                ).then(result => responseTransformer(result))
            );
        }

        return await Promise.all(requests);;
    };

    const batchRequests = [];
    for (let i = 0; i < Math.ceil(payloadChunks.length / BATCH_REQUEST_SIZE); i++) {
        batchRequests.push(
            new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        const groupChunks = payloadChunks.splice(0, 5);
                        resolve(await paginatedRequest(i, groupChunks));
                    }
                    catch {
                        reject('Loading issues failed');
                    }
                }, i === 0 ? 0 : REQUEST_INTERVAL);
            })
        );
    }

    return await Promise.all(batchRequests).then(([apiResults] = [[]]) =>
        ({
            status: 'resolved',
            result: apiResults.reduce(
                (prev, current) => ({ issues: prev.issues.concat(current?.issues || []) }),
                { issues: [] })
        })
    ).catch(error => ({
        status: 'rejected',
        error
    }));
};

onmessage = async ({ data = {} } = {}) => {
    const { remediationType, areAllSelected, payload = [] } = data;
    const shouldMapSystems = remediationType === 'systems' && !areAllSelected;

    const endpoint = shouldMapSystems ? '/systems/advisories' : '/advisories/systems';
    const responseTransformer = shouldMapSystems ? transformSystemsPairs : transformPairs;

    const payloadModifier = (payload) => (!areAllSelected ? { [remediationType]: payload } : {});

    const result = await batchRequest(
        payload,
        {
            dataFetcher: fetchDataCallback(endpoint),
            payloadModifier,
            responseTransformer
        }
    );

    postMessage(result);
};
