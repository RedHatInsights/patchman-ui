import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/cjs/NotificationPortal';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './App.scss';
import { Routes, paths } from './Routes';

// console.log('dev mode');
class App extends Component {
    componentDidMount() {
        insights.chrome.init();
        insights.chrome.identifyApp('patch');

        this.triggerNavigation();
        this.unregister = this.listenNavigation();
    }

    componentWillUnmount() {
        this.unregister();
    }

    listenNavigation() {
        return  insights.chrome.on('APP_NAVIGATION', event => {
            if (event.domEvent) {
                this.props.history.push(`/${event.navId}`);
            }
        });
    }

    triggerNavigation() {
        this.props.history.listen(() => {

            const { pathname } = this.props.location;
            const currentRoute = Object.values(paths).filter(element => pathname !== '/' && pathname.includes(element.to));

            if (pathname === '/') {
                insights.chrome.appNavClick({ id: 'advisories' }, false);
            }
            else if (currentRoute) {
                const navId =  pathname.split('/').filter(element => element.length > 0)[0];
                navId && insights.chrome.appNavClick({ id: navId });
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <NotificationsPortal />
                <Routes childProps={this.props} />
            </React.Fragment>
        );
    }

}

App.propTypes = {
    history: PropTypes.object,
    location: PropTypes.object
};

export default withRouter(connect()(App));
