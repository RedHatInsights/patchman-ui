import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import React from 'react';
import SystemAdvisories from '../SystemAdvisories/SystemAdvisories';
import SystemPackages from '../SystemPackages/SystemPackages';

const SystemDetail = () => {
    const [activeTabKey, setActiveTabKey] = React.useState(0);
    const onTabSelect = (event, id) => {
        setActiveTabKey(id);
    };

    return (
        <Tabs activeKey={activeTabKey} onSelect={onTabSelect} style={{ backgroundColor: 'white' }}>
            <Tab eventKey={0} title={<TabTitleText>Advisories</TabTitleText>}>
                <SystemAdvisories/>
            </Tab>
            <Tab eventKey={1} title={<TabTitleText>Packages</TabTitleText>}>
                <SystemPackages/>
            </Tab>
        </Tabs>
    );
};

export default SystemDetail;
