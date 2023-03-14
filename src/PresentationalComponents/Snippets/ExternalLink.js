import { Flex, FlexItem } from '@patternfly/react-core';
import ExternalLinkSquareAltIcon from '@patternfly/react-icons/dist/js/icons/external-link-square-alt-icon';
import propTypes from 'prop-types';
import React from 'react';

const ExternalLink = ({ link, text }) => {
    return (
        <a
            href={link}
            target="__blank"
        >
            <Flex flex={{ default: 'inlineFlex' }}>
                <FlexItem spacer={{ default: 'spacerSm' }}>
                    {text}
                </FlexItem>
                <FlexItem spacer={{ default: 'spacerSm' }}>
                    <ExternalLinkSquareAltIcon />
                </FlexItem>
            </Flex>
        </a>

    );
};

ExternalLink.propTypes = {
    link: propTypes.string,
    text: propTypes.string
};

export default ExternalLink;
