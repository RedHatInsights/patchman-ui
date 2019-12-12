import { Tab, Tabs } from '@patternfly/react-core';
import propTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { paths } from '../../Routes';
import './Header.scss';

const HeaderTabs = ({ history }) => {
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
            />
            <Tab eventKey={paths.systems.to} title={paths.systems.title} />
        </Tabs>
    );
};

HeaderTabs.propTypes = {
    history: propTypes.object
};

export default withRouter(HeaderTabs);
