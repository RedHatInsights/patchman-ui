import ExternalLinkSquareAltIcon from '@patternfly/react-icons/dist/js/icons/external-link-square-alt-icon';
import propTypes from 'prop-types';
import React from 'react';
import { Flex, FlexItem } from '@patternfly/react-core';

const PortalAdvisoryLink = ({ advisory }) => {
    return (
        <a
            href={`https://access.redhat.com/errata/${advisory}`}
            target="__blank"
        >
            <Flex flex={{ default: 'inlineFlex' }}>
                <FlexItem spacer={{ default: 'spacerSm' }}>
                    <ExternalLinkSquareAltIcon />
                </FlexItem>
                <FlexItem spacer={{ default: 'spacerSm' }}>
                    View packages and errata at
                    access.redhat.com
                </FlexItem>
            </Flex>
        </a>

    );
};

PortalAdvisoryLink.propTypes = {
    advisory: propTypes.string
};

export default PortalAdvisoryLink;
