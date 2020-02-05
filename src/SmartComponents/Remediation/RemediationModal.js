import * as ReactCore from '@patternfly/react-core';
import * as pfReactTable from '@patternfly/react-table';
import propTypes from 'prop-types';
import React from 'react';

function getLoader() {
    return (
        (insights.experimental && insights.experimental.loadRemediations) ||
        insights.loadRemediations
    );
}

const RemediationModal = ({ data, onRemediationCreated }) => {
    const [remediations, setRemediations] = React.useState(false);
    React.useEffect(() => {
        getLoader()({
            react: React,
            reactCore: ReactCore,
            pfReactTable
        }).then(remediations => setRemediations(remediations));
        return () => setRemediations(false);
    }, []);

    React.useEffect(() => {
        remediations &&
            remediations
            .openWizard(data)
            .then(result => result && onRemediationCreated(result));
    }, [remediations]);

    return (
        <React.Fragment>
            {remediations.RemediationWizard && (
                <remediations.RemediationWizard />
            )}
        </React.Fragment>
    );
};

RemediationModal.propTypes = {
    data: propTypes.object,
    onRemediationCreated: propTypes.func
};

RemediationModal.defaultProps = {
    onRemediationCreated: f => f
};

export default RemediationModal;
