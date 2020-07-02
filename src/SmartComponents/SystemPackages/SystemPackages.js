import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import React from 'react';
import SystemAdvisories from '../SystemAdvisories/SystemAdvisories';

const SystemPackages = () => {
    const [activeTabKey, setActiveTabKey] = React.useState(0);
    const onTabSelect = (event, id) => {
        setActiveTabKey(id);
    };

    return (
        <Tabs activeKey={activeTabKey} onSelect={onTabSelect}>
            <Tab eventKey={0} title={<TabTitleText>Advisories</TabTitleText>}>
                <SystemAdvisories/>
            </Tab>
            <Tab eventKey={1} title={<TabTitleText>Packages</TabTitleText>}>
            Containers
            </Tab>
        </Tabs>
    );
};

export default SystemPackages;
