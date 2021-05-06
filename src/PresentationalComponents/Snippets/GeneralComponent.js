import React from 'react';
import { STATUS_NO_REGISTERED_SYSTEMS, STATUS_UNAUTHORIZED, STATUS_REJECTED, STATUS_RESOLVED } from '../../Utilities/constants';
import NoAccessPage from './NoAccess';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import { paths } from '../../Routes';
import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

const GeneralComponent = ({ status, children, EmptyState = null }) => {
    const history = useHistory();

    if (status === STATUS_NO_REGISTERED_SYSTEMS) {
        history.replace(paths.register.to);
    }

    if (status === STATUS_UNAUTHORIZED) {
        return <NoAccessPage />;
    }

    if (status === STATUS_REJECTED) {
        return < Unavailable />;
    }

    if (status === STATUS_RESOLVED && EmptyState !== null) {
        return <EmptyState/>;
    }

    return (<Fragment>
        {children}
    </Fragment>);
};

GeneralComponent.propTypes = {
    status: PropTypes.string,
    EmptyState: PropTypes.element,
    children: PropTypes.element
};

export default GeneralComponent;
