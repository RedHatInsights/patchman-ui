import React from 'react';
import { Text, TextContent, TextVariants, TextList,
    TextListVariants, TextListItem, TextListItemVariants } from '@patternfly/react-core';
import Label from './Label';
import { handlePatchLink, truncate } from '../../Utilities/Helpers';
import { entityTypes } from '../../Utilities/constants';
import ExternalLink from './ExternalLink';
import propTypes from 'prop-types';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

export const DescriptionWithLink = ({ row }) =>  (
    <TextContent>
        <TextList component={TextListVariants.dl}>
            <TextListItem component={TextListItemVariants.dt}>
                {intl.formatMessage(messages.labelsCves)}
            </TextListItem>
            <TextListItem component={TextListItemVariants.dd}>
                3
            </TextListItem>
        </TextList>
        <Label>{intl.formatMessage(messages.labelsDescription)}</Label>
        <Text component={TextVariants.p} style={{ whiteSpace: 'pre-line' }}>
            {truncate(row.attributes.description.replace(
                new RegExp('\\n(?=[^\\n])', 'g'),
                ''
            ), 570, handlePatchLink(entityTypes.advisories, row.id, intl.formatMessage(messages.linksReadMore)))}
        </Text>
        <ExternalLink link={`https://access.redhat.com/errata/${row.id}`}
            text={intl.formatMessage(messages.linksViewPackagesAndErrata)} />
    </TextContent>);

DescriptionWithLink.propTypes = {
    row: propTypes.shape({
        id: propTypes.string,
        attributes: propTypes.object
    })
};
