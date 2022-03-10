import { Button } from '@patternfly/react-core';
import propTypes from 'prop-types';
import React from 'react';

const PatchRemediationButton = ({ onClick, isDisabled, isLoading, ouia, children }) => {
    return (
        <Button
            isDisabled={isDisabled}
            onClick={onClick}
            ouiaId={ouia}
            variant="primary"
            isLoading={isLoading}
        >
            {children}
        </Button>
    );
};

PatchRemediationButton.propTypes = {
    onClick: propTypes.object,
    isDisabled: propTypes.bool,
    isLoading: propTypes.bool,
    ouia: propTypes.string,
    children: propTypes.element
};

export default PatchRemediationButton;
