import { Button } from '@patternfly/react-core';
import propTypes from 'prop-types';
import React from 'react';

const PatchRemediationButton = ({ onClick, isDisabled, isLoading, ouia }) => {
    return (
        <Button
            isDisabled={isDisabled}
            onClick={onClick}
            ouiaId={ouia}
            variant="primary"
            isLoading={isLoading}
        >Remediate
        </Button>
    );
};

PatchRemediationButton.propTypes = {
    onClick: propTypes.object,
    isDisabled: propTypes.bool,
    isLoading: propTypes.bool,
    ouia: propTypes.string
};

export default PatchRemediationButton;
