import { Flex, FlexItem } from '@patternfly/react-core';
import { ExternalLinkSquareAltIcon } from '@patternfly/react-icons';
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
                    <ExternalLinkSquareAltIcon />
                </FlexItem>
                <FlexItem spacer={{ default: 'spacerSm' }}>
                    {text}
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
