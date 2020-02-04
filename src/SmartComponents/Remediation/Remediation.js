import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
import RemediationButton from '@redhat-cloud-services/frontend-components-remediations/RemediationButton';
import propTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';

const Remediation = ({ remediationProvider }) => {
    const dispatch = useDispatch();
    return (
        <div>
            <RemediationButton
                dataProvider={remediationProvider}
                isDisabled={!remediationProvider()}
                onRemediationCreated={result =>
                    dispatch(addNotification(result.getNotification()))
                }
            >
                Apply
            </RemediationButton>
        </div>
    );
};

Remediation.propTypes = {
    remediationProvider: propTypes.func
};

export default Remediation;
