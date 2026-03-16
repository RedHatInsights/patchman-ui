import React from 'react';
import propTypes from 'prop-types';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import usePermissionCheck from '../../Utilities/hooks/usePermissionCheck';

const WithPermission = ({ children, requiredPermissions = [], hide = false }) => {
  const { hasAccess, isLoading } = usePermissionCheck(requiredPermissions);

  if (isLoading) {
    return null;
  }
  return hasAccess ? children : !hide && <NotAuthorized serviceName='patch' />;
};

WithPermission.propTypes = {
  children: propTypes.node,
  requiredPermissions: propTypes.array,
  hide: propTypes.bool,
};

export default WithPermission;
