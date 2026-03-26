import { useMemo } from 'react';
import { usePermissionsWithContext } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import { getKesselAccessCheckParams } from '@redhat-cloud-services/frontend-components-utilities/kesselPermissions';
import { useSelfAccessCheck } from '@project-kessel/react-kessel-access-check';
import { useKesselWorkspaceIds } from './useKesselWorkspaceIds';
import useFeatureFlag from './useFeatureFlag';
import { featureFlags } from '../constants';

export const PERMISSION_MAP_HOST_CENTRIC = {
  'patch:*:read': 'patch_system_view',
  'patch:*:*': 'patch_system_edit',
};

export const useRbacV1Permissions = (requiredPermissions) => {
  const { hasAccess, isLoading } = usePermissionsWithContext(requiredPermissions);
  return { hasAccess, isLoading };
};

export const useKesselPermissions = (requiredPermissions, enabled = false) => {
  const {
    workspaceIds,
    isLoading: workspacesLoading,
    error: workspacesError,
  } = useKesselWorkspaceIds(enabled);

  const permissionCheckParams = useMemo(
    () =>
      getKesselAccessCheckParams({
        permissionMap: PERMISSION_MAP_HOST_CENTRIC,
        requiredPermissions,
        resourceIdOrIds: workspaceIds,
      }),
    [workspaceIds],
  );

  const { data, loading, error } = useSelfAccessCheck(permissionCheckParams);

  if (workspacesLoading) {
    return { hasAccess: false, isLoading: true };
  }

  if (permissionCheckParams?.resources?.length === 0) {
    return { hasAccess: true, isLoading: false };
  }

  if (!workspaceIds?.length || workspacesError || error) {
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

  return isKesselEnabled ? kessel : rbac;
};

export default usePermissionCheck;
