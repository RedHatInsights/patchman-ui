import PropTypes from 'prop-types';
import React from 'react';
import { advisoryTypes } from '../../Utilities/constants';
import { Icon, Split, SplitItem } from '@patternfly/react-core';

const AdvisoryType = ({ type }) => {
    const advisoryType =
        advisoryTypes.find(item => item.value === type) || advisoryTypes[3];
    return (
        <Split hasGutter>
            <SplitItem>
                <Icon>
                    {advisoryType.icon}
                </Icon>
            </SplitItem>
            <SplitItem isFilled>{advisoryType.label}</SplitItem>
        </Split>
    );
};

AdvisoryType.propTypes = {
    type: PropTypes.string
};

export default AdvisoryType;
