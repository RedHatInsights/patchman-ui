import some from 'lodash/some';
import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import asyncComponent from './Utilities/asyncComponent';

const Advisories = asyncComponent(() =>
    import(
        /* webpackChunkName: "Advisories" */ './SmartComponents/Advisories/Advisories'
    )
);

const Systems = asyncComponent(() =>
    import(
        /* webpackChunkName: "Systems" */ './SmartComponents/Systems/Systems'
    )
);

const InventoryPage = asyncComponent(() =>
    import(
        /* webpackChunkName: "InventoryPage" */ './SmartComponents/SystemDetail/InventoryPage'
    )
);

const AdvisoryPage = asyncComponent(() =>
    import(
        /* webpackChunkName: "AdvisoryyPage" */ './SmartComponents/AdvisoryDetail/AdvisoryDetail'
    )
);
export const paths = {
    advisories: {
        title: 'Applicable advisories',
        to: '/'
    },
    systems: {
        title: 'Systems',
        to: '/systems'
    },
    inventoryDetail: {
        title: 'Inventory detail',
        to: '/systems/:inventoryId'
    },
    advisoryDetail: {
        title: 'Advisory detail',
        to: '/advisories/:advisoryId'
    },
    advisoryDetailSystem: {
        title: '',
        to: '/advisories/:advisoryId/:inventoryId'
    }
};

type Props = {
    childProps: any
};

const InsightsRoute = ({ component: Component, rootClass, ...rest }) => {
    const root = document.getElementById('root');
    root.removeAttribute('class');
    root.classList.add(`page__${rootClass}`, 'pf-c-page__main');
    root.setAttribute('role', 'main');

    return <Route {...rest} component={Component} />;
};

InsightsRoute.propTypes = {
    component: PropTypes.func,
    rootClass: PropTypes.string
};

export const Routes = (props: Props) => {
    const path = props.childProps.location.pathname;
    return (
        <Switch>
            <Redirect
                from={paths.advisoryDetailSystem.to}
                to={paths.inventoryDetail.to}
            />
            <InsightsRoute
                path={paths.inventoryDetail.to}
                component={InventoryPage}
            />
            <InsightsRoute exact path={paths.systems.to} component={Systems} />
            <InsightsRoute
                exact
                path={paths.advisoryDetail.to}
                component={AdvisoryPage}
            />
            <InsightsRoute
                exact
                path={paths.advisories.to}
                component={Advisories}
                rootClass="Patchman"
            />

            <Route
                render={() =>
                    some(paths, p => p.to === path) || (
                        <Redirect to={paths.advisories.to} />
                    )
                }
            />
        </Switch>
    );
};

Routes.propTypes = {
    childProps: PropTypes.shape({
        location: PropTypes.shape({
            pathname: PropTypes.string
        })
    })
};
