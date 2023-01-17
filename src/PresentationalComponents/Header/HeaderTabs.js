import { Tab, Tabs } from '@patternfly/react-core';
import propTypes from 'prop-types';
import React from 'react';
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
                eventKey={'/advisories'}
                title={'Applicable advisories'}
                data-ouia-component-type={`${headerOUIA}-tab`}
                data-ouia-component-id={`${headerOUIA}-tab-Applicable advisories'`}
            />
            <Tab
                eventKey={'/systems/'}
                title={'Systems'}
                data-ouia-component-type={`${headerOUIA}-tab`}
                data-ouia-component-id={`${headerOUIA}-tab-Systems`}
            />
        </Tabs>
    );
};

HeaderTabs.propTypes = {
    history: propTypes.object,
    headerOUIA: propTypes.string
};

export default HeaderTabs;
