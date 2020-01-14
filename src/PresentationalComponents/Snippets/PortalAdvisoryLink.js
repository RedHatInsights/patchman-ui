import { ExternalLinkSquareAltIcon } from '@patternfly/react-icons';
import propTypes from 'prop-types';
import React from 'react';

const PortalAdvisoryLink = ({ advisory }) => {
    return (
        <span className={'icon-with-label'}>
            <a
                href={`https://access.redhat.com/errata/${advisory}`}
                target="__blank"
            >
                <ExternalLinkSquareAltIcon /> View packages and errata at
                access.redhat.com
            </a>
        </span>
    );
};

PortalAdvisoryLink.propTypes = {
    advisory: propTypes.string
};

export default PortalAdvisoryLink;
