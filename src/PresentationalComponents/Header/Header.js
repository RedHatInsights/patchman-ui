import {
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';
import PropTypes from 'prop-types';
import React from 'react';
import HeaderBreadcrumbs from './HeaderBreadcrumbs';
import HeaderTabs from './HeaderTabs';

const Header = ({ title, showTabs, breadcrumbs }) => {
    return (
        <React.Fragment>
            <PageHeader>
                {breadcrumbs && <HeaderBreadcrumbs items={breadcrumbs} />}
                <PageHeaderTitle title={title} />
            </PageHeader>
            {showTabs && <HeaderTabs />}
        </React.Fragment>
    );
};

Header.propTypes = {
    title: PropTypes.string,
    showTabs: PropTypes.bool,
    breadcrumbs: PropTypes.array
};

export default Header;
