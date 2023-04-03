import { Split, SplitItem } from '@patternfly/react-core';
import {
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components/PageHeader';
import PropTypes from 'prop-types';
import React from 'react';
import HeaderBreadcrumbs from './HeaderBreadcrumbs';
import HeaderTabs from './HeaderTabs';

const Header = ({ title, showTabs, breadcrumbs, children, headerOUIA, actions }) => {
    return (
        <React.Fragment>
            <PageHeader
                data-ouia-component-type={`${headerOUIA}-page-header`}
            >
                {breadcrumbs && <HeaderBreadcrumbs items={breadcrumbs} headerOUIA={headerOUIA} />}
                <Split hasGutter>
                    <SplitItem>
                        <PageHeaderTitle title={title} />
                    </SplitItem>
                    <SplitItem isFilled />
                    <SplitItem>
                        {actions}
                    </SplitItem>
                </Split>
                {children}
            </PageHeader>
            {showTabs && <HeaderTabs headerOUIA={headerOUIA} />}
        </React.Fragment>
    );
};

Header.propTypes = {
    title: PropTypes.node,
    showTabs: PropTypes.bool,
    breadcrumbs: PropTypes.array,
    children: PropTypes.any,
    headerOUIA: PropTypes.string,
    actions: PropTypes.node
};

export default Header;
