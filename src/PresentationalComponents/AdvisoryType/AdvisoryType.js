import PropTypes from 'prop-types';
import React from 'react';
import { advisoryTypes } from '../../Utilities/constants';
import { Split, SplitItem } from '@patternfly/react-core';

const AdvisoryType = ({ type }) => {
    const advisoryType =
        advisoryTypes.find(item => item.value === type) || advisoryTypes[2];
    return (
        <Split hasGutter className='advisoryTypeSpacer'>
            <SplitItem>{advisoryType.icon}</SplitItem>
            <SplitItem isFilled>{advisoryType.label}</SplitItem>
        </Split>
    );
};

AdvisoryType.propTypes = {
    type: PropTypes.number
};

export default AdvisoryType;
