import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import propTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import { Spinner } from '@patternfly/react-core';
import { spinnerSize } from '@patternfly/react-core/dist/js/components/Spinner/Spinner';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const AsyncRemediationButton = ({ remediationProvider, isDisabled }) => {
    const dispatch = useDispatch();

    const handleRemediationSuccess = res => {
        dispatch(addNotification(res.getNotification()));
    };

    return (
        <AsyncComponent
            appName="remediations"
            module="./RemediationButton"
            fallback={<Spinner size={spinnerSize.lg} />}
            dataProvider={remediationProvider}
            onRemediationCreated={handleRemediationSuccess}
            isDisabled={isDisabled}
            isLoading
        >
            {intl.formatMessage(messages.labelsRemediate)}
        </AsyncComponent>
    );
};

AsyncRemediationButton.propTypes = {
    remediationProvider: propTypes.func,
    isDisabled: propTypes.bool
};

export default AsyncRemediationButton;
