import { useMemo } from 'react';
import { usePermissionsWithContext } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import { getKesselAccessCheckParams } from '@redhat-cloud-services/frontend-components-utilities/kesselPermissions';
import { useSelfAccessCheck } from '@project-kessel/react-kessel-access-check';
import { useFetchDefaultWorkspaceId } from './useKesselWorkspaces';
import useFeatureFlag from './useFeatureFlag';
import { featureFlags } from '../constants';

export const PERMISSION_MAP = {
  'patch:*:read': 'patch_system_view',
  'patch:*:*': 'patch_system_edit',
  'patch:template:write': 'patch_template_edit',
};

export const useRbacV1Permissions = (requiredPermissions) => {
  const { hasAccess, isLoading } = usePermissionsWithContext(requiredPermissions);
  return { hasAccess, isLoading };
};

export const useKesselPermissions = (requiredPermissions, enabled = true) => {
  const {
    workspaceId,
    isLoading: workspaceLoading,
    error: workspaceError,
  } = useFetchDefaultWorkspaceId(enabled);

  const checkParams = useMemo(
    () =>
      getKesselAccessCheckParams({
        permissionMap: PERMISSION_MAP,
        requiredPermissions,
        resourceIdOrIds: workspaceId,
      }),
    [workspaceId, requiredPermissions],
  );

  const { data, loading, error } = useSelfAccessCheck(checkParams);

  if (workspaceLoading) {
    return { hasAccess: false, isLoading: true };
  }

  if (checkParams?.resources?.length === 0) {
    return { hasAccess: true, isLoading: false };
  }

  if (!workspaceId || workspaceError || error) {
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
