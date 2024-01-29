import usePromiseQueue from './usePromiseQueue';

export const useFetchBatched = () => {
    const { isResolving: isLoading, resolve } = usePromiseQueue();

    return {
        isLoading,
        fetchBatched: (fetchFunction, total, filter, batchSize = 50) => {
            const pages = Math.ceil(total / batchSize) || 1;

            const results = resolve(
                [...new Array(pages)].map(
                    // eslint-disable-next-line camelcase
                    (_, pageIdx) => () =>
                        fetchFunction(filter, { offset: pageIdx + 1, limit: batchSize })
                )
            );

            return results;
        },
        fetchBatchedInline: (fetchFunction, list, batchSize = 20) => {
            const pages = Math.ceil(list.length / batchSize) || 1;

            const results = resolve(
                [...new Array(pages)].map(
                    (_, pageIdx) => () =>
                        fetchFunction(
                            list.slice(batchSize * pageIdx, batchSize * (pageIdx + 1))
                        )
                )
            );

            return results;
        }
    };
};

