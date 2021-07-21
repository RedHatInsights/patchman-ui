import React from 'react';
import propTypes from 'prop-types';
import { InvalidObject } from '@redhat-cloud-services/frontend-components/InvalidObject';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';
import { SkeletonTable } from '@redhat-cloud-services/frontend-components/SkeletonTable';
import { NotConnected } from '@redhat-cloud-services/frontend-components/NotConnected';
import { LockIcon } from '@patternfly/react-icons';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const ErrorHandler = ({ code, ErrorState, EmptyState }) => {

    switch (code) {
        case 204:
            return <NotConnected />;
        case 401:
            return <NotAuthorized
                icon={LockIcon}
                title={intl.formatMessage(messages.labelsNotAuthorizedTitle)}
                description={intl.formatMessage(messages.labelsNotAuthorizedDescription)}
                prevPageButtonText={intl.formatMessage(messages.labelsReturnToPreviousPage)}
                toLandingPageText={intl.formatMessage(messages.labelsReturnToLandingPage)}
            />;

        case 403:
            return <NotAuthorized
                icon={LockIcon}
                title={intl.formatMessage(messages.labelsNotAuthorizedTitle)}
                description={intl.formatMessage(messages.labelsNotAuthorizedDescription)}
                prevPageButtonText={intl.formatMessage(messages.labelsReturnToPreviousPage)}
                toLandingPageText={intl.formatMessage(messages.labelsReturnToLandingPage)}
            />;

        case 404:
            return <InvalidObject />;

        case 500:
        case 502:
        case 503:
            return <Unavailable />;

        default:
            return ErrorState && <ErrorState />
                || EmptyState && <EmptyState />
                || <SkeletonTable colSize={5} rowSize={20} /> ;
    }
};

ErrorHandler.propTypes = {
    code: propTypes.number,
    ErrorState: propTypes.element,
    EmptyState: propTypes.element
};

export default ErrorHandler;
