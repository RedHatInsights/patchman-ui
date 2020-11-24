import {
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components/components/PageHeader';
import PropTypes from 'prop-types';
import React from 'react';
import HeaderBreadcrumbs from './HeaderBreadcrumbs';
import HeaderTabs from './HeaderTabs';

const Header = ({ title, showTabs, breadcrumbs, children, headerOUIA }) => {
    return (
        <React.Fragment>
            <PageHeader
                data-ouia-component-type={`${headerOUIA}-page-header`}
            >
                {breadcrumbs && <HeaderBreadcrumbs items={breadcrumbs} headerOUIA={headerOUIA} />}
                <PageHeaderTitle title={title} />
                {children}
            </PageHeader>
            {showTabs && <HeaderTabs headerOUIA = {headerOUIA}/>}
        </React.Fragment>
    );
};

Header.propTypes = {
    title: PropTypes.string,
    showTabs: PropTypes.bool,
    breadcrumbs: PropTypes.array,
    children: PropTypes.any,
    headerOUIA: PropTypes.string
};

export default Header;
