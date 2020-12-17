import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import React from 'react';
import SystemAdvisories from '../SystemAdvisories/SystemAdvisories';
import SystemPackages from '../SystemPackages/SystemPackages';
import './SystemDetail.scss';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';

const SystemDetail = () => {
    const [activeTabKey, setActiveTabKey] = React.useState(0);
    const onTabSelect = (event, id) => {
        setActiveTabKey(id);
    };

    return (
        <Tabs activeKey={activeTabKey} onSelect={onTabSelect} className={'patchTabSelect'}>
            <Tab eventKey={0} title={<TabTitleText>{intl.formatMessage(messages.advisories)}</TabTitleText>}
                data-ouia-component-type={`system-advisories-tab`}
                data-ouia-component-id={`system-advisories-tab`}
            >
                <SystemAdvisories/>
            </Tab>
            <Tab
                eventKey={1}
                title={<TabTitleText>{intl.formatMessage(messages.packages)}</TabTitleText>}
                data-ouia-component-type={`system-packages-tab`}
                data-ouia-component-id={`system-packages-tab`}
            >
                <SystemPackages/>
            </Tab>
        </Tabs>
    );
};

export default SystemDetail;
