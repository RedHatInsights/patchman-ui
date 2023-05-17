import {
    Breadcrumb,
    BreadcrumbItem
} from '@patternfly/react-core';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

const HeaderBreadcrumbs = ({ items, headerOUIA }) => {
    return (
        <Breadcrumb>
            {items.filter(Boolean).map(item => (
                <BreadcrumbItem key={item.title} isActive={item.isActive}>
                    {item.to
                        ? <Link to={`..${item.to}`}
                            data-ouia-component-type={`${headerOUIA}-breadcrumb`}
                            data-ouia-component-id={`breadcrumb-to-${item.title}`}
                        >{item.title}</Link>
                        : item.title
                    }
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
            title: PropTypes.node
        })
    ),
    headerOUIA: PropTypes.string
};

export default HeaderBreadcrumbs;
