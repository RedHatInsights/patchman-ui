import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import SystemAdvisories from '../SystemAdvisories/SystemAdvisories';
import SystemPackages from '../SystemPackages/SystemPackages';
import './SystemDetail.scss';
import { intl } from '../../Utilities/IntlProvider';
import messages from '../../Messages';
import { NotConnected } from '@redhat-cloud-services/frontend-components/NotConnected';
import propTypes from 'prop-types';

const SystemDetail = ({ isInventoryApp, inventoryId, shouldRefresh }) => {
    const { state } = useLocation();

    const [activeTabKey, setActiveTabKey] = useState(
        (state?.tab === 'packages') ? 1 : 0
    );
    const [areTabsHidden, setTabsHidden] = useState(false);

    const onTabSelect = (event, id) => {
        setActiveTabKey(id);
    };

    const handleNoSystemData = () => {
        isInventoryApp && setTabsHidden(prevTabsHidden => !prevTabsHidden);
        return isInventoryApp && null || <NotConnected />;
    };

    return (!areTabsHidden && (
        <Tabs activeKey={activeTabKey} onSelect={onTabSelect} className={'patchTabSelect'} isHidden>
            <Tab eventKey={0} title={<TabTitleText>{intl.formatMessage(messages.titlesAdvisories)}</TabTitleText>}
                data-ouia-component-type={`system-advisories-tab`}
                data-ouia-component-id={`system-advisories-tab`}
            >
                <SystemAdvisories
                    handleNoSystemData={handleNoSystemData}
                    inventoryId={inventoryId}
                    shouldRefresh={shouldRefresh}
                />
            </Tab>
            <Tab
                eventKey={1}
                title={<TabTitleText>{intl.formatMessage(messages.titlesPackages)}</TabTitleText>}
                data-ouia-component-type={`system-packages-tab`}
                data-ouia-component-id={`system-packages-tab`}
            >
                <SystemPackages
                    handleNoSystemData={handleNoSystemData}
                    inventoryId={inventoryId}
                    shouldRefresh={shouldRefresh}
                />
            </Tab>
        </Tabs>
    ) || <NotConnected/>);
};

SystemDetail.propTypes = {
    isInventoryApp: propTypes.bool,
    inventoryId: propTypes.string.isRequired,
    shouldRefresh: propTypes.bool
};
export default SystemDetail;
