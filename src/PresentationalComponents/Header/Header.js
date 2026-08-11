import React from 'react';
import { Split, SplitItem } from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import PropTypes from 'prop-types';
import HeaderBreadcrumbs from './HeaderBreadcrumbs';

const Header = ({ title, breadcrumbs, children, headerOUIA, actions }) => (
  <>
    <PageHeader data-ouia-component-type={`${headerOUIA}-page-header`}>
      {breadcrumbs && <HeaderBreadcrumbs items={breadcrumbs} headerOUIA={headerOUIA} />}
      <Split hasGutter>
        <SplitItem>
          <PageHeaderTitle title={title} />
        </SplitItem>
        <SplitItem isFilled />
        <SplitItem>{actions}</SplitItem>
      </Split>
      {children}
    </PageHeader>
  </>
);

Header.propTypes = {
  title: PropTypes.node,
  breadcrumbs: PropTypes.array,
  children: PropTypes.any,
  headerOUIA: PropTypes.string,
  actions: PropTypes.node,
};

export default Header;
