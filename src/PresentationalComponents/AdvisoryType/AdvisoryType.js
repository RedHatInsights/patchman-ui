import {
    BugIcon,
    EnhancementIcon,
    SecurityIcon,
    UnknownIcon
} from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import React from 'react';

export const AdvisoryTypes = [
    {
        title: 'Unknown',
        icon: <UnknownIcon />
    },
    {
        title: 'Enhancement',
        icon: <EnhancementIcon />
    },
    {
        title: 'Bugfix',
        icon: <BugIcon />
    },
    {
        title: 'Security',
        icon: <SecurityIcon />
    }
];

const AdvisoryType = ({ type }) => {
    const advisoryType = AdvisoryTypes[type] || AdvisoryTypes[0];
    return (
        <React.Fragment>
            <div className={'icon-with-label'}>
                {advisoryType.icon}
                {advisoryType.title}
            </div>
        </React.Fragment>
    );
};

AdvisoryType.propTypes = {
    type: PropTypes.number
};

export default AdvisoryType;
