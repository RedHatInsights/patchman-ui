import React from 'react';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';
import Label from './Label';
import { handlePatchLink, truncate } from '../../Utilities/Helpers';
import { entityTypes } from '../../Utilities/constants';
import ExternalLink from './ExternalLink';
import propTypes from 'prop-types';

export const DescriptionWithLink = ({ row }) =>  (<TextContent>
    <Label>Description</Label>
    <Text component={TextVariants.p} style={{ whiteSpace: 'pre-line' }}>
        {truncate(row.attributes.description.replace(
            new RegExp('\\n(?=[^\\n])', 'g'),
            ''
        ), 570, handlePatchLink(entityTypes.advisories, row.id, 'Read more'))}
    </Text>
    <ExternalLink link={`https://access.redhat.com/errata/${row.id}`}
        text={'View packages and errata at access.redhat.com'} />
</TextContent>);

DescriptionWithLink.propTypes = {
    row: propTypes.shape({
        id: propTypes.string,
        attributes: propTypes.object
    })
};
