import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/cjs/NotificationPortal';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './App.scss';
import { paths, Routes } from './Routes';
import { globalFilter } from './store/Actions/Actions';
/*eslint-disable */
// console.log('dev mode');
class App extends Component {

    componentDidMount() {
        insights.chrome.init();
        insights.chrome.identifyApp('patch');
        insights.chrome.enable.globalFilter();

        if (insights.chrome?.globalFilterScope) {
            insights.chrome.on('GLOBAL_FILTER_UPDATE', ({ data }) => {
                const [workloads, SID, tags] = insights.chrome?.mapGlobalFilter?.(data, false, true);
                const SAP = data?.Workloads?.SAP;
                const selectedTags = insights.chrome?.mapGlobalFilter?.(data)
                    ?.filter(item => !item.includes('Workloads')).map(tag => (`tags=${encodeURIComponent(tag)}`));

                const config = { };
                (SAP && SAP.isSelected)
                    ? (config.systemProfile = `filter[system_profile][sap_system]=${SAP.isSelected}`)
                    : config.systemProfile = undefined;
                selectedTags && (config.selectedTags = selectedTags);
                if (SID?.length !== 0) {
                    const SID_filter = `filter[system_profile][sap_sids][in]=${SID}`;
                    config.systemProfile = config.systemProfile?.concat(SID_filter) || SID_filter;
                }

                this.props.globalFilter(config);

            });
        }

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
    location: PropTypes.object,
    globalFilter: PropTypes.func
};

const mapDispatchToProps = dispatch => ({ globalFilter: (filter) => dispatch(globalFilter(filter)) });

export default withRouter(connect(null, mapDispatchToProps)(App));
