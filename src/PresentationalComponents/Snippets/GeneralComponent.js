import React from 'react';
import { STATUS_NO_REGISTERED_SYSTEMS, STATUS_UNAUTHORIZED, STATUS_REJECTED, STATUS_RESOLVED } from '../../Utilities/constants';
import NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { NoSystemData } from './NoSystemData';

const GeneralComponent = ({ status, children, EmptyState, ErrorState }) => {

    switch (status) {
        case STATUS_NO_REGISTERED_SYSTEMS:
            return <NoSystemData />;
        case STATUS_UNAUTHORIZED:
            return <NotAuthorized serviceName='Patch' />;
        case STATUS_REJECTED:
            return ErrorState !== undefined && <ErrorState/> || <Unavailable />;
        default:
            return (<Fragment>
                {(status === STATUS_RESOLVED && EmptyState !== undefined) && <EmptyState/> || children}
            </Fragment>);;
    }
};

GeneralComponent.propTypes = {
    status: PropTypes.string,
    EmptyState: PropTypes.element,
    ErrorState: PropTypes.element,
    children: PropTypes.element
};

export default GeneralComponent;
