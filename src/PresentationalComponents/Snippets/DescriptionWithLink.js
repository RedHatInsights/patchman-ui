import {
    Text, TextContent, TextList,
    TextListItem, TextListItemVariants, TextListVariants, TextVariants
} from '@patternfly/react-core';
import { SecurityIcon } from '@patternfly/react-icons';
import propTypes from 'prop-types';
import React from 'react';
import messages from '../../Messages';
import { entityTypes } from '../../Utilities/constants';
import { getSeverityById, handlePatchLink, isRHAdvisory, truncate } from '../../Utilities/Helpers';
import { intl } from '../../Utilities/IntlProvider';
import ExternalLink from './ExternalLink';
import Label from './Label';

export const DescriptionWithLink = ({ row }) => {
    const severityObject = getSeverityById(row.attributes.severity);
    return (
        <TextContent>
            {
                row.attributes.cve_count > 0 &&
                (<TextList component={TextListVariants.dl} style={{ '--pf-c-content--dl--RowGap': '0.5rem' }}>
                    <TextListItem component={TextListItemVariants.dt}>
                        {intl.formatMessage(messages.labelsSeverity)}
                    </TextListItem>
                    <TextListItem component={TextListItemVariants.dd}>
                        <SecurityIcon size="sm" color={severityObject.color} />  {severityObject.label}
                    </TextListItem>
                    <TextListItem component={TextListItemVariants.dt}>
                        {intl.formatMessage(messages.labelsCves)}
                    </TextListItem>
                    <TextListItem component={TextListItemVariants.dd}>
                        {row.attributes.cve_count}
                    </TextListItem>
                </TextList>)}
            <Label>{intl.formatMessage(messages.labelsDescription)}</Label>
            <Text component={TextVariants.p} style={{ whiteSpace: 'pre-line' }}>
                {truncate(row.attributes.description.replace(
                    new RegExp('\\n(?=[^\\n])', 'g'),
                    ''
                ), 570, handlePatchLink(entityTypes.advisories, row.id, intl.formatMessage(messages.linksReadMore)))}
            </Text>
            {isRHAdvisory(row.id) && <ExternalLink link={`https://access.redhat.com/errata/${row.id}`}
                text={intl.formatMessage(messages.linksViewPackagesAndErrata)} />}
        </TextContent>);
};

DescriptionWithLink.propTypes = {
    row: propTypes.shape({
        id: propTypes.string,
        attributes: propTypes.object
    })
};
