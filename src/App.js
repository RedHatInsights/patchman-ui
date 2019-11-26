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

        this.appNav = insights.chrome.on('APP_NAVIGATION', event => this.props.history.push(`/${event.navId}`));
        this.buildNav = this.props.history.listen(() => insights.chrome.navigation(buildNavigation()));
    }

    componentWillUnmount() {
        this.appNav();
        this.buildNav();
    }

    render() {
        return <Routes childProps={ this.props } />;
    }
}

App.propTypes = {
    history: PropTypes.object
};

export default withRouter(connect()(App));

function buildNavigation() {
    return [];
}
