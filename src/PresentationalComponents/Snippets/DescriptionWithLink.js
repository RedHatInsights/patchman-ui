import { Content, ContentVariants } from '@patternfly/react-core';
import propTypes from 'prop-types';
import React from 'react';
import messages from '../../Messages';
import { entityTypes } from '../../Utilities/constants';
import { handlePatchLink, isRHAdvisory, truncate } from '../../Utilities/Helpers';
import { intl } from '../../Utilities/IntlProvider';
import ExternalLink from './ExternalLink';
import Label from './Label';
import RebootRequired from '../Snippets/RebootRequired';
import AdvisorySeverity from '../AdvisorySeverity/AdvisorySeverity';

export const DescriptionWithLink = ({ row }) => (
  <Content className='patch-advisory-description'>
    {row.attributes.cve_count > 0 && (
      <Content component={ContentVariants.dl} style={{ '--pf-v6-c-content--dl--RowGap': '0.5rem' }}>
        <Content component={ContentVariants.dt}>
          {intl.formatMessage(messages.labelsSeverity)}
        </Content>
        <Content component={ContentVariants.dd}>
          <AdvisorySeverity severity={row.attributes.severity} />
        </Content>
        <Content component={ContentVariants.dt}>{intl.formatMessage(messages.labelsCves)}</Content>
        <Content component={ContentVariants.dd}>{row.attributes.cve_count}</Content>
      </Content>
    )}
    <Label>{intl.formatMessage(messages.labelsDescription)}</Label>
    <Content component={ContentVariants.p} style={{ whiteSpace: 'pre-line' }}>
      {truncate(
        row.attributes.description.replace(new RegExp('\\n(?=[^\\n])', 'g'), ''),
        570,
        handlePatchLink(entityTypes.advisories, row.id, intl.formatMessage(messages.linksReadMore)),
      )}
    </Content>
    {row.attributes.reboot_required && <RebootRequired />}
    {isRHAdvisory(row.id) && (
      <ExternalLink
        link={`https://access.redhat.com/errata/${row.id}`}
        text={intl.formatMessage(messages.linksViewPackagesAndErrata)}
      />
    )}
  </Content>
);

DescriptionWithLink.propTypes = {
  row: propTypes.shape({
    id: propTypes.string,
    attributes: propTypes.object,
    reboot_required: propTypes.bool,
  }),
};
