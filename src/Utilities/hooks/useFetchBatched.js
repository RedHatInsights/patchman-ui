import usePromiseQueue from './usePromiseQueue';

export const useFetchBatched = () => {
  const { isResolving: isLoading, resolve } = usePromiseQueue();

  return {
    isLoading,
    fetchBatched: async (fetchFunction, filter, total, batchSize = 50) => {
      if (!total) {
        total = await fetchFunction({ ...filter, limit: 1 }).then(
          (response) => response?.meta?.total_items || 0,
        );
      }

      const pages = Math.ceil(total / batchSize) || 1;

      const results = resolve(
        [...new Array(pages)].map(
          (_, pageIdx) => () =>
            fetchFunction({
              ...filter,
              offset: pageIdx * batchSize,
              limit: batchSize,
            }),
        ),
      );

      return results;
    },
    fetchBatchedInline: (fetchFunction, list, batchSize = 20) => {
      const pages = Math.ceil(list.length / batchSize) || 1;

      const results = resolve(
        [...new Array(pages)].map(
          (_, pageIdx) => () =>
            fetchFunction(list.slice(batchSize * pageIdx, batchSize * (pageIdx + 1))),
        ),
      );

      return results;
    },
  };
};
