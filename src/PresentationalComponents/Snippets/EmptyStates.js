import { EmptyState, EmptyStateBody, EmptyStateVariant } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import React from 'react';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

export const EmptyAdvisoryList = () => (
  <EmptyState
    headingLevel='h5'
    titleText={intl.formatMessage(messages.statesNoMatchingAdvisories)}
    variant={EmptyStateVariant.full}
  >
    <EmptyStateBody>{intl.formatMessage(messages.textEmptyStateBody)}</EmptyStateBody>
  </EmptyState>
);

export const EmptyPackagesList = () => (
  <EmptyState
    headingLevel='h5'
    icon={SearchIcon}
    titleText={intl.formatMessage(messages.statesNoMatchingPackages)}
    variant={EmptyStateVariant.full}
  >
    <EmptyStateBody>{intl.formatMessage(messages.textEmptyStateBody)}</EmptyStateBody>
  </EmptyState>
);

export const EmptyCvesList = () => (
  <EmptyState
    headingLevel='h5'
    icon={SearchIcon}
    titleText={intl.formatMessage(messages.statesNoMatchingCve)}
    variant={EmptyStateVariant.full}
  >
    <EmptyStateBody>{intl.formatMessage(messages.textEmptyStateBody)}</EmptyStateBody>
  </EmptyState>
);
