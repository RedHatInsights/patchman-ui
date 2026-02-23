import { useQuery } from '@tanstack/react-query';
import { RBAC_API_BASE_V2 } from '../constants';

const STALE_TIME = 5 * 60 * 1000;

export const useKesselWorkspaces = (options = {}) =>
  useQuery({
    queryKey: ['workspaces', options.type, options.limit],
    queryFn: async () => {
      const response = await fetch(
        `${RBAC_API_BASE_V2}/workspaces/?limit=${options.limit ?? 1000}&type=${options.type ?? 'all'}`,
      );
      if (!response.ok) {
        throw new Error('Failed to fetch workspaces');
      }
      const data = await response.json();
      return data.data || [];
    },
    enabled: options.enabled ?? true,
    staleTime: options.staleTime,
  });

export const useFetchDefaultWorkspaceId = (enabled = true) => {
  const {
    data: workspaces,
    isLoading,
    error,
  } = useKesselWorkspaces({ type: 'default', limit: 1, staleTime: STALE_TIME, enabled });
  const defaultWorkspace = workspaces?.[0];

  return {
    workspaceId: defaultWorkspace?.id,
    isLoading: enabled ? isLoading : false,
    error,
  };
};
