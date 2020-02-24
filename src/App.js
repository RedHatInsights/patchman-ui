import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './App.scss';
import { Routes } from './Routes';

class App extends Component {
    componentDidMount() {
        insights.chrome.init();
        insights.chrome.identifyApp('patch');
        insights.chrome.navigation(buildNavigation());

        this.appNav = insights.chrome.on('APP_NAVIGATION', event =>
            this.props.history.push(`/${event.navId}`)
        );
        this.buildNav = this.props.history.listen(() =>
            insights.chrome.navigation(buildNavigation())
        );
    }

    componentWillUnmount() {
        this.appNav();
        this.buildNav();
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
    history: PropTypes.object
};

export default withRouter(connect()(App));

function buildNavigation() {
    return [];
}
