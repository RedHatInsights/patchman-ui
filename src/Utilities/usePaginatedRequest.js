import chunk from 'lodash/chunk';
import { remediationIdentifiers } from '../Utilities/constants';

const REQUEST_CHUNK_SIZE = 100;
const BATCH_REQUEST_SIZE = 5;

/**
* Creates paginated batch of API requests.
* @param {Array} [payload] payload to the API. This array dictates the number of API calls and batches.
* @param {Function} [fetchFunction] function to trigger API call
* @param {Function} [transformerFunction] function to customize API request result
* @returns {paginatedRequest}
* @returns {Array} array resolved Promises with fetched data
*/
const usePaginatedRequest = (payload, fetchFunction, transformerFunction) => {

    const payloadChunks = chunk(payload, REQUEST_CHUNK_SIZE);

    const fetchedData = [];
    const fetchDataGroup = async (batchIndex, payloadModifier) => {
        const groupChunks = payloadChunks.splice(0, 5);
        for (let i = 0; i < groupChunks.length; i++) {
            const res = await fetchFunction({
                ...payloadModifier(groupChunks[i]),
                limit: REQUEST_CHUNK_SIZE,
                offset: ((batchIndex * BATCH_REQUEST_SIZE) + i) * 100
            }).then(result => transformerFunction(result, remediationIdentifiers.advisory));

            fetchedData.push(res);
        }
    };

    const paginatedRequest = async (payloadModifier) => {
        const batchRequests = [];
        for (let i = 0; i < Math.ceil(payloadChunks.length / BATCH_REQUEST_SIZE); i++) {
            batchRequests.push(
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(fetchDataGroup(i, payloadModifier));
                    }, 100);
                })
            );
        }

        await Promise.all(batchRequests);

        return fetchedData;
    };

    return paginatedRequest;
};

export default usePaginatedRequest;
