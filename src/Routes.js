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

export const paths = {
    advisories: {
        title: 'Applicable Advisories',
        to: '/'
    },
    systems: {
        title: 'Systems',
        to: '/systems'
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
            <Route path={paths.systems.to} component={Systems} />
            <InsightsRoute
                path={paths.advisories.to}
                component={Advisories}
                rootClass="Patchman"
            />

            <Route
                render={() =>
                    some(paths, p => p.to === path) ? null : (
                        <Redirect to={paths.systems.to} />
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
