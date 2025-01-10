import React from 'react';
import propTypes from 'prop-types';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';

const RemediationWizard = ({ data, setRemediationOpen }) => {
    return (
        <AsyncComponent
            scope="remediations"
            module="./RemediationWizard"
            setOpen={setRemediationOpen}
            fallback={<span />}
            data={data}
        />
    );
};

RemediationWizard.propTypes = {
    data: propTypes.object,
    setRemediationOpen: propTypes.func
};
export default RemediationWizard;
