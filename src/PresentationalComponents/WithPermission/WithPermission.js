import React from 'react';
import propTypes from 'prop-types';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { usePermissionsWithContext } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';

const WithPermission = ({ children, requiredPermissions = [] }) => {
  const { hasAccess, isLoading } = usePermissionsWithContext(requiredPermissions);
  if (!isLoading) {
    return hasAccess ? children : <NotAuthorized serviceName='patch' />;
  } else {
    return '';
  }
};

WithPermission.propTypes = {
  children: propTypes.node,
  requiredPermissions: propTypes.array,
};

export default WithPermission;
