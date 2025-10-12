import { Content, ContentVariants, Icon } from '@patternfly/react-core';
import { SecurityIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import React from 'react';

const AdvisorySeverity = ({ severity: { label, color } = {} }) => (
    <Content>
        <Content component={ContentVariants.dd}>
            <Icon size="sm">
                <SecurityIcon color={color}/>
            </Icon>
            &nbsp;{label}
        </Content>
    </Content>
);

AdvisorySeverity.propTypes = {
    severity: PropTypes.shape({
        label: PropTypes.string,
        color: PropTypes.string
    })
};

export default AdvisorySeverity;
