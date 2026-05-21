import { useCallback } from 'react';
import { fetchGroupsByIds } from '../api/api';

const fetchGroupNamesById = async (groupIds) => {
  if (groupIds.length === 0) {
    return {};
  }

  const { results = [] } = await fetchGroupsByIds(groupIds);
  return Object.fromEntries(
    results.filter((group) => group?.id && group?.name).map((group) => [group.id, group.name]),
  );
};

/**
 * Resolves hostGroupFilter group IDs to names
 */
export const useHostGroupFilter = () => {
  const resolveHostGroupFilter = useCallback(async (hostGroupFilter) => {
    if (!Array.isArray(hostGroupFilter) || hostGroupFilter.length === 0) {
      return [];
    }

    const idToName = await fetchGroupNamesById(hostGroupFilter);

    return hostGroupFilter.map((value) => idToName[value] ?? value);
  }, []);

  return resolveHostGroupFilter;
};
