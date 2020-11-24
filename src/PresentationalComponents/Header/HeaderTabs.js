import { Tab, Tabs } from '@patternfly/react-core/dist/js/components/Tabs';
import propTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { paths } from '../../Routes';
import './Header.scss';

const HeaderTabs = ({ history, headerOUIA }) => {
    const handleRedirect = (event, tabString) => {
        history.push(tabString);
    };

    return (
        <Tabs
            onSelect={handleRedirect}
            activeKey={history.location.pathname}
            className={'patchman-tabs'}
        >
            <Tab
                eventKey={paths.advisories.to}
                title={paths.advisories.title}
                data-ouia-component-type={`${headerOUIA}-tab`}
                data-ouia-component-id={`${headerOUIA}-tab-${paths.advisories.title}`}
            />
            <Tab
                eventKey={paths.systems.to}
                title={paths.systems.title}
                data-ouia-component-type={`${headerOUIA}-tab`}
                data-ouia-component-id={`${headerOUIA}-tab-${paths.systems.title}`}
            />
        </Tabs>
    );
};

HeaderTabs.propTypes = {
    history: propTypes.object,
    headerOUIA: propTypes.string
};

export default withRouter(HeaderTabs);
