import { useMemo } from 'react';
import { usePermissionsWithContext } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import { useSelfAccessCheck } from '@project-kessel/react-kessel-access-check';
import { useFetchDefaultWorkspaceId } from './useKesselWorkspaces';
import useFeatureFlag from './useFeatureFlag';
import { featureFlags } from '../constants';

export const PERMISSION_MAP = {
  'patch:*:read': 'patch_system_view',
  'patch:*:*': 'patch_system_edit',
  'patch:template:write': 'patch_template_edit',
};

const getKesselAccessCheckParams = (permissionMap, requiredPermissions, workspaceId) => {
  const resources = requiredPermissions
    .map((perm) => {
      const relation = permissionMap[perm];
      if (!relation) {
        return null;
      }
      return { id: workspaceId, type: 'workspace', relation };
    })
    .filter(Boolean);

  if (resources.length === 0) {
    return { resources: [] };
  }

  if (resources.length === 1) {
    return {
      resource: { id: resources[0].id, type: resources[0].type },
      relation: resources[0].relation,
    };
  }

  return { resources };
};

export const useRbacV1Permissions = (requiredPermissions) => {
  const { hasAccess, isLoading } = usePermissionsWithContext(requiredPermissions);
  return { hasAccess, isLoading };
};

export const useKesselPermissions = (requiredPermissions, enabled = true) => {
  const { workspaceId, isLoading: workspaceLoading } = useFetchDefaultWorkspaceId(enabled);

  const checkParams = useMemo(
    () => getKesselAccessCheckParams(PERMISSION_MAP, requiredPermissions, workspaceId),
    [workspaceId, requiredPermissions],
  );

  const { data, loading, error } = useSelfAccessCheck(checkParams);

  if (workspaceLoading) {
    return { hasAccess: false, isLoading: true };
  }

  if (!workspaceId || error) {
    return { hasAccess: false, isLoading: false };
  }

  const hasAccess = Array.isArray(data)
    ? data.some((check) => check.allowed)
    : (data?.allowed ?? false);

  return { hasAccess, isLoading: loading };
};

const usePermissionCheck = (requiredPermissions) => {
  const isKesselEnabled = useFeatureFlag(featureFlags.kessel_enabled);
  const rbac = useRbacV1Permissions(requiredPermissions);
  const kessel = useKesselPermissions(requiredPermissions, !!isKesselEnabled);

  if (isKesselEnabled === undefined) {
    return { hasAccess: false, isLoading: true };
  }

  return isKesselEnabled ? kessel : rbac;
};

export default usePermissionCheck;
