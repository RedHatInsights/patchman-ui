import {
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components/components/PageHeader';
import PropTypes from 'prop-types';
import React from 'react';
import HeaderBreadcrumbs from './HeaderBreadcrumbs';
import HeaderTabs from './HeaderTabs';

const Header = ({ title, showTabs, breadcrumbs, children }) => {
    return (
        <React.Fragment>
            <PageHeader>
                {breadcrumbs && <HeaderBreadcrumbs items={breadcrumbs} />}
                <PageHeaderTitle title={title} />
                {children}
            </PageHeader>
            {showTabs && <HeaderTabs />}
        </React.Fragment>
    );
};

Header.propTypes = {
    title: PropTypes.string,
    showTabs: PropTypes.bool,
    breadcrumbs: PropTypes.array,
    children: PropTypes.any
};

export default Header;
