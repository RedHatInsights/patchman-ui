import {
    Breadcrumb,
    BreadcrumbItem
} from '@patternfly/react-core/dist/js/components/Breadcrumb/';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

const HeaderBreadcrumbs = ({ items }) => {
    return (
        <Breadcrumb>
            {items.filter(Boolean).map(item => (
                <BreadcrumbItem key={item.title} isActive={item.isActive}>
                    {(item.to && <Link to={item.to}>{item.title}</Link>) ||
                        item.title}
                </BreadcrumbItem>
            ))}
        </Breadcrumb>
    );
};

HeaderBreadcrumbs.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            isActive: PropTypes.bool,
            to: PropTypes.string,
            title: PropTypes.string
        })
    )
};

export default HeaderBreadcrumbs;
