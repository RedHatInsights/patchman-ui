import React from 'react';
import PropTypes from 'prop-types';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components';
import { usePermissionsWithContext } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';

const AccessWrapper = ({ children }) => {
    const { hasAccess, isLoading } = usePermissionsWithContext([
        'patch:*:*',
        'patch:*:read'
    ]);

    return isLoading ? (
        <Bullseye>
            <Spinner />
        </Bullseye>
    ) : hasAccess ? (
        children
    ) : (
        <NotAuthorized serviceName="patch" />
    );
};

AccessWrapper.propTypes = {
    children: PropTypes.any
};

export default AccessWrapper;
